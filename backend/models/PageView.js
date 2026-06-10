const mongoose = require('mongoose');

const pageViewSchema = new mongoose.Schema({
  page:      { type: String, required: true },
  path:      { type: String, required: true },
  ip:        { type: String },
  userAgent: { type: String },
  referrer:  { type: String },
  country:   { type: String, default: 'Unknown' },
  createdAt: { type: Date, default: Date.now }
});

pageViewSchema.index({ createdAt: -1 });
pageViewSchema.index({ page: 1 });

module.exports = mongoose.model('PageView', pageViewSchema);
