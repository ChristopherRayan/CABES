const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  product: { type: String, required: true },
  packSize: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  district: { type: String, required: true },
  delivery: { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
  notes: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'paid', 'dispatched', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);