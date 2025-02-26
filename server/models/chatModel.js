const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Use String instead of ObjectId
  messages: [
    {
      text: String,
      sender: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
