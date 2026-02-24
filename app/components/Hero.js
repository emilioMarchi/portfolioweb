export default function Hero() {
  return (
    <section style={styles.hero}>
      <div style={styles.container}>
        <h1 style={styles.title}>
          Sitios web accesibles para emprendedores
        </h1>
        <p style={styles.subtitle}>
          Landing pages, tiendas online y soluciones digitales adaptadas a tu negocio.
          Tecnologías modernas con inteligencia artificial integrada.
        </p>
        <div style={styles.buttons}>
          <a href="#productos" style={styles.primaryButton}>
            Ver Productos
          </a>
          <a href="#contacto" style={styles.secondaryButton}>
            Contactar
          </a>
        </div>
        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>⚡</span>
            <span>Fast & Light</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🤖</span>
            <span>IA Integrada</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>📱</span>
            <span>Responsive</span>
          </div>
        </div>
      </div>
    </section>
  )
}

const styles = {
  hero: {
    padding: '4rem 2rem',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '1.5rem',
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#666',
    marginBottom: '2rem',
    lineHeight: 1.6,
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '3rem',
  },
  primaryButton: {
    padding: '1rem 2rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  },
  secondaryButton: {
    padding: '1rem 2rem',
    backgroundColor: 'transparent',
    color: '#0070f3',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    border: '2px solid #0070f3',
    transition: 'background-color 0.3s',
  },
  features: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#666',
    fontSize: '0.875rem',
  },
  featureIcon: {
    fontSize: '1.25rem',
  },
}
