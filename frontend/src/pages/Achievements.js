import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ethelImg from '../assets/ethel.jpeg';
import '../App.css';
import './Achievements.css';

const achievements = [
  {
    icon: '🤝',
    category: 'Partnerships',
    title: 'CICOD Partnership',
    year: '2023',
    desc: 'Supplied certified seed to development partners such as CICOD in Mlonyeni EPA, contributing directly to improved food security for smallholder farmers.',
    color: '#1e7d3e',
  },
  {
    icon: '🌾',
    category: 'FAO Collaboration',
    title: '32+ Farmer Field Schools',
    year: '2020–2023',
    desc: 'Supported over 32 Farmer Field Schools under FAO to produce certified seed in Mzimba South and Kasungu districts — directly benefiting thousands of smallholder farmers.',
    color: '#2563eb',
  },
  {
    icon: '🔬',
    category: 'Research',
    title: 'ICRISAT Groundnut Research',
    year: 'Ongoing',
    desc: 'Contributed to the release of groundnut varieties through agricultural research conducted under ICRISAT, part of the team to screen trials and maintain genetic purity of early generation seed.',
    color: '#dc2626',
  },
  {
    icon: '📈',
    category: 'Growth',
    title: 'Consistent Business Growth',
    year: '2018–Present',
    desc: 'Demonstrated consistent growth in production capacity and financial stability since inception — growing from a small-scale local supplier to a recognized agribusiness with national partnerships.',
    color: '#059669',
  },
];

const partners = [
  { name: 'FAO', full: 'Food & Agriculture Organization', icon: '🌾' },
  { name: 'GIZ', full: 'German Development Cooperation', icon: '🇩🇪' },
  { name: 'AGRA', full: 'Alliance for a Green Revolution in Africa', icon: '🌍' },
  { name: 'ICRISAT', full: 'International Crops Research Institute', icon: '🔬' },
  { name: 'CICOD', full: 'Development Partner Organization', icon: '🤝' },
  { name: 'LUANAR', full: 'Lilongwe University of Agriculture', icon: '🎓' },
];

export default function Achievements() {
  const [content, setContent] = useState({});

  useEffect(() => {
    let cancelled = false;
    fetch('/api/content/achievements')
      .then(r => r.json())
      .then(data => { if (!cancelled) setContent(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

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
            <Link to="/">Home</Link> <span>/</span> <span>Achievements</span>
          </div>
          <h1>{content.achTitle || 'Key Achievements'}</h1>
          <p>{content.achSubtitle || 'A track record of partnerships, awards, and consistent growth since 2018.'}</p>
        </div>
      </section>

      {/* Stats highlight */}
      <section className="ach-stats-bar">
        <div className="container ach-stats-grid">
          {[
            { n: '32+', l: 'Farmer Field Schools' },
            { n: '2', l: 'International Awards (2025)' },
            { n: '6+', l: 'Major Partnerships' },
            { n: '7', l: 'Years of Growth' },
          ].map(s => (
            <div key={s.l} className="ach-stat reveal">
              <div className="ach-stat-n">{s.n}</div>
              <div className="ach-stat-l">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements grid */}
      <section className="section section-alt founder-highlight">
        <div className="container founder-grid">
          <div className="founder-photo reveal">
            <img src={content.founderSpotlight || ethelImg} alt="CABES Founder Ms. Ethel Chilumpha" />
          </div>
          <div className="founder-copy reveal">
            <div className="section-badge">👩‍🌾 Founder Spotlight</div>
            <h2 className="section-title">Meet the Founder</h2>
            <p className="section-sub" style={{marginBottom:'24px'}}>
              Ms. Ethel Chilumpha founded CABES Company with the vision that certified seed is the cornerstone of food security in Malawi. Her leadership blends scientific seed systems expertise with strong partnerships across FAO, GIZ, AGRA, and ICRISAT.
            </p>
            <p style={{color:'var(--gray-500)', fontSize:'0.95rem', lineHeight:'1.8'}}>
              Under her guidance, CABES has grown from a local supplier to a trusted seed producer with an award-winning track record. She continues to champion inclusive growth, supporting women and youth in agricultural value chains.
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'56px'}} className="reveal">
            <div className="section-badge">🏆 Milestones</div>
            <h2 className="section-title">Our Key Achievements</h2>
            <p className="section-sub" style={{margin:'0 auto'}}>From international awards to FAO partnerships, CABES has established itself as a reliable force in Malawian agribusiness.</p>
          </div>
          <div className="ach-grid">
            {achievements.map((a, i) => (
              <div key={a.title} className="ach-card reveal" style={{animationDelay:`${i*0.1}s`}}>
                <div className="ach-card-top" style={{background: a.color}}>
                  <div className="ach-icon">{a.icon}</div>
                  <div className="ach-cat">{a.category}</div>
                  <div className="ach-year">{a.year}</div>
                </div>
                <div className="ach-card-body">
                  <h3 className="ach-title">{a.title}</h3>
                  <p className="ach-desc">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section section-alt">
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'48px'}} className="reveal">
            <div className="section-badge">🌐 Partners</div>
            <h2 className="section-title">Our Partners & Collaborators</h2>
          </div>
          <div className="partners-grid">
            {partners.map((p, i) => (
              <div key={p.name} className="partner-card reveal" style={{animationDelay:`${i*0.08}s`}}>
                <div className="partner-icon">{p.icon}</div>
                <div className="partner-name">{p.name}</div>
                <div className="partner-full">{p.full}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Outlook */}
      <section className="section outlook-section">
        <div className="container">
          <div className="outlook-inner reveal">
            <div className="section-badge">🔭 Future Outlook</div>
            <h2 className="section-title" style={{color:'white'}}>Looking Ahead</h2>
            <p style={{color:'rgba(255,255,255,0.8)', fontSize:'1.05rem', lineHeight:'1.75', maxWidth:'640px'}}>
              CABES seeks to strengthen partnerships with UN agencies, government institutions, NGOs, and private sector stakeholders to scale up certified seed production and market access for smallholder farmers. The company aims to expand into regional markets while maintaining its commitment to quality, sustainability, and inclusive growth.
            </p>
            <div className="outlook-points">
              {[
                '🌍 Regional market expansion',
                '🤝 Stronger UN agency partnerships',
                '👩‍🌾 Scaling smallholder farmer reach',
                '🏭 Increased production capacity',
              ].map(p => (
                <div key={p} className="outlook-point">{p}</div>
              ))}
            </div>
            <Link to="/contact" className="btn btn-gold" style={{marginTop:'24px'}}>Partner With CABES →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
