const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const ChatReport=require('../models/chatReport')

// MongoDB Model Setup

// Route for Analyzing and Storing Conversation
router.post('/analyze', async (req, res) => {
  const { userId, sessionId, messages } = req.body;

  if (!sessionId) {
      return res.status(400).json({ success: false, error: 'Session ID is required' });
  }

  try {
      const response = await axios.post('http://127.0.0.1:5000/api/chatreport', { messages });
      const result = response.data;

      if (result.status === 'processed') {
          await ChatReport.deleteMany({ sessionId });

          const reportData = {
              userId,
              sessionId,
              timestamp: new Date(),
              message_count: result.message_count,
              sentiment: result.analysis.sentiment,
              summary: result.analysis.summary,
              positive_count: result.analysis.positive_count || 0,
              negative_count: result.analysis.negative_count || 0,
              neutral_count: result.analysis.neutral_count || 0
          };

          const chatReport = new ChatReport(reportData);
          await chatReport.save();

          res.status(200).json({ success: true, chatReport });
      } else {
          res.status(500).json({ success: false, error: 'Error in analysis', details: result });
      }
  } catch (error) {
      console.error('Error during analysis:', error);
      res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

module.exports = router;
