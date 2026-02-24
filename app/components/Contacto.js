export default function Contacto() {
  return (
    <section id="contacto" style={styles.section}>
      <div style={styles.container}>
        <h2 style={styles.title}>Contacto</h2>
        <p style={styles.subtitle}>
          ¿Listo para empezar tu proyecto? Escribime y hablemos.
        </p>
        <form style={styles.form}>
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
          <div style={styles.field}>
            <label style={styles.label} htmlFor="mensaje">Mensaje</label>
            <textarea 
              id="mensaje" 
              name="mensaje" 
              style={styles.textarea}
              placeholder="Cuéntame sobre tu proyecto..."
              rows={5}
            />
          </div>
          <button type="submit" style={styles.button}>
            Enviar Mensaje
          </button>
        </form>
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
    maxWidth: '600px',
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
    marginBottom: '2rem',
    fontSize: '1.125rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    outline: 'none',
  },
  textarea: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
  },
  button: {
    padding: '1rem 2rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
}
