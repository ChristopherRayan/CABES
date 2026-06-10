const express = require('express');
const Order   = require('../models/Order');
const AuditLog= require('../models/AuditLog');
const { protect } = require('../middleware/auth');
const router  = express.Router();

const audit = (req, action, resourceId, details) =>
  AuditLog.create({ adminId: req.admin._id, adminName: req.admin.name, action, resource: 'order', resourceId, details, ip: req.ip }).catch(() => {});

// POST — public: place order
router.post('/', async (req, res) => {
  try {
    const { product, packSize, quantity, totalPrice, customerName, phone, email, district, delivery, notes } = req.body;
    if (!product || !customerName || !phone || !district)
      return res.status(400).json({ error: 'Required fields missing.' });
    const order = new Order({ product, packSize, quantity, totalPrice, customerName, phone, email, district, delivery, notes });
    await order.save();
    res.status(201).json({ success: true, message: 'Order placed.', orderId: order._id });
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
});

// GET /stats — admin dashboard stats
router.get('/stats', protect, async (req, res) => {
  try {
    const total     = await Order.countDocuments();
    const pending   = await Order.countDocuments({ status: 'pending' });
    const confirmed = await Order.countDocuments({ status: 'confirmed' });
    const delivered = await Order.countDocuments({ status: 'delivered' });
    const revenue   = await Order.aggregate([
      { $match: { status: { $in: ['confirmed','paid','dispatched','delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    res.json({ total, pending, confirmed, delivered, revenue: revenue[0]?.total || 0, recentOrders });
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
});

// GET / — admin: list orders
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit));
    const total  = await Order.countDocuments(filter);
    res.json({ orders, total, pages: Math.ceil(total/limit) });
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
});

// PATCH /:id/status — admin
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    audit(req, 'UPDATE', order._id, `Status → ${req.body.status} for ${order.customerName}`);
    res.json(order);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
});

// DELETE /:id — admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found.' });
    audit(req, 'DELETE', order._id, `Deleted order from ${order.customerName}`);
    res.json({ message: 'Deleted.' });
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
});

module.exports = router;
