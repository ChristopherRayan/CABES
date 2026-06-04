import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import beansImg from '../assets/beans.jpeg';
import groundnutsImg from '../assets/groundnuts.jpg';
import soybeansImg from '../assets/soybeans.jpeg';
import '../App.css';
import './Shop.css';

const products = [
  {
    id: 1, img: soybeansImg, name: 'Certified Soybeans – Class 1',
    shortName: 'Soybeans',
    price: 12000, unit: '25 kg bag',
    desc: 'High-protein soybean certified seed. Superior germination rate, disease resistant, adapted for Malawi agro-ecology.',
    features: ['High protein content','Drought tolerant','Improved nodulation','Market-grade quality'],
    stock: 'Available', badge: 'Best Seller', badgeColor: '#1e7d3e',
    sizes: [{ label:'10 kg bag', price:5500 },{ label:'25 kg bag', price:12000 },{ label:'50 kg bag', price:22000 }],
  },
  {
    id: 2, img: groundnutsImg, name: 'Certified Groundnuts – Class 1',
    shortName: 'Groundnuts',
    price: 9500, unit: '25 kg bag',
    desc: 'ICRISAT research-backed groundnut varieties. Genetic purity assured, high oil content, aflatoxin-resistant.',
    features: ['ICRISAT research-backed','Genetic purity assured','High oil content','Aflatoxin-resistant'],
    stock: 'Available', badge: 'ICRISAT Backed', badgeColor: '#7c3aed',
    sizes: [{ label:'10 kg bag', price:4000 },{ label:'25 kg bag', price:9500 },{ label:'50 kg bag', price:18000 }],
  },
  {
    id: 3, img: beansImg, name: 'Certified Common Beans – Class 1',
    shortName: 'Common Beans',
    price: 8000, unit: '25 kg bag',
    desc: 'Fast-maturing certified common bean seed. Ideal for smallholder farmers across the Lilongwe–Kasungu plains.',
    features: ['Fast maturing','High nutritional value','Strong market demand','Intercrop-friendly'],
    stock: 'Available', badge: 'FAO Supported', badgeColor: '#2563eb',
    sizes: [{ label:'10 kg bag', price:3500 },{ label:'25 kg bag', price:8000 },{ label:'50 kg bag', price:15000 }],
  },
];

function ProductCard({ product, onOrder }) {
  const [selectedSize, setSelectedSize] = useState(1);
  const [qty, setQty] = useState(1);
  return (
    <div className="shop-card">
      <div className="sc-img-wrap">
        <img src={product.img} alt={product.name} />
        <div className="sc-badge" style={{background:product.badgeColor}}>{product.badge}</div>
        <div className="sc-cert">✓ Certified Class 1</div>
        <div className="sc-stock">🟢 {product.stock}</div>
      </div>
      <div className="sc-body">
        <h3 className="sc-name">{product.name}</h3>
        <p className="sc-desc">{product.desc}</p>
        <div className="sc-features">
          {product.features.map(f=>(
            <span key={f} className="sc-feat">
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              {f}
            </span>
          ))}
        </div>
        {/* Size picker */}
        <div className="sc-section-label">Select Pack Size</div>
        <div className="sc-sizes">
          {product.sizes.map((s,i)=>(
            <button key={i} className={`sc-size ${selectedSize===i?'active':''}`} onClick={()=>setSelectedSize(i)}>
              <span className="ssz-label">{s.label}</span>
              <span className="ssz-price">MK {s.price.toLocaleString()}</span>
            </button>
          ))}
        </div>
        {/* Qty */}
        <div className="sc-section-label">Quantity (bags)</div>
        <div className="sc-qty-row">
          <div className="sc-qty">
            <button onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
            <span>{qty}</span>
            <button onClick={()=>setQty(q=>q+1)}>+</button>
          </div>
          <div className="sc-total">
            Total: <strong>MK {(product.sizes[selectedSize].price * qty).toLocaleString()}</strong>
          </div>
        </div>
        <button className="btn btn-primary sc-order-btn"
          onClick={()=>onOrder({ ...product, selectedSize: product.sizes[selectedSize], qty })}>
          🛒 Place Order
        </button>
      </div>
    </div>
  );
}

function OrderModal({ item, onClose }) {
  const [form, setForm] = useState({ name:'', phone:'', email:'', district:'', delivery:'pickup', notes:'' });
  const [paymentMethod, setPaymentMethod] = useState('Airtel Money');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const paymentInstructions = {
    'Airtel Money': 'Send payment to 088 123 4567 using your Airtel Money wallet. Include your name and order reference in the remarks.',
    'TNM Mpamba': 'Send payment to 099 987 6543 using your TNM Mpamba wallet. Include your name and order reference in the remarks.',
  };

  const handleChange = e => setForm({...form,[e.target.name]:e.target.value});
  const handleSubmit = e => {
    e.preventDefault(); setLoading(true);
    setTimeout(()=>{ setLoading(false); setSubmitted(true); }, 1600);
  };

  return (
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        {submitted ? (
          <div className="modal-success">
            <div className="ms-icon">🌱</div>
            <h3>Order Received!</h3>
            <p>Thank you, <strong>{form.name}</strong>! We've received your order for:</p>
            <div className="ms-order-summary">
              <div><strong>{item.shortName}</strong> – {item.selectedSize.label}</div>
              <div>Qty: {item.qty} bag{item.qty>1?'s':''}</div>
              <div>Payment: <strong>{paymentMethod}</strong></div>
              <div className="ms-total">Total: MK {(item.selectedSize.price*item.qty).toLocaleString()}</div>
            </div>
            <p className="ms-note">Our team will contact you within 24 hours to confirm your order and share the {paymentMethod} payment instructions.</p>
            <p className="ms-contact">{paymentInstructions[paymentMethod]}</p>
            <p className="ms-contact">📧 cabesmw@gmail.com</p>
            <button className="btn btn-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div>
                <h3>Place Your Order</h3>
                <p className="modal-sub">{item.name} · {item.selectedSize.label} · {item.qty} bag{item.qty>1?'s':''} · <strong>MK {(item.selectedSize.price*item.qty).toLocaleString()}</strong></p>
              </div>
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="mf-row">
                <div className="mf-group">
                  <label>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
                </div>
                <div className="mf-group">
                  <label>Phone Number *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+265 XXX XXX XXX" required />
                </div>
              </div>
              <div className="mf-group">
                <label>Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
              </div>
              <div className="mf-group">
                <label>District *</label>
                <select name="district" value={form.district} onChange={handleChange} required>
                  <option value="">Select district...</option>
                  {['Lilongwe','Kasungu','Mzimba','Blantyre','Zomba','Dedza','Salima','Ntchisi','Dowa','Nkhotakota','Other'].map(d=>(
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="mf-group">
                <label>Delivery Preference</label>
                <div className="mf-radio-group">
                  {[['pickup','Pick Up at Office (Area 49, Lilongwe)'],['delivery','Request Delivery (additional cost)']].map(([val,lbl])=>(
                    <label key={val} className={`mf-radio ${form.delivery===val?'active':''}`}>
                      <input type="radio" name="delivery" value={val} checked={form.delivery===val} onChange={handleChange}/>
                      {lbl}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mf-group">
                <label>Payment Method</label>
                <div className="mf-radio-group">
                  {['Airtel Money','TNM Mpamba'].map(method=>(
                    <label key={method} className={`mf-radio ${paymentMethod===method?'active':''}`}>
                      <input type="radio" name="paymentMethod" value={method} checked={paymentMethod===method} onChange={e=>setPaymentMethod(e.target.value)}/>
                      {method}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mf-group">
                <label>Additional Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any special requirements or questions..." rows={3}/>
              </div>
              <div className="modal-notice">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Our team will contact you to confirm payment and arrange delivery or pickup. We accept mobile money and bank transfer.
              </div>
              <button type="submit" className="btn btn-primary mf-submit" disabled={loading}>
                {loading ? <><span className="spinner"/>Processing...</> : '✅ Confirm Order'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function Shop() {
  const [orderItem, setOrderItem] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
    return ()=>observer.disconnect();
  }, []);

  const filtered = filter==='all' ? products : products.filter(p=>p.shortName.toLowerCase().includes(filter));

  return (
    <div className="page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container page-hero-content">
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Shop</span></div>
          <h1>🛒 Seed Shop</h1>
          <p>Order certified grain legume seed directly from CABES — quality guaranteed, Malawi Seed Act (2022) compliant.</p>
        </div>
      </section>

      {/* Info bar */}
      <div className="shop-info-bar">
        <div className="container shop-info-grid">
          {[
            { icon:'✅', label:'All seeds Certified Class 1' },
            { icon:'📞', label:'24hr order confirmation' },
            { icon:'📍', label:'Pickup: Area 49, Lilongwe' },
            { icon:'💳', label:'Mobile money & bank transfer' },
          ].map(i=>(
            <div key={i.label} className="sib-item">
              <span>{i.icon}</span>{i.label}
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <section className="section">
        <div className="container">
          <div className="shop-header reveal">
            <div>
              <div className="section-badge">🌱 Available Now</div>
              <h2 className="section-title">Certified Seed Products</h2>
            </div>
            <div className="shop-filters">
              {[['all','All Seeds'],['soy','Soybeans'],['ground','Groundnuts'],['bean','Beans']].map(([val,lbl])=>(
                <button key={val} className={`sf-btn ${filter===val?'active':''}`} onClick={()=>setFilter(val)}>{lbl}</button>
              ))}
            </div>
          </div>
          <div className="shop-grid">
            {filtered.map((p,i)=>(
              <div key={p.id} className="reveal" style={{animationDelay:`${i*0.12}s`}}>
                <ProductCard product={p} onOrder={setOrderItem}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to order */}
      <section className="section section-alt">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'48px'}} className="reveal">
            <div className="section-badge">📋 Process</div>
            <h2 className="section-title">How to Order</h2>
          </div>
          <div className="order-steps">
            {[
              { step:'01', icon:'🛒', title:'Select & Order', desc:'Choose your seed type, pack size, and quantity. Click "Place Order" and fill in your details.' },
              { step:'02', icon:'📞', title:'Confirmation Call', desc:'Our team contacts you within 24 hours to confirm availability, pricing, and arrange payment.' },
              { step:'03', icon:'💳', title:'Make Payment', desc:'Pay via mobile money (Airtel/TNM) or bank transfer. We\'ll send payment details after confirmation.' },
              { step:'04', icon:'🌾', title:'Receive Your Seed', desc:'Pick up at our Area 49 office in Lilongwe, or we arrange delivery to your district.' },
            ].map((s,i)=>(
              <div key={s.step} className="order-step reveal" style={{animationDelay:`${i*0.1}s`}}>
                <div className="os-num">{s.step}</div>
                <div className="os-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / Info */}
      <section className="section">
        <div className="container shop-faq-grid">
          <div className="reveal">
            <div className="section-badge">❓ FAQs</div>
            <h2 className="section-title">Common Questions</h2>
            <div className="faq-list">
              {[
                { q:'Are the seeds certified?', a:'Yes. All CABES seeds are Certified Class 1 under the Malawi Seed Act (2022), guaranteeing quality, purity, and germination standards.' },
                { q:'What is the minimum order?', a:'Minimum order is 1 bag (10 kg). Bulk discounts are available for orders above 10 bags — contact us directly.' },
                { q:'Where is pickup located?', a:'Our office and pickup point is at Area 49, Lilongwe, Malawi. Operating hours: Mon–Fri, 8 AM – 5 PM.' },
                { q:'Do you deliver to my district?', a:'We can arrange delivery to most districts. Delivery costs vary by location and will be confirmed when we contact you.' },
                { q:'How long do the seeds stay viable?', a:'CABES Certified Class 1 seeds retain vigor and quality for up to three growing seasons when stored properly.' },
              ].map(faq=>(
                <div key={faq.q} className="faq-item">
                  <div className="faq-q">{faq.q}</div>
                  <div className="faq-a">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="shop-contact-box reveal">
            <div className="scb-icon">📞</div>
            <h3>Need Help Ordering?</h3>
            <p>Our team is happy to help you choose the right seed and quantity for your farm.</p>
            <div className="scb-contacts">
              <a href="mailto:cabesmw@gmail.com" className="scb-contact">
                <span>📧</span> cabesmw@gmail.com
              </a>
              <div className="scb-contact">
                <span>📍</span> Area 49, Lilongwe, Malawi
              </div>
              <div className="scb-contact">
                <span>⏰</span> Mon–Fri: 8:00 AM – 5:00 PM
              </div>
            </div>
            <Link to="/contact" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:'20px'}}>Send Us a Message</Link>
          </div>
        </div>
      </section>

      {/* Order modal */}
      {orderItem && <OrderModal item={orderItem} onClose={()=>setOrderItem(null)}/>}
    </div>
  );
}
