import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import beansImg     from '../assets/beans.jpeg';
import groundnutsImg from '../assets/groundnuts.jpg';
import soybeansImg  from '../assets/soybeans.jpeg';
import '../App.css';
import './Shop.css';

// Fallback images keyed by shortName (lowercase)
const FALLBACK_IMGS = {
  soybeans:     soybeansImg,
  groundnuts:   groundnutsImg,
  'common beans': beansImg,
};

function getImg(product) {
  if (product.imageUrl && product.imageUrl.startsWith('http')) return product.imageUrl;
  if (product.imageUrl && product.imageUrl.startsWith('/uploads')) return `${process.env.REACT_APP_API_URL || ''}${product.imageUrl}`;
  return FALLBACK_IMGS[product.shortName?.toLowerCase()] || soybeansImg;
}

function ProductCard({ product, onOrder }) {
  const [selectedSize, setSelectedSize] = useState(0);
  const [qty, setQty] = useState(1);
  const size = product.sizes[selectedSize];
  if (!size) return null;
  const finalPrice = size.discount > 0 ? Math.round(size.price * (1 - size.discount/100)) : size.price;

  return (
    <div className="shop-card">
      <div className="sc-img-wrap">
        <img src={getImg(product)} alt={product.name}/>
        {product.badge && <div className="sc-badge" style={{background:product.badgeColor||'#1e7d3e'}}>{product.badge}</div>}
        <div className="sc-cert">✓ Certified {product.certClass||'Class 1'}</div>
        {size.discount > 0 && <div className="sc-discount-badge">-{size.discount}% OFF</div>}
        {size.stock === 'out_of_stock' && <div className="sc-out-badge">Out of Stock</div>}
      </div>
      <div className="sc-body">
        <h3 className="sc-name">{product.name}</h3>
        {product.description && <p className="sc-desc">{product.description}</p>}
        {product.features?.length > 0 && (
          <div className="sc-features">
            {product.features.map(f => (
              <span key={f} className="sc-feat">
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                {f}
              </span>
            ))}
          </div>
        )}

        <div className="sc-section-label">Select Pack Size</div>
        <div className="sc-sizes">
          {product.sizes.map((s,i) => {
            const fp = s.discount>0 ? Math.round(s.price*(1-s.discount/100)) : s.price;
            return (
              <button key={i} className={`sc-size ${selectedSize===i?'active':''} ${s.stock==='out_of_stock'?'sc-size-out':''}`}
                onClick={()=>{ if(s.stock!=='out_of_stock') setSelectedSize(i); }}
                disabled={s.stock==='out_of_stock'}>
                <span className="ssz-label">{s.label}</span>
                <span className="ssz-price">
                  {s.discount>0
                    ? <><s style={{fontSize:10,color:'var(--gray-400)',marginRight:4}}>MK {s.price.toLocaleString()}</s>MK {fp.toLocaleString()}</>
                    : `MK ${fp.toLocaleString()}`
                  }
                </span>
                {s.stock==='limited' && <span className="ssz-limited">Limited</span>}
              </button>
            );
          })}
        </div>

        <div className="sc-section-label">Quantity</div>
        <div className="sc-qty-row">
          <div className="sc-qty">
            <button onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
            <span>{qty}</span>
            <button onClick={()=>setQty(q=>q+1)}>+</button>
          </div>
          <div className="sc-total">Total: <strong>MK {(finalPrice*qty).toLocaleString()}</strong></div>
        </div>
        <button className="btn btn-primary sc-order-btn"
          disabled={size.stock==='out_of_stock'}
          onClick={()=>onOrder({ ...product, selectedSize:{ label:size.label, price:finalPrice }, qty })}>
          {size.stock==='out_of_stock' ? 'Out of Stock' : '🛒 Place Order'}
        </button>
      </div>
    </div>
  );
}

function OrderModal({ item, onClose }) {
  const [form, setForm] = useState({ name:'', phone:'', email:'', district:'', delivery:'pickup', notes:'' });
  const [payment, setPayment] = useState('Airtel Money');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleChange = e => setForm({...form,[e.target.name]:e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          product: item.shortName, packSize: item.selectedSize.label,
          quantity: item.qty, totalPrice: item.selectedSize.price * item.qty,
          customerName: form.name, phone: form.phone, email: form.email,
          district: form.district, delivery: form.delivery, notes: form.notes
        })
      });
      if (!res.ok) throw new Error('Order failed');
      setSubmitted(true);
    } catch { alert('Order failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        {submitted ? (
          <div className="modal-success">
            <div className="ms-icon">🌱</div>
            <h3>Order Received!</h3>
            <p>Thank you, <strong>{form.name}</strong>!</p>
            <div className="ms-order-summary">
              <div><strong>{item.shortName}</strong> – {item.selectedSize.label}</div>
              <div>Qty: {item.qty} bag{item.qty>1?'s':''}</div>
              <div className="ms-total">Total: MK {(item.selectedSize.price*item.qty).toLocaleString()}</div>
            </div>
            <p className="ms-note">Our team will contact you within 24 hours to confirm and arrange payment.</p>
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
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required/>
                </div>
                <div className="mf-group">
                  <label>Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+265 XXX XXX XXX" required/>
                </div>
              </div>
              <div className="mf-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com"/>
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
                <label>Delivery</label>
                <div className="mf-radio-group">
                  {[['pickup','Pick Up – Area 49, Lilongwe'],['delivery','Request Delivery (extra cost)']].map(([v,l])=>(
                    <label key={v} className={`mf-radio ${form.delivery===v?'active':''}`}>
                      <input type="radio" name="delivery" value={v} checked={form.delivery===v} onChange={handleChange}/>{l}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mf-group">
                <label>Payment Method</label>
                <div className="mf-radio-group">
                  {['Airtel Money','TNM Mpamba','Bank Transfer'].map(m=>(
                    <label key={m} className={`mf-radio ${payment===m?'active':''}`}>
                      <input type="radio" name="payment" value={m} checked={payment===m} onChange={e=>setPayment(e.target.value)}/>{m}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mf-group">
                <label>Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any special requirements..." rows={3}/>
              </div>
              <div className="modal-notice">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                We'll contact you within 24 hours to confirm and share payment details.
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
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [orderItem,setOrderItem]= useState(null);
  const [filter,   setFilter]   = useState('all');

  useEffect(() => {
    fetch('/api/products')
      .then(r => { if(!r.ok) throw new Error('Failed to load'); return r.json(); })
      .then(data => { setProducts(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [products]);

  const filtered = filter==='all' ? products
    : products.filter(p => p.shortName.toLowerCase().includes(filter));

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container page-hero-content">
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Shop</span></div>
          <h1>🛒 Seed Shop</h1>
          <p>Order certified grain legume seed directly from CABES — quality guaranteed, Malawi Seed Act (2022) compliant.</p>
        </div>
      </section>

      <div className="shop-info-bar">
        <div className="container shop-info-grid">
          {[{icon:'✅',label:'Certified Class 1'},{icon:'📞',label:'24hr confirmation'},{icon:'📍',label:'Pickup: Area 49, Lilongwe'},{icon:'💳',label:'Mobile money accepted'}].map(i=>(
            <div key={i.label} className="sib-item"><span>{i.icon}</span>{i.label}</div>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="shop-header reveal">
            <div>
              <div className="section-badge">🌱 Available Now</div>
              <h2 className="section-title">Certified Seed Products</h2>
            </div>
            <div className="shop-filters">
              {[['all','All Seeds'],['soy','Soybeans'],['ground','Groundnuts'],['bean','Beans']].map(([v,l])=>(
                <button key={v} className={`sf-btn ${filter===v?'active':''}`} onClick={()=>setFilter(v)}>{l}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{textAlign:'center',padding:'60px 0'}}>
              <div className="spinner spinner-dark" style={{width:32,height:32,borderWidth:3,margin:'0 auto'}}/>
              <p style={{color:'var(--gray-400)',marginTop:14,fontSize:14}}>Loading products...</p>
            </div>
          ) : error ? (
            <div style={{textAlign:'center',padding:'60px 0',color:'var(--gray-400)'}}>
              <p>⚠️ Could not load products. Make sure the backend is running.</p>
            </div>
          ) : filtered.length===0 ? (
            <div style={{textAlign:'center',padding:'60px 0',color:'var(--gray-400)'}}>
              <p>No products found.</p>
            </div>
          ) : (
            <div className="shop-grid">
              {filtered.map((p,i)=>(
                <div key={p._id} className="reveal" style={{animationDelay:`${i*0.12}s`}}>
                  <ProductCard product={p} onOrder={setOrderItem}/>
                </div>
              ))}
            </div>
          )}
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
              {step:'01',icon:'🛒',title:'Select & Order',desc:'Choose your seed type, pack size, and quantity. Fill in your details.'},
              {step:'02',icon:'📞',title:'Confirmation',desc:'Our team contacts you within 24 hours to confirm and arrange payment.'},
              {step:'03',icon:'💳',title:'Make Payment',desc:'Pay via Airtel Money, TNM Mpamba, or bank transfer.'},
              {step:'04',icon:'🌾',title:'Receive Seed',desc:'Pick up at Area 49, Lilongwe or delivery to your district.'},
            ].map((s,i)=>(
              <div key={s.step} className="order-step reveal" style={{animationDelay:`${i*0.1}s`}}>
                <div className="os-num">{s.step}</div>
                <div className="os-icon">{s.icon}</div>
                <h4>{s.title}</h4><p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {orderItem && <OrderModal item={orderItem} onClose={()=>setOrderItem(null)}/>}
    </div>
  );
}
