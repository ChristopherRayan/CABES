const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  adminId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  adminName: { type: String },
  action:    { type: String, required: true },  // 'CREATE','UPDATE','DELETE','LOGIN'
  resource:  { type: String, required: true },  // 'product','order','content','auth'
  resourceId:{ type: String },
  details:   { type: String },
  ip:        { type: String },
  createdAt: { type: Date, default: Date.now }
});

auditSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditSchema);
