const express = require('express');
const Content = require('../models/Content');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');
const router = express.Router();

// ─── PUBLIC ───────────────────────────────────────────────
// GET /api/content/:section — public, for frontend to fetch live content
router.get('/:section', async (req, res) => {
  if (req.params.section === 'bulk') return res.status(400).json({ error: 'Invalid section.' });
  try {
    const items = await Content.find({ section: req.params.section });
    const result = {};
    items.forEach(i => { result[i.key] = i.value; });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── ADMIN ────────────────────────────────────────────────
// GET /api/content — admin: get all content grouped by section
router.get('/', protect, async (req, res) => {
  try {
    const items = await Content.find().sort({ section: 1, key: 1 });
    const grouped = {};
    items.forEach(i => {
      if (!grouped[i.section]) grouped[i.section] = [];
      grouped[i.section].push(i);
    });
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/content/bulk/update — MUST be before /:section/:key
router.put('/bulk/update', protect, async (req, res) => {
  try {
    const { updates } = req.body;
    if (!updates || !Array.isArray(updates) || updates.length === 0)
      return res.status(400).json({ error: 'No updates provided.' });

    const ops = updates.map(u => ({
      updateOne: {
        filter: { section: u.section, key: u.key },
        update: {
          $set: {
            value: String(u.value),
            type: u.type || 'text',
            label: u.label || u.key,
            updatedAt: new Date(),
            updatedBy: req.admin.name
          }
        },
        upsert: true
      }
    }));
    await Content.bulkWrite(ops);

    AuditLog.create({
      adminId: req.admin._id, adminName: req.admin.name,
      action: 'UPDATE', resource: 'content', resourceId: '',
      details: `Updated ${updates.length} content field(s): ${updates.map(u=>u.key).slice(0,5).join(', ')}${updates.length>5?'…':''}`,
      ip: req.ip
    }).catch(() => {});

    res.json({ message: `${updates.length} fields updated.`, count: updates.length });
  } catch (err) {
    console.error('Bulk update error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/content/:section/:key — admin: update one field
router.put('/:section/:key', protect, async (req, res) => {
  try {
    const { value, type, label } = req.body;
    const item = await Content.findOneAndUpdate(
      { section: req.params.section, key: req.params.key },
      { value: String(value), type: type || 'text', label: label || req.params.key, updatedAt: new Date(), updatedBy: req.admin.name },
      { upsert: true, new: true }
    );

    AuditLog.create({
      adminId: req.admin._id, adminName: req.admin.name,
      action: 'UPDATE', resource: 'content', resourceId: `${req.params.section}.${req.params.key}`,
      details: `Updated ${req.params.section}.${req.params.key}`, ip: req.ip
    }).catch(() => {});

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
