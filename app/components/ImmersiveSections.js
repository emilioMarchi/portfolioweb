'use client'

import { useState, useEffect, useRef } from 'react'
import Hero from './Hero'
import Productos from './Productos'
import Servicios from './Servicios'
import Proceso from './Proceso'
import Tecnica from './Tecnica'
import Contacto from './Contacto'

const sectionDirections = {
  hero: { enterFrom: 'fade', direction: 'center' },
  productos: { enterFrom: 'left', direction: 'right' },
  servicios: { enterFrom: 'right', direction: 'left' },
  proceso: { enterFrom: 'bottom', direction: 'up' },
  tecnica: { enterFrom: 'top', direction: 'down' },
  contacto: { enterFrom: 'fade', direction: 'center' },
}

export default function ImmersiveSections() {
  const [activeSection, setActiveSection] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef(null)
  const sectionsRef = useRef([])
  
  const sections = [
    { id: 'hero', component: <Hero /> },
    { id: 'productos', component: <Productos /> },
    { id: 'servicios', component: <Servicios /> },
    { id: 'proceso', component: <Proceso /> },
    { id: 'tecnica', component: <Tecnica /> },
    { id: 'contacto', component: <Contacto /> },
  ]

  const scrollToSection = (index, direction = 'down') => {
    if (isTransitioning || index === activeSection) return
    
    setIsTransitioning(true)
    setScrollDirection(direction)
    
    window.scrollTo({
      top: window.innerHeight * index,
      behavior: 'smooth'
    })
    
    setTimeout(() => {
      setIsTransitioning(false)
    }, 1000)
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const currentSection = Math.round(scrollTop / windowHeight)
      
      setActiveSection(currentSection)
      setScrollProgress(scrollTop / ((sections.length - 1) * windowHeight))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections.length])

  const [scrollDirection, setScrollDirection] = useState('down')
  
  useEffect(() => {
    let lastScrollY = window.scrollY
    
    const updateDirection = () => {
      const currentScrollY = window.scrollY
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up')
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', updateDirection, { passive: true })
    return () => window.removeEventListener('scroll', updateDirection)
  }, [])

  const renderNavigationDots = () => (
    <div style={styles.navDots}>
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(index)}
          style={{
            ...styles.dot,
            ...(activeSection === index ? styles.dotActive : {}),
            ...(isTransitioning ? styles.dotTransitioning : {})
          }}
          aria-label={`Ir a ${section.id}`}
        />
      ))}
    </div>
  )

  const renderProgressBar = () => (
    <div style={styles.progressContainer}>
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${scrollProgress * 100}%` }} />
      </div>
      <span style={styles.progressText}>{Math.round(scrollProgress * 100)}%</span>
    </div>
  )

  const renderScrollIndicator = () => (
    <div style={styles.scrollIndicator}>
      <div style={{ ...styles.arrowUp, opacity: scrollDirection === 'up' ? 1 : 0.3 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </div>
      <div style={{ ...styles.arrowDown, opacity: scrollDirection === 'down' ? 1 : 0.3 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>
    </div>
  )

  const renderSectionMap = () => (
    <div style={styles.sectionMap}>
      <span style={styles.sectionMapTitle}>MAPA</span>
      {sections.map((section, index) => (
        <div key={section.id} style={{ ...styles.mapItem, opacity: activeSection === index ? 1 : 0.4 }}>
          <span style={styles.mapIndex}>0{index + 1}</span>
          <span style={styles.mapName}>{section.id}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div ref={containerRef} style={styles.container}>
      {renderNavigationDots()}
      {renderProgressBar()}
      {renderScrollIndicator()}
      {renderSectionMap()}
      
      {sections.map((section, index) => {
        const isActive = activeSection === index
        
        return (
          <section
            key={section.id}
            ref={el => sectionsRef.current[index] = el}
            style={{
              ...styles.section,
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 10 : 1,
              pointerEvents: isActive ? 'auto' : 'none',
              transition: isTransitioning ? 'opacity 0.5s ease' : 'none',
            }}
            id={section.id}
          >
            {section.component}
          </section>
        )
      })}
      
      <div style={styles.particlesBg}>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            ...styles.particle,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }} />
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    scrollBehavior: 'smooth',
    overflowX: 'hidden',
  },
  section: {
    minHeight: '100vh',
    position: 'relative',
    transformStyle: 'preserve-3d',
    perspective: '1000px',
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
  },
  navDots: {
    position: 'fixed',
    right: '24px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    zIndex: 100,
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid var(--color-primary-light)',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    padding: 0,
  },
  dotActive: {
    backgroundColor: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
    boxShadow: '0 0 15px var(--color-primary)',
    transform: 'scale(1.3)',
  },
  dotTransitioning: { pointerEvents: 'none' },
  progressContainer: {
    position: 'fixed',
    left: '24px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    zIndex: 100,
  },
  progressBar: {
    width: '4px',
    height: '150px',
    backgroundColor: 'var(--color-border)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(180deg, var(--color-primary), var(--color-secondary))',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    fontFamily: 'monospace',
  },
  scrollIndicator: {
    position: 'fixed',
    left: '50%',
    bottom: '30px',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    zIndex: 100,
    opacity: 0.6,
  },
  arrowUp: { color: 'var(--color-primary-light)', transition: 'all 0.3s ease' },
  arrowDown: { color: 'var(--color-primary-light)', transition: 'all 0.3s ease' },
  sectionMap: {
    position: 'fixed',
    left: '24px',
    top: '100px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 100,
    padding: '16px',
    backgroundColor: 'rgba(15, 15, 26, 0.8)',
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
    backdropFilter: 'blur(10px)',
  },
  sectionMapTitle: {
    fontSize: '10px',
    color: 'var(--color-text-muted)',
    letterSpacing: '2px',
    marginBottom: '4px',
  },
  mapItem: { display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease' },
  mapIndex: { fontSize: '10px', color: 'var(--color-primary-light)', fontFamily: 'monospace', width: '20px' },
  mapName: { fontSize: '11px', color: 'var(--color-text)', textTransform: 'capitalize' },
  particlesBg: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary-light)',
    boxShadow: '0 0 10px var(--color-primary)',
    animation: 'particleFloat linear infinite',
    opacity: 0,
  },
}
