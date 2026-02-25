/**
 * Plantillas base para la previsualización en el DemoGenerator
 * Estas plantillas imitan la estructura de las plantillas reales del site-generator
 */

export const getTemplateHtml = (type, data) => {
  const primary = data.colores?.primary || '#6366f1';
  const secondary = data.colores?.secondary || '#0ea5e9';
  const name = data.nombre || 'Mi Negocio';
  const description = data.descripcion || 'Bienvenido a nuestro sitio web profesional.';
  
  // Plantilla LANDING (basada en site-generator templates/landing)
  if (type === 'landing' || !type) {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; }
          .bg-gradient-custom { background: linear-gradient(135deg, ${primary}15, ${secondary}10); }
          .text-primary { color: ${primary}; }
          .bg-primary { background-color: ${primary}; }
          .border-primary { border-color: ${primary}; }
        </style>
      </head>
      <body class="bg-white">
        <!-- Hero -->
        <section class="relative bg-gradient-custom py-20 px-6">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">${name}</h1>
            <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">${description}</p>
            <div class="flex gap-4 justify-center">
              <button class="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">Contactanos</button>
              <button class="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">Ver más</button>
            </div>
          </div>
        </section>

        <!-- Services -->
        <section class="py-16 px-6">
          <div class="max-w-5xl mx-auto">
            <h2 class="text-2xl font-bold text-center text-gray-900 mb-10">Nuestros Servicios</h2>
            <div class="grid md:grid-cols-3 gap-6">
              <div class="p-6 bg-gray-50 rounded-xl border border-gray-100">
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span class="text-primary font-bold">1</span>
                </div>
                <h3 class="font-semibold mb-2">Servicio Premium</h3>
                <p class="text-sm text-gray-500">Ofrecemos la mejor calidad en cada detalle para tu negocio.</p>
              </div>
              <div class="p-6 bg-gray-50 rounded-xl border border-gray-100">
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span class="text-primary font-bold">2</span>
                </div>
                <h3 class="font-semibold mb-2">Atención 24/7</h3>
                <p class="text-sm text-gray-500">Estamos siempre disponibles para resolver tus dudas.</p>
              </div>
              <div class="p-6 bg-gray-50 rounded-xl border border-gray-100">
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span class="text-primary font-bold">3</span>
                </div>
                <h3 class="font-semibold mb-2">Garantía de Éxito</h3>
                <p class="text-sm text-gray-500">Tu satisfacción es nuestra prioridad absoluta.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Contact -->
        <section class="py-16 px-6 bg-gray-50">
          <div class="max-w-2xl mx-auto text-center">
            <h2 class="text-2xl font-bold mb-4">¿Listo para empezar?</h2>
            <p class="text-gray-600 mb-8">Dejanos tu consulta y nos pondremos en contacto a la brevedad.</p>
            <div class="bg-white p-2 rounded-xl border border-gray-200 flex">
              <input type="email" placeholder="tu@email.com" class="flex-1 p-3 outline-none rounded-l-lg">
              <button class="bg-primary text-white px-6 py-3 rounded-lg font-semibold">Enviar</button>
            </div>
          </div>
        </section>

        <footer class="py-10 text-center border-t border-gray-100 text-gray-400 text-xs">
          © 2026 ${name} - Diseñado con OVNI Studio
        </footer>
      </body>
      </html>
    `;
  }

  // Fallback simple
  return `<html><body><h1>${name}</h1><p>${description}</p></body></html>`;
};
