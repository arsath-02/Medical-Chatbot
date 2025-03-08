const express = require("express");
const axios = require("axios");
const router = express.Router();
// In your Node.js router file
router.post("/chatreport", async (req, res) => {
  console.log("Chat Report API hit");
  console.log("Request body:", JSON.stringify(req.body));

  try {
    const { messages } = req.body;
    console.log("Messages received:", messages);
    console.log("Type of messages:", typeof messages);
    console.log("Length of messages:", messages ? messages.length : 0);

    // Check if messages is defined and is a string
    if (!messages || typeof messages !== 'string') {
      return res.status(400).json({
        error: "Invalid request format. Expected 'messages' as a string in request body."
      });
    }

    const dataToSend = { messages: messages };
    console.log("Sending to Python backend:", JSON.stringify(dataToSend));

    // Send request to Python backend
    const response = await axios.post(
      "http://localhost:5000/api/chatreport",
      dataToSend,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("Response from Python:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response error data:", error.response.data);
      console.error("Response error status:", error.response.status);
    }
    res.status(500).json({
      error: "Something went wrong",
      details: error.message
    });
  }
});

module.exports = router;