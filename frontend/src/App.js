import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { usePageView } from './hooks/usePageView';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Leadership from './pages/Leadership';
import Achievements from './pages/Achievements';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import Login from './pages/admin/Login';
import Layout from './components/admin/Layout';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Contacts from './pages/admin/Contacts';
import ContentEditor from './pages/admin/ContentEditor';
import ProductsAdmin from './pages/admin/Products';
import Settings from './pages/admin/Settings';
import Analytics from './pages/admin/Analytics';
import './App.css';

function TrackedApp() {
  usePageView();
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/leadership" element={<Leadership/>} />
        <Route path="/achievements" element={<Achievements/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/shop" element={<Shop/>} />
      </Routes>
      <Footer/>
    </>
  );
}

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
      <div className="spinner spinner-dark" style={{ width:32, height:32, borderWidth:3 }}/>
      <p style={{ color:'var(--gray-500)', fontSize:14 }}>Loading...</p>
    </div>
  );
  return admin ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public website with analytics tracking */}
          <Route path="/*" element={<TrackedApp/>} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute>
              <Layout><Orders /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/contacts" element={
            <ProtectedRoute>
              <Layout><Contacts /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/content" element={
            <ProtectedRoute>
              <Layout><ContentEditor /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute>
              <Layout><ProductsAdmin /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <Layout><Settings /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute>
              <Layout><Analytics /></Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
