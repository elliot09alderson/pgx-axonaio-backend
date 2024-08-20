const express = require('express');
const router = express.Router();
const LivePaymentLink = require('../models/livePaymentsLink');

// Create a live payment link
router.post('/live-payment-links', async (req, res) => {
  try {
    const livePaymentLink = await LivePaymentLink.create(req.body);
    res.status(201).json({ message: 'Live payment link created successfully', data: livePaymentLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all live payment links
router.get('/live-payment-links', async (req, res) => {
  try {
    const livePaymentLinks = await LivePaymentLink.find();
    res.json({ data: livePaymentLinks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
