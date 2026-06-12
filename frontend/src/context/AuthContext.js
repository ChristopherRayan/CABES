import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AuthContext = createContext(null);
const API = process.env.REACT_APP_API_URL || '/api';

// Helper to build full endpoint URL
const buildEndpoint = (endpoint) => {
  // If API already points to backend root, append /api
  if (API.startsWith('http')) return `${API}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  // For relative /api, return as-is
  return endpoint.startsWith('/api') ? endpoint : `/api/${endpoint}`;
};

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const tokenRef = useRef(null);

  const syncToken = () => { tokenRef.current = localStorage.getItem('cabes_admin_token'); };
  const getToken = () => localStorage.getItem('cabes_admin_token');

  useEffect(() => {
    const t = localStorage.getItem('cabes_admin_token');
    tokenRef.current = t;
    let cancelled = false;
    if (t) {
      fetch(`${buildEndpoint('/auth/me')}`, { headers: { Authorization: `Bearer ${t}` } })
        .then(r => r.json())
        .then(data => {
          if (!cancelled) {
            if (data.admin) setAdmin(data.admin);
            else { localStorage.removeItem('cabes_admin_token'); tokenRef.current = null; }
          }
        })
        .catch(() => { if (!cancelled) { localStorage.removeItem('cabes_admin_token'); tokenRef.current = null; } })
        .finally(() => { if (!cancelled) { setLoading(false); setAuthReady(true); } });
    } else { setLoading(false); setAuthReady(true); }
    return () => { cancelled = true; };
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${buildEndpoint('/auth/login')}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('cabes_admin_token', data.token);
    tokenRef.current = data.token;
    setAdmin(data.admin);
    setAuthReady(true);
    setLoading(false);
    return data;
  };

  const logout = () => { localStorage.removeItem('cabes_admin_token'); tokenRef.current = null; setAdmin(null); };

  const apiFetch = useCallback(async (path, options = {}) => {
    const token = getToken();
    const res = await fetch(`${buildEndpoint(path)}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }, []);

  return (
    <AuthContext.Provider value={{ admin, setAdmin, login, logout, loading, authReady, apiFetch, getToken, syncToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
