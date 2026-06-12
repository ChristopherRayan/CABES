const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  section:   { type: String, required: true },
  key:       { type: String, required: true },
  value:     { type: String, default: '' },
  type:      { type: String, enum: ['text','textarea','image','array','boolean'], default: 'text' },
  label:     { type: String },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String }
});

contentSchema.index({ section: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Content', contentSchema);