import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" stroke="#4ab86e" strokeWidth="2"/>
                <rect x="12" y="26" width="6" height="12" fill="#4ab86e"/>
                <rect x="21" y="20" width="6" height="18" fill="#f4b400"/>
                <rect x="30" y="14" width="6" height="24" fill="#2563eb"/>
                <path d="M10 34 Q18 20 24 24 Q30 28 38 14" stroke="#4ab86e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              </svg>
              <div>
                <div className="footer-logo-name">CABES</div>
                <div className="footer-logo-sub">Company</div>
              </div>
            </div>
            <p className="footer-desc">
              Legally registered agribusiness specializing in certified seed production for grain legumes. Empowering smallholder farmers across Malawi since 2018.
            </p>
            <div className="footer-social">
              <a href="mailto:cabesmw@gmail.com" className="social-chip" title="Email">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Email Us
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <nav className="footer-nav">
              {[['/', 'Home'], ['/about', 'About Us'], ['/products', 'Products'], ['/leadership', 'Leadership'], ['/achievements', 'Achievements'], ['/contact', 'Contact']].map(([path, label]) => (
                <Link key={path} to={path} className="footer-link">{label}</Link>
              ))}
            </nav>
          </div>

          {/* Products */}
          <div className="footer-col">
            <h4 className="footer-heading">Our Products</h4>
            <div className="footer-products">
              {['Certified Soybeans', 'Certified Groundnuts', 'Common Beans', 'Certified Seed Class 1'].map(p => (
                <span key={p} className="footer-product-tag">{p}</span>
              ))}
            </div>
            <h4 className="footer-heading" style={{marginTop: '24px'}}>Compliance</h4>
            <p className="footer-small">Operating under the Malawi Seed Act (2022) & Business Registration Act (2012)</p>
            <p className="footer-small" style={{marginTop:8}}>Reg. No: <strong>MBRS1032430</strong></p>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contacts">
              <div className="footer-contact-item">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Area 49, Lilongwe, Malawi</span>
              </div>
              <div className="footer-contact-item">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>cabesmw@gmail.com</span>
              </div>
              <div className="footer-contact-item">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>Est. 2018</span>
              </div>
              <div className="footer-contact-item">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                <span>Mon–Fri: 8:00 AM – 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} CABES Company. All rights reserved.</p>
          <p className="footer-tagline">🌱 <em>Celebrate Success as it comes</em></p>
        </div>
      </div>
    </footer>
  );
}
