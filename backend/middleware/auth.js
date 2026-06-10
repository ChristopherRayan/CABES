const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ error: 'Not authorized. No token.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cabes_super_secret_2024');
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) return res.status(401).json({ error: 'Admin not found.' });
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid or expired.' });
  }
};

const superAdminOnly = (req, res, next) => {
  if (req.admin.role !== 'superadmin') return res.status(403).json({ error: 'Super admin access required.' });
  next();
};

module.exports = { protect, superAdminOnly };