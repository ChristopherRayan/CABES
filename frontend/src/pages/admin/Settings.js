import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Settings.css';

export default function Settings() {
  const { admin, apiFetch, logout, setAdmin } = useAuth();
  const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);
  const [pwError, setPwError] = useState(null);

  const [name, setName] = useState(admin?.name || '');
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileError, setProfileError] = useState(null);

  const fileRef = useRef(null);

  const handlePwChange = e => setPwForm({...pwForm, [e.target.name]: e.target.value});

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwError(null); setPwMsg(null);
    if (pwForm.newPassword !== pwForm.confirmPassword) return setPwError('New passwords do not match.');
    if (pwForm.newPassword.length < 8) return setPwError('Password must be at least 8 characters.');
    setPwLoading(true);
    try {
      await apiFetch('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      });
      setPwMsg('Password changed successfully! Please log in again.');
      setPwForm({ currentPassword:'', newPassword:'', confirmPassword:'' });
      setTimeout(() => logout(), 2500);
    } catch (err) { setPwError(err.message); }
    finally { setPwLoading(false); }
  };

  const handleNameSave = async () => {
    setProfileMsg(null); setProfileError(null); setSaving(true);
    try {
      const data = await apiFetch('/auth/update-profile', {
        method: 'PUT',
        body: JSON.stringify({ name })
      });
      setAdmin(data.admin);
      setProfileMsg('Name updated successfully.');
    } catch (err) { setProfileError(err.message); }
    finally { setSaving(false); }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileMsg(null); setProfileError(null);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const token = localStorage.getItem('cabes_admin_token');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      const updateData = await apiFetch('/auth/update-profile', {
        method: 'PUT',
        body: JSON.stringify({ profilePicture: data.url })
      });
      setAdmin(updateData.admin);
      setProfileMsg('Profile picture updated successfully.');
    } catch (err) { setProfileError(err.message); }
  };

  const profilePic = admin?.profilePicture;

  return (
    <div className="settings-page animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">⚙️ Settings</h1>
          <p className="page-sub">Manage your admin account</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="card settings-card">
          <div className="sc-header">
            <h3>👤 Profile Picture</h3>
          </div>

          {profileMsg && (<div className="settings-success">{profileMsg}</div>)}
          {profileError && (<div className="settings-error">{profileError}</div>)}

          <div style={{display:'flex',alignItems:'center',gap:24,marginBottom:20}}>
            {profilePic ? (
              <img src={profilePic} alt="Profile" style={{width:80,height:80,borderRadius:'50%',objectFit:'cover',border:'3px solid var(--green-200)'}} />
            ) : (
              <div className="ap-avatar" style={{width:80,height:80,fontSize:28}}>{admin?.name?.[0]}</div>
            )}
            <button className="btn btn-outline" onClick={() => fileRef.current?.click()} style={{fontSize:13}}>📷 Upload Photo</button>
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleProfilePicUpload} />
          </div>
          <p style={{fontSize:12,color:'var(--gray-500)',marginTop:-8}}>Click to upload a new profile picture (max 5MB, JPG/PNG).</p>
        </div>

        <div className="card settings-card">
          <div className="sc-header">
            <h3>👤 Account Info</h3>
          </div>
          <div className="profile-fields">
            <div className="pf-row">
              <span className="pf-label">Full Name</span>
              <input className="pf-input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="pf-row">
              <span className="pf-label">Email</span>
              <span className="pf-value">{admin?.email}</span>
            </div>
            <div className="pf-row">
              <span className="pf-label">Role</span>
              <span className="pf-value" style={{textTransform:'capitalize'}}>{admin?.role}</span>
            </div>
            <button className="btn btn-primary" onClick={handleNameSave} disabled={saving} style={{marginTop:12}}>
              {saving ? <><span className="spinner"/> Saving...</> : '💾 Save Name'}
            </button>
          </div>
        </div>

        <div className="card settings-card">
          <div className="sc-header">
            <h3>🔒 Change Password</h3>
          </div>

          {pwMsg && (<div className="settings-success">{pwMsg}</div>)}
          {pwError && (<div className="settings-error">{pwError}</div>)}

          <form onSubmit={handlePwSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input className="form-input" type="password" name="currentPassword" value={pwForm.currentPassword} onChange={handlePwChange} required placeholder="Enter current password"/>
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" name="newPassword" value={pwForm.newPassword} onChange={handlePwChange} required placeholder="Min. 8 characters"/>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input className="form-input" type="password" name="confirmPassword" value={pwForm.confirmPassword} onChange={handlePwChange} required placeholder="Repeat new password"/>
            </div>
            <button type="submit" className="btn btn-primary" disabled={pwLoading}>
              {pwLoading ? <><span className="spinner"/>Updating...</> : '🔒 Update Password'}
            </button>
          </form>
        </div>

        <div className="card settings-card">
          <div className="sc-header">
            <h3>🌐 System Info</h3>
          </div>
          <div className="sys-info">
            {[
              { label:'Company', value:'CABES Company' },
              { label:'Registration', value:'MBRS1032430' },
              { label:'Location', value:'Area 49, Lilongwe, Malawi' },
              { label:'Email', value:'cabesmw@gmail.com' },
              { label:'Admin Version', value:'v2.0.0' },
              { label:'Backend API', value:'http://localhost:5000/api' },
              { label:'Frontend', value:'http://localhost:3000' },
            ].map(r => (
              <div key={r.label} className="pf-row">
                <span className="pf-label">{r.label}</span>
                <span className="pf-value">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card settings-card">
          <div className="sc-header">
            <h3>📖 Admin Quick Guide</h3>
          </div>
          <div className="guide-list">
            {[
              { icon:'📊', step:'Dashboard', desc:'See order stats, recent activity, and quick links at a glance.' },
              { icon:'📦', step:'Orders', desc:'View all customer seed orders. Change their status from Pending → Confirmed → Paid → Dispatched → Delivered.' },
              { icon:'✉️', step:'Inquiries', desc:'Read customer messages. Click Reply to open your email with pre-filled details.' },
              { icon:'✏️', step:'Edit Content', desc:'Update any text on the website — hero titles, about section, leadership bio, achievements, and contact info.' },
              { icon:'🌱', step:'Shop', desc:'Update seed prices by pack size. Changes show on the shop instantly.' },
            ].map(g => (
              <div key={g.step} className="guide-item">
                <div className="gi-icon">{g.icon}</div>
                <div>
                  <div className="gi-step">{g.step}</div>
                  <div className="gi-desc">{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
