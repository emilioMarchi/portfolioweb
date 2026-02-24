'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

const sections = [
  { id: 'hero', name: 'Inicio' },
  { id: 'productos', name: 'Productos' },
  { id: 'servicios', name: 'Servicios' },
  { id: 'proceso', name: 'Proceso' },
  { id: 'tecnica', name: 'Técnica' },
  { id: 'contacto', name: 'Contacto' },
]

export default function NavigationOverlay() {
  const [activeSection, setActiveSection] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Escuchar cambios del scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2
      
      for (let i = 0; i < sections.length; i++) {
        const section = document.getElementById(sections[i].id)
        if (section) {
          const top = section.offsetTop
          const bottom = top + section.offsetHeight
          
          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveSection(i)
            break
          }
        }
      }
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
      setActiveSection(index)
    }
  }

  return (
    <>
      {/* Barra de progreso lateral - solo desktop */}
      {!isMobile && (
        <motion.div
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
      )}

      {/* Dots de navegación - solo desktop */}
      {!isMobile && (
        <div style={{
          position: 'fixed',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
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
      )}

      {/* Mapa del sitio - solo desktop */}
      {!isMobile && (
        <div style={{
          position: 'fixed',
          left: '20px',
          top: '120px',
          display: 'flex',
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
      )}

      {/* Indicador de sección actual - siempre visible pero más sutil en mobile */}
      <div style={{
        position: 'fixed',
        bottom: isMobile ? '20px' : '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: isMobile ? '8px 16px' : '10px 20px',
        backgroundColor: 'rgba(15, 15, 26, 0.85)',
        borderRadius: '30px',
        border: '1px solid var(--color-border)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '8px' : '12px',
      }}>
        {!isMobile && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-light)" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        )}
        <span style={{
          fontSize: isMobile ? '11px' : '12px',
          color: 'var(--color-text)',
          fontWeight: 500,
        }}>
          {sections[activeSection].name}
        </span>
        {!isMobile && (
          <>
            <span style={{
              fontSize: '11px',
              color: 'var(--color-text-muted)',
            }}>
              {Math.round(scrollYProgress.get() * 100)}%
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-light)" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </>
        )}
      </div>
    </>
  )
}
