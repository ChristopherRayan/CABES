import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const navItems = [
  { path: '/admin', icon: '📊', label: 'Dashboard' },
  { path: '/admin/orders', icon: '📦', label: 'Orders' },
  { path: '/admin/contacts', icon: '✉️', label: 'Inquiries' },
  { path: '/admin/content', icon: '✏️', label: 'Edit Content' },
  { path: '/admin/products', icon: '🌱', label: 'Shop' },
  { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
  { path: '/admin/analytics', icon: '📈', label: 'Analytics' },
];

function Avatar({ src, alt, className }) {
  if (src) {
    return <img src={src} alt={alt || 'Avatar'} className={className} />;
  }
  return <span className={className}>{(alt || 'A')[0].toUpperCase()}</span>;
}

export default function Layout({ children }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const profilePic = admin?.profilePicture || null;

  return (
    <div className={`admin-layout ${collapsed ? 'collapsed' : ''}`}>
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sb-logo">
            <div className="sb-logo-icon">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#4ab86e" strokeWidth="2"/>
                <rect x="10" y="22" width="4" height="9" fill="#4ab86e"/>
                <rect x="16" y="17" width="4" height="14" fill="#f4b400"/>
                <rect x="22" y="12" width="4" height="19" fill="#2563eb"/>
                <path d="M8 28 Q14 18 20 21 Q26 24 32 13" stroke="#4ab86e" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            {!collapsed && (
              <div className="sb-brand">
                <span className="sb-name">CABES</span>
                <span className="sb-sub">Admin Panel</span>
              </div>
            )}
          </div>
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points={collapsed ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ path, icon, label }) => (
            <NavLink key={path} to={path} end={path === '/admin'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
              <span className="nav-icon">{icon}</span>
              {!collapsed && <span className="nav-label">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!collapsed && (
            <div className="admin-info">
              <Avatar src={profilePic} alt={admin?.name} className="admin-avatar" />
              <div className="admin-details">
                <div className="admin-name">{admin?.name}</div>
                <div className="admin-role">{admin?.role}</div>
              </div>
            </div>
          )}
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <span>🚪</span>
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)}/>}

      <div className="main-area">
        <header className="top-header">
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
          <div className="header-breadcrumb"><span className="hb-site">CABES Admin</span></div>
          <div className="header-right">
            <a href="/" target="_blank" rel="noreferrer" className="view-site-btn">🌐 View Website</a>
            <Avatar src={profilePic} alt={admin?.name} className="header-avatar" />
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
