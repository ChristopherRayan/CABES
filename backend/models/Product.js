const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  label:    { type: String, required: true },  // e.g. "10 kg bag"
  kg:       { type: Number, required: true },  // e.g. 10
  price:    { type: Number, required: true },
  discount: { type: Number, default: 0 },      // percentage 0-100
  stock:    { type: String, enum: ['available','limited','out_of_stock'], default: 'available' }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  shortName:   { type: String, required: true },
  description: { type: String, default: '' },
  category:    { type: String, default: 'grain_legume' },
  certClass:   { type: String, default: 'Class 1' },
  badge:       { type: String, default: '' },
  badgeColor:  { type: String, default: '#1e7d3e' },
  imageUrl:    { type: String, default: '' },
  features:    [{ type: String }],
  sizes:       [sizeSchema],
  active:      { type: Boolean, default: true },
  sortOrder:   { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now }
});

productSchema.pre('save', function(next) { this.updatedAt = new Date(); next(); });

module.exports = mongoose.model('Product', productSchema);
