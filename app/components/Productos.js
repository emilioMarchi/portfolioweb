'use client'

import { useState, useEffect } from 'react'

const productos = [
  {
    id: 1,
    titulo: 'Landing Pages',
    descripcion: 'Sitios de una página optimizados para convertir visitantes en clientes.',
    precio: 'Desde $XXX',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    color: '#14b8a6',
    caracteristicas: ['Diseño responsive', 'SEO básico', 'Formulario de contacto', '1 semana de entrega'],
  },
  {
    id: 2,
    titulo: 'Sitios Multipágina',
    descripcion: 'Presencia web completa con múltiples secciones y páginas.',
    precio: 'Desde $XXX',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
       3" y=" <rect x="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    color: '#06b6d4',
    caracteristicas: ['Hasta 5 páginas', 'Diseño personalizado', 'SEO avanzado', '2 semanas de entrega'],
  },
  {
    id: 3,
    titulo: 'E-commerce',
    descripcion: 'Tienda online funcional para vender tus productos.',
    precio: 'Desde $XXX',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
    color: '#22c55e',
    caracteristicas: ['Carrito de compras', 'Pasarela de pago', 'Gestión de productos', '3 semanas de entrega'],
  },
  {
    id: 4,
    titulo: 'Personalización',
    descripcion: 'Customización adicional sobre cualquiera de nuestros productos base.',
    precio: 'A definir',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    color: '#f472b6',
    caracteristicas: ['Funcionalidades extra', 'Integraciones', 'Modificaciones de diseño', 'Plazo a definir'],
  },
]

export default function Productos() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section id="productos" style={{...styles.section, marginLeft: 'auto', marginRight: 'auto'}}>
      <div style={{
        ...styles.container,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <div style={styles.header}>
          <span style={styles.badge}>NUESTROS PRODUCTOS</span>
          <h2 style={styles.title}>
            Soluciones digitales para <span style={styles.titleAccent}>tu negocio</span>
          </h2>
          <p style={styles.subtitle}>
            Elige la opción que mejor se adapte a tus necesidades.
          </p>
        </div>
        
        <div style={styles.grid}>
          {productos.map((producto, index) => (
            <div 
              key={producto.id} 
              style={{
                ...styles.card,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div style={{
                ...styles.cardGlow,
                background: `linear-gradient(90deg, transparent, ${producto.color}, transparent)`
              }} />
              
              <div style={{
                ...styles.iconContainer,
                borderColor: `${producto.color}40`,
                boxShadow: `0 0 20px ${producto.color}20`,
                color: producto.color,
              }}>
                {producto.icon}
              </div>
              
              <h3 style={styles.cardTitle}>{producto.titulo}</h3>
              <p style={styles.cardDesc}>{producto.descripcion}</p>
              
              <div style={{
                ...styles.priceContainer,
                borderColor: `${producto.color}30`
              }}>
                <span style={{
                  ...styles.price,
                  color: producto.color
                }}>{producto.precio}</span>
              </div>
              
              <ul style={styles.features}>
                {producto.caracteristicas.map((feature, idx) => (
                  <li key={idx} style={styles.feature}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M20 6L9 17l-5-5" stroke={producto.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <a href="#contacto" style={{
                ...styles.button,
                borderColor: `${producto.color}50`,
                color: producto.color,
              }}>
                Solicitar Ahora
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: {
    position: 'relative',
    padding: '3rem 1.5rem',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    width: '100%',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    width: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 14px',
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    border: '1px solid rgba(20, 184, 166, 0.2)',
    borderRadius: '50px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--color-primary-light)',
    letterSpacing: '1.5px',
    marginBottom: '1rem',
  },
  title: {
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
    fontWeight: 700,
    color: 'var(--color-text)',
    marginBottom: '0.75rem',
  },
  titleAccent: {
    color: 'var(--color-primary-light)',
  },
  subtitle: {
    textAlign: 'center',
    color: 'var(--color-text-muted)',
    fontSize: '1rem',
    maxWidth: '500px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
  },
  card: {
    position: 'relative',
    padding: '1.75rem',
    borderRadius: '20px',
    backgroundColor: 'rgba(20, 184, 166, 0.03)',
    border: '1px solid rgba(20, 184, 166, 0.15)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: '1px',
    opacity: 0.5,
  },
  iconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: 'var(--color-text)',
    marginBottom: '0.5rem',
  },
  cardDesc: {
    color: 'var(--color-text-muted)',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    lineHeight: 1.5,
    flex: 1,
  },
  priceContainer: {
    marginBottom: '1rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid',
  },
  price: {
    fontSize: '1.25rem',
    fontWeight: 700,
  },
  features: {
    listStyle: 'none',
    marginBottom: '1.25rem',
    padding: 0,
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    color: 'var(--color-text-muted)',
    marginBottom: '0.5rem',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.875rem',
    backgroundColor: 'transparent',
    border: '1px solid',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '0.9rem',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
}
