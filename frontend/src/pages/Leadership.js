import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ethelImg from '../assets/ethel.jpeg';
import field1Img from '../assets/field1.jpeg';
import ethelFieldImg from '../assets/ethel-field.jpeg';
import ethelField2Img from '../assets/ethel-field2.jpeg';
import '../App.css';
import './Leadership.css';

const awards = [
  { year: '2025', title: 'GIZ Women Entrepreneurship for Africa', icon: '🌍' },
  { year: '2025', title: 'AGRA Value for Her Award', icon: '👩‍💼' },
  { year: '2022', title: 'ICRISAT Research Partnership Recognition', icon: '🔬' },
];

const expertise = [
  { area: 'Climate-Smart Agriculture', level: 95, icon: '🌤️' },
  { area: 'Plant Breeding & Genetics', level: 90, icon: '🧬' },
  { area: 'Agribusiness Management', level: 92, icon: '📊' },
  { area: 'Rural Development', level: 88, icon: '🏘️' },
  { area: 'Seed Systems', level: 96, icon: '🌱' },
  { area: 'Gender & Youth Inclusion', level: 85, icon: '🤝' },
];

const timeline = [
  { year: '2018', event: 'Founded CABES Company', detail: 'Established as a certified seed supplier in Area 49, Lilongwe.' },
  { year: '2020', event: 'FAO Partnership', detail: 'Supported 32+ Farmer Field Schools under FAO in Mzimba South and Kasungu.' },
  { year: '2022', event: 'ICRISAT Collaboration', detail: 'Contributed to groundnut variety release through ICRISAT research trials.' },
  { year: '2023', event: 'CICOD Supply', detail: 'Supplied certified seed to CICOD in Mlonyeni EPA.' },
  { year: '2025', event: 'GIZ & AGRA Awards', detail: 'Dual awardee: GIZ Women Entrepreneurship for Africa & AGRA Value for Her.' },
];

export default function Leadership() {
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
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Leadership</span></div>
          <h1>Leadership</h1>
          <p>Visionary leadership rooted in science, experience, and deep commitment to inclusive agricultural development.</p>
        </div>
      </section>

      {/* ── LEADER PROFILE ── */}
      <section className="section leader-section">
        <div className="container leader-grid">
          {/* Photo card */}
          <div className="portrait-col reveal">
            <div className="portrait-card">
              <div className="portrait-photo-wrap">
                <img src={ethelImg} alt="Ms. Ethel Chilumpha" className="portrait-photo" />
                <div className="portrait-photo-ring"/>
                <div className="portrait-title-badge">
                  <span>🌱</span> Founder & Managing Director
                </div>
              </div>
              <div className="portrait-details">
                <h3 className="portrait-name">Ms. Ethel Chilumpha</h3>
                <div className="education-cards">
                  <div className="ed-card">
                    <div className="ed-degree">MSc</div>
                    <div className="ed-field">Agronomy</div>
                    <div className="ed-uni">UNIMA</div>
                  </div>
                  <div className="ed-card">
                    <div className="ed-degree">BSc</div>
                    <div className="ed-field">Agriculture</div>
                    <div className="ed-uni">UNIMA</div>
                  </div>
                </div>
              </div>
              <div className="portrait-badges">
                {[
                  { icon: '🎓', label: 'MSc Agronomy – UNIMA' },
                  { icon: '📅', label: '20+ Years Experience' },
                  { icon: '🔬', label: 'ICRISAT Researcher' },
                ].map(b => (
                  <div key={b.label} className="p-badge">
                    <span>{b.icon}</span>{b.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bio-col reveal" style={{animationDelay:'0.15s'}}>
            <div className="section-badge">👩‍🌾 About the Director</div>
            <h2 className="section-title" style={{fontSize:'2.2rem'}}>A Pioneer in<br/>Certified Seed Systems</h2>
            <p className="section-sub" style={{maxWidth:'100%'}}>
              Ms. Ethel Chilumpha is the founder and managing director of CABES Company. She holds an MSc in Agronomy and a BSc in Agriculture from the University of Malawi (UNIMA) and brings over 20 years of professional experience in climate-smart agriculture, plant breeding, agribusiness, and rural development.
            </p>
            <p style={{color:'var(--gray-500)',fontSize:'0.95rem',lineHeight:'1.78',marginTop:'16px'}}>
              Under her leadership, CABES has grown from a small-scale local seed supplier into a nationally recognized agribusiness with partnerships spanning FAO, GIZ, AGRA, and ICRISAT. Her technical depth in plant breeding has contributed directly to the release of groundnut varieties adopted by smallholder farmers across Malawi.
            </p>
            <p style={{color:'var(--gray-500)',fontSize:'0.95rem',lineHeight:'1.78',marginTop:'16px'}}>
              A champion of gender equity, she has integrated women and youth into CABES operations — advancing local economic resilience and demonstrating that inclusive agribusiness is both socially impactful and commercially viable.
            </p>
            <div className="bio-quote">
              <span className="bq-mark">"</span>
              <p>Quality certified seed is the foundation of every thriving farm. Our mission is to make that foundation accessible to every smallholder farmer in Malawi.</p>
              <div className="bq-author">— Ms. Ethel Chilumpha</div>
            </div>
            <div className="awards-panel reveal" style={{animationDelay:'0.2s'}}>
              {awards.map((award, i) => (
                <div key={award.title} className="award-stat-card">
                  <div className="asc-icon">{award.icon}</div>
                  <div className="asc-year">{award.year}</div>
                  <div className="asc-title">{award.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Field image banner */}
      <div className="leader-field-banner">
        <img src={field1Img} alt="CABES fields" />
        <div className="lfb-overlay">
          <div className="lfb-text">Leading from the Field to the Market</div>
        </div>
      </div>

      {/* Expertise */}
      <section className="section section-alt">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'56px'}} className="reveal">
            <div className="section-badge">🧠 Expertise</div>
            <h2 className="section-title">Areas of Expertise</h2>
          </div>
          <div className="expertise-grid">
            {expertise.map((e,i) => (
              <div key={e.area} className="expertise-item reveal" style={{animationDelay:`${i*0.08}s`}}>
                <div className="exp-header">
                  <span className="exp-icon">{e.icon}</span>
                  <span className="exp-label">{e.area}</span>
                  <span className="exp-pct">{e.level}%</span>
                </div>
                <div className="exp-bar"><div className="exp-fill" style={{width:`${e.level}%`}}/></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'56px'}} className="reveal">
            <div className="section-badge">📅 Journey</div>
            <h2 className="section-title">Leadership Timeline</h2>
          </div>
          <div className="timeline">
            {timeline.map((t,i) => (
              <div key={t.year} className={`timeline-item reveal ${i%2===0?'tl-left':'tl-right'}`} style={{animationDelay:`${i*0.1}s`}}>
                <div className="tl-year">{t.year}</div>
                <div className="tl-dot"/>
                <div className="tl-content"><h4>{t.event}</h4><p>{t.detail}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IN THE FIELD ── */}
      <section className="section leader-infield">
        <div className="container">
          <div className="infield-grid">
            <div className="infield-img-wrap reveal" style={{animationDelay:'0.1s'}}>
              <img src={ethelFieldImg} alt="Ms. Ethel Chilumpha in the field" />
              <div className="infield-overlay">
                <div className="infield-quote">
                  "Imparting technical skills to smallholder farmers — specifically women."
                </div>
              </div>
            </div>
            <div className="reveal infield-text" style={{animationDelay:'0.15s'}}>
              <div className="section-badge">🌾 Field Work</div>
              <h2 className="section-title">Leading From<br/>the Ground Up</h2>
              <p className="section-sub" style={{maxWidth:'100%', marginTop:'16px', marginBottom:'24px'}}>
                Ms. Ethel Chilumpha doesn't just manage from behind a desk — she's on the ground, working directly with smallholder farmers, particularly women, to transfer critical agricultural knowledge.
              </p>
              <p style={{color:'var(--gray-500)',fontSize:'0.95rem',lineHeight:'1.78',marginBottom:'24px'}}>
                Through the mother–baby demonstration model and Farmer Field Schools, she ensures that climate-smart techniques, seed handling practices, and good agricultural practices reach the farmers who need them most.
              </p>
              <div className="infield-stats">
                <div className="ifs-item">
                  <div className="ifs-num">32+</div>
                  <div className="ifs-lbl">Farmer Field Schools</div>
                </div>
                <div className="ifs-item">
                  <div className="ifs-num">👩‍🌾</div>
                  <div className="ifs-lbl">Women-focused training</div>
                </div>
                <div className="ifs-item">
                  <div className="ifs-num">FAO</div>
                  <div className="ifs-lbl">Supported Programs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── IN THE FIELD ── */}
      <section className="section leader-infield">
        <div className="container">
          <div className="infield-grid infield-grid--reverse">
            <div className="reveal infield-text" style={{animationDelay:'0.1s'}}>
              <div className="section-badge">🌱 Harvesting in Action</div>
              <h2 className="section-title">Translating Skills Into Harvest</h2>
              <p className="section-sub" style={{maxWidth:'100%', marginTop:'16px', marginBottom:'24px'}}>
                This CABES farm demonstrates the soybean seed harvesting process, where technical training turns into real action on the ground.
              </p>
              <p style={{color:'var(--gray-500)',fontSize:'0.95rem',lineHeight:'1.78',marginBottom:'24px'}}>
                Every harvest is supported by the same hands-on coaching and seed system practices that Ms. Ethel shares with farmers during field visits.
              </p>
              <div className="infield-stats">
                <div className="ifs-item">
                  <div className="ifs-num">Soybeans</div>
                  <div className="ifs-lbl">Seed Harvest Process</div>
                </div>
                <div className="ifs-item">
                  <div className="ifs-num">🌾</div>
                  <div className="ifs-lbl">Field-Based Training</div>
                </div>
                <div className="ifs-item">
                  <div className="ifs-num">Action</div>
                  <div className="ifs-lbl">From Seed to Storage</div>
                </div>
              </div>
            </div>
            <div className="infield-img-wrap reveal" style={{animationDelay:'0.15s'}}>
              <img src={ethelField2Img} alt="CABES farm during soybean seed harvesting" />
              <div className="infield-overlay">
                <div className="infield-quote">
                  "Translating the technical skills into action, this is CABES farm during soybeans seed harvesting process."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section section-alt">
        <div className="container philosophy-grid">
          {[
            { icon:'👩‍👦‍👦', title:'Gender & Youth Inclusion', desc:'Actively integrating women and youth into CABES operations to advance local economic resilience.' },
            { icon:'🌱', title:'Empowerment Through Seeds', desc:'Access to quality certified seed is the foundation of agricultural transformation for smallholder farmers.' },
            { icon:'🔬', title:'Science-Led Practice', desc:'Applying 20+ years of agronomy and plant breeding expertise to every decision in seed production.' },
          ].map((p,i) => (
            <div key={p.title} className="phil-card reveal" style={{animationDelay:`${i*0.1}s`}}>
              <div className="phil-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
