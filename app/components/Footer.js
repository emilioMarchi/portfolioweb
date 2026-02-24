export default function Footer() {
  return (
    <footer style={styles.footer}>
      {/* Fondo decorativo */}
      <div style={styles.footerGlow} />
      
      <div style={styles.container}>
        {/* Logo y descripción */}
        <div style={styles.brandSection}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <ellipse cx="12" cy="14" rx="8" ry="3" fill="url(#footerOvniGradient)" opacity="0.3"/>
                <ellipse cx="12" cy="13" rx="8" ry="3" fill="url(#footerOvniGradient)"/>
                <ellipse cx="12" cy="12" rx="5" ry="2" fill="white" opacity="0.8"/>
                <defs>
                  <linearGradient id="footerOvniGradient" x1="4" y1="10" x2="20" y2="16">
                    <stop stopColor="#6366f1"/>
                    <stop offset="1" stopColor="#0ea5e9"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span style={styles.logoText}>OVNI <span style={styles.logoAccent}>Studio</span></span>
          </div>
          <p style={styles.description}>
            Creando experiencias digitales únicas con inteligencia artificial integrada.
            Transformamos tu presencia online.
          </p>
          <div style={styles.socialLinks}>
            <a href="#" style={styles.socialIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" style={styles.socialIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" style={styles.socialIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Links */}
        <div style={styles.linksSection}>
          <div style={styles.linksColumn}>
            <h4 style={styles.columnTitle}>Productos</h4>
            <ul style={styles.linksList}>
              <li><a href="#productos">Landing Pages</a></li>
              <li><a href="#productos">Sitios Multipágina</a></li>
              <li><a href="#productos">E-commerce</a></li>
              <li><a href="#productos">Personalización</a></li>
            </ul>
          </div>
          <div style={styles.linksColumn}>
            <h4 style={styles.columnTitle}>Servicios</h4>
            <ul style={styles.linksList}>
              <li><a href="#servicios">Integraciones IA</a></li>
              <li><a href="#servicios">Automatización</a></li>
              <li><a href="#servicios">Desarrollo Web</a></li>
              <li><a href="#servicios">Consultoría</a></li>
            </ul>
          </div>
          <div style={styles.linksColumn}>
            <h4 style={styles.columnTitle}>Empresa</h4>
            <ul style={styles.linksList}>
              <li><a href="#proceso">Proceso</a></li>
              <li><a href="#tecnica">Técnica</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom */}
      <div style={styles.bottom}>
        <div style={styles.bottomContainer}>
          <p style={styles.copyright}>© 2026 OVNI Studio. Todos los derechos reservados.</p>
          <div style={styles.legalLinks}>
            <a href="#">Términos</a>
            <span style={styles.separator}>•</span>
            <a href="#">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    position: 'relative',
    backgroundColor: 'var(--color-bg-secondary)',
    borderTop: '1px solid var(--color-border)',
    padding: '4rem 2rem 2rem',
    overflow: 'hidden',
  },
  footerGlow: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse 50% 30% at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '4rem',
    position: 'relative',
    zIndex: 1,
  },
  brandSection: {
    maxWidth: '300px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '1.5rem',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'var(--color-text)',
  },
  logoAccent: {
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  description: {
    color: 'var(--color-text-muted)',
    fontSize: '0.95rem',
    lineHeight: 1.7,
    marginBottom: '1.5rem',
  },
  socialLinks: {
    display: 'flex',
    gap: '12px',
  },
  socialIcon: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text-muted)',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  },
  linksSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
  },
  linksColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  columnTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text)',
    marginBottom: '1.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  linksList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  bottom: {
    maxWidth: '1200px',
    margin: '3rem auto 0',
    paddingTop: '2rem',
    borderTop: '1px solid var(--color-border)',
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  copyright: {
    color: 'var(--color-text-muted)',
    fontSize: '0.875rem',
  },
  legalLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  separator: {
    color: 'var(--color-text-muted)',
  },
}
