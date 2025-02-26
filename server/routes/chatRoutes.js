const express = require('express');
const Chat = require('../models/chatModel');
const router = express.Router();
const axios = require('axios');

router.post('/chatbot', async (req, res) => {
    try {
      const { userId, message } = req.body;
      if (!userId || !message) {
        return res.status(400).json({ error: "Missing userId or message" });
      }
  
      let chat = await Chat.findOne({ userId });
  
      if (!chat) {
        chat = new Chat({ userId, messages: [] });
      }
  
      console.log("Received message from user:", userId, message);
  
      // Save user message
      chat.messages.push({ text: message, sender: 'user', timestamp: new Date() });
  
      // Send user input to the AI model backend
      const modelResponse = await axios.post('http://127.0.0.1:5000/api/chat', { message });
      
      const botMessage = { text: modelResponse.data.response, sender: 'bot', timestamp: new Date() };
  
      // Save bot response
      chat.messages.push(botMessage);
      await chat.save();
  
      res.json({ response: botMessage.text });
    } catch (error) {
      console.error('Chat API Error:', error);
      res.status(500).json({ error: 'Failed to process chat' });
    }
  });
  
  router.get("/chats/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const chat = await Chat.findOne({ userId }).sort({ "messages.timestamp": 1 });
  
      if (!chat) {
        return res.status(404).json({ error: "No chat history found" });
      }
  
      res.json(chat.messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
   

module.exports = router;
