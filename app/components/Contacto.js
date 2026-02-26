'use client'

import { useState, useEffect } from 'react'

export default function Contacto() {
  const [isMobile, setIsMobile] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setIsSuccess(false)
    setIsError(false)

    try {
      const response = await fetch('/api/contact-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, mensaje }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setNombre('')
        setEmail('')
        setMensaje('')
      } else {
        setIsError(true)
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="contacto" style={styles.section}>
      <div style={styles.backgroundGlow} />
      
      <div style={{...styles.container, ...(isMobile ? styles.containerMobile : {})}}>
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
        
        <div style={{
          ...styles.contentWrapper,
          gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr',
          gap: isMobile ? '2rem' : '3rem',
        }}>
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
                <a href="mailto:emiliomarchi.dev@gmail.com" style={styles.infoValue}>emiliomarchi.dev@gmail.com</a>
              </div>
            </div>
            
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-3.67-2.94L3 13.5V10.5h4c.7 0 1.25-.56 1.25-1.25s-.55-1.25-1.25-1.25H3V5.5c0-.83.67-1.5 1.5-1.5h1.4c1 0 1.9.4 2.6.9L12 9l4.5-4.5c.7-.5 1.6-.9 2.6-.9H20.5c.83 0 1.5.67 1.5 1.5V16.92z"/>
                </svg>
              </div>
              <div style={styles.infoContent}>
                <span style={styles.infoLabel}>Teléfono</span>
                <a href="tel:+543425161099" style={styles.infoValue}>+54 342 5161099</a>
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
                <span style={styles.infoValue}>Santa Fe, Argentina</span>
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
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={{
              ...styles.formGrid,
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? '1rem' : '1.5rem',
            }}>
              <div style={styles.field}>
                <label style={styles.label} htmlFor="nombre">Nombre</label>
                <input 
                  type="text" 
                  id="nombre" 
                  name="nombre" 
                  style={styles.input}
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="mensaje">Mensaje</label>
              <textarea 
                id="mensaje" 
                name="mensaje" 
                style={styles.textarea}
                placeholder="Cuéntame sobre tu proyecto..."
                rows={5}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                required
              />
            </div>
            {isSuccess && <p style={styles.successMessage}>¡Mensaje enviado con éxito! Te contactaré pronto.</p>}
            {isError && <p style={styles.errorMessage}>Ocurrió un error al enviar el mensaje. Por favor, intenta de nuevo más tarde.</p>}
            <button type="submit" style={styles.button} disabled={isLoading}>
              {isLoading ? (
                'Enviando...'
              ) : (
                <>
                  <span>Enviar Mensaje</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
        
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
    padding: '2rem 2rem 6rem 2rem',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    width: '100%',
  },
  backgroundGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(99, 102, 241, 0.1) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'rgba(22, 33, 62, 0.4)',
    backdropFilter: 'blur(10px)',
    borderRadius: '30px',
    border: '1px solid var(--color-border)',
    padding: '4rem 3rem',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
  },
  containerMobile: {
    padding: '3rem 1.5rem',
    borderRadius: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3.5rem',
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
  successMessage: {
    color: '#10b981',
    marginTop: '1rem',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#ef4444',
    marginTop: '1rem',
    textAlign: 'center',
    fontWeight: 'bold',
  },
}
