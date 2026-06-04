const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  type: { type: String, default: '' },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'new' }
});
module.exports = mongoose.model('Contact', contactSchema);
