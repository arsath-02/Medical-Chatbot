const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/chatbot", async (req, res) => {
  try {
    const { userId, message, sessionId } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "Missing userId or message" });
    }

    // Generate a timestamp-based sessionId if not provided (new session)
    const session = sessionId || Date.now().toString(); // Convert timestamp to string

    // Dynamically create a collection for each session
    const Chat = require("../models/chatbot")(session);

    let chat = await Chat.findOne({ sessionId: session });

    if (!chat) {
      chat = new Chat({ sessionId: session, userId, messages: [] });
    }

    console.log("Received message from user:", userId, message);

    // Save user message
    chat.messages.push({ text: message, sender: "user", timestamp: new Date() });

    // Send user input to the AI model backend
    const modelResponse = await axios.post("http://127.0.0.1:5000/api/chat", { message });

    const botMessage = { text: modelResponse.data.response, sender: "bot", timestamp: new Date() };

    // Save bot response
    chat.messages.push(botMessage);
    await chat.save();

    res.json({ sessionId: session, response: botMessage.text });
  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

module.exports = router;
