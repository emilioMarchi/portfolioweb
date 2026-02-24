'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Hero from './Hero'
import Productos from './Productos'
import Servicios from './Servicios'
import Proceso from './Proceso'
import Tecnica from './Tecnica'
import Contacto from './Contacto'

// Direcciones de entrada para cada sección (simulando espacio 3D)
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

  // Scroll a una sección específica
  const scrollToSection = (index, direction = 'down') => {
    if (isTransitioning || index === activeSection) return
    
    setIsTransitioning(true)
    setScrollDirection(direction)
    
    // Scroll directo
    window.scrollTo({
      top: window.innerHeight * index,
      behavior: 'smooth'
    })
    
    setTimeout(() => {
      setIsTransitioning(false)
    }, 1000)
  }

  // Manejar scroll - detectar sección activa
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

  // Detectar dirección del scroll
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

  // Indicadores de navegación (dots)
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

  // Barra de progreso
  const renderProgressBar = () => (
    <div style={styles.progressContainer}>
      <div style={styles.progressBar}>
        <div 
          style={{
            ...styles.progressFill,
            width: `${scrollProgress * 100}%`
          }} 
        />
      </div>
      <span style={styles.progressText}>
        {Math.round(scrollProgress * 100)}%
      </span>
    </div>
  )

  // Indicador de dirección de scroll
  const renderScrollIndicator = () => (
    <div style={styles.scrollIndicator}>
      <div style={{
        ...styles.arrowUp,
        opacity: scrollDirection === 'up' ? 1 : 0.3,
        transform: 'translateY(5px)'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </div>
      <div style={{
        ...styles.arrowDown,
        opacity: scrollDirection === 'down' ? 1 : 0.3,
        transform: 'translateY(-5px)'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>
    </div>
  )

  // Mini mapa de secciones
  const renderSectionMap = () => (
    <div style={styles.sectionMap}>
      <span style={styles.sectionMapTitle}>MAPA</span>
      {sections.map((section, index) => (
        <div 
          key={section.id}
          style={{
            ...styles.mapItem,
            opacity: activeSection === index ? 1 : 0.4,
            transform: activeSection === index ? 'scale(1.2)' : 'scale(1)'
          }}
        >
          <span style={styles.mapIndex}>0{index + 1}</span>
          <span style={styles.mapName}>{section.id}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Navegación flotante */}
      {renderNavigationDots()}
      {renderProgressBar()}
      {renderScrollIndicator()}
      {renderSectionMap()}
      
      {/* Secciones con transiciones 3D */}
      {sections.map((section, index) => {
        const config = sectionDirections[section.id]
        const isActive = activeSection === index
        const isPrev = index < activeSection
        const isNext = index > activeSection
        
        // Calcular transform basada en estado
        let transform = 'translate3d(0, 0, 0)'
        let opacity = 0
        let scale = 0.8
        let rotate = 0
        
        if (isActive) {
          opacity = 1
          scale = 1
        } else if (isNext) {
          // Las secciones siguientes vienen de diferentes direcciones
          switch (config.enterFrom) {
            case 'left':
              transform = 'translate3d(100px, 50px, -100px)'
              break
            case 'right':
              transform = 'translate3d(-100px, 50px, -100px)'
              break
            case 'bottom':
              transform = 'translate3d(0, 100px, -100px)'
              break
            case 'top':
              transform = 'translate3d(0, -100px, -100px)'
              break
            default:
              transform = 'translate3d(0, 50px, -50px)'
          }
        } else if (isPrev) {
          // Las secciones previas se van hacia atrás
          switch (config.direction) {
            case 'right':
              transform = 'translate3d(-150px, -50px, -200px)'
              break
            case 'left':
              transform = 'translate3d(150px, -50px, -200px)'
              break
            case 'up':
              transform = 'translate3d(0, 150px, -200px)'
              break
            case 'down':
              transform = 'translate3d(0, -150px, -200px)'
              break
            default:
              transform = 'translate3d(0, -50px, -100px)'
          }
        }
        
        return (
          <section
            key={section.id}
            ref={el => sectionsRef.current[index] = el}
            style={{
              ...styles.section,
              transform,
              opacity,
              scale,
              rotate,
              zIndex: isActive ? 10 : (isNext ? 5 : 1),
              pointerEvents: isActive ? 'auto' : 'none',
              transition: isTransitioning 
                ? 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' 
                : 'none',
            }}
            id={section.id}
          >
            {section.component}
          </section>
        )
      })}
      
      {/* Efecto de partículas 3D en el fondo */}
      <div style={styles.particlesBg}>
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            style={{
              ...styles.particle,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes particleFloat {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }
      `}</style>
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
  // Navegación
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
  dotTransitioning: {
    pointerEvents: 'none',
  },
  // Progreso
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
  // Scroll indicator
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
    transition: 'opacity 0.3s',
  },
  arrowUp: {
    color: 'var(--color-primary-light)',
    transition: 'all 0.3s ease',
  },
  arrowDown: {
    color: 'var(--color-primary-light)',
    transition: 'all 0.3s ease',
  },
  // Section map
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
  mapItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
  },
  mapIndex: {
    fontSize: '10px',
    color: 'var(--color-primary-light)',
    fontFamily: 'monospace',
    width: '20px',
  },
  mapName: {
    fontSize: '11px',
    color: 'var(--color-text)',
    textTransform: 'capitalize',
  },
  // Partículas
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
