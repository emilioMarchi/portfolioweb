const servicios = [
  {
    id: 1,
    titulo: 'Integraciones de IA',
    descripcion: 'Implementación de agentes IA como asistentes virtuales, chatbots avanzados y automatización inteligente.',
    icon: '🤖',
  },
  {
    id: 2,
    titulo: 'Automatización',
    descripcion: 'Procesos automatizados para optimizar flujo de trabajo, notificaciones y gestión de datos.',
    icon: '⚙️',
  },
]

export default function Servicios() {
  return (
    <section id="servicios" style={styles.section}>
      <div style={styles.container}>
        <h2 style={styles.title}>Servicios</h2>
        <p style={styles.subtitle}>
          Servicios adicionales para potenciar tu negocio con tecnología de inteligencia artificial.
        </p>
        <div style={styles.grid}>
          {servicios.map((servicio) => (
            <div key={servicio.id} style={styles.card}>
              <span style={styles.icon}>{servicio.icon}</span>
              <h3 style={styles.cardTitle}>{servicio.titulo}</h3>
              <p style={styles.cardDesc}>{servicio.descripcion}</p>
              <a href="#contacto" style={styles.link}>Más información →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: {
    padding: '4rem 2rem',
    backgroundColor: '#f8f9fa',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#1a1a1a',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '3rem',
    fontSize: '1.125rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  card: {
    padding: '2rem',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  icon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: '#1a1a1a',
  },
  cardDesc: {
    color: '#666',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  link: {
    color: '#0070f3',
    textDecoration: 'none',
    fontWeight: '500',
  },
}
