import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Contacts.css';

export default function Contacts() {
  const { apiFetch } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 30 });
      if (filter !== 'all') params.set('status', filter);
      const data = await apiFetch(`/contact?${params}`);
      setContacts(data.contacts || []);
      setTotal(data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const updateStatus = async (id, status) => {
    try {
      const updated = await apiFetch(`/contact/${id}/status`, {
        method: 'PATCH', body: JSON.stringify({ status })
      });
      setContacts(prev => prev.map(c => c._id === id ? updated : c));
    } catch (err) { alert('Failed to update'); }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await apiFetch(`/contact/${id}`, { method: 'DELETE' });
      setContacts(prev => prev.filter(c => c._id !== id));
      setTotal(t => t - 1);
    } catch (err) { alert('Failed to delete'); }
  };

  const filtered = search ? contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.includes(search) || c.subject.toLowerCase().includes(search.toLowerCase())) : contacts;

  return (
    <div className="orders-page animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">✉️ Inquiries</h1>
          <p className="page-sub">{total} total messages</p>
        </div>
      </div>

      <div className="card orders-toolbar">
        <div className="filter-tabs">
          {['all','new','read','replied'].map(s => (
            <button key={s} className={`filter-tab ${filter===s?'active':''}`} onClick={() => setFilter(s)}>
              {s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>
        <input className="form-input search-input" placeholder="🔍  Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="contacts-list card">
        {loading ? (
          <div className="table-loading"><div className="spinner spinner-dark"/><p>Loading...</p></div>
        ) : filtered.length === 0 ? (
          <div className="table-empty"><div style={{fontSize:'2.5rem'}}>✉️</div><p>No inquiries found</p></div>
        ) : (
          filtered.map(c => (
            <div key={c._id} className={`contact-card ${expanded===c._id?'contact-expanded':''} ${c.status==='new'?'contact-new':''}`}>
              <div className="contact-header" onClick={() => { setExpanded(expanded===c._id?null:c._id); if(c.status==='new') updateStatus(c._id,'read'); }}>
                <div className="contact-avatar">{c.name[0]}</div>
                <div className="contact-meta">
                  <div className="contact-name">{c.name}{c.status==='new' && <span className="new-dot"/>}</div>
                  <div className="contact-subject">{c.subject}</div>
                  <div className="contact-info">{c.email} · {new Date(c.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="contact-actions" onClick={e=>e.stopPropagation()}>
                  <select className="status-select" value={c.status} onChange={e=>updateStatus(c._id,e.target.value)}>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                  <a href={`mailto:${c.email}?subject=Re: ${c.subject}`} className="btn btn-primary" style={{fontSize:'12px',padding:'6px 12px'}}>Reply ↗</a>
                  <button className="icon-btn icon-btn-danger" onClick={()=>deleteContact(c._id)}>🗑️</button>
                </div>
              </div>
              {expanded===c._id && (
                <div className="contact-message">
                  <div className="cm-label">Message</div>
                  <p>{c.message}</p>
                  {c.type && <div className="cm-type">Type: <strong>{c.type}</strong></div>}
                  <div className="cm-reply-hint">💡 Click <strong>Reply</strong> to open your email app with this message pre-filled.</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}