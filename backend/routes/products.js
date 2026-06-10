const express = require('express');
const Product = require('../models/Product');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');
const router = express.Router();

const audit = (req, action, resourceId, details) =>
  AuditLog.create({ adminId: req.admin._id, adminName: req.admin.name, action, resource: 'product', resourceId, details, ip: req.ip }).catch(() => {});

// GET /api/products — public: list active products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ active: true }).sort({ sortOrder: 1, createdAt: 1 });
    res.json(products);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
});

// GET /api/products/all — admin: all including inactive
router.get('/all', protect, async (req, res) => {
  try {
    const products = await Product.find().sort({ sortOrder: 1, createdAt: 1 });
    res.json(products);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
});

// POST /api/products — admin: create
router.post('/', protect, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    audit(req, 'CREATE', product._id, `Created product: ${product.name}`);
    res.status(201).json(product);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/products/:id — admin: update
router.put('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    audit(req, 'UPDATE', product._id, `Updated product: ${product.name}`);
    res.json(product);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE /api/products/:id — admin: delete
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    audit(req, 'DELETE', product._id, `Deleted product: ${product.name}`);
    res.json({ message: 'Product deleted.' });
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
});

// PATCH /api/products/:id/toggle — admin: toggle active
router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found.' });
    product.active = !product.active;
    await product.save();
    audit(req, 'UPDATE', product._id, `${product.active ? 'Activated' : 'Deactivated'}: ${product.name}`);
    res.json(product);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
});

module.exports = router;
