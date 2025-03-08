const express = require("express");
const axios = require("axios");
const Chat = require("../models/chat");
const Session = require("../models/session");
const Summary = require("../models/SummarizedHistory"); // Fixed import

const router = express.Router();


router.post("/chatbot", async (req, res) => {
    try {
        const { userId, message, sessionId, title } = req.body;

        if (!userId || !message || !sessionId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let chat = await Chat.findOne({ sessionId, userId });
        if (!chat) {
            chat = new Chat({ sessionId, userId, messages: [] });
        }

        let session = await Session.findOne({ sessionId, userId });
        if (!session) {
            session = new Session({
                sessionId,
                userId,
                title: title || "New Chat",
                preview: message.slice(0, 50) + (message.length > 50 ? "..." : "")
            });
            await session.save();
        } else if (title && session.title === "New Chat") {
            session.title = title;
            session.preview = message.slice(0, 50) + (message.length > 50 ? "..." : "");
            session.lastUpdated = new Date();
            await session.save();
        }

        chat.messages.push({ text: message, sender: "user", timestamp: new Date() });
        await chat.save();

        const latestSummary = await Summary.findOne({ userId, sessionId }).sort({ timestamp: -1 });

        const modelPayload = {
            message,
            user_id: userId,
            sessionId,
            history_summary: latestSummary ? latestSummary.summarizedHistory : ""
        };

        console.log("Sending payload to Python:", modelPayload);

        // Send payload to the Python model
        const modelResponse = await axios.post("http://127.0.0.1:5000/api/chat", modelPayload);

        const botMessage = {
            text: modelResponse.data.response,
            sender: "bot",
            timestamp: new Date()
        };

        chat.messages.push(botMessage);
        await chat.save();

        // Return the bot's response immediately
        res.json({ sessionId, response: botMessage.text });

        // Save summarized history asynchronously (doesn't block the response)
        if (modelResponse.data.summarized_history) {
            saveSummarizedHistory(userId, sessionId, modelResponse.data.summarized_history, botMessage.text)
                .catch(err => console.error("Error saving summary:", err));
        }

    } catch (error) {
        console.error("Chat API Error:", error.message || error);
        res.status(500).json({ error: "Failed to process chat" });
    }
});

// Async Summary Saving Function
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

module.exports = router;


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
