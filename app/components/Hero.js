'use client'

import { useChat } from './ChatContext'

export default function Hero() {
  const { openChat } = useChat()

  return (
    <section style={styles.hero}>
      {/* Fondo con gradiente y partículas */}
      <div style={styles.backgroundEffect} />
      <div style={styles.gridPattern} />
      
      <div style={styles.container}>
        {/* Badge de categoría */}
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          Transformación Digital
        </div>
        
        {/* Título principal */}
        <h1 style={styles.title}>
          <span style={styles.titleGradient}>Sitios web</span> que{' '}
          <span style={styles.titleAccent}>transforman</span>
          {' '}tu negocio
        </h1>
        
        {/* Subtítulo */}
        <p style={styles.subtitle}>
          Creamos experiencias digitales únicas con{' '}
          <span style={styles.highlight}>inteligencia artificial</span> integrada.
          Landing pages, tiendas online y soluciones a medida para emprendedores que quieren destacar.
        </p>
        
        {/* Botones CTA */}
        <div style={styles.buttons}>
          <a href="#productos" style={styles.primaryButton}>
            <span>Ver Productos</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <button onClick={openChat} style={styles.secondaryButton}>
            <span>Hablar con OVNI</span>
            <div style={styles.ovniMini}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <ellipse cx="12" cy="14" rx="8" ry="3"/>
              </svg>
            </div>
          </button>
        </div>
        
        {/* Features con iconos */}
        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div style={styles.featureContent}>
              <span style={styles.featureTitle}>Fast & Light</span>
              <span style={styles.featureDesc}>Carga ultrarrápida</span>
            </div>
          </div>
          <div style={styles.featureDivider} />
          <div style={styles.feature}>
            <div style={{...styles.featureIcon, background: 'linear-gradient(135deg, #6366f1 0%, #f472b6 100%)'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                <circle cx="7.5" cy="14.5" r="1.5"/>
                <circle cx="16.5" cy="14.5" r="1.5"/>
              </svg>
            </div>
            <div style={styles.featureContent}>
              <span style={styles.featureTitle}>IA Integrada</span>
              <span style={styles.featureDesc}>Asistente conversacional</span>
            </div>
          </div>
          <div style={styles.featureDivider} />
          <div style={styles.feature}>
            <div style={styles.featureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <path d="M12 18h.01"/>
              </svg>
            </div>
            <div style={styles.featureContent}>
              <span style={styles.featureTitle}>100% Responsive</span>
              <span style={styles.featureDesc}>Diseño adaptativo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const styles = {
  hero: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 0,
    margin: 0,
    top: 0,
  },
  backgroundEffect: {
    display: 'none',
  },
  gridPattern: {
    display: 'none',
  },
  container: {
    position: 'relative',
    maxWidth: '900px',
    margin: '0 auto',
    textAlign: 'center',
    zIndex: 1,
    paddingTop: '120px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '50px',
    fontSize: '13px',
    color: 'var(--color-primary-light)',
    marginBottom: '2rem',
    backdropFilter: 'blur(10px)',
  },
  badgeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    animation: 'pulse 2s infinite',
  },
  title: {
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '1.5rem',
    lineHeight: 1.1,
  },
  titleGradient: {
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  titleAccent: {
    color: '#f472b6',
    position: 'relative',
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    color: 'var(--color-text-muted)',
    marginBottom: '2.5rem',
    lineHeight: 1.7,
    maxWidth: '650px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  highlight: {
    color: 'var(--color-primary-light)',
    fontWeight: '600',
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '4rem',
    flexWrap: 'wrap',
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '1rem 2rem',
    background: 'var(--gradient-primary)',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    fontSize: '1rem',
    boxShadow: 'var(--shadow-glow)',
    transition: 'all 0.3s ease',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '1rem 2rem',
    backgroundColor: 'transparent',
    color: 'var(--color-text)',
    textDecoration: 'none',
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    fontSize: '1rem',
    border: '1px solid var(--color-border)',
    transition: 'all 0.3s ease',
  },
  ovniMini: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-primary-light)',
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
    padding: '2rem',
    backgroundColor: 'rgba(22, 33, 62, 0.5)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    backdropFilter: 'blur(10px)',
    maxWidth: '700px',
    margin: '0 auto',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-primary-light)',
  },
  featureContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  featureTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text)',
  },
  featureDesc: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  },
  featureDivider: {
    width: '1px',
    height: '40px',
    backgroundColor: 'var(--color-border)',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--color-text-muted)',
  },
  scrollText: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  scrollArrow: {
    animation: 'bounce 2s infinite',
  },
}
