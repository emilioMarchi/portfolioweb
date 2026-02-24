const productos = [
  {
    id: 1,
    titulo: 'Landing Pages',
    descripcion: 'Sitios de una página optimizados para convertir visitantes en clientes.',
    precio: 'Desde $XXX',
    caracteristicas: ['Diseño responsive', 'SEO básico', 'Formulario de contacto', '1 semana de entrega'],
  },
  {
    id: 2,
    titulo: 'Sitios Multipágina',
    descripcion: 'Presencia web completa con múltiples secciones y páginas.',
    precio: 'Desde $XXX',
    caracteristicas: ['Hasta 5 páginas', 'Diseño personalizado', 'SEO avanzado', '2 semanas de entrega'],
  },
  {
    id: 3,
    titulo: 'E-commerce Básico',
    descripcion: 'Tienda online funcional para vender tus productos.',
    precio: 'Desde $XXX',
    caracteristicas: ['Carrito de compras', 'Pasarela de pago', 'Gestión de productos', '3 semanas de entrega'],
  },
  {
    id: 4,
    titulo: 'Personalización',
    descripcion: 'Customización adicional sobre cualquiera de nuestros productos base.',
    precio: 'A definir',
    caracteristicas: ['Funcionalidades extra', 'Integraciones', 'Modificaciones de diseño', 'Plazo a definir'],
  },
]

export default function Productos() {
  return (
    <section id="productos" style={styles.section}>
      <div style={styles.container}>
        <h2 style={styles.title}>Productos</h2>
        <p style={styles.subtitle}>
          Sitios web básicos pero funcionales, adaptados a las necesidades de emprendedores y negocios pequeños.
        </p>
        <div style={styles.grid}>
          {productos.map((producto) => (
            <div key={producto.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{producto.titulo}</h3>
              <p style={styles.cardDesc}>{producto.descripcion}</p>
              <p style={styles.price}>{producto.precio}</p>
              <ul style={styles.features}>
                {producto.caracteristicas.map((feature, index) => (
                  <li key={index} style={styles.feature}>✓ {feature}</li>
                ))}
              </ul>
              <a href="#contacto" style={styles.button}>Solicitar</a>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  card: {
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #e5e5e5',
    backgroundColor: '#fff',
    transition: 'box-shadow 0.3s',
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
  },
  price: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#0070f3',
    marginBottom: '1rem',
  },
  features: {
    listStyle: 'none',
    marginBottom: '1.5rem',
  },
  feature: {
    fontSize: '0.875rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  button: {
    display: 'block',
    textAlign: 'center',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '500',
  },
}
