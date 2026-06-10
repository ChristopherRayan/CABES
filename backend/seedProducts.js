const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const Product  = require('./models/Product');
dotenv.config();

const defaults = [
  {
    name: 'Certified Soybeans – Class 1', shortName: 'Soybeans',
    description: 'High-protein certified soybean seed adapted for Malawi agro-ecology. Superior germination rate, disease resistant.',
    category: 'grain_legume', certClass: 'Class 1',
    badge: 'Best Seller', badgeColor: '#1e7d3e',
    features: ['High protein content','Drought tolerant','Improved nodulation','Market-grade quality'],
    sizes: [
      { label: '10 kg bag', kg: 10, price: 15000 },
      { label: '25 kg bag', kg: 25, price: 35000 },
      { label: '50 kg bag', kg: 50, price: 65000 },
    ],
    sortOrder: 1, active: true
  },
  {
    name: 'Certified Groundnuts – Class 1', shortName: 'Groundnuts',
    description: 'ICRISAT research-backed groundnut varieties. Genetic purity assured, high oil content, aflatoxin-resistant.',
    category: 'grain_legume', certClass: 'Class 1',
    badge: 'ICRISAT Backed', badgeColor: '#7c3aed',
    features: ['ICRISAT research-backed','Genetic purity assured','High oil content','Aflatoxin-resistant'],
    sizes: [
      { label: '10 kg bag', kg: 10, price: 12000 },
      { label: '25 kg bag', kg: 25, price: 28000 },
      { label: '50 kg bag', kg: 50, price: 52000 },
    ],
    sortOrder: 2, active: true
  },
  {
    name: 'Certified Common Beans – Class 1', shortName: 'Common Beans',
    description: 'Fast-maturing certified common bean seed. Ideal for smallholder farmers across the Lilongwe–Kasungu plains.',
    category: 'grain_legume', certClass: 'Class 1',
    badge: 'FAO Supported', badgeColor: '#2563eb',
    features: ['Fast maturing','High nutritional value','Strong market demand','Intercrop-friendly'],
    sizes: [
      { label: '10 kg bag', kg: 10, price: 18000 },
      { label: '25 kg bag', kg: 25, price: 42000 },
      { label: '50 kg bag', kg: 50, price: 78000 },
    ],
    sortOrder: 3, active: true
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cabes');
  for (const p of defaults) {
    const exists = await Product.findOne({ shortName: p.shortName });
    if (!exists) { await Product.create(p); console.log('✅ Created:', p.name); }
    else console.log('ℹ️  Already exists:', p.name);
  }
  process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
