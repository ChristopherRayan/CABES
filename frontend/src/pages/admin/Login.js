import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { login, authReady } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || email.trim().length === 0) { setError('Email is required.'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return false; }
    if (!password || password.length === 0) { setError('Password is required.'); return false; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return false; }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

  if (!authReady) {
    return (
      <div className="login-page">
        <div className="login-left">
          <div className="ll-content">
            <div className="ll-logo">
              <div className="ll-logo-icon">
                <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="19" stroke="#4ab86e" strokeWidth="2"/>
                  <rect x="10" y="22" width="5" height="10" fill="#4ab86e"/>
                  <rect x="17" y="17" width="5" height="15" fill="#f4b400"/>
                  <rect x="24" y="12" width="5" height="20" fill="#2563eb"/>
                  <path d="M8 28 Q14 16 20 20 Q26 24 32 12" stroke="#4ab86e" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="ll-brand">CABES Admin</div>
                <div className="ll-sub">Content Management System</div>
              </div>
            </div>
            <h1 className="ll-title">Manage Your<br/>Agricultural<br/>Business</h1>
            <p className="ll-desc">Update website content, manage seed orders, respond to inquiries, and track your business — all in one place.</p>
            <div className="ll-features">
              {['📦 Manage seed orders & track status','✉️ Respond to customer inquiries','✏️ Edit website content live','📊 View business dashboard','🖼️ Upload product images'].map(f => (
                <div key={f} className="ll-feature">{f}</div>
              ))}
            </div>
          </div>
          <div className="ll-footer">© {new Date().getFullYear()} CABES Company · Area 49, Lilongwe, Malawi</div>
        </div>
        <div className="login-right">
          <div className="login-card animate-in">
            <div className="lc-header">
              <h2>Loading...</h2>
              <p>Checking authentication status</p>
            </div>
            <div className="spinner" style={{margin:'32px auto'}}/>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="ll-content">
          <div className="ll-logo">
            <div className="ll-logo-icon">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="19" stroke="#4ab86e" strokeWidth="2"/>
                <rect x="10" y="22" width="5" height="10" fill="#4ab86e"/>
                <rect x="17" y="17" width="5" height="15" fill="#f4b400"/>
                <rect x="24" y="12" width="5" height="20" fill="#2563eb"/>
                <path d="M8 28 Q14 16 20 20 Q26 24 32 12" stroke="#4ab86e" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="ll-brand">CABES Admin</div>
              <div className="ll-sub">Content Management System</div>
            </div>
          </div>
          <h1 className="ll-title">Manage Your<br/>Agricultural<br/>Business</h1>
          <p className="ll-desc">Update website content, manage seed orders, respond to inquiries, and track your business — all in one place.</p>
          <div className="ll-features">
            {['📦 Manage seed orders & track status','✉️ Respond to customer inquiries','✏️ Edit website content live','📊 View business dashboard','🖼️ Upload product images'].map(f => (
              <div key={f} className="ll-feature">{f}</div>
            ))}
          </div>
        </div>
        <div className="ll-footer">© {new Date().getFullYear()} CABES Company · Area 49, Lilongwe, Malawi</div>
      </div>

      <div className="login-right">
        <div className="login-card animate-in">
          <div className="lc-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your admin dashboard</p>
          </div>

          {error && (
            <div className="login-error">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrap">
                <svg className="input-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input className="form-input input-with-icon" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@cabes.mw" required autoFocus />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <svg className="input-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <input className="form-input input-with-icon input-with-right" type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                <button type="button" className="input-toggle" onClick={() => setShow(!show)}>{show ? '🙈' : '👁️'}</button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
              {loading ? <><span className="spinner"/> Signing in...</> : '→  Sign In to Dashboard'}
            </button>
          </form>

<div className="login-hint">
             <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             Secure admin access only — credentials managed by your deployment.
           </div>
        </div>
      </div>
    </div>
  );
}