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

// POST /api/content/seed — public: seed default content (one-time use)
router.post('/seed', async (req, res) => {
  const defaultContent = [
    { section: 'hero', key: 'heroTitle', value: 'Growing Malawi\'s Agricultural Future', type: 'text', label: 'Hero Title' },
    { section: 'hero', key: 'heroSubtitle', value: 'Certified seed, quality produce, and trusted partnerships for every farmer.', type: 'text', label: 'Hero Subtitle' },
    { section: 'hero', key: 'heroCtaText', value: 'Shop Seeds', type: 'text', label: 'CTA Button Text' },
    { section: 'hero', key: 'honeycombSoybeans', value: '', type: 'image', label: 'Hero Honeycomb - Soybeans' },
    { section: 'hero', key: 'honeycombGroundnuts', value: '', type: 'image', label: 'Hero Honeycomb - Groundnuts' },
    { section: 'hero', key: 'honeycombBeans', value: '', type: 'image', label: 'Hero Honeycomb - Beans' },
    { section: 'about', key: 'aboutTitle', value: 'About CABES', type: 'text', label: 'About Title' },
    { section: 'about', key: 'aboutBody', value: 'CABES is dedicated to providing certified quality seed and agricultural services to Malawian farmers.', type: 'textarea', label: 'About Body Text' },
    { section: 'about', key: 'aboutHeroBg', value: '', type: 'image', label: 'About Hero Background' },
    { section: 'about', key: 'aboutCollageMain', value: '', type: 'image', label: 'About Collage - Main Field' },
    { section: 'about', key: 'aboutCollageSecondary', value: '', type: 'image', label: 'About Collage - Secondary Field' },
    { section: 'about', key: 'aboutLocationImg', value: '', type: 'image', label: 'About Location Image' },
    { section: 'leadership', key: 'ceoName', value: 'Ms. Ethel Chilumpha', type: 'text', label: 'CEO / Founder Name' },
    { section: 'leadership', key: 'ceoTitle', value: 'Chief Executive Officer', type: 'text', label: 'CEO Title' },
    { section: 'leadership', key: 'ceoBio', value: 'Visionary leader with 20+ years in certified seed systems.', type: 'textarea', label: 'CEO Biography' },
    { section: 'leadership', key: 'ceoPortrait', value: '', type: 'image', label: 'CEO Portrait Photo' },
    { section: 'leadership', key: 'fieldWorkPhoto', value: '', type: 'image', label: 'Field Work Photo' },
    { section: 'leadership', key: 'harvestingPhoto', value: '', type: 'image', label: 'Harvesting Photo' },
    { section: 'achievements', key: 'achTitle', value: 'Key Achievements', type: 'text', label: 'Achievements Page Title' },
    { section: 'achievements', key: 'achSubtitle', value: 'A track record of partnerships, awards, and consistent growth.', type: 'text', label: 'Achievements Subtitle' },
    { section: 'achievements', key: 'founderSpotlight', value: '', type: 'image', label: 'Founder Spotlight Image' },
    { section: 'contact', key: 'email', value: 'cabesmw@gmail.com', type: 'text', label: 'Email Address' },
    { section: 'contact', key: 'phone', value: '+265 1 234 567', type: 'text', label: 'Phone Number' },
    { section: 'contact', key: 'address', value: 'Area 49, Lilongwe, Malawi', type: 'text', label: 'Office Address' },
    { section: 'contact', key: 'businessHours', value: 'Mon–Fri: 8:00 AM – 5:00 PM', type: 'text', label: 'Business Hours' },
    { section: 'contact', key: 'registration', value: 'MBRS1032430', type: 'text', label: 'Registration Number' },
    { section: 'products', key: 'soybeansPrice10kg', value: '15000', type: 'text', label: 'Soybeans 10kg Price' },
    { section: 'products', key: 'soybeansPrice25kg', value: '35000', type: 'text', label: 'Soybeans 25kg Price' },
    { section: 'products', key: 'soybeansPrice50kg', value: '65000', type: 'text', label: 'Soybeans 50kg Price' },
    { section: 'products', key: 'groundnutsPrice10kg', value: '12000', type: 'text', label: 'Groundnuts 10kg Price' },
    { section: 'products', key: 'groundnutsPrice25kg', value: '22000', type: 'text', label: 'Groundnuts 25kg Price' },
    { section: 'products', key: 'groundnutsPrice50kg', value: '42000', type: 'text', label: 'Groundnuts 50kg Price' },
    { section: 'products', key: 'beansPrice10kg', value: '8000', type: 'text', label: 'Beans 10kg Price' },
    { section: 'products', key: 'beansPrice25kg', value: '15000', type: 'text', label: 'Beans 25kg Price' },
    { section: 'products', key: 'beansPrice50kg', value: '28000', type: 'text', label: 'Beans 50kg Price' },
    { section: 'products', key: 'beansPrice50kgDiscount', value: '', type: 'text', label: 'Beans 50kg Discount %' },
  ];
  try {
    for (const item of defaultContent) {
      const existing = await Content.findOne({ section: item.section, key: item.key });
      if (!existing) {
        await Content.create({ ...item, updatedAt: new Date(), updatedBy: 'system' });
      }
    }
    res.json({ message: 'Content seeded', count: defaultContent.length });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ error: 'Seed failed', details: err.message });
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
