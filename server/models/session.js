const mongoose = require("mongoose");

// Schema for storing chat session metadata
const SessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: "New Chat"
  },
  preview: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Session", SessionSchema);