import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Products.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const EMPTY_SIZE  = { label:'', kg:'', price:'', discount:'', stock:'available' };
const EMPTY_PRODUCT = {
  name:'', shortName:'', description:'', category:'grain_legume',
  certClass:'Class 1', badge:'', badgeColor:'#1e7d3e',
  imageUrl:'', features:[''], sizes:[{ ...EMPTY_SIZE }], active:true, sortOrder:0
};

function SizeRow({ size, idx, onChange, onRemove }) {
  return (
    <div className="size-row">
      <div className="sr-inputs">
        <input className="form-input" placeholder="Label e.g. 10 kg bag" value={size.label}
          onChange={e=>onChange(idx,'label',e.target.value)}/>
        <input className="form-input" type="number" placeholder="kg" value={size.kg}
          onChange={e=>onChange(idx,'kg',e.target.value)} style={{width:80}}/>
        <div style={{display:'flex',alignItems:'center',gap:4}}>
          <span style={{fontSize:12,color:'var(--gray-500)',fontWeight:600}}>MK</span>
          <input className="form-input" type="number" placeholder="Price" value={size.price}
            onChange={e=>onChange(idx,'price',e.target.value)}/>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:4}}>
          <input className="form-input" type="number" min="0" max="100" placeholder="Disc%" value={size.discount}
            onChange={e=>onChange(idx,'discount',e.target.value)} style={{width:80}}/>
          <span style={{fontSize:11,color:'var(--gray-400)'}}>%</span>
        </div>
        <select className="form-select" value={size.stock} onChange={e=>onChange(idx,'stock',e.target.value)}>
          <option value="available">Available</option>
          <option value="limited">Limited</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
        <button type="button" className="icon-btn icon-btn-danger" onClick={()=>onRemove(idx)} title="Remove size">🗑️</button>
      </div>
    </div>
  );
}

function ProductModal({ product, onClose, onSave, uploading, onImageUpload }) {
  const [form, setForm] = useState(product || EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSizeChange = (idx, field, val) => {
    const sizes = [...form.sizes];
    sizes[idx] = { ...sizes[idx], [field]: val };
    set('sizes', sizes);
  };
  const addSize    = () => set('sizes', [...form.sizes, { ...EMPTY_SIZE }]);
  const removeSize = (idx) => set('sizes', form.sizes.filter((_,i)=>i!==idx));

  const handleFeatureChange = (idx, val) => {
    const f = [...form.features]; f[idx] = val; set('features', f);
  };
  const addFeature    = () => set('features', [...form.features, '']);
  const removeFeature = (idx) => set('features', form.features.filter((_,i)=>i!==idx));

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await onImageUpload(file);
    if (url) set('imageUrl', url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.shortName) return alert('Name and Short Name are required.');
    if (!form.sizes.length) return alert('Add at least one size.');
    setSaving(true);
    try {
      const cleaned = {
        ...form,
        sizes: form.sizes.map(s => ({ ...s, kg: Number(s.kg), price: Number(s.price), discount: Number(s.discount||0) })),
        features: form.features.filter(f => f.trim()),
        sortOrder: Number(form.sortOrder||0)
      };
      await onSave(cleaned);
      onClose();
    } catch (err) { alert('Save failed: ' + err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal modal-large">
        <div className="modal-header">
          <div>
            <h3>{product?._id ? 'Edit Product' : 'Add New Product'}</h3>
            <p className="modal-sub">All fields marked * are required</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form className="modal-form product-form" onSubmit={handleSubmit}>
          <div className="pf-grid">
            {/* Left column */}
            <div className="pf-col">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input className="form-input" value={form.name} onChange={e=>set('name',e.target.value)}
                  placeholder="e.g. Certified Soybeans – Class 1" required/>
              </div>
              <div className="pf-row-2">
                <div className="form-group">
                  <label className="form-label">Short Name *</label>
                  <input className="form-input" value={form.shortName} onChange={e=>set('shortName',e.target.value)}
                    placeholder="e.g. Soybeans" required/>
                </div>
                <div className="form-group">
                  <label className="form-label">Cert. Class</label>
                  <input className="form-input" value={form.certClass} onChange={e=>set('certClass',e.target.value)} placeholder="Class 1"/>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows={3} value={form.description}
                  onChange={e=>set('description',e.target.value)} placeholder="Product description for the shop page..."/>
              </div>
              <div className="pf-row-2">
                <div className="form-group">
                  <label className="form-label">Badge Text</label>
                  <input className="form-input" value={form.badge} onChange={e=>set('badge',e.target.value)} placeholder="e.g. Best Seller"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Badge Color</label>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <input type="color" value={form.badgeColor} onChange={e=>set('badgeColor',e.target.value)}
                      style={{width:40,height:38,padding:2,border:'1px solid var(--gray-200)',borderRadius:6,cursor:'pointer'}}/>
                    <input className="form-input" value={form.badgeColor} onChange={e=>set('badgeColor',e.target.value)}/>
                  </div>
                </div>
              </div>
              <div className="pf-row-2">
                <div className="form-group">
                  <label className="form-label">Sort Order</label>
                  <input className="form-input" type="number" value={form.sortOrder} onChange={e=>set('sortOrder',e.target.value)}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.active} onChange={e=>set('active',e.target.value==='true')}>
                    <option value="true">Active (visible)</option>
                    <option value="false">Inactive (hidden)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="pf-col">
              {/* Image */}
              <div className="form-group">
                <label className="form-label">Product Image</label>
                <div className="img-upload-area">
                  {form.imageUrl ? (
                    <div className="img-preview-wrap">
                      <img src={form.imageUrl} alt="product"/>
                      <button type="button" className="img-remove" onClick={()=>set('imageUrl','')}>✕</button>
                    </div>
                  ) : (
                    <label className="upload-zone" style={{cursor:'pointer'}}>
                      <input type="file" accept="image/*" ref={fileRef} onChange={handleImage} style={{display:'none'}}/>
                      {uploading ? <><span className="spinner spinner-dark"/> Uploading...</> : <><span>📁</span> Click to upload image<span className="upload-hint">Max 5MB</span></>}
                    </label>
                  )}
                  {form.imageUrl && (
                    <label style={{cursor:'pointer',fontSize:12,color:'var(--green-600)',marginTop:8,display:'block'}}>
                      <input type="file" accept="image/*" onChange={handleImage} style={{display:'none'}}/>
                      🔄 Change image
                    </label>
                  )}
                </div>
                <div className="form-group" style={{marginTop:10,marginBottom:0}}>
                  <label className="form-label" style={{fontSize:10}}>Or paste image URL</label>
                  <input className="form-input" value={form.imageUrl} onChange={e=>set('imageUrl',e.target.value)} placeholder="https://..."/>
                </div>
              </div>

              {/* Features */}
              <div className="form-group">
                <label className="form-label">Features / Highlights</label>
                <div className="features-list">
                  {form.features.map((f,i) => (
                    <div key={i} className="feature-row">
                      <input className="form-input" value={f} onChange={e=>handleFeatureChange(i,e.target.value)} placeholder={`Feature ${i+1}`}/>
                      <button type="button" className="icon-btn icon-btn-danger" onClick={()=>removeFeature(i)}>✕</button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-ghost" style={{fontSize:12,padding:'6px 12px'}} onClick={addFeature}>+ Add Feature</button>
                </div>
              </div>
            </div>
          </div>

          {/* Sizes — full width */}
          <div className="sizes-section">
            <div className="sizes-header">
              <label className="form-label" style={{margin:0}}>Pack Sizes & Prices *</label>
              <button type="button" className="btn btn-ghost" style={{fontSize:12,padding:'6px 12px'}} onClick={addSize}>+ Add Size</button>
            </div>
            <div className="sizes-labels">
              <span>Label</span><span>KG</span><span>Price (MK)</span><span>Discount %</span><span>Stock</span><span/>
            </div>
            {form.sizes.map((s,i) => (
              <SizeRow key={i} size={s} idx={i} onChange={handleSizeChange} onRemove={removeSize}/>
            ))}
            {form.sizes.length===0 && <p style={{fontSize:12,color:'var(--gray-400)',padding:'12px 0'}}>No sizes yet. Click "+ Add Size".</p>}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><span className="spinner"/>Saving...</> : product?._id ? '💾 Update Product' : '✅ Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Products() {
  const { apiFetch, getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null); // null | 'add' | product object
  const [uploading,setUploading]= useState(false);
  const [toggling, setToggling] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search,   setSearch]   = useState('');

  const load = () => {
    setLoading(true);
    apiFetch('/products/all')
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data.url;
    } catch (err) { alert('Upload failed: ' + err.message); return null; }
    finally { setUploading(false); }
  };

  const handleSave = async (form) => {
    if (form._id) {
      const updated = await apiFetch(`/products/${form._id}`, { method:'PUT', body:JSON.stringify(form) });
      setProducts(prev => prev.map(p => p._id===form._id ? updated : p));
    } else {
      const created = await apiFetch('/products', { method:'POST', body:JSON.stringify(form) });
      setProducts(prev => [...prev, created]);
    }
  };

  const handleToggle = async (id) => {
    setToggling(id);
    try {
      const updated = await apiFetch(`/products/${id}/toggle`, { method:'PATCH', body:'{}' });
      setProducts(prev => prev.map(p => p._id===id ? updated : p));
    } catch (err) { alert('Failed: ' + err.message); }
    finally { setToggling(null); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await apiFetch(`/products/${id}`, { method:'DELETE', body:'{}' });
      setProducts(prev => prev.filter(p => p._id!==id));
    } catch (err) { alert('Delete failed: ' + err.message); }
    finally { setDeleting(null); }
  };

  const filtered = search
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.shortName.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <div className="products-admin animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">🌱 Products</h1>
          <p className="page-sub">{products.length} products · {products.filter(p=>p.active).length} active</p>
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <input className="form-input" style={{width:220,fontSize:13}} placeholder="🔍 Search products..."
            value={search} onChange={e=>setSearch(e.target.value)}/>
          <button className="btn btn-primary" onClick={()=>setModal('add')}>+ Add Product</button>
        </div>
      </div>

      {loading ? (
        <div className="table-loading"><div className="spinner spinner-dark" style={{width:28,height:28,borderWidth:3}}/><p>Loading products...</p></div>
      ) : filtered.length===0 ? (
        <div className="card" style={{padding:60,textAlign:'center'}}>
          <div style={{fontSize:'3rem',marginBottom:12}}>🌱</div>
          <p style={{color:'var(--gray-400)',marginBottom:16}}>No products yet</p>
          <button className="btn btn-primary" onClick={()=>setModal('add')}>+ Add Your First Product</button>
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map(product => (
            <div key={product._id} className={`product-card card ${!product.active?'product-inactive':''}`}>
              <div className="pc-img">
                {product.imageUrl
                  ? <img src={product.imageUrl} alt={product.name}/>
                  : <div className="pc-img-placeholder">🌱</div>
                }
                {product.badge && (
                  <span className="pc-badge" style={{background:product.badgeColor||'#1e7d3e'}}>{product.badge}</span>
                )}
                {!product.active && <span className="pc-inactive-tag">Hidden</span>}
              </div>

              <div className="pc-body">
                <h3 className="pc-name">{product.name}</h3>
                <p className="pc-desc">{product.description?.slice(0,80)}{product.description?.length>80?'…':''}</p>

                <div className="pc-sizes">
                  {product.sizes.map((s,i)=>(
                    <div key={i} className="pcs-item">
                      <span className="pcs-label">{s.label}</span>
                      <span className="pcs-price">
                        {s.discount>0
                          ? <><s style={{fontSize:10,color:'var(--gray-400)'}}>MK {s.price.toLocaleString()}</s> MK {Math.round(s.price*(1-s.discount/100)).toLocaleString()}</>
                          : `MK ${s.price.toLocaleString()}`
                        }
                      </span>
                      <span className={`pcs-stock ${s.stock==='available'?'stock-ok':s.stock==='limited'?'stock-warn':'stock-out'}`}>
                        {s.stock==='available'?'✓':s.stock==='limited'?'~':'✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pc-actions">
                <button className="btn btn-ghost" style={{fontSize:12,flex:1}} onClick={()=>setModal(product)}>✏️ Edit</button>
                <button
                  className={`btn ${product.active?'btn-ghost':'btn-primary'}`}
                  style={{fontSize:12,flex:1}}
                  onClick={()=>handleToggle(product._id)}
                  disabled={toggling===product._id}
                >
                  {toggling===product._id ? <span className="spinner spinner-dark"/> : product.active ? '👁️ Hide' : '👁️ Show'}
                </button>
                <button
                  className="btn btn-danger"
                  style={{fontSize:12,padding:'9px 12px'}}
                  onClick={()=>handleDelete(product._id, product.name)}
                  disabled={deleting===product._id}
                >
                  {deleting===product._id ? <span className="spinner"/> : '🗑️'}
                </button>
              </div>
            </div>
          ))}

          {/* Add card */}
          <div className="product-card product-add-card" onClick={()=>setModal('add')}>
            <div className="pac-inner">
              <div className="pac-icon">+</div>
              <div className="pac-label">Add New Product</div>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <ProductModal
          product={modal==='add' ? null : modal}
          onClose={()=>setModal(null)}
          onSave={handleSave}
          uploading={uploading}
          onImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
}
