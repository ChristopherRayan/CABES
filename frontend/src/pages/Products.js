import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import soybeansImg from '../assets/soybeans.jpeg';
import groundnutsImg from '../assets/groundnuts.jpg';
import beansImg from '../assets/beans.jpeg';
import '../App.css';
import './Products.css';

const products = [
  {
    id: 1,
    img: soybeansImg,
    name: 'Certified Soybeans',
    class: 'Class 1',
    desc: 'High-protein certified soybean seed adapted for the Malawi agro-ecology. Our soybeans deliver consistent yields with superior germination and disease resistance.',
    features: ['High protein content', 'Drought tolerant', 'Improved nodulation', 'Market-grade quality'],
  },
  {
    id: 2,
    img: groundnutsImg,
    name: 'Certified Groundnuts',
    class: 'Class 1',
    desc: 'Quality certified groundnut varieties contributed through ICRISAT research. These varieties are bred for genetic purity and high early-generation seed standards.',
    features: ['ICRISAT research-backed', 'Genetic purity assured', 'High oil content', 'Aflatoxin-resistant'],
  },
  {
    id: 3,
    img: beansImg,
    name: 'Common Beans',
    class: 'Class 1',
    desc: 'Certified common bean seed supporting household food security and income generation. Ideal for smallholder farmers across the Lilongwe–Kasungu plains.',
    features: ['Fast maturing', 'High nutritional value', 'Market demand', 'Intercrop-friendly'],
  },
];

const certProcess = [
  { step: '01', title: 'Seed Sourcing', desc: 'Sourcing breeder and foundation seed from certified research institutions.' },
  { step: '02', title: 'Field Production', desc: 'Controlled field production on Lilongwe–Kasungu plains with isolation.' },
  { step: '03', title: 'Quality Inspection', desc: 'Field inspections for genetic purity, isolation distance, and crop condition.' },
  { step: '04', title: 'Post-Harvest Testing', desc: 'Laboratory testing for germination, purity, moisture, and seed health.' },
  { step: '05', title: 'Certification', desc: 'Official certification under Malawi Seed Act (2022) standards.' },
  { step: '06', title: 'Distribution', desc: 'Packaged and distributed to farmers, NGOs, and development partners.' },
];

const paymentMethods = ['Airtel Money', 'TNM Mpamba'];

export default function Products() {
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container page-hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Products</span>
          </div>
          <h1>Our Certified Seeds</h1>
          <p>Certified Seed Class 1 — retaining vigor and quality for up to three growing seasons, compliant with the Malawi Seed Act (2022).</p>
        </div>
      </section>

      {/* Products */}
      <section className="section">
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'56px'}} className="reveal">
            <div className="section-badge">🌱 Grain Legumes</div>
            <h2 className="section-title">What We Produce</h2>
            <p className="section-sub" style={{margin:'0 auto'}}>All seeds are certified under national standards ensuring quality, purity, and optimal germination for Malawian growing conditions.</p>
          </div>
          <div className="products-list">
            {products.map((p, i) => (
              <div key={p.id} className={`product-row reveal ${i % 2 === 1 ? 'product-row-reverse' : ''}`} style={{animationDelay:`${i*0.1}s`}}>
                <div className="product-visual">
                  <img src={p.img} alt={p.name} />
                  <div className="pv-badge">Certified {p.class}</div>
                  <div className="pv-label">Malawi Seed Act (2022)</div>
                </div>
                <div className="product-info">
                  <div className="section-badge" style={{marginBottom:'12px'}}>Grain Legume</div>
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-desc">{p.desc}</p>
                  <div className="product-features">
                    {p.features.map(f => (
                      <span key={f} className="feature-tag">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="payment-section reveal" style={{animationDelay:'0.15s'}}>
            <div className="section-badge">📲 Payment Options</div>
            <h3 className="section-title" style={{fontSize:'clamp(1.75rem,2.5vw,2.2rem)', marginBottom:'18px'}}>Choose Airtel Money or TNM Mpamba</h3>
            <p className="section-sub" style={{maxWidth:'720px', margin:'0 auto 24px'}}>
              Select your preferred mobile money provider before placing an order. We will send secure payment instructions to the selected service.
            </p>
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`payment-option ${paymentMethod === method ? 'active' : ''}`}
                >
                  {method}
                </button>
              ))}
            </div>
            <div className="payment-summary">
              Selected provider: <strong>{paymentMethod}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Highlight */}
      <section className="section section-alt cert-highlight">
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'56px'}} className="reveal">
            <div className="section-badge">🏆 Standards</div>
            <h2 className="section-title">Certified Seed Class 1</h2>
            <p className="section-sub" style={{margin:'0 auto'}}>Our seed retains vigor and quality for up to three growing seasons — the highest standard for Malawian smallholder farmers.</p>
          </div>
          <div className="cert-cards">
            {[
              { icon: '🔬', title: 'Genetic Purity', desc: 'Maintained through rigorous isolation and roguing practices during field production.' },
              { icon: '🌡️', title: 'Germination Rate', desc: 'Tested to meet minimum germination thresholds as per Malawi Seed Act (2022).' },
              { icon: '💧', title: 'Moisture Content', desc: 'Processed and stored at optimal moisture levels to preserve seed viability.' },
              { icon: '🛡️', title: 'Seed Health', desc: 'Treated and inspected for seed-borne pathogens before distribution.' },
            ].map((c, i) => (
              <div key={c.title} className="cert-card reveal" style={{animationDelay:`${i*0.1}s`}}>
                <div className="cert-icon">{c.icon}</div>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Process */}
      <section className="section">
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'56px'}} className="reveal">
            <div className="section-badge">⚙️ Process</div>
            <h2 className="section-title">Seed Certification Process</h2>
          </div>
          <div className="process-grid">
            {certProcess.map((step, i) => (
              <div key={step.step} className="process-step reveal" style={{animationDelay:`${i*0.1}s`}}>
                <div className="step-number">{step.step}</div>
                <h4 className="step-title">{step.title}</h4>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section section-alt">
        <div className="container" style={{textAlign:'center'}}>
          <div className="reveal">
            <div className="section-badge">📞 Order</div>
            <h2 className="section-title">Ready to Order Certified Seed?</h2>
            <p className="section-sub" style={{margin:'0 auto 32px'}}>Contact us to discuss your seed requirements, pricing, and availability for the upcoming growing season.</p>
            <Link to="/contact" className="btn btn-primary">Contact CABES →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
