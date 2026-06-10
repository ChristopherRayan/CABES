require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cabes');
    console.log('Connected to MongoDB');

    const defaultContent = [
      { section: 'hero', key: 'heroTitle', value: 'Growing Malawi\'s Agricultural Future', type: 'text', label: 'Hero Title' },
      { section: 'hero', key: 'heroSubtitle', value: 'Certified seed, quality produce, and trusted partnerships for every farmer.', type: 'text', label: 'Hero Subtitle' },
      { section: 'hero', key: 'heroCtaText', value: 'Shop Seeds', type: 'text', label: 'CTA Button Text' },
      { section: 'about', key: 'aboutTitle', value: 'About CABES', type: 'text', label: 'About Title' },
      { section: 'about', key: 'aboutBody', value: 'CABES is dedicated to providing certified quality seed and agricultural services to Malawian farmers.', type: 'textarea', label: 'About Body Text' },
      { section: 'leadership', key: 'ceoName', value: 'Ms. Ethel Chilumpha', type: 'text', label: 'CEO / Founder Name' },
      { section: 'leadership', key: 'ceoTitle', value: 'Chief Executive Officer', type: 'text', label: 'CEO Title' },
      { section: 'leadership', key: 'ceoBio', value: 'Visionary leader with 20+ years in certified seed systems, plant breeding, and inclusive agribusiness.', type: 'textarea', label: 'CEO Biography' },
      { section: 'achievements', key: 'achTitle', value: 'Key Achievements', type: 'text', label: 'Achievements Page Title' },
      { section: 'achievements', key: 'achSubtitle', value: 'A track record of partnerships, awards, and consistent growth since 2018.', type: 'text', label: 'Achievements Subtitle' },
      { section: 'contact', key: 'email', value: 'cabesmw@gmail.com', type: 'text', label: 'Email Address' },
      { section: 'contact', key: 'phone', value: '+265 1 234 567', type: 'text', label: 'Phone Number' },
      { section: 'contact', key: 'address', value: 'Area 49, Lilongwe, Malawi', type: 'text', label: 'Office Address' },
      { section: 'contact', key: 'businessHours', value: 'Monday – Friday: 8:00 AM – 5:00 PM', type: 'text', label: 'Business Hours' },
      { section: 'contact', key: 'registration', value: 'MBRS1032430', type: 'text', label: 'Registration Number' },
      { section: 'products', key: 'soybeansPrice10kg', value: '15000', type: 'text', label: 'Soybeans 10kg Price' },
      { section: 'products', key: 'soybeansPrice25kg', value: '35000', type: 'text', label: 'Soybeans 25kg Price' },
      { section: 'products', key: 'soybeansPrice50kg', value: '65000', type: 'text', label: 'Soybeans 50kg Price' },
      { section: 'products', key: 'groundnutsPrice10kg', value: '12000', type: 'text', label: 'Groundnuts 10kg Price' },
      { section: 'products', key: 'groundnutsPrice25kg', value: '28000', type: 'text', label: 'Groundnuts 25kg Price' },
      { section: 'products', key: 'groundnutsPrice50kg', value: '52000', type: 'text', label: 'Groundnuts 50kg Price' },
      { section: 'products', key: 'beansPrice10kg', value: '18000', type: 'text', label: 'Beans 10kg Price' },
      { section: 'products', key: 'beansPrice25kg', value: '42000', type: 'text', label: 'Beans 25kg Price' },
      { section: 'products', key: 'beansPrice50kg', value: '78000', type: 'text', label: 'Beans 50kg Price' },
      { section: 'products', key: 'soybeansPrice10kgDiscount', value: '', type: 'text', label: 'Soybeans 10kg Discount %' },
      { section: 'products', key: 'soybeansPrice25kgDiscount', value: '', type: 'text', label: 'Soybeans 25kg Discount %' },
      { section: 'products', key: 'soybeansPrice50kgDiscount', value: '', type: 'text', label: 'Soybeans 50kg Discount %' },
      { section: 'products', key: 'groundnutsPrice10kgDiscount', value: '', type: 'text', label: 'Groundnuts 10kg Discount %' },
      { section: 'products', key: 'groundnutsPrice25kgDiscount', value: '', type: 'text', label: 'Groundnuts 25kg Discount %' },
      { section: 'products', key: 'groundnutsPrice50kgDiscount', value: '', type: 'text', label: 'Groundnuts 50kg Discount %' },
      { section: 'products', key: 'beansPrice10kgDiscount', value: '', type: 'text', label: 'Beans 10kg Discount %' },
      { section: 'products', key: 'beansPrice25kgDiscount', value: '', type: 'text', label: 'Beans 25kg Discount %' },
      { section: 'products', key: 'beansPrice50kgDiscount', value: '', type: 'text', label: 'Beans 50kg Discount %' },
      { section: 'hero', key: 'honeycombSoybeans', value: '', type: 'image', label: 'Hero Honeycomb - Soybeans' },
      { section: 'hero', key: 'honeycombGroundnuts', value: '', type: 'image', label: 'Hero Honeycomb - Groundnuts' },
      { section: 'hero', key: 'honeycombBeans', value: '', type: 'image', label: 'Hero Honeycomb - Beans' },
      { section: 'about', key: 'aboutCollageMain', value: '', type: 'image', label: 'About Collage - Main Field' },
      { section: 'about', key: 'aboutCollageSecondary', value: '', type: 'image', label: 'About Collage - Secondary Field' },
      { section: 'about', key: 'aboutHeroBg', value: '', type: 'image', label: 'About Hero Background' },
      { section: 'about', key: 'aboutLocationImg', value: '', type: 'image', label: 'About Location Image' },
      { section: 'leadership', key: 'ceoPortrait', value: '', type: 'image', label: 'CEO Portrait Photo' },
      { section: 'leadership', key: 'fieldWorkPhoto', value: '', type: 'image', label: 'Field Work Photo' },
      { section: 'leadership', key: 'harvestingPhoto', value: '', type: 'image', label: 'Harvesting Photo' },
      { section: 'achievements', key: 'founderSpotlight', value: '', type: 'image', label: 'Founder Spotlight Image' },
    ];

    for (const item of defaultContent) {
      await Content.findOneAndUpdate(
        { section: item.section, key: item.key },
        item,
        { upsert: true, new: true }
      );
      console.log(`Seeded: ${item.section}.${item.key}`);
    }

    const adminExists = await Admin.findOne({ email: 'admin@cabes.mw' });
    if (!adminExists) {
      await Admin.create({
        name: 'Admin User',
        email: 'admin@cabes.mw',
        password: 'Cabes@2024!',
        role: 'superadmin'
      });
      console.log('Seeded admin: admin@cabes.mw / Cabes@2024!');
    } else {
      adminExists.password = 'Cabes@2024!';
      await adminExists.save();
      console.log('Reset admin password for: admin@cabes.mw');
    }

    console.log('\n✅ Seed complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
