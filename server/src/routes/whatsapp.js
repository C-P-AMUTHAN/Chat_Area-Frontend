const express = require('express');
const axios = require('axios');
const router = express.Router();

const WHATSAPP_GRAPH_URL = 'https://graph.facebook.com/v21.0';

// Exchange short-lived token for a long-lived token
router.post('/exchange-token', async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  try {
    const response = await axios.get(
      `${WHATSAPP_GRAPH_URL}/oauth/access_token`, 
      {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: process.env.META_APP_ID,
          client_secret: process.env.META_APP_SECRET,
          fb_exchange_token: access_token,
        },
      }
    );

    const longLivedToken = response.data.access_token;
    res.status(200).json({ status: 'success', access_token: longLivedToken });
  } catch (error) {
    console.error('Token exchange failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to exchange token' });
  }
});

// Setup WhatsApp Business Account
router.post('/setup', async (req, res) => {
  const { waba_id, phone_number_id, access_token, display_phone_number, business_name } = req.body;

  if (!waba_id || !phone_number_id || !access_token) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await axios.post(
      `${WHATSAPP_GRAPH_URL}/${waba_id}/subscribed_apps`, 
      {
        subscribed_fields: ['messages', 'message_templates'],
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    res.status(200).json({ status: 'success', message: 'WhatsApp setup completed' });
  } catch (error) {
    console.error('Setup failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'WhatsApp setup failed' });
  }
});

// Register WhatsApp Phone Number
router.post('/register-phone', async (req, res) => {
  const { phone_number_id, display_phone_number, access_token, certificate } = req.body;

  if (!phone_number_id || !access_token || !certificate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await axios.post(
      `${WHATSAPP_GRAPH_URL}/${phone_number_id}/register`, 
      { messaging_product: 'whatsapp', certificate },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    res.status(200).json({ status: 'success', message: 'Phone number registered successfully' });
  } catch (error) {
    console.error('Phone registration failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'Phone registration failed' });
  }
});

// Check Payment Status
router.get('/payment-status/:wabaId', async (req, res) => {
  const { wabaId } = req.params;

  try {
    const response = await axios.get(
      `${WHATSAPP_GRAPH_URL}/${wabaId}/payment_info`, 
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        },
      }
    );

    const hasPaymentMethod = response.data.payment_methods.length > 0;
    res.status(200).json({ status: 'success', hasPaymentMethod });
  } catch (error) {
    console.error('Payment status check failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

module.exports = router;
