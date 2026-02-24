export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.logo}>
          <h1 style={styles.logoText}>TuMarca</h1>
        </div>
        <nav style={styles.nav}>
          <a href="#productos" style={styles.navLink}>Productos</a>
          <a href="#servicios" style={styles.navLink}>Servicios</a>
          <a href="#proceso" style={styles.navLink}>Proceso</a>
          <a href="#tecnica" style={styles.navLink}>Técnica</a>
          <a href="#contacto" style={styles.ctaButton}>Contacto</a>
        </nav>
      </div>
    </header>
  )
}

const styles = {
  header: {
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  logoText: {
    margin: 0,
    color: '#333',
  },
  nav: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  navLink: {
    textDecoration: 'none',
    color: '#666',
    fontSize: '1rem',
    transition: 'color 0.3s',
  },
  ctaButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    transition: 'background-color 0.3s',
  },
}
