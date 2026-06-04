import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import beansImg from '../assets/beans.jpeg';
import groundnutsImg from '../assets/groundnuts.jpg';
import soybeansImg from '../assets/soybeans.jpeg';
import field1Img from '../assets/field1.jpeg';
import field2Img from '../assets/field2.jpeg';
import './Home.css';

const stats = [
  { number: '2018', label: 'Year Founded', icon: '📅' },
  { number: '32+', label: 'Farmer Field Schools', icon: '🌾' },
  { number: '3', label: 'Certified Crops', icon: '🌱' },
  { number: '20+', label: 'Years Leadership', icon: '👩‍🌾' },
];

const values = [
  { icon: '⚖️', title: 'Integrity', desc: 'Transparency and accountability in all operations.' },
  { icon: '🏅', title: 'Quality', desc: 'Certified seed meeting the highest national standards.' },
  { icon: '🤝', title: 'Inclusion', desc: 'Gender and youth participation in agribusiness.' },
  { icon: '♻️', title: 'Sustainability', desc: 'Climate-smart and environmentally sound practices.' },
  { icon: '💡', title: 'Innovation', desc: 'Modern technologies for resilient seed systems.' },
];

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page home-page">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"/>
          <div className="hero-orb hero-orb-2"/>
          <div className="hero-pattern"/>
        </div>

        <div className="container hero-content">
          {/* LEFT: Text */}
          <div className="hero-text">
            <div className="hero-badge fade-up" style={{animationDelay:'0.1s'}}>
              <span className="badge-dot"/>
              Malawi's Trusted Certified Seed Producer
            </div>
            <h1 className="hero-title fade-up" style={{animationDelay:'0.2s'}}>
              Growing Malawi's<br/>
              <span className="hero-highlight">Agricultural</span><br/>
              Future
            </h1>
            <p className="hero-sub fade-up" style={{animationDelay:'0.35s'}}>
              CABES Company produces certified seed for grain legumes — soybeans, groundnuts, and common beans — empowering smallholder farmers across Malawi with quality, purity, and reliability.
            </p>
            <div className="hero-actions fade-up" style={{animationDelay:'0.5s'}}>
              <Link to="/shop" className="btn btn-gold">🛒 Order Seeds Now</Link>
              <Link to="/about" className="btn btn-outline">Learn More</Link>
            </div>
            <div className="hero-compliance fade-up" style={{animationDelay:'0.65s'}}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              Malawi Seed Act (2022) Compliant &nbsp;·&nbsp; Reg. MBRS1032430
            </div>
          </div>

          {/* RIGHT: Honeycomb hexagon cluster */}
          <div className="hero-honeycomb fade-in" style={{animationDelay:'0.4s'}}>
            <div className="hc-wrap">
              <div className="hex hex-left-top">
                <div className="hex-inner">
                  <img src={soybeansImg} alt="Certified Soybeans" />
                  <div className="hex-label">Soybeans</div>
                </div>
              </div>
              <div className="hex hex-left-bottom">
                <div className="hex-inner">
                  <img src={groundnutsImg} alt="Certified Groundnuts" />
                  <div className="hex-label">Groundnuts</div>
                </div>
              </div>
              <div className="hex hex-right">
                <div className="hex-inner">
                  <img src={beansImg} alt="Certified Beans" />
                  <div className="hex-label">Common Beans</div>
                </div>
              </div>
              {/* Floating tags removed (awards shown elsewhere) */}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="hero-stats-bar">
          <div className="container hero-stats-grid">
            {stats.map((s, i) => (
              <div key={s.label} className="hero-stat fade-up" style={{animationDelay:`${0.6+i*0.1}s`}}>
                <span className="hero-stat-icon">{s.icon}</span>
                <span className="hero-stat-number">{s.number}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT SNIPPET ── */}
      <section className="section home-about">
        <div className="container home-about-grid">
          <div className="reveal">
            <div className="section-badge">🌿 Who We Are</div>
            <h2 className="section-title">Rooted in Quality,<br/>Driven by Purpose</h2>
            <p className="section-sub">
              Founded in 2018 and headquartered in Area 49, Lilongwe, CABES Company is a legally registered agribusiness operating under the Business Registration Act of 2012. We specialize in certified seed production for grain legumes across the Lilongwe–Kasungu plains.
            </p>
            <div className="about-pillars">
              <div className="pillar">
                <div className="pillar-icon">🎯</div>
                <div>
                  <strong>Our Vision</strong>
                  <p>To become a leading and trusted supplier of certified legume seed in Malawi.</p>
                </div>
              </div>
              <div className="pillar">
                <div className="pillar-icon">🚀</div>
                <div>
                  <strong>Our Mission</strong>
                  <p>Empowering smallholder farmers—particularly women and youth—with high-quality certified seed and climate-smart technologies.</p>
                </div>
              </div>
            </div>
            <Link to="/about" className="btn btn-primary">Full Company Profile →</Link>
          </div>

          {/* Field photo collage */}
          <div className="field-collage reveal">
            <div className="fc-main">
              <img src={field1Img} alt="CABES soybean field" />
              <div className="fc-overlay">
                <span>🌱 Lilongwe–Kasungu Plains</span>
              </div>
            </div>
            <div className="fc-secondary">
              <img src={field2Img} alt="CABES bean field" />
              <div className="fc-badge">
                <span>📍</span> Our Fields
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CROPS ── */}
      <section className="section section-alt home-crops">
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'56px'}} className="reveal">
            <div className="section-badge">🫘 Our Products</div>
            <h2 className="section-title">Certified Grain Legumes</h2>
            <p className="section-sub" style={{margin:'0 auto'}}>
              All seeds meet national certification standards under the Malawi Seed Act (2022).
            </p>
          </div>
          <div className="crops-grid">
            {[
              { img: soybeansImg, name: 'Soybeans', desc: 'High-protein certified soybean seed with superior germination and disease resistance.', cert: 'Class 1' },
              { img: groundnutsImg, name: 'Groundnuts', desc: 'ICRISAT research-backed groundnut varieties with assured genetic purity and high oil content.', cert: 'Class 1' },
              { img: beansImg, name: 'Common Beans', desc: 'Fast-maturing certified bean seed for food security and income generation across smallholder farms.', cert: 'Class 1' },
            ].map((c, i) => (
              <div key={c.name} className="crop-card reveal" style={{animationDelay:`${i*0.15}s`}}>
                <div className="crop-img-wrap">
                  <img src={c.img} alt={c.name} />
                  <div className="crop-cert-badge">✓ Certified {c.cert}</div>
                </div>
                <div className="crop-body">
                  <h3 className="crop-name">{c.name}</h3>
                  <p className="crop-desc">{c.desc}</p>
                  <Link to="/shop" className="btn btn-primary" style={{fontSize:'0.82rem', padding:'10px 20px'}}>Order Now →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="section home-values">
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'56px'}} className="reveal">
            <div className="section-badge">💚 Core Values</div>
            <h2 className="section-title">What Drives Us</h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={v.title} className="value-card reveal" style={{animationDelay:`${i*0.1}s`}}>
                <div className="value-icon">{v.icon}</div>
                <h4 className="value-title">{v.title}</h4>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STRATEGY ── */}
      <section className="section section-alt home-strategy">
        <div className="container strategy-grid">
          <div className="reveal">
            <div className="section-badge">🔬 Strategic Focus</div>
            <h2 className="section-title">Mother–Baby<br/>Demonstration Model</h2>
            <p className="section-sub">
              CABES mentors smallholder farmers through a proven model in collaboration with the Ministry of Agriculture and local extension services.
            </p>
            <div className="strategy-points">
              {[
                { icon: '🌿', label: 'Good Agricultural Practices (GAP)' },
                { icon: '🔬', label: 'Integrated Pest & Disease Management (IPDM)' },
                { icon: '🌤️', label: 'Climate-Smart Agriculture (CSA)' },
              ].map(p => (
                <div key={p.label} className="strategy-point"><span>{p.icon}</span> {p.label}</div>
              ))}
            </div>
          </div>
          <div className="strategy-visual reveal">
            <div className="sv-center">Mother Farm</div>
            {['Baby Farm 1','Baby Farm 2','Baby Farm 3','Baby Farm 4'].map((b,i)=>(
              <div key={b} className={`sv-satellite sv-sat-${i+1}`}>{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home-cta">
        <div className="container home-cta-inner">
          <div className="reveal">
            <h2 className="section-title" style={{color:'white'}}>Ready to Partner With Us?</h2>
            <p style={{color:'rgba(255,255,255,0.75)', fontSize:'1.1rem', marginBottom:'32px', maxWidth:'520px'}}>
              Whether you're a smallholder farmer, NGO, government institution, or private sector partner — we'd love to work with you.
            </p>
            <div style={{display:'flex', gap:'16px', flexWrap:'wrap'}}>
              <Link to="/shop" className="btn btn-gold">SHOP</Link>
              <Link to="/contact" className="btn btn-outline">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
