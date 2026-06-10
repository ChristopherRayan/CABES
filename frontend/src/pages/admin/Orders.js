import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Orders.css';

const STATUSES = ['all','pending','confirmed','paid','dispatched','delivered','cancelled'];
const statusColor = { pending:'badge-pending',confirmed:'badge-confirmed',paid:'badge-paid',dispatched:'badge-dispatched',delivered:'badge-delivered',cancelled:'badge-cancelled' };

export default function Orders() {
  const { apiFetch } = useAuth();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filter !== 'all') params.set('status', filter);
      const data = await apiFetch(`/orders?${params}`);
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filter, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const updated = await apiFetch(`/orders/${id}/status`, {
        method: 'PATCH', body: JSON.stringify({ status })
      });
      setOrders(prev => prev.map(o => o._id === id ? updated : o));
    } catch (err) { alert('Failed to update status'); }
    finally { setUpdating(null); }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await apiFetch(`/orders/${id}`, { method: 'DELETE' });
      setOrders(prev => prev.filter(o => o._id !== id));
      setTotal(t => t - 1);
    } catch (err) { alert('Failed to delete'); }
  };

  const filtered = search ? orders.filter(o => o.customerName.toLowerCase().includes(search.toLowerCase()) || o.phone.includes(search) || o.product.toLowerCase().includes(search.toLowerCase())) : orders;

  return (
    <div className="orders-page animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">📦 Orders</h1>
          <p className="page-sub">{total} total orders</p>
        </div>
      </div>

      <div className="card orders-toolbar">
        <div className="filter-tabs">
          {STATUSES.map(s => (
            <button key={s} className={`filter-tab ${filter===s?'active':''}`} onClick={() => { setFilter(s); setPage(1); }}>
              {s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>
        <input className="form-input search-input" placeholder="🔍  Search by name, phone, product..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card">
        {loading ? (
          <div className="table-loading"><div className="spinner spinner-dark"/><p>Loading orders...</p></div>
        ) : filtered.length === 0 ? (
          <div className="table-empty">
            <div style={{fontSize:'2.5rem'}}>📦</div>
            <p>No orders found</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Size × Qty</th>
                  <th>Total</th>
                  <th>District</th>
                  <th>Delivery</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <React.Fragment key={order._id}>
                    <tr className={`tr-clickable ${expanded===order._id?'tr-expanded':''}`} onClick={() => setExpanded(expanded===order._id?null:order._id)}>
                      <td>
                        <div className="td-name">{order.customerName}</div>
                        <div className="td-sub">{order.phone}</div>
                      </td>
                      <td><div className="td-product">{order.product}</div></td>
                      <td>{order.packSize} × {order.quantity}</td>
                      <td><strong>MK {order.totalPrice?.toLocaleString()}</strong></td>
                      <td>{order.district}</td>
                      <td><span className={`badge ${order.delivery==='delivery'?'badge-confirmed':'badge-read'}`}>{order.delivery}</span></td>
                      <td><div className="td-date">{new Date(order.createdAt).toLocaleDateString()}</div></td>
                      <td>
                        <select className="status-select" value={order.status} onChange={e => { e.stopPropagation(); updateStatus(order._id, e.target.value); }} disabled={updating===order._id} onClick={e=>e.stopPropagation()}>
                          {['pending','confirmed','paid','dispatched','delivered','cancelled'].map(s=>(<option key={s} value={s}>{s}</option>))}
                        </select>
                      </td>
                      <td onClick={e=>e.stopPropagation()}>
                        <button className="icon-btn icon-btn-danger" onClick={() => deleteOrder(order._id)} title="Delete">🗑️</button>
                      </td>
                    </tr>
                    {expanded === order._id && (
                      <tr className="tr-detail">
                        <td colSpan={9}>
                          <div className="order-detail">
                            {order.email && <div><span>Email:</span> {order.email}</div>}
                            {order.notes && <div><span>Notes:</span> {order.notes}</div>}
                            <div><span>Order ID:</span> <code>{order._id}</code></div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 15 && (
          <div className="pagination">
            <button className="btn btn-ghost" onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}>← Prev</button>
            <span className="page-info">Page {page} of {Math.ceil(total/15)}</span>
            <button className="btn btn-ghost" onClick={() => setPage(p=>p+1)} disabled={page>=Math.ceil(total/15)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}