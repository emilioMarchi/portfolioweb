const tecnologias = [
  { nombre: 'Next.js', descripcion: 'Framework React con Serverless' },
  { nombre: 'React', descripcion: 'Biblioteca UI modular' },
  { nombre: 'IA Integration', descripcion: 'Agentes y chatbots' },
  { nombre: 'Serverless', descripcion: 'Despliegue escalable' },
]

export default function Tecnica() {
  return (
    <section id="tecnica" style={styles.section}>
      <div style={styles.container}>
        <h2 style={styles.title}>Técnica</h2>
        <p style={styles.subtitle}>
          Tecnologías modernas que usamos para construir tu proyecto.
        </p>
        <div style={styles.grid}>
          {tecnologias.map((tech, index) => (
            <div key={index} style={styles.card}>
              <h3 style={styles.cardTitle}>{tech.nombre}</h3>
              <p style={styles.cardDesc}>{tech.descripcion}</p>
            </div>
          ))}
        </div>
        <div style={styles.demo}>
          <h3 style={styles.demoTitle}>🎯 Demo Técnica</h3>
          <p style={styles.demoText}>
            También podés probar nuestro generador de sitios en tiempo real.
            ¡Chateá con nuestro agente y generá tu sitio automáticamente!
          </p>
          <a href="#contacto" style={styles.demoButton}>Probar Demo</a>
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: {
    padding: '4rem 2rem',
    backgroundColor: '#1a1a1a',
    color: '#fff',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#fff',
  },
  subtitle: {
    textAlign: 'center',
    color: '#999',
    marginBottom: '3rem',
    fontSize: '1.125rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  card: {
    padding: '1.5rem',
    borderRadius: '8px',
    backgroundColor: '#2a2a2a',
  },
  cardTitle: {
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
    color: '#fff',
  },
  cardDesc: {
    color: '#999',
    fontSize: '0.875rem',
  },
  demo: {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '12px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #333',
  },
  demoTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: '#fff',
  },
  demoText: {
    color: '#999',
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
  },
  demoButton: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '500',
  },
}
