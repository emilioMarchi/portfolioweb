'use client'

import { useUI } from './UIContext'

const tecnologias = [

  { 
    nombre: 'Next.js', 
    descripcion: 'Framework React con Serverless',
    icono: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
        <path d="M12 2L2 19.5h20L12 2zm0 4.5l6.5 10.5h-13L12 6.5z"/>
      </svg>
    )
  },
  { 
    nombre: 'React', 
    descripcion: 'Biblioteca UI modular',
    icono: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
        <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85-1.03 0-1.87-.85-1.87-1.85 0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9-.82-.08-1.63-.2-2.4-.36-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47l-.81 1.5.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.3-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 3.59 2.14 3.13 3.46-1.01 2.96-5.41 3.41-7.77 2.47-1.02-.42-1.81-1.07-2.43-1.83-.42-.51-.72-1.02-.92-1.53-.31-.77-.42-1.56-.27-2.35.31-1.57 1.77-2.71 3.87-2.89 1.05-.09 2.09.04 3.38.54z"/>
      </svg>
    )
  },
  { 
    nombre: 'IA Integration', 
    descripcion: 'Agentes y chatbots',
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
        <circle cx="7.5" cy="14.5" r="1.5"/>
        <circle cx="16.5" cy="14.5" r="1.5"/>
      </svg>
    )
  },
  { 
    nombre: 'Serverless', 
    descripcion: 'Despliegue escalable',
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
      </svg>
    )
  },
]

export default function Tecnica() {
  const { openChat } = useUI()

  
  return (
    <section id="tecnica" style={styles.section}>
      {/* Fondo decorativo */}
      <div style={styles.backgroundGlow} />
      <div style={styles.gridPattern} />
      
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.badge}>TÉCNICA</span>
          <h2 style={styles.title}>
            Tecnologías <span style={styles.titleGradient}>modernas</span>
          </h2>
          <p style={styles.subtitle}>
            Stack tecnológico de vanguardia para construir tu proyecto.
          </p>
        </div>
        
        <div style={styles.grid}>
          {tecnologias.map((tech, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.cardIcon}>{tech.icono}</div>
              <h3 style={styles.cardTitle}>{tech.nombre}</h3>
              <p style={styles.cardDesc}>{tech.descripcion}</p>
              <div style={styles.cardGlow} />
            </div>
          ))}
        </div>
        
        {/* Demo CTA */}
        <div style={styles.demo}>
          <div style={styles.demoContent}>
            <div style={styles.demoIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div style={styles.demoText}>
              <h3 style={styles.demoTitle}>¿Querés ver la IA en acción?</h3>
              <p style={styles.demoDesc}>
                Chateá con nuestro agente y generá tu sitio automáticamente.
              </p>
            </div>
          </div>
          <button onClick={openChat} style={styles.demoButton}>
            <span>Probar Demo</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
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
    padding: '7rem 2rem 2rem 2rem',
    overflow: 'hidden',
  },
  backgroundGlow: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    height: '40%',
    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  gridPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(14, 165, 233, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(14, 165, 233, 0.02) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    pointerEvents: 'none',
  },
  container: {
    position: 'relative',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    zIndex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 14px',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    border: '1px solid rgba(14, 165, 233, 0.2)',
    borderRadius: '50px',
    fontSize: '12px',
    color: 'var(--color-secondary)',
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
    background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary-light) 100%)',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  card: {
    position: 'relative',
    backgroundColor: 'rgba(22, 33, 62, 0.6)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
  },
  cardIcon: {
    width: '56px',
    height: '56px',
    borderRadius: 'var(--radius-md)',
    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
    color: 'var(--color-secondary)',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: 'var(--color-text)',
    marginBottom: '0.5rem',
  },
  cardDesc: {
    fontSize: '0.9rem',
    color: 'var(--color-text-muted)',
    lineHeight: 1.5,
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, var(--color-secondary), transparent)',
    opacity: 0.5,
  },
  demo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(22, 33, 62, 0.8)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  demoContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  demoIcon: {
    width: '56px',
    height: '56px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--gradient-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    flexShrink: 0,
  },
  demoText: {},
  demoTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: 'var(--color-text)',
    marginBottom: '0.25rem',
  },
  demoDesc: {
    fontSize: '0.9rem',
    color: 'var(--color-text-muted)',
  },
  demoButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0.875rem 1.75rem',
    background: 'var(--gradient-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-glow)',
    transition: 'all 0.3s ease',
  },
}
