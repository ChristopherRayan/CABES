const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();
const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://cabes-six.vercel.app',
  'https://*.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/products', require('./routes/products'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/upload', require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'CABES API running', company: 'CABES Company Malawi' }));

// MongoDB connection with resilient error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cabes', {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CABES Server running on port ${PORT}`));