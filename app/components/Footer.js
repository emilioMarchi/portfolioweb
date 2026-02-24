export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h3 style={styles.title}>TuMarca</h3>
          <p style={styles.text}>Sitios web y servicios para emprendedores</p>
        </div>
        <div style={styles.section}>
          <h4 style={styles.subtitle}>Productos</h4>
          <ul style={styles.list}>
            <li>Landing Pages</li>
            <li>Sitios Multipágina</li>
            <li>E-commerce</li>
            <li>Personalización</li>
          </ul>
        </div>
        <div style={styles.section}>
          <h4 style={styles.subtitle}>Servicios</h4>
          <ul style={styles.list}>
            <li>Integraciones IA</li>
            <li>Automatización</li>
          </ul>
        </div>
        <div style={styles.section}>
          <h4 style={styles.subtitle}>Contacto</h4>
          <p style={styles.text}>email@ejemplo.com</p>
        </div>
      </div>
      <div style={styles.bottom}>
        <p>© 2026 TuMarca. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: '3rem 2rem 1rem',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
  },
  section: {
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.125rem',
    marginBottom: '0.75rem',
    color: '#ccc',
  },
  text: {
    color: '#999',
    fontSize: '0.875rem',
  },
  list: {
    listStyle: 'none',
    color: '#999',
    fontSize: '0.875rem',
    lineHeight: 1.8,
  },
  bottom: {
    maxWidth: '1200px',
    margin: '2rem auto 0',
    paddingTop: '1rem',
    borderTop: '1px solid #333',
    textAlign: 'center',
    color: '#666',
    fontSize: '0.875rem',
  },
}
