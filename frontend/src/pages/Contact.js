import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', type: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch('/api/content/contact')
      .then(r => r.json())
      .then(data => setContactInfo(data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1800);
  };

  return (
    <div className="page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container page-hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Contact</span>
          </div>
          <h1>Get in Touch</h1>
          <p>Whether you're a farmer, NGO, government body, or private sector partner — we'd love to hear from you.</p>
        </div>
      </section>

      {/* Contact grid */}
      <section className="section">
        <div className="container contact-layout">
          {/* Info */}
          <div className="contact-info reveal">
            <div className="section-badge">📞 Contact</div>
            <h2 className="section-title" style={{fontSize:'2rem'}}>Let's Connect</h2>
            <p className="section-sub" style={{maxWidth:'100%', marginBottom:'32px'}}>
              Reach out to CABES Company for seed orders, partnership inquiries, or general information about our certified seed production.
            </p>

            <div className="contact-cards">
              <div className="contact-card">
                <div className="cc-icon">📍</div>
                <div>
                  <div className="cc-label">Headquarters</div>
                  <div className="cc-value">{contactInfo.address || 'Area 49, Lilongwe, Malawi'}</div>
                </div>
              </div>
              <div className="contact-card">
                <div className="cc-icon">📧</div>
                <div>
                  <div className="cc-label">Email Address</div>
                  <div className="cc-value">
                    <a href={`mailto:${contactInfo.email || 'cabesmw@gmail.com'}`}>{contactInfo.email || 'cabesmw@gmail.com'}</a>
                  </div>
                </div>
              </div>
              <div className="contact-card">
                <div className="cc-icon">🌾</div>
                <div>
                  <div className="cc-label">Operations Area</div>
                  <div className="cc-value">Lilongwe–Kasungu Plains</div>
                </div>
              </div>
              <div className="contact-card">
                <div className="cc-icon">⏰</div>
                <div>
                  <div className="cc-label">Business Hours</div>
                  <div className="cc-value">{contactInfo.businessHours || 'Monday – Friday: 8:00 AM – 5:00 PM'}</div>
                </div>
              </div>
              <div className="contact-card">
                <div className="cc-icon">📋</div>
                <div>
                  <div className="cc-label">Registration Number</div>
                  <div className="cc-value">{contactInfo.registration || 'MBRS1032430'}</div>
                </div>
              </div>
            </div>

            {/* Inquiry types */}
            <div className="inquiry-types">
              <div className="it-title">We Can Help With</div>
              <div className="it-tags">
                {['Seed Orders', 'Partnership Inquiries', 'Technical Advice', 'Research Collaboration', 'NGO Programs', 'General Info'].map(t => (
                  <span key={t} className="it-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-wrap reveal" style={{animationDelay:'0.2s'}}>
            {submitted ? (
              <div className="success-state">
                <div className="success-icon">✅</div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out to CABES Company. We'll get back to you within 1–2 business days.</p>
                <button className="btn btn-primary" onClick={() => { setSubmitted(false); setForm({ name:'', email:'', subject:'', message:'', type:'' }); }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h3 className="form-title">Send Us a Message</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      className="form-input" type="text" name="name"
                      value={form.name} onChange={handleChange}
                      placeholder="Your full name" required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      className="form-input" type="email" name="email"
                      value={form.email} onChange={handleChange}
                      placeholder="your@email.com" required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Inquiry Type</label>
                  <select className="form-input" name="type" value={form.type} onChange={handleChange}>
                    <option value="">Select inquiry type...</option>
                    <option value="seed-order">Seed Order</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="research">Research Collaboration</option>
                    <option value="technical">Technical Advice</option>
                    <option value="general">General Information</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input
                    className="form-input" type="text" name="subject"
                    value={form.subject} onChange={handleChange}
                    placeholder="Subject of your inquiry" required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    className="form-input form-textarea" name="message"
                    value={form.message} onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    required rows={5}
                  />
                </div>

                <button type="submit" className="btn btn-primary form-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner"/>
                      Sending...
                    </>
                  ) : (
                    <>Send Message →</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section section-alt">
        <div className="container">
          <div style={{textAlign:'center', marginBottom:'40px'}} className="reveal">
            <div className="section-badge">📍 Location</div>
            <h2 className="section-title">Find Us in Lilongwe</h2>
          </div>
          <div className="map-container reveal">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.4329384269767!2d33.73845!3d-13.98333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sArea%2049%2C%20Lilongwe!2sLilongwe%2C%20Malawi!5e0!3m2!1sen!2s!4v1685901234567"
              width="100%" 
              height="400" 
              style={{border:0, borderRadius:'12px'}}
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="google-map-iframe"
            />
            <div className="map-info-overlay">
              <div className="map-info-badge">
                <span className="badge-pin">📍</span>
                <div>
                  <div className="badge-title">CABES Company Headquarters</div>
                  <div className="badge-location">Area 49, Lilongwe, Malawi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
