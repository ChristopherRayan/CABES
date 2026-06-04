import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import './Navbar.css';

const navLinks = [
  { path: '/about', label: 'About' },
  { path: '/products', label: 'Products' },
  { path: '/leadership', label: 'Leadership' },
  { path: '/achievements', label: 'Achievements' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <img src={logoImg} alt="CABES Logo" className="logo-img" />
          <div className="logo-text">
            <span className="logo-name">CABES</span>
            <span className="logo-tagline">Certified Seed Production</span>
          </div>
        </Link>

        <div className="navbar-links">
          {navLinks.map(({ path, label }) => (
            <Link key={path} to={path} className={`nav-link ${pathname === path ? 'active' : ''}`}>{label}</Link>
          ))}
          <Link to="/shop" className="btn btn-gold nav-shop-btn">SHOP</Link>
        </div>

        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span/><span/><span/>
        </button>
      </div>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(({ path, label }) => (
          <Link key={path} to={path} className={`mobile-link ${pathname === path ? 'active' : ''}`}>{label}</Link>
        ))}
        <Link to="/shop" className="mobile-link mobile-shop-link">SHOP</Link>
      </div>
    </nav>
  );
}
