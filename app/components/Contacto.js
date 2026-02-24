export default function Contacto() {
  return (
    <section id="contacto" style={styles.section}>
      {/* Fondo decorativo */}
      <div style={styles.backgroundGlow} />
      
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.badge}>CONTACTO</span>
          <h2 style={styles.title}>
            ¿Hablamos de tu <span style={styles.titleAccent}>proyecto</span>?
          </h2>
          <p style={styles.subtitle}>
            ¿Listo para transformar tu presencia digital? 
            Escribime y trabajemos juntos.
          </p>
        </div>
        
        <div style={styles.contentWrapper}>
          {/* Info de contacto */}
          <div style={styles.infoSection}>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div style={styles.infoContent}>
                <span style={styles.infoLabel}>Email</span>
                <a href="mailto:hola@ovnistudio.com" style={styles.infoValue}>hola@ovnistudio.com</a>
              </div>
            </div>
            
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div style={styles.infoContent}>
                <span style={styles.infoLabel}>Ubicación</span>
                <span style={styles.infoValue}>Buenos Aires, Argentina</span>
              </div>
            </div>
            
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div style={styles.infoContent}>
                <span style={styles.infoLabel}>Horario</span>
                <span style={styles.infoValue}>Lun - Vie: 9:00 - 18:00</span>
              </div>
            </div>
          </div>
          
          {/* Formulario */}
          <form style={styles.form}>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label} htmlFor="nombre">Nombre</label>
                <input 
                  type="text" 
                  id="nombre" 
                  name="nombre" 
                  style={styles.input}
                  placeholder="Tu nombre"
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label} htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  style={styles.input}
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="mensaje">Mensaje</label>
              <textarea 
                id="mensaje" 
                name="mensaje" 
                style={styles.textarea}
                placeholder="Cuéntame sobre tu proyecto, tus objetivos y cómo puedo ayudarte..."
                rows={5}
              />
            </div>
            <button type="submit" style={styles.button}>
              <span>Enviar Mensaje</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </form>
        </div>
        
        {/* CTA alternativo */}
        <div style={styles.alternative}>
          <span style={styles.alternativeText}>O también puedes</span>
          <a href="#" style={styles.chatLink}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Chatear con OVNI</span>
          </a>
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: {
    position: 'relative',
    padding: '6rem 2rem',
    backgroundColor: 'var(--color-bg)',
    overflow: 'hidden',
  },
  backgroundGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 14px',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-primary-light)',
    letterSpacing: '1px',
    marginBottom: '1rem',
  },
  title: {
    fontSize: 'clamp(2rem, 4vw, 2.75rem)',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '1rem',
  },
  titleAccent: {
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    textAlign: 'center',
    color: 'var(--color-text-muted)',
    fontSize: '1.1rem',
    maxWidth: '500px',
    margin: '0 auto',
  },
  contentWrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '3rem',
    alignItems: 'start',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  infoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem',
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
  },
  infoIcon: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-primary-light)',
    flexShrink: 0,
  },
  infoContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoLabel: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoValue: {
    fontSize: '14px',
    color: 'var(--color-text)',
    fontWeight: '500',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text)',
  },
  input: {
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  textarea: {
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s',
    minHeight: '140px',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '1rem 2rem',
    background: 'var(--gradient-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: 'var(--shadow-glow)',
  },
  alternative: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '1px solid var(--color-border)',
  },
  alternativeText: {
    color: 'var(--color-text-muted)',
    fontSize: '14px',
  },
  chatLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--color-primary-light)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
}
