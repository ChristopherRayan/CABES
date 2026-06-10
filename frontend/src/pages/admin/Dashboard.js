import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePolling } from '../../hooks/usePolling';
import './Dashboard.css';

const STATUS_COLOR = { pending:'badge-pending', confirmed:'badge-confirmed', paid:'badge-paid', dispatched:'badge-dispatched', delivered:'badge-delivered', cancelled:'badge-cancelled' };

export default function Dashboard() {
  const { apiFetch, admin } = useAuth();
  const [stats,    setStats]    = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const fetcher = useCallback(async () => {
    const [orderStats, analyticsData, contactData] = await Promise.all([
      apiFetch('/orders/stats'),
      apiFetch('/analytics?days=14'),
      apiFetch('/contact?limit=5'),
    ]);
    return {
      stats: orderStats,
      contacts: contactData.contacts || [],
      todayViews: analyticsData.todayViews || 0,
      todayVisitors: analyticsData.todayVisitors || 0,
      totalVisitors: analyticsData.totalVisitors || 0,
      totalViews: analyticsData.totalViews || 0,
    };
  }, [apiFetch]);

  const onData = useCallback((data) => {
    if (data) {
      setStats({ ...data.stats, todayViews: data.todayViews, todayVisitors: data.todayVisitors, totalVisitors: data.totalVisitors, totalViews: data.totalViews });
      setContacts(data.contacts);
    }
    setLoading(false);
  }, []);

  usePolling(fetcher, onData, 8000);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) return (
    <div className="dash-loading">
      <div className="spinner spinner-dark" style={{width:32,height:32,borderWidth:3}}/>
      <p>Loading dashboard...</p>
    </div>
  );

  const kpis = [
    { label:'Total Orders',   value: stats?.total || 0,              icon:'📦', color:'var(--green-600)', bg:'var(--green-50)',  link:'/admin/orders' },
    { label:'Pending Orders', value: stats?.pending || 0,            icon:'⏳', color:'#d97706',          bg:'#fffbeb',         link:'/admin/orders' },
    { label:'Delivered',      value: stats?.delivered || 0,          icon:'✅', color:'var(--blue)',       bg:'var(--blue-50)',  link:'/admin/orders' },
    { label:'Revenue (MK)',   value:(stats?.revenue||0).toLocaleString(), icon:'💰', color:'var(--purple)', bg:'#f5f3ff', link:'/admin/orders' },
    { label:'Page Views Today',value: stats?.todayViews || 0,        icon:'👁️', color:'#0891b2',          bg:'#ecfeff',        link:'/admin/analytics' },
    { label:'Visitors Today', value: stats?.todayVisitors || 0,      icon:'🌐', color:'#059669',          bg:'#ecfdf5',        link:'/admin/analytics' },
  ];

  return (
    <div className="dashboard animate-in">
      {/* Header */}
      <div className="dash-welcome">
        <div>
          <h1 className="dash-title">{greeting}, {admin?.name?.split(' ')[0]} 👋</h1>
          <p className="dash-sub">{new Date().toLocaleDateString('en-GB',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
        </div>
        <div className="dash-actions">
          <Link to="/admin/products" className="btn btn-primary" style={{fontSize:13}}>+ Add Product</Link>
          <Link to="/admin/analytics" className="btn btn-ghost" style={{fontSize:13}}>📊 Full Analytics</Link>
        </div>
      </div>

      {/* KPI grid */}
      <div className="kpi-grid">
        {kpis.map(k => (
          <Link key={k.label} to={k.link} className="kpi-card card">
            <div className="kpi-icon" style={{background:k.bg,color:k.color}}>{k.icon}</div>
            <div className="kpi-val" style={{color:k.color}}>{k.value}</div>
            <div className="kpi-lbl">{k.label}</div>
          </Link>
        ))}
      </div>

      {/* Tables */}
      <div className="dash-tables">
        <div className="card">
          <div className="dt-header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="dt-link">View all →</Link>
          </div>
          {!stats?.recentOrders?.length ? (
            <p className="dash-empty">No orders yet</p>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Customer</th><th>Product</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {stats.recentOrders.map(o => (
                  <tr key={o._id}>
                    <td><strong>{o.customerName}</strong><br/><span style={{fontSize:11,color:'#9ca3af'}}>{o.phone}</span></td>
                    <td>{o.product}<br/><span style={{fontSize:11,color:'#9ca3af'}}>{o.packSize} × {o.quantity}</span></td>
                    <td><strong style={{color:'var(--green-700)'}}>MK {o.totalPrice?.toLocaleString()}</strong></td>
                    <td><span className={`badge ${STATUS_COLOR[o.status]}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <div className="dt-header">
            <h3>Recent Inquiries</h3>
            <Link to="/admin/contacts" className="dt-link">View all →</Link>
          </div>
          {!contacts.length ? (
            <p className="dash-empty">No inquiries yet</p>
          ) : (
            <table className="dash-table">
              <thead><tr><th>From</th><th>Subject</th><th>Date</th></tr></thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c._id}>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:28,height:28,borderRadius:'50%',background:'var(--green-100)',color:'var(--green-700)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:12,flexShrink:0}}>{c.name[0]}</div>
                        <strong>{c.name}</strong>
                        {c.status==='new'&&<span style={{width:7,height:7,borderRadius:'50%',background:'var(--gold)',display:'inline-block'}}/>}
                      </div>
                    </td>
                    <td style={{fontSize:12,color:'var(--gray-600)'}}>{c.subject}</td>
                    <td style={{fontSize:11,color:'var(--gray-400)'}}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card">
        <h3 style={{fontSize:'0.9rem',fontWeight:700,marginBottom:16,color:'var(--gray-900)'}}>Quick Actions</h3>
        <div className="qa-grid">
          {[
            { icon:'➕', label:'Add New Product',    desc:'Create a new seed product',          link:'/admin/products' },
            { icon:'📦', label:'Manage Orders',      desc:'Update order statuses',              link:'/admin/orders' },
            { icon:'✏️', label:'Edit Website Text',  desc:'Update any page content',            link:'/admin/content' },
            { icon:'✉️', label:'View Inquiries',     desc:'Respond to customers',               link:'/admin/contacts' },
            { icon:'📊', label:'Full Analytics',     desc:'Detailed stats & graphs',            link:'/admin/analytics' },
            { icon:'⚙️', label:'Settings',           desc:'Account & system settings',          link:'/admin/settings' },
          ].map(a => (
            <Link key={a.label} to={a.link} className="qa-item">
              <span className="qa-icon">{a.icon}</span>
              <span className="qa-label">{a.label}</span>
              <span className="qa-desc">{a.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
