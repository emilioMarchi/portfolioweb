/**
 * Plantillas base para la previsualización en el DemoGenerator
 * Estas plantillas imitan la estructura de las plantillas reales del site-generator
 */

export const getTemplateHtml = (type, data) => {
  const primary = data.colores?.primary || '#6366f1';
  const secondary = data.colores?.secondary || '#0ea5e9';
  const name = data.nombre || 'Mi Negocio';
  const description = data.descripcion || 'Bienvenido a nuestro sitio web profesional.';
  
  if (type === 'ecommerce') {
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
          .bg-primary { background-color: ${primary}; }
          .text-primary { color: ${primary}; }
          .border-primary { border-color: ${primary}; }
        </style>
      </head>
      <body class="bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm sticky top-0 z-50">
          <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900">${name}</h1>
            <div class="flex gap-4 items-center">
              <span class="text-sm font-semibold">Inicio</span>
              <span class="text-sm">Catálogo</span>
              <div class="bg-primary text-white p-2 rounded-full px-4 text-sm font-bold">🛒 Carrito (0)</div>
            </div>
          </div>
        </header>

        <!-- Hero -->
        <section class="bg-primary text-white py-16 px-6 text-center">
          <h2 class="text-4xl md:text-5xl font-bold mb-4">Nuestra nueva colección</h2>
          <p class="text-lg opacity-90 mb-8 max-w-2xl mx-auto">${description}</p>
          <button class="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">Ver Productos</button>
        </section>

        <!-- Products -->
        <section class="py-16 px-6 max-w-6xl mx-auto">
          <h3 class="text-2xl font-bold mb-8 text-gray-900">Productos Destacados</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <!-- Product 1 -->
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition">
              <div class="bg-gray-100 aspect-square rounded-lg mb-4 flex items-center justify-center">🛍️</div>
              <h4 class="font-semibold text-gray-800">Producto Premium</h4>
              <p class="text-primary font-bold mt-2">$29.99</p>
              <button class="w-full mt-4 border border-gray-200 text-sm py-2 rounded-lg group-hover:bg-primary group-hover:text-white group-hover:border-primary transition">Agregar</button>
            </div>
            <!-- Product 2 -->
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition">
              <div class="bg-gray-100 aspect-square rounded-lg mb-4 flex items-center justify-center">🎁</div>
              <h4 class="font-semibold text-gray-800">Artículo Especial</h4>
              <p class="text-primary font-bold mt-2">$49.99</p>
              <button class="w-full mt-4 border border-gray-200 text-sm py-2 rounded-lg group-hover:bg-primary group-hover:text-white group-hover:border-primary transition">Agregar</button>
            </div>
            <!-- Product 3 -->
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition">
              <div class="bg-gray-100 aspect-square rounded-lg mb-4 flex items-center justify-center">📦</div>
              <h4 class="font-semibold text-gray-800">Pack Exclusivo</h4>
              <p class="text-primary font-bold mt-2">$89.99</p>
              <button class="w-full mt-4 border border-gray-200 text-sm py-2 rounded-lg group-hover:bg-primary group-hover:text-white group-hover:border-primary transition">Agregar</button>
            </div>
            <!-- Product 4 -->
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition">
              <div class="bg-gray-100 aspect-square rounded-lg mb-4 flex items-center justify-center">⭐</div>
              <h4 class="font-semibold text-gray-800">Novedad</h4>
              <p class="text-primary font-bold mt-2">$19.99</p>
              <button class="w-full mt-4 border border-gray-200 text-sm py-2 rounded-lg group-hover:bg-primary group-hover:text-white group-hover:border-primary transition">Agregar</button>
            </div>
          </div>
        </section>

        <footer class="bg-white py-8 text-center border-t border-gray-200 text-gray-500 text-sm">
          © 2026 ${name} - Ecommerce Seguro
        </footer>
      </body>
      </html>
    `;
  }

  if (type === 'portfolio') {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'JetBrains Mono', monospace; background-color: #0f0f0f; color: #fff; }
          .text-primary { color: ${primary}; }
          .border-primary { border-color: ${primary}; }
          .bg-primary { background-color: ${primary}; }
        </style>
      </head>
      <body>
        <div class="max-w-4xl mx-auto px-6 py-20">
          <header class="mb-20">
            <h1 class="text-5xl font-bold mb-4">${name}<span class="text-primary">.</span></h1>
            <p class="text-xl text-gray-400 max-w-2xl">${description}</p>
          </header>

          <section class="mb-20">
            <h2 class="text-2xl font-bold mb-8 border-b border-gray-800 pb-4">Trabajos Destacados</h2>
            <div class="space-y-12">
              <div class="group border border-gray-800 rounded-2xl overflow-hidden hover:border-primary transition p-6">
                <h3 class="text-xl font-bold mb-2">Proyecto Alfa</h3>
                <p class="text-gray-400 mb-4">Desarrollo web y branding corporativo.</p>
                <div class="flex gap-2">
                  <span class="text-xs bg-gray-800 px-3 py-1 rounded-full text-primary">React</span>
                  <span class="text-xs bg-gray-800 px-3 py-1 rounded-full text-primary">Design</span>
                </div>
              </div>
              <div class="group border border-gray-800 rounded-2xl overflow-hidden hover:border-primary transition p-6">
                <h3 class="text-xl font-bold mb-2">App Mobile Beta</h3>
                <p class="text-gray-400 mb-4">Aplicación nativa para gestión de tareas.</p>
                <div class="flex gap-2">
                  <span class="text-xs bg-gray-800 px-3 py-1 rounded-full text-primary">UX/UI</span>
                  <span class="text-xs bg-gray-800 px-3 py-1 rounded-full text-primary">Mobile</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 class="text-2xl font-bold mb-8 border-b border-gray-800 pb-4">Contacto</h2>
            <button class="bg-primary text-white font-bold py-4 px-8 rounded-lg hover:opacity-90 transition">
              Iniciar Proyecto
            </button>
          </section>
        </div>
      </body>
      </html>
    `;
  }

  // Plantilla LANDING (por defecto)
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
};
