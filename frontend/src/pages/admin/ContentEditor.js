import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ContentEditor.css';

const SECTIONS = [
  { key:'hero', label:'Hero Section' },
  { key:'about', label:'About Page' },
  { key:'leadership', label:'Leadership' },
  { key:'achievements', label:'Achievements' },
  { key:'contact', label:'Contact Info' },
];

function FieldEditor({ item, onSave }) {
  const [value, setValue] = useState(item.value || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(item.section, item.key, value, item.type, item.label);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) { alert('Save failed: ' + err.message); }
    finally { setSaving(false); }
  };

  const changed = value !== (item.value || '');

  return (
    <div className={`field-editor ${changed ? 'field-changed' : ''}`}>
      <div className="fe-label">{item.label || item.key}</div>
      {item.type === 'textarea' ? (
        <textarea className="form-textarea fe-input" value={value} onChange={e => setValue(e.target.value)} rows={4}/>
      ) : (
        <input className="form-input fe-input" type="text" value={value} onChange={e => setValue(e.target.value)} />
      )}
      <div className="fe-actions">
        {changed && <span className="fe-unsaved">● Unsaved</span>}
        <button className="btn btn-primary fe-save" onClick={handleSave} disabled={saving || !changed}>
          {saving ? <><span className="spinner"/>Saving...</> : saved ? '✅ Saved!' : '💾 Save'}
        </button>
      </div>
    </div>
  );
}

function ImageUploader({ section, fieldKey, label, currentUrl, onSave, getToken }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || '');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = getToken();
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPreview(data.url);
      await onSave(section, fieldKey, data.url, 'image');
    } catch (err) { alert('Upload failed: ' + err.message); }
    finally { setUploading(false); }
  };

  return (
    <div className="image-uploader">
      <div className="fe-label">{label}</div>
      {preview && (<div className="img-preview"><img src={preview} alt="preview" /></div>)}
      <label className="upload-zone">
        <input type="file" accept="image/*" onChange={handleFile} style={{display:'none'}} />
        {uploading ? (<><span className="spinner spinner-dark"/> Uploading...</>) : (<><span>📁</span> Click to upload</>)}
      </label>
    </div>
  );
}

export default function ContentEditor() {
  const { apiFetch, getToken } = useAuth();
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/content')
      .then(data => setContent(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [apiFetch]);

  const handleSave = async (section, key, value, type, label) => {
    await apiFetch(`/content/${section}/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value, type, label })
    });
    setContent(prev => ({
      ...prev,
      [section]: (prev[section] || []).map(item =>
        item.key === key ? { ...item, value, label } : item
      )
    }));
  };

  const sectionItems = content[activeSection] || [];
  const textFields = sectionItems.filter(i => i.type !== 'image');
  const imageFields = sectionItems.filter(i => i.type === 'image');

  if (loading) return (
    <div className="table-loading"><div className="spinner spinner-dark" style={{width:32,height:32,borderWidth:3}}/><p>Loading content...</p></div>
  );

  return (
    <div className="content-editor animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">✏️ Edit Website Content</h1>
          <p className="page-sub">Changes saved here update the live website immediately</p>
        </div>
        <div className="ce-hint card">
          <span>💡</span>
          <span>Save each field individually. Changes go live instantly.</span>
        </div>
      </div>

      <div className="ce-layout">
        <div className="ce-tabs">
          {SECTIONS.map(s => (
            <button key={s.key} className={`ce-tab ${activeSection===s.key?'active':''}`} onClick={() => setActiveSection(s.key)}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="ce-fields">
          <div className="card ce-section">
            <div className="ces-header">
              <h3>{SECTIONS.find(s=>s.key===activeSection)?.label}</h3>
              <span className="ces-count">{textFields.length} text fields</span>
            </div>

            {textFields.length === 0 && imageFields.length === 0 ? (
              <div className="ces-empty">
                <p>No editable fields in this section yet.</p>
                <p style={{fontSize:'0.78rem',color:'var(--gray-400)',marginTop:8}}>Run <code>npm run seed</code> on the backend to populate default content.</p>
              </div>
            ) : (
              <div className="ces-fields">
                {textFields.map(item => (
                  <FieldEditor key={`${item.section}-${item.key}`} item={item} onSave={handleSave} />
                ))}
                {imageFields.length > 0 && (
                  <>
                    <div className="ces-divider">Image Fields</div>
                    {imageFields.map(item => (
                      <ImageUploader key={`${item.section}-${item.key}`} section={item.section} fieldKey={item.key} label={item.label || item.key} currentUrl={item.value} onSave={handleSave} getToken={getToken} />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="card preview-hint">
            <div className="ph-icon">🌐</div>
            <div>
              <div className="ph-title">See your changes live</div>
              <p className="ph-desc">After saving, open the website to see your updates reflected immediately.</p>
              <a href="http://localhost:3000" target="_blank" rel="noreferrer" className="btn btn-ghost" style={{marginTop:10,fontSize:12}}>Open Website ↗</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}