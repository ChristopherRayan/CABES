const express = require('express');
const Order   = require('../models/Order');
const Contact = require('../models/Contact');
const PageView= require('../models/PageView');
const AuditLog= require('../models/AuditLog');
const { protect } = require('../middleware/auth');
const router  = express.Router();

// POST /api/analytics/pageview — public: track a page view
router.post('/pageview', async (req, res) => {
  try {
    const { page, path } = req.body;
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
    const userAgent = req.headers['user-agent'] || '';
    const referrer  = req.headers['referer'] || '';
    await PageView.create({ page: page || 'unknown', path: path || '/', ip, userAgent, referrer });
    res.json({ ok: true });
  } catch (err) { res.json({ ok: false }); } // never fail silently
});

// POST /api/analytics/seed — admin: seed mock data for last 30 days
router.post('/seed', protect, async (req, res) => {
  const PAGES = ['Home', 'About', 'Products', 'Leadership', 'Achievements', 'Contact', 'Shop'];
  const PATHS = ['/', '/about', '/products', '/leadership', '/achievements', '/contact', '/shop'];
  const COUNTRIES = ['Malawi', 'Kenya', 'Zambia', 'Tanzania', 'South Africa'];

  const randIP = () => `${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}`;
  const views = [];

  for (let d = 29; d >= 0; d--) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    date.setHours(0,0,0,0);
    const dailyViews = Math.floor(10 + Math.random() * 20);
    for (let i = 0; i < dailyViews; i++) {
      const idx = Math.floor(Math.random() * PAGES.length);
      views.push({
        page: PAGES[idx], path: PATHS[idx], ip: randIP(), userAgent: 'Mozilla/5.0', country: COUNTRIES[Math.floor(Math.random()*COUNTRIES.length)],
        createdAt: new Date(date.getTime() + Math.random() * 86400000)
      });
    }
  }

  await PageView.insertMany(views);
  AuditLog.create({ adminId: req.admin._id, adminName: req.admin.name, action: 'CREATE', resource: 'analytics', details: `Seeded ${views.length} mock pageviews` }).catch(()=>{});
  res.json({ message: `Seeded ${views.length} pageviews`, count: views.length });
});

// GET /api/analytics — admin: full analytics
router.get('/', protect, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    const localNow = new Date(now.valueOf() - offsetMs);
    const startOfToday = new Date(Date.UTC(localNow.getFullYear(), localNow.getMonth(), localNow.getDate()) + offsetMs);

    const absOffset = Math.abs(now.getTimezoneOffset());
    const sign = now.getTimezoneOffset() <= 0 ? '+' : '-';
    const tzString = `${sign}${String(Math.floor(absOffset / 60)).padStart(2, '0')}:${String(absOffset % 60).padStart(2, '0')}`;
    const dateOpts = { format: '%Y-%m-%d', date: '$createdAt', timezone: tzString };

    // Orders over time
    const ordersByDay = await Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { ...dateOpts } }, count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
      { $sort: { _id: 1 } }
    ]);

    // Revenue by product
    const revenueByProduct = await Order.aggregate([
      { $match: { status: { $in: ['confirmed','paid','dispatched','delivered'] } } },
      { $group: { _id: '$product', revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
      { $sort: { revenue: -1 } }
    ]);

    // Order status breakdown
    const statusBreakdown = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Page views over time
    const viewsByDay = await PageView.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { ...dateOpts } }, views: { $sum: 1 }, unique: { $addToSet: '$ip' } } },
      { $project: { _id: 1, views: 1, unique: { $size: '$unique' } } },
      { $sort: { _id: 1 } }
    ]);

    // Top pages
    const topPages = await PageView.aggregate([
      { $group: { _id: '$page', views: { $sum: 1 } } },
      { $sort: { views: -1 } }, { $limit: 8 }
    ]);

    // Totals
    const totalOrders   = await Order.countDocuments();
    const totalPending  = await Order.countDocuments({ status: 'pending' });
    const totalDelivered= await Order.countDocuments({ status: 'delivered' });
    const totalViews    = await PageView.countDocuments();

    const todayViews = await PageView.countDocuments({ createdAt: { $gte: startOfToday } });

    const distinctIpsToday   = await PageView.distinct('ip', { createdAt: { $gte: startOfToday } });
    const todayVisitors      = distinctIpsToday.length;

    const distinctIpsAll     = await PageView.distinct('ip');
    const totalVisitors      = distinctIpsAll.length;

    const revenueAgg    = await Order.aggregate([
      { $match: { status: { $in: ['confirmed','paid','dispatched','delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalContacts = await Contact.countDocuments();
    const newContacts   = await Contact.countDocuments({ status: 'new' });

    res.json({
      total: totalOrders, pending: totalPending, delivered: totalDelivered,
      revenue: revenueAgg[0]?.total || 0,
      totalViews, todayViews, totalVisitors, todayVisitors, totalContacts, newContacts,
      ordersByDay, viewsByDay, revenueByProduct, statusBreakdown, topPages
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/analytics/audit — admin: activity log
router.get('/audit', protect, async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
});

module.exports = router;
