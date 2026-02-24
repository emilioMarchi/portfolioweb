'use client'

const servicios = [
  {
    id: 1,
    titulo: 'Integraciones de IA',
    descripcion: 'Agentes IA como asistentes virtuales, chatbots avanzados y automatización inteligente.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
        <circle cx="7.5" cy="14.5" r="1.5"/>
        <circle cx="16.5" cy="14.5" r="1.5"/>
      </svg>
    ),
    color: '#14b8a6',
  },
  {
    id: 2,
    titulo: 'Automatización',
    descripcion: 'Procesos automatizados para optimizar flujo de trabajo y aumentar productividad.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    color: '#06b6d4',
  },
  {
    id: 3,
    titulo: 'Desarrollo Web',
    descripcion: 'Sitios web personalizados, aplicaciones y plataformas digitales a medida.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    color: '#22c55e',
  },
  {
    id: 4,
    titulo: 'Consultoría Tech',
    descripcion: 'Asesoramiento estratégico para transformar digitalmente tu negocio.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    color: '#f472b6',
  },
]

export default function Servicios() {
  return (
    <section id="servicios" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.badge}>SERVICIOS</span>
          <h2 style={styles.title}>
            Tecnología de <span style={styles.titleAccent}>vanguardia</span>
          </h2>
        </div>
        
        <div style={styles.grid}>
          {servicios.map((servicio) => (
            <div 
              key={servicio.id} 
              style={{
                ...styles.card,
                borderColor: `${servicio.color}30`,
              }}
            >
              <div style={{
                ...styles.cardGlow,
                background: `radial-gradient(circle at 30% 30%, ${servicio.color}10, transparent 60%)`,
              }} />
              
              <div style={{
                ...styles.iconContainer,
                borderColor: `${servicio.color}40`,
                boxShadow: `0 0 20px ${servicio.color}15`,
                color: servicio.color,
              }}>
                {servicio.icon}
              </div>
              
              <h3 style={{
                ...styles.cardTitle,
                color: servicio.color
              }}>{servicio.titulo}</h3>
              <p style={styles.cardDesc}>{servicio.descripcion}</p>
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
    padding: '6rem 2rem',
    backgroundColor: 'transparent',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 14px',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    border: '1px solid rgba(6, 182, 212, 0.2)',
    borderRadius: '50px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#06b6d4',
    letterSpacing: '1.5px',
    marginBottom: '1rem',
  },
  title: {
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
    fontWeight: 700,
    color: 'var(--color-text)',
  },
  titleAccent: {
    color: '#06b6d4',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  },
  card: {
    position: 'relative',
    padding: '1.5rem',
    borderRadius: '16px',
    backgroundColor: 'rgba(6, 182, 212, 0.02)',
    border: '1px solid',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  iconContainer: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    position: 'relative',
    zIndex: 1,
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    position: 'relative',
    zIndex: 1,
  },
  cardDesc: {
    color: 'var(--color-text-muted)',
    fontSize: '0.85rem',
    lineHeight: 1.5,
    position: 'relative',
    zIndex: 1,
  },
}
