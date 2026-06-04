const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, type, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ error: 'All required fields must be filled.' });
    const contact = new Contact({ name, email, subject, type, message });
    await contact.save();
    res.status(201).json({ success: true, message: 'Message received. We will respond within 1-2 business days.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
