const express = require('express');
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');
const router = express.Router();

// POST /api/contact — public
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, type, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ error: 'All required fields must be filled.' });
    const contact = new Contact({ name, email, subject, type, message });
    await contact.save();
    res.status(201).json({ success: true, message: 'Message received. We will respond within 1-2 business days.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/contact — admin
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const contacts = await Contact.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit));
    const total = await Contact.countDocuments(filter);
    res.json({ contacts, total });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PATCH /api/contact/:id/status — admin
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/contact/:id — admin
router.delete('/:id', protect, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
