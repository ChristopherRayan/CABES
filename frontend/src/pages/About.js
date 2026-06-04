import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import field1Img from '../assets/field1.jpeg';
import field2Img from '../assets/field2.jpeg';
import '../App.css';
import './About.css';

export default function About() {
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
      {/* ── HERO with real field image ── */}
      <section className="about-hero">
        <img src={field1Img} alt="CABES fields" className="about-hero-bg" />
        <div className="about-hero-overlay"/>
        <div className="container about-hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span>/</span><span>About Us</span>
          </div>
          <h1>About CABES Company</h1>
          <p>A legally registered agribusiness transforming smallholder farming across Malawi through certified seed excellence.</p>
          <div className="about-hero-stats">
            {[['2018','Est.'],['32+','Field Schools'],['3','Certified Crops'],['20+','Yrs Leadership']].map(([n,l])=>(
              <div key={l} className="ahs-item">
                <div className="ahs-num">{n}</div>
                <div className="ahs-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="section">
        <div className="container about-overview-grid">
          <div className="reveal">
            <div className="section-badge">🌿 Overview</div>
            <h2 className="section-title">Grounded in Compliance,<br/>Driven by Impact</h2>
            <p className="section-sub">
              CABES Company is a legally registered agribusiness operating under the Business Registration Act of 2012. Founded in 2018, we specialize in the production and distribution of certified seed for grain legumes — soybeans, groundnuts, and common beans.
            </p>
            <p className="section-sub" style={{marginTop:16}}>
              Operating in accordance with the Malawi Seed Act (2022), all our seed meets national certification standards for quality, purity, and germination. Our seed production activities are based in the Lilongwe–Kasungu plains.
            </p>
          </div>
          <div className="about-info-card reveal">
            {[
              { label:'Registration', value:'MBRS1032430' },
              { label:'Year Established', value:'2018' },
              { label:'Headquarters', value:'Area 49, Lilongwe, Malawi' },
              { label:'Sector', value:'Agribusiness – Certified Seed' },
              { label:'Legal Framework', value:'Business Registration Act (2012)' },
              { label:'Seed Standard', value:'Malawi Seed Act (2022)' },
              { label:'Email', value:'cabesmw@gmail.com' },
            ].map(item=>(
              <div key={item.label} className="info-row">
                <span className="info-label">{item.label}</span>
                <span className="info-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section section-alt">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'56px'}} className="reveal">
            <div className="section-badge">🎯 Direction</div>
            <h2 className="section-title">Vision & Mission</h2>
          </div>
          <div className="vm-grid">
            <div className="vm-card vm-vision reveal">
              <div className="vm-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>To become a leading and trusted supplier of certified legume seed in Malawi, promoting inclusive agricultural growth and sustainable livelihoods.</p>
            </div>
            <div className="vm-card vm-mission reveal" style={{animationDelay:'0.15s'}}>
              <div className="vm-icon">🚀</div>
              <h3>Our Mission</h3>
              <p>To empower smallholder farmers — particularly women and youth — through access to high-quality certified seed, good agricultural practices, and climate-smart technologies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'56px'}} className="reveal">
            <div className="section-badge">💚 Values</div>
            <h2 className="section-title">Core Values</h2>
          </div>
          <div className="values-detail-grid">
            {[
              { icon:'⚖️', title:'Integrity', desc:'Upholding transparency and accountability in all our operations, relationships, and business dealings.' },
              { icon:'🏅', title:'Quality', desc:'Ensuring every seed we produce meets the highest national certification standards.' },
              { icon:'🤝', title:'Inclusion', desc:'Actively promoting gender equity and youth participation in all aspects of our agribusiness.' },
              { icon:'♻️', title:'Sustainability', desc:'Committing to environmentally sound and climate-smart practices that protect land for future generations.' },
              { icon:'💡', title:'Innovation', desc:'Applying modern technologies and research-backed methods for efficient, resilient seed systems.' },
            ].map((v,i)=>(
              <div key={v.title} className="value-detail-card reveal" style={{animationDelay:`${i*0.1}s`}}>
                <div className="vd-icon">{v.icon}</div>
                <div className="vd-content"><h4>{v.title}</h4><p>{v.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location with second field image */}
      <section className="section section-alt">
        <div className="container location-grid">
          <div className="reveal">
            <div className="section-badge">📍 Location & Operations</div>
            <h2 className="section-title">Where We Operate</h2>
            <p className="section-sub">
              Our seed production activities are based in the Lilongwe–Kasungu plains, a region known for its favorable agro-ecological conditions for grain legume production.
            </p>
            <div className="location-details">
              {[
                { icon:'🏢', label:'Headquarters:', val:'Area 49, Lilongwe, Malawi' },
                { icon:'🌾', label:'Production Region:', val:'Lilongwe–Kasungu Plains' },
                { icon:'📧', label:'Email:', val:'cabesmw@gmail.com' },
              ].map(l=>(
                <div key={l.label} className="loc-item">
                  <span className="loc-icon">{l.icon}</span>
                  <span><strong>{l.label}</strong> {l.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal">
            <div className="about-field-img">
              <img src={field2Img} alt="CABES bean fields" />
              <div className="afi-caption">Bean crop production — Lilongwe–Kasungu Plains</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{textAlign:'center'}}>
          <div className="reveal">
            <h2 className="section-title">Learn About Our Products</h2>
            <p className="section-sub" style={{margin:'0 auto 32px'}}>Explore our range of certified grain legume seeds.</p>
            <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
              <Link to="/shop" className="btn btn-gold">SHOP</Link>
              <Link to="/contact" className="btn btn-primary">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
