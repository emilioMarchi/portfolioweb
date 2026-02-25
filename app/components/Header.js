'use client'

import { useState, useEffect } from 'react'
import { useUI } from './UIContext'

export default function Header() {
  const { activeSection, openChat } = useUI()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)


  useEffect(() => {
    // Detectar si es mobile inmediatamente
    setIsMobile(window.innerWidth < 768)
    
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const closeMenu = (e, id) => {
    setMobileMenuOpen(false)
    if (id) {
      e.preventDefault()
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const headerStyle = {
    ...styles.header,
    backgroundColor: isMobile ? 'transparent' : (isScrolled ? 'rgba(15, 15, 26, 0.95)' : 'rgba(15, 15, 26, 0.8)'),
    borderBottom: isMobile ? 'none' : (isScrolled ? '1px solid rgba(20, 184, 166, 0.2)' : 'none'),
    boxShadow: isMobile ? 'none' : (isScrolled ? '0 4px 20px rgba(0,0,0,0.3)' : 'none'),
    pointerEvents: 'none', // Por defecto no bloquea clicks abajo
  }

  return (
    <header style={headerStyle}>
      <div style={{...styles.container, pointerEvents: 'auto'}}>
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
          <a href="#" style={{...styles.navButton, ...(activeSection === 'hero' ? styles.navButtonActive : {})}} onClick={(e) => closeMenu(e, 'hero')}>Inicio</a>
          <a href="#productos" style={{...styles.navButton, ...(activeSection === 'productos' ? styles.navButtonActive : {})}} onClick={(e) => closeMenu(e, 'productos')}>Productos</a>
          <a href="#servicios" style={{...styles.navButton, ...(activeSection === 'servicios' ? styles.navButtonActive : {})}} onClick={(e) => closeMenu(e, 'servicios')}>Servicios</a>
          <a href="#proceso" style={{...styles.navButton, ...(activeSection === 'proceso' ? styles.navButtonActive : {})}} onClick={(e) => closeMenu(e, 'proceso')}>Proceso</a>
          <a href="#tecnica" style={{...styles.navButton, ...(activeSection === 'tecnica' ? styles.navButtonActive : {})}} onClick={(e) => closeMenu(e, 'tecnica')}>Técnica</a>
          <a href="#contacto" style={{...styles.navButton, ...(activeSection === 'contacto' ? styles.navButtonActive : {})}} onClick={(e) => closeMenu(e, 'contacto')}>Contacto</a>
        </nav>
        
        {/* Mobile Menu Button (Floating) */}
        <button 
          style={{
            ...styles.mobileMenuBtn,
            ...(isMobile ? styles.mobileFAB : { display: 'none' })
          }} 
          className="mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" stroke="#fff"/>
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" stroke="#fff"/>
            )}
          </svg>
        </button>
        
        {/* Mobile Menu (Floating Column) */}
        {mobileMenuOpen && (
          <div style={styles.mobileMenuFloating} className="mobile-only-menu">
            <a href="#" style={{...styles.mobileNavLinkMinimal, ...(activeSection === 'hero' ? styles.mobileNavLinkMinimalActive : {})}} onClick={(e) => closeMenu(e, 'hero')}>Inicio</a>
            <a href="#productos" style={{...styles.mobileNavLinkMinimal, ...(activeSection === 'productos' ? styles.mobileNavLinkMinimalActive : {})}} onClick={(e) => closeMenu(e, 'productos')}>Productos</a>
            <a href="#servicios" style={{...styles.mobileNavLinkMinimal, ...(activeSection === 'servicios' ? styles.mobileNavLinkMinimalActive : {})}} onClick={(e) => closeMenu(e, 'servicios')}>Servicios</a>
            <a href="#proceso" style={{...styles.mobileNavLinkMinimal, ...(activeSection === 'proceso' ? styles.mobileNavLinkMinimalActive : {})}} onClick={(e) => closeMenu(e, 'proceso')}>Proceso</a>
            <a href="#tecnica" style={{...styles.mobileNavLinkMinimal, ...(activeSection === 'tecnica' ? styles.mobileNavLinkMinimalActive : {})}} onClick={(e) => closeMenu(e, 'tecnica')}>Técnica</a>
            <a href="#contacto" style={{...styles.mobileNavLinkMinimal, ...(activeSection === 'contacto' ? styles.mobileNavLinkMinimalActive : {})}} onClick={(e) => closeMenu(e, 'contacto')}>Contacto</a>
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
  navButtonActive: {
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    borderColor: 'rgba(20, 184, 166, 0.8)',
    color: '#5eead4',
    boxShadow: '0 0 15px rgba(20, 184, 166, 0.3)',
  },
  mobileMenuBtn: {

    display: 'flex',
    padding: '8px',
    background: 'none',
    border: 'none',
    color: 'var(--color-text)',
    cursor: 'pointer',
    zIndex: 200,
  },
  mobileFAB: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    background: 'var(--gradient-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(20, 184, 166, 0.4)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    zIndex: 200,
  },
  mobileMenuFloating: {
    position: 'fixed',
    bottom: '85px',
    right: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-end',
    zIndex: 190,
    animation: 'slideUpFade 0.3s ease-out forwards',
  },
  mobileNavLinkMinimal: {
    padding: '0.6rem 1.2rem',
    backgroundColor: 'rgba(15, 15, 26, 0.85)',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    borderRadius: '12px',
    color: '#e2e8f0',
    fontSize: '0.9rem',
    fontWeight: 500,
    textDecoration: 'none',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    minWidth: '120px',
  },
  mobileNavLinkMinimalActive: {
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    borderColor: '#5eead4',
    color: '#5eead4',
  },
}

