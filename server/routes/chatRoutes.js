const express = require("express");
const axios = require("axios");
const Chat = require("../models/chat");
const Session = require("../models/session");

const router = express.Router();

// Handle chatbot message exchange
router.post("/chatbot", async (req, res) => {
  try {
    const { userId, message, sessionId, title } = req.body;

    if (!userId || !message || !sessionId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("Received message from user:", userId, message);

    // Find or create chat document
    let chat = await Chat.findOne({ sessionId, userId });
    if (!chat) {
      chat = new Chat({ sessionId, userId, messages: [] });
    }

    // Find or create session document for chat history
    let session = await Session.findOne({ sessionId, userId });
    if (!session) {
      session = new Session({
        sessionId,
        userId,
        title: title || "New Chat",
        preview: message.length > 50 ? message.substring(0, 50) + "..." : message
      });
      await session.save();
    } else if (title && session.title === "New Chat") {
      // Update title if provided and current title is default
      session.title = title;
      session.preview = message.length > 50 ? message.substring(0, 50) + "..." : message;
      session.lastUpdated = new Date();
      await session.save();
    }

    // Save user message
    chat.messages.push({ text: message, sender: "user", timestamp: new Date() });
    await chat.save();

    // Send user input to the Python backend for AI processing
    const modelResponse = await axios.post("http://127.0.0.1:5000/api/chat", { message });

    const botMessage = {
      text: modelResponse.data.response,
      sender: "bot",
      timestamp: new Date()
    };

    // Save bot response
    chat.messages.push(botMessage);
    await chat.save();

    res.json({ sessionId, response: botMessage.text });
  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

// Get all sessions for a user
router.get("/sessions", async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const sessions = await Session.find({ userId })
      .sort({ lastUpdated: -1 })
      .lean();

    res.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// Get chat messages for a specific session
router.get("/chat/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const chat = await Chat.findOne({ sessionId, userId }).lean();

    if (!chat) {
      return res.json({ messages: [] });
    }

    res.json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// Delete a chat session
router.delete("/chat/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Delete the session metadata
    await Session.deleteOne({ sessionId, userId });

    // Delete the chat messages
    await Chat.deleteOne({ sessionId, userId });

    res.json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

module.exports = router;