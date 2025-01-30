const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Fetch all contacts
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 }).exec();

    const contacts = messages.reduce((acc, msg) => {
      const phoneNumber = msg.from === process.env.WHATSAPP_PHONE_NUMBER_ID ? msg.to : msg.from;

      if (!acc.find((c) => c.phone_number === phoneNumber)) {
        acc.push({
          id: phoneNumber,
          name: msg.profile_name || `Contact ${phoneNumber}`,
          phone_number: phoneNumber,
          lastMessage: msg.text,
          timestamp: msg.timestamp,
        });
      }
      return acc;
    }, []);

    // Sort by the latest message timestamp
    res.json(contacts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});


// Fetch messages for a specific contact
router.get('/:phone_number', async (req, res) => {
  const { phone_number } = req.params;

  if (!phone_number) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const limit = parseInt(req.query.limit, 10) || 50;
  const page = parseInt(req.query.page, 10) || 1;
  const skip = (page - 1) * limit;

  try {
    const messages = await Message.find({
      $or: [{ from: phone_number }, { to: phone_number }],
    })
      .sort({ timestamp: 1 })
      .skip(skip)
      .limit(limit);

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});


module.exports = router;
