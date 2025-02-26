const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  messages: [
    {
      text: String,
      sender: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

module.exports = (sessionId) => mongoose.model(`Chat_${sessionId}`, ChatSchema);
