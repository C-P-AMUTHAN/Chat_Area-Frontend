const express = require('express');
const axios = require('axios');
const Message = require('../models/Message');
const router = express.Router();
require('dotenv').config();

// Unified Webhook Route
router.all('/', async (req, res) => {
  try {
    if (req.method === 'POST') {
      // Handle Incoming Messages
      const { body } = req;

      if (
        body.object === 'whatsapp_business_account' &&
        body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
      ) {
        const message = body.entry[0].changes[0].value.messages[0];

        // Validate incoming message
        if (!message.from || !message.text) {
          console.error('Invalid message format:', message);
          return res.status(400).json({ error: 'Invalid message format' });
        }

        console.log('Incoming Message:', {
          from: message.from,
          to: message.to,
          text: message.text.body,
        });

        // Save the message to the database
        const newMessage = new Message({
          from: message.from,
          to: message.to || process.env.WHATSAPP_PHONE_NUMBER_ID, // Fallback for `to`
          text: message.text.body,
          timestamp: new Date(),
        });

        await newMessage.save();
        console.log('Message saved to DB:', newMessage);

        // Broadcast the message to the frontend via socket.io
        global.io.emit('receive_message', newMessage);

        return res.sendStatus(200);
      }

      return res.sendStatus(400); // Bad Request if payload is invalid
    }

    res.sendStatus(405); // Method Not Allowed for unsupported methods
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.sendStatus(500); // Internal Server Error
  }
});


// Send Message API
router.post("/send", async (req, res) => {
  const { to, text } = req.body;

  if (!to || !text) {
    return res.status(400).json({ error: "Recipient and text are required" });
  }

  try {
    // Send the message via WhatsApp API
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "text",
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Save the message to the database
    const savedMessage = await Message.create({
      from: process.env.WHATSAPP_PHONE_NUMBER_ID,
      to,
      text,
      timestamp: new Date(),
      sent: true,
    });

    console.log("Message saved to DB:", savedMessage);

    // Emit the message via Socket.IO for real-time updates
    global.io.emit("receive_message", savedMessage);

    res.status(200).json({ success: true, message: savedMessage });
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;
