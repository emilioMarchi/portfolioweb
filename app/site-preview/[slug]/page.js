'use client'

import { getTemplateHtml } from '../../../lib/templates/previewTemplates'

// Componente para renderizar un sitio dinámicamente
export default function SitePreviewPage({ params, searchParams }) {
  // Los parámetros llegan por querystring (en la URL)
  // Ej: /site-preview/mi-negocio?tipo=landing&p=#ff0000&s=#000000&desc=Hola
  
  const { slug } = params;
  
  // Reconstruir la data desde los query params
  const siteData = {
    nombre: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    tipo: searchParams.tipo || 'landing',
    descripcion: searchParams.desc || 'Sitio web generado automáticamente.',
    colores: {
      primary: searchParams.p ? `#${searchParams.p}` : '#6366f1',
      secondary: searchParams.s ? `#${searchParams.s}` : '#0ea5e9'
    }
  };

  // Obtener el HTML generado para inyectar
  const htmlContent = getTemplateHtml(siteData.tipo, siteData);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      {/* Botón flotante para volver al portfolio */}
      <a 
        href="/#demo"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#0f0f1a',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '30px',
          textDecoration: 'none',
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          fontSize: '14px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 9999,
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <span>← Volver a OVNI Studio</span>
      </a>

      {/* Inyectar el HTML en un iframe para aislar los estilos y scripts */}
      <iframe 
        style={{ width: '100%', height: '100%', border: 'none' }}
        srcDoc={htmlContent} 
        title="Site Preview"
      />
    </div>
  );
}
