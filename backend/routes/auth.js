const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');
const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'cabes_super_secret_2024', { expiresIn: '7d' });

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required.' });

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid email or password.' });

    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    AuditLog.create({
      adminId: admin._id, adminName: admin.name,
      action: 'LOGIN', resource: 'auth', resourceId: admin._id.toString(),
      details: `${admin.name} logged in`, ip: req.ip
    }).catch(() => {});

    res.json({
      token: signToken(admin._id),
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, profilePicture: admin.profilePicture || '' }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ admin: req.admin });
});

// PUT /api/auth/change-password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);
    if (!(await admin.comparePassword(currentPassword)))
      return res.status(400).json({ error: 'Current password is incorrect.' });
    if (newPassword.length < 8)
      return res.status(400).json({ error: 'New password must be at least 8 characters.' });
    admin.password = newPassword;
    await admin.save();
    AuditLog.create({
      adminId: admin._id, adminName: admin.name,
      action: 'UPDATE', resource: 'auth', resourceId: admin._id.toString(),
      details: `${admin.name} changed their password`, ip: req.ip
    }).catch(() => {});
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/auth/update-profile
router.put('/update-profile', protect, async (req, res) => {
  try {
    const { name, profilePicture } = req.body;
    const admin = await Admin.findById(req.admin._id);
    if (name) admin.name = name;
    if (profilePicture !== undefined) admin.profilePicture = profilePicture;
    await admin.save({ validateBeforeSave: false });
    AuditLog.create({
      adminId: admin._id, adminName: admin.name,
      action: 'UPDATE', resource: 'auth', resourceId: admin._id.toString(),
      details: `${admin.name} updated their profile`, ip: req.ip
    }).catch(() => {});
    res.json({ admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, profilePicture: admin.profilePicture || '' } });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
