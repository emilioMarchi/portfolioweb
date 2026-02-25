'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useUI } from './UIContext'

const sections = [
  { id: 'hero', name: 'Inicio' },
  { id: 'productos', name: 'Productos' },
  { id: 'servicios', name: 'Servicios' },
  { id: 'proceso', name: 'Proceso' },
  { id: 'tecnica', name: 'Técnica' },
  { id: 'contacto', name: 'Contacto' },
]

export default function NavigationOverlay() {
  const { activeSection: activeSectionId, setActiveSection } = useUI()
  const activeSection = sections.findIndex(s => s.id === activeSectionId)
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      let currentSectionId = 'hero'
      
      // Encontrar la sección que más espacio ocupa en el viewport
      let maxVisibleHeight = 0
      
      sections.forEach((s) => {
        const el = document.getElementById(s.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
          
          if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight
            currentSectionId = s.id
          }
        }
      })
      
      setActiveSection(currentSectionId)
    }


    // Intervalo para detectar cambios
    const interval = setInterval(handleScroll, 100)
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
    }
  }, [])

  const scrollToSection = (index) => {
    const section = document.getElementById(sections[index].id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sections[index].id)
    }
  }

  return (

    <>
      {/* Barra de progreso lateral - solo desktop */}
      <motion.div
        className="desktop-only-block"
        style={{
          position: 'fixed',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '4px',
          height: '200px',
          backgroundColor: 'var(--color-border)',
          borderRadius: '2px',
          zIndex: 100,
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            scaleY,
            transformOrigin: 'top',
            background: 'linear-gradient(180deg, var(--color-primary), var(--color-secondary))',
            borderRadius: '2px',
            width: '100%',
            height: '100%',
          }}
        />
      </motion.div>

      {/* Dots de navegación - solo desktop */}
      <div 
        className="desktop-only"
        style={{
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 100,
      }}>
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(index)}
            style={{
              width: activeSection === index ? '14px' : '10px',
              height: activeSection === index ? '14px' : '10px',
              borderRadius: '50%',
              border: `2px solid ${activeSection === index ? 'var(--color-primary)' : 'var(--color-primary-light)'}`,
              backgroundColor: activeSection === index ? 'var(--color-primary)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
              boxShadow: activeSection === index ? '0 0 15px var(--color-primary)' : 'none',
            }}
            aria-label={`Ir a ${section.name}`}
          />
        ))}
      </div>

      {/* Mapa del sitio - solo desktop */}
      <div 
        className="desktop-only"
        style={{
        position: 'fixed',
        left: '20px',
        top: '120px',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 100,
        padding: '16px',
        backgroundColor: 'rgba(15, 15, 26, 0.85)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        backdropFilter: 'blur(10px)',
      }}>
        <span style={{
          fontSize: '10px',
          color: 'var(--color-text-muted)',
          letterSpacing: '2px',
          marginBottom: '4px',
        }}>
          MAPA
        </span>
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(index)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              opacity: activeSection === index ? 1 : 0.5,
              transform: activeSection === index ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.3s ease',
              padding: '4px',
              textAlign: 'left',
            }}
          >
            <span style={{
              fontSize: '10px',
              color: 'var(--color-primary-light)',
              fontFamily: 'monospace',
              width: '16px',
            }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span style={{
              fontSize: '11px',
              color: activeSection === index ? 'var(--color-text)' : 'var(--color-text-muted)',
              fontWeight: activeSection === index ? 600 : 400,
            }}>
              {section.name}
            </span>
          </button>
        ))}
      </div>

      {/* Indicador de sección actual - siempre visible pero más sutil en mobile */}
      <div className="section-indicator">
        <svg className="desktop-only-block" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-light)" strokeWidth="2" style={{ marginRight: '4px' }}>
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
        <span style={{
          color: 'var(--color-text)',
          fontWeight: 500,
        }}>
          {sections[activeSection].name}
        </span>
        <div className="desktop-only" style={{ alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
          <span style={{
            fontSize: '11px',
            color: 'var(--color-text-muted)',
          }}>
            {Math.round(scrollYProgress.get() * 100)}%
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-light)" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </>
  )
}
