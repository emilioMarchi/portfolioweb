'use client'

import { useState, useEffect } from 'react'

const pasos = [
  {
    numero: 1,
    titulo: 'Consulta Inicial',
    descripcion: 'Hablamos sobre tu proyecto, necesidades y objetivos.',
    icono: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    )
  },
  {
    numero: 2,
    titulo: 'Propuesta',
    descripcion: 'Te presento una propuesta personalizada con alcance y tiempos.',
    icono: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
      </svg>
    )
  },
  {
    numero: 3,
    titulo: 'Desarrollo',
    descripcion: 'Construyo tu sitio web con revisiones periódicas.',
    icono: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
      </svg>
    )
  },
  {
    numero: 4,
    titulo: 'Entrega',
    descripcion: 'Tu sitio listo para usar con soporte post-entrega.',
    icono: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <path d="M22 4L12 14.01l-3-3"/>
      </svg>
    )
  },
]

export default function Proceso() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section id="proceso" style={styles.section}>
      <div style={styles.backgroundGlow} />
      
      <div style={{...styles.container, ...(isMobile ? styles.containerMobile : {})}}>
        <div style={{...styles.header, marginBottom: isMobile ? '2rem' : '4rem'}}>
          <span style={styles.badge}>PROCESO</span>
          <h2 style={styles.title}>
            ¿Cómo <span style={styles.titleGradient}>trabajamos</span> juntos?
          </h2>
          <p style={styles.subtitle}>
            Un proceso claro y transparente para construir tu proyecto digital.
          </p>
        </div>
        
        <div style={{
          ...styles.stepsContainer,
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '1rem' : '1.5rem',
        }}>
          {!isMobile && <div style={styles.connectorLine} />}
          
          {pasos.map((paso) => (
            <div key={paso.numero} style={styles.step}>
              <div style={styles.stepCard}>
                <div style={styles.stepIcon}>
                  {paso.icono}
                </div>
                <div style={styles.stepNumber}>{paso.numero}</div>
                <h3 style={styles.stepTitle}>{paso.titulo}</h3>
                <p style={styles.stepDesc}>{paso.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    overflow: 'hidden',
  },
  backgroundGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    height: '60%',
    background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  container: {
    position: 'relative',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    zIndex: 1,
  },
  containerMobile: {
    padding: '0 1rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 14px',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '50px',
    fontSize: '12px',
    color: 'var(--color-primary-light)',
    letterSpacing: '1.5px',
    marginBottom: '1rem',
    fontWeight: 600,
  },
  title: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '1rem',
    lineHeight: 1.2,
  },
  titleGradient: {
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--color-text-muted)',
    maxWidth: '500px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  stepsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
    position: 'relative',
  },
  connectorLine: {
    position: 'absolute',
    top: '60px',
    left: '15%',
    right: '15%',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, var(--color-primary), var(--color-secondary), transparent)',
    opacity: 0.3,
  },
  step: {
    position: 'relative',
  },
  stepCard: {
    backgroundColor: 'rgba(22, 33, 62, 0.6)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem 1.5rem',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  stepIcon: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--gradient-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
    color: '#fff',
  },
  stepNumber: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-bg)',
    border: '2px solid var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-primary-light)',
  },
  stepTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--color-text)',
    marginBottom: '0.75rem',
  },
  stepDesc: {
    fontSize: '0.875rem',
    color: 'var(--color-text-muted)',
    lineHeight: 1.5,
  },
}
