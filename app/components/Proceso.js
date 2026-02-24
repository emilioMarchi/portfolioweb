const pasos = [
  {
    numero: 1,
    titulo: 'Consulta Inicial',
    descripcion: 'Hablamos sobre tu proyecto, necesidades y objetivos.',
  },
  {
    numero: 2,
    titulo: 'Propuesta',
    descripcion: 'Te presento una propuesta personalizada con alcance y tiempos.',
  },
  {
    numero: 3,
    titulo: 'Desarrollo',
    descripcion: 'Construyo tu sitio web con revisiones periódicas.',
  },
  {
    numero: 4,
    titulo: 'Entrega',
    descripcion: 'Tu sitio listo para usar con soporte post-entrega.',
  },
]

export default function Proceso() {
  return (
    <section id="proceso" style={styles.section}>
      <div style={styles.container}>
        <h2 style={styles.title}>Proceso de Trabajo</h2>
        <p style={styles.subtitle}>
          Un proceso claro y transparente para construir tu proyecto digital.
        </p>
        <div style={styles.steps}>
          {pasos.map((paso) => (
            <div key={paso.numero} style={styles.step}>
              <div style={styles.stepNumber}>{paso.numero}</div>
              <h3 style={styles.stepTitle}>{paso.titulo}</h3>
              <p style={styles.stepDesc}>{paso.descripcion}</p>
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
    backgroundColor: '#fff',
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
  steps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
  },
  step: {
    textAlign: 'center',
  },
  stepNumber: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#0070f3',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 auto 1rem',
  },
  stepTitle: {
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
    color: '#1a1a1a',
  },
  stepDesc: {
    color: '#666',
    fontSize: '0.875rem',
  },
}
