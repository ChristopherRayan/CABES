import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import './Analytics.css';

const COLORS = ['#4ab86e','#2563eb','#f4b400','#7c3aed','#dc2626','#0891b2','#059669','#d97706'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="ct-label">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{color:p.color}} className="ct-val">
          {p.name === 'revenue'
            ? `Revenue: MK ${Number(p.value).toLocaleString()}`
            : `${p.name.charAt(0).toUpperCase()+p.name.slice(1)}: ${p.value}`
          }
        </p>
      ))}
    </div>
  );
};

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent*100).toFixed(0)}%`}
    </text>
  );
};

export default function Analytics() {
  const { apiFetch } = useAuth();
  const [data,    setData]    = useState(null);
  const [audit,   setAudit]   = useState([]);
  const [days,    setDays]    = useState(30);
  const [tab,     setTab]     = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiFetch(`/analytics?days=${days}`),
      apiFetch('/analytics/audit')
    ]).then(([analyticsData, auditData]) => {
      setData(analyticsData);
      setAudit(auditData);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) return (
    <div className="dash-loading">
      <div className="spinner spinner-dark" style={{width:32,height:32,borderWidth:3}}/>
      <p>Loading analytics...</p>
    </div>
  );

  const statusData = (data?.statusBreakdown || []).map(s => ({ name: s._id, value: s.count }));
  const productData = (data?.revenueByProduct || []).map(p => ({ name: p._id, revenue: p.revenue, orders: p.count }));
  const topPages = data?.topPages || [];

  const kpis = [
    { label:'Total Orders',   value: data?.total || 0,                          color:'var(--green-600)', icon:'📦' },
    { label:'Revenue (MK)',   value:(data?.revenue||0).toLocaleString(),         color:'var(--purple)',    icon:'💰' },
    { label:'Total Page Views',value:(data?.totalViews||0).toLocaleString(),     color:'#0891b2',          icon:'👁️' },
    { label:'Views Today',    value: data?.todayViews || 0,                      color:'#059669',          icon:'🌐' },
    { label:'Pending Orders', value: data?.pending || 0,                         color:'#d97706',          icon:'⏳' },
    { label:'New Inquiries',  value: data?.newContacts || 0,                     color:'var(--blue)',      icon:'✉️' },
  ];

  return (
    <div className="analytics-page animate-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">📊 Analytics</h1>
          <p className="page-sub">Business intelligence for CABES Company</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          {[7,14,30,90].map(d => (
            <button key={d} className={`btn ${days===d?'btn-primary':'btn-ghost'}`}
              style={{fontSize:12,padding:'7px 14px'}} onClick={()=>setDays(d)}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* KPI Strip */}
      <div className="an-kpi-grid">
        {kpis.map(k => (
          <div key={k.label} className="an-kpi card">
            <span className="an-kpi-icon">{k.icon}</span>
            <span className="an-kpi-val" style={{color:k.color}}>{k.value}</span>
            <span className="an-kpi-lbl">{k.label}</span>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="an-tabs">
        {[['overview','📈 Overview'],['traffic','👁️ Traffic'],['products','🌱 Products'],['audit','🔍 Audit Log']].map(([key,lbl])=>(
          <button key={key} className={`an-tab ${tab===key?'active':''}`} onClick={()=>setTab(key)}>{lbl}</button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === 'overview' && (
        <div className="an-section">
          {/* Orders + Views area chart */}
          <div className="card an-chart-full">
            <div className="an-chart-head">
              <h3>Orders & Page Views — Last {days} days</h3>
            </div>
            {(data?.ordersByDay?.length > 0 || data?.viewsByDay?.length > 0) ? (() => {
              const merged = {};
              (data.ordersByDay||[]).forEach(d => { merged[d._id] = { date:d._id, orders:d.count, revenue:d.revenue||0 }; });
              (data.viewsByDay||[]).forEach(d => { if(merged[d._id]) merged[d._id].views=d.views; else merged[d._id]={date:d._id,views:d.views,orders:0}; });
              const chart = Object.values(merged).sort((a,b)=>a.date.localeCompare(b.date));
              return (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chart} margin={{top:5,right:10,left:0,bottom:0}}>
                    <defs>
                      <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ab86e" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#4ab86e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                    <XAxis dataKey="date" tick={{fontSize:10}} tickFormatter={v=>v.slice(5)}/>
                    <YAxis yAxisId="left"  tick={{fontSize:10}} allowDecimals={false}/>
                    <YAxis yAxisId="right" orientation="right" tick={{fontSize:10}} allowDecimals={false}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend wrapperStyle={{fontSize:12}}/>
                    <Area yAxisId="right" type="monotone" dataKey="views"  stroke="#2563eb" fill="url(#gViews)"  strokeWidth={2} name="views"  dot={false}/>
                    <Area yAxisId="left"  type="monotone" dataKey="orders" stroke="#4ab86e" fill="url(#gOrders)" strokeWidth={2} name="orders" dot={{r:3,fill:'#4ab86e'}}/>
                  </AreaChart>
                </ResponsiveContainer>
              );
            })() : <p className="an-empty">No data for this period</p>}
          </div>

          {/* Revenue bar + status pie */}
          <div className="an-two-col">
            <div className="card an-chart-half">
              <div className="an-chart-head"><h3>Daily Revenue (MK)</h3></div>
              {data?.ordersByDay?.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.ordersByDay} margin={{top:5,right:10,left:0,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                    <XAxis dataKey="_id" tick={{fontSize:10}} tickFormatter={v=>v.slice(5)}/>
                    <YAxis tick={{fontSize:10}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                    <Tooltip formatter={(v)=>[`MK ${Number(v).toLocaleString()}`,'Revenue']}/>
                    <Bar dataKey="revenue" fill="#4ab86e" radius={[4,4,0,0]} name="Revenue"/>
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="an-empty">No revenue data yet</p>}
            </div>

            <div className="card an-chart-half">
              <div className="an-chart-head"><h3>Order Status Breakdown</h3></div>
              {statusData.length > 0 ? (
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <ResponsiveContainer width="55%" height={200}>
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" outerRadius={80}
                        dataKey="value" labelLine={false} label={<CustomPieLabel/>}>
                        {statusData.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pie-legend">
                    {statusData.map((s,i) => (
                      <div key={s.name} className="pie-leg-item">
                        <span className="pie-dot" style={{background:COLORS[i%COLORS.length]}}/>
                        <span className="pie-name">{s.name}</span>
                        <span className="pie-count">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : <p className="an-empty">No orders yet</p>}
            </div>
          </div>
        </div>
      )}

      {/* ── TRAFFIC TAB ── */}
      {tab === 'traffic' && (
        <div className="an-section">
          <div className="card an-chart-full">
            <div className="an-chart-head"><h3>Page Views Over Time</h3></div>
            {data?.viewsByDay?.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.viewsByDay} margin={{top:5,right:10,left:0,bottom:0}}>
                  <defs>
                    <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0891b2" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gU" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                  <XAxis dataKey="_id" tick={{fontSize:10}} tickFormatter={v=>v.slice(5)}/>
                  <YAxis tick={{fontSize:10}} allowDecimals={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend wrapperStyle={{fontSize:12}}/>
                  <Area type="monotone" dataKey="views"  stroke="#0891b2" fill="url(#gV)" strokeWidth={2} name="views"   dot={false}/>
                  <Area type="monotone" dataKey="unique" stroke="#059669" fill="url(#gU)" strokeWidth={2} name="unique"  dot={{r:3,fill:'#059669'}}/>
                </AreaChart>
              </ResponsiveContainer>
            ) : <p className="an-empty">No traffic data yet. Make sure the frontend is sending pageviews.</p>}
          </div>

          <div className="card an-chart-full">
            <div className="an-chart-head"><h3>Top Pages</h3></div>
            {topPages.length > 0 ? (
              <div className="top-pages">
                {topPages.map((p,i) => (
                  <div key={p._id} className="tp-row">
                    <span className="tp-rank">#{i+1}</span>
                    <span className="tp-page">{p._id || '/'}</span>
                    <div className="tp-bar-wrap">
                      <div className="tp-bar" style={{width:`${Math.round((p.views/topPages[0].views)*100)}%`}}/>
                    </div>
                    <span className="tp-views">{p.views} views</span>
                  </div>
                ))}
              </div>
            ) : <p className="an-empty">No page data yet</p>}
          </div>
        </div>
      )}

      {/* ── PRODUCTS TAB ── */}
      {tab === 'products' && (
        <div className="an-section">
          <div className="card an-chart-full">
            <div className="an-chart-head"><h3>Revenue by Product</h3></div>
            {productData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={productData} layout="vertical" margin={{top:0,right:20,left:80,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false}/>
                  <XAxis type="number" tick={{fontSize:10}} tickFormatter={v=>`MK ${(v/1000).toFixed(0)}k`}/>
                  <YAxis type="category" dataKey="name" tick={{fontSize:12}} width={80}/>
                  <Tooltip formatter={(v,name)=>name==='revenue'?[`MK ${Number(v).toLocaleString()}`,'Revenue']:[v,'Orders']}/>
                  <Legend wrapperStyle={{fontSize:12}}/>
                  <Bar dataKey="revenue" fill="#4ab86e" radius={[0,4,4,0]} name="revenue"/>
                  <Bar dataKey="orders"  fill="#2563eb" radius={[0,4,4,0]} name="orders"/>
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="an-empty">No order data yet</p>}
          </div>
        </div>
      )}

      {/* ── AUDIT LOG TAB ── */}
      {tab === 'audit' && (
        <div className="an-section">
          <div className="card">
            <div className="an-chart-head"><h3>Admin Activity Log</h3><span style={{fontSize:12,color:'var(--gray-400)'}}>{audit.length} recent actions</span></div>
            {audit.length === 0 ? (
              <p className="an-empty">No activity recorded yet</p>
            ) : (
              <div className="audit-list">
                {audit.map(log => (
                  <div key={log._id} className="audit-row">
                    <div className={`audit-action-badge action-${log.action?.toLowerCase()}`}>
                      {log.action}
                    </div>
                    <div className="audit-info">
                      <div className="audit-detail">{log.details}</div>
                      <div className="audit-meta">{log.adminName} · {log.resource} · {new Date(log.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="audit-resource">{log.resource}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
