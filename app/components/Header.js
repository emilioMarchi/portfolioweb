'use client'

import { useState, useEffect } from 'react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <header style={{
      ...styles.header,
      opacity: isScrolled ? 0.95 : 0.9,
    }}>
      <div style={styles.container}>
        <a href="#" style={styles.logo} onClick={closeMenu}>
          <div style={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <ellipse cx="12" cy="14" rx="8" ry="3" fill="url(#ovniGrad2)" opacity="0.5"/>
              <ellipse cx="12" cy="13" rx="8" ry="3" fill="url(#ovniGrad2)"/>
              <ellipse cx="12" cy="12" rx="5" ry="2" fill="white" opacity="0.95"/>
              <circle cx="9" cy="11" r="0.5" fill="white"/>
              <circle cx="15" cy="11" r="0.5" fill="white"/>
              <defs>
                <linearGradient id="ovniGrad2" x1="4" y1="10" x2="20" y2="16">
                  <stop stopColor="#14b8a6"/>
                  <stop offset="1" stopColor="#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span style={styles.logoText}>OVNI</span>
        </a>
        
        {/* Desktop Nav */}
        <nav style={styles.nav} className="desktop-only">
          <a href="#productos" style={styles.navButton} onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(20, 184, 166, 0.2)'; e.target.style.borderColor = 'rgba(20, 184, 166, 0.7)'; e.target.style.color = '#5eead4'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(20, 184, 166, 0.08)'; e.target.style.borderColor = 'rgba(20, 184, 166, 0.4)'; e.target.style.color = '#94a3b8'; }}>Productos</a>
          <a href="#servicios" style={styles.navButton} onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(20, 184, 166, 0.2)'; e.target.style.borderColor = 'rgba(20, 184, 166, 0.7)'; e.target.style.color = '#5eead4'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(20, 184, 166, 0.08)'; e.target.style.borderColor = 'rgba(20, 184, 166, 0.4)'; e.target.style.color = '#94a3b8'; }}>Servicios</a>
          <a href="#proceso" style={styles.navButton} onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(20, 184, 166, 0.2)'; e.target.style.borderColor = 'rgba(20, 184, 166, 0.7)'; e.target.style.color = '#5eead4'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(20, 184, 166, 0.08)'; e.target.style.borderColor = 'rgba(20, 184, 166, 0.4)'; e.target.style.color = '#94a3b8'; }}>Proceso</a>
          <a href="#tecnica" style={styles.navButton} onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(20, 184, 166, 0.2)'; e.target.style.borderColor = 'rgba(20, 184, 166, 0.7)'; e.target.style.color = '#5eead4'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(20, 184, 166, 0.08)'; e.target.style.borderColor = 'rgba(20, 184, 166, 0.4)'; e.target.style.color = '#94a3b8'; }}>Técnica</a>
          <a href="#contacto" style={styles.ctaButton} onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(20, 184, 166, 0.3)'; e.target.style.boxShadow = '0 0 30px rgba(20, 184, 166, 0.5)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(20, 184, 166, 0.15)'; e.target.style.boxShadow = '0 0 20px rgba(20, 184, 166, 0.25)'; }}>
            Contacto
          </a>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          style={styles.mobileMenuBtn} 
          className="mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12"/>
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18"/>
            )}
          </svg>
        </button>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={styles.mobileMenu} className="mobile-only-menu">
            <a href="#productos" style={styles.mobileNavLink} onClick={closeMenu}>Productos</a>
            <a href="#servicios" style={styles.mobileNavLink} onClick={closeMenu}>Servicios</a>
            <a href="#proceso" style={styles.mobileNavLink} onClick={closeMenu}>Proceso</a>
            <a href="#tecnica" style={styles.mobileNavLink} onClick={closeMenu}>Técnica</a>
            <a href="#contacto" style={styles.mobileCtaButton} onClick={closeMenu}>Contacto</a>
          </div>
        )}
      </div>
    </header>
  )
}

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: '0.875rem 0',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(15, 15, 26, 0.95)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    flexWrap: 'wrap',
    width: '100%',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    letterSpacing: '2px',
    color: '#5eead4',
    textShadow: '0 0 25px rgba(20, 184, 166, 0.6)',
  },
  nav: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  navButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(20, 184, 166, 0.08)',
    border: '1px solid rgba(20, 184, 166, 0.4)',
    borderRadius: '20px',
    color: '#94a3b8',
    fontSize: '0.85rem',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.25s ease',
    backdropFilter: 'blur(8px)',
  },
  ctaButton: {
    padding: '0.5rem 1.25rem',
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    border: '1px solid rgba(20, 184, 166, 0.6)',
    borderRadius: '20px',
    color: '#5eead4',
    fontSize: '0.85rem',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'all 0.25s ease',
    boxShadow: '0 0 20px rgba(20, 184, 166, 0.25)',
  },
  mobileMenuBtn: {
    display: 'flex',
    padding: '8px',
    background: 'none',
    border: 'none',
    color: 'var(--color-text)',
    cursor: 'pointer',
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 15, 26, 0.98)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    borderTop: '1px solid rgba(20, 184, 166, 0.2)',
    animation: 'fadeIn 0.3s ease',
  },
  mobileNavLink: {
    padding: '0.75rem 1rem',
    color: '#94a3b8',
    fontSize: '1rem',
    textDecoration: 'none',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  mobileCtaButton: {
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    border: '1px solid rgba(20, 184, 166, 0.6)',
    borderRadius: '8px',
    color: '#5eead4',
    fontSize: '1rem',
    fontWeight: 600,
    textDecoration: 'none',
    textAlign: 'center',
    marginTop: '0.5rem',
  },
}
