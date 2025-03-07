const express = require("express");
const axios = require("axios");
const Chat = require("../models/chat");
const Session = require("../models/session");
const Summary = require("../models/SummarizedHistory"); // Fixed import

const router = express.Router();
// Ensure this matches your actual model file

// Modify chatbot handler
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

        // Find or create session document
        let session = await Session.findOne({ sessionId, userId });
        if (!session) {
            session = new Session({
                sessionId,
                userId,
                title: title || "New Chat",
                preview: message.length > 50 ? message.substring(0, 50) + "..." : message,
            });
            await session.save();
        } else if (title && session.title === "New Chat") {
            session.title = title;
            session.preview = message.length > 50 ? message.substring(0, 50) + "..." : message;
            session.lastUpdated = new Date();
            await session.save();
        }

        // Save user message into chat history
        chat.messages.push({ text: message, sender: "user", timestamp: new Date() });
        await chat.save();

        // 🔥 Fetch the latest summarized history for this user-session (if available)
        const latestSummary = await Summary.findOne({ userId, sessionId }).sort({ timestamp: -1 });

        // Prepare the payload for the Python model
        const modelPayload = {
            message,          // Latest user message
            user_id: userId,   // User ID for memory tracking
            history_summary: latestSummary ? latestSummary.summary : ""  // Pass summarized history if exists
        };

        // Send data to Python backend
        const modelResponse = await axios.post("http://127.0.0.1:5000/api/chat", modelPayload);

        const botMessage = {
            text: modelResponse.data.response,
            sender: "bot",
            timestamp: new Date()
        };

        // Save bot response into chat history
        chat.messages.push(botMessage);
        await chat.save();

        // Save summarized history from Flask response (if provided)
        if (modelResponse.data.summarized_history) {
            await saveSummarizedHistory(userId, sessionId, modelResponse.data.summarized_history, botMessage.text);
        }

        res.json({ sessionId, response: botMessage.text });

    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({ error: "Failed to process chat" });
    }
});



async function saveSummarizedHistory(userId, sessionId, summarizedHistory, botResponse) {
    const summaryDoc = new Summary({
        userId,
        sessionId,
        summarizedHistory,
        botResponse,
        timestamp: new Date(),
    });

    await summaryDoc.save();
}

router.get("/sessions", async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const sessions = await Session.find({ userId }).sort({ lastUpdated: -1 }).lean();
        res.json(sessions);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ error: "Failed to fetch sessions" });
    }
});

router.get("/chat/:sessionId", async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const chat = await Chat.findOne({ sessionId, userId }).lean();
        res.json(chat || { messages: [] });
    } catch (error) {
        console.error("Error fetching chat:", error);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

router.delete("/chat/:sessionId", async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        await Session.deleteOne({ sessionId, userId });
        await Chat.deleteOne({ sessionId, userId });

        res.json({ success: true, message: "Chat deleted successfully" });
    } catch (error) {
        console.error("Error deleting chat:", error);
        res.status(500).json({ error: "Failed to delete chat" });
    }
});

router.post("/saveSummary", async (req, res) => {
    const { userId, sessionId, summarizedHistory, botResponse } = req.body;

    if (!userId || !sessionId || !summarizedHistory || !botResponse) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const summaryDoc = new Summary({
            userId,
            sessionId,
            summarizedHistory,
            botResponse,
            timestamp: new Date()
        });

        await summaryDoc.save();
        res.status(200).json({ message: "Summary saved successfully" });
    } catch (err) {
        console.error("DB save error:", err);
        res.status(500).json({ error: "Failed to save summary" });
    }
});

module.exports = router;
