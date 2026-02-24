/**
 * API Endpoint para subir la base de conocimientos dividida en chunks
 * POST /api/chatbot/upload-knowledge
 */

import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import genAI from '../../../../lib/gemini.js';

// Inicializar Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const db = admin.firestore();

/**
 * Genera embedding para un texto
 */
async function getEmbedding(text) {
  const result = await genAI.models.embedContent({
    model: 'gemini-embedding-001',
    contents: [{ role: 'user', parts: [{ text }] }]
  });
  return result.embeddings?.[0]?.values || null;
}

/**
 * Convierte la data en chunks pequeños
 */
function parseDataToChunks(data) {
  const chunks = [];
  const clientId = 'client1';

  // Información básica
  chunks.push({
    clientId,
    text: `Nombre del negocio: ${data.nombre}. Web: ${data.web}. Ubicación: ${data.ubicacion}. Descripción: ${data.descripcion}`,
    categoria: 'info_basica'
  });

  // Contacto
  chunks.push({
    clientId,
    text: `Teléfono: ${data.contacto.telefono}. Email: ${data.contacto.email}`,
    categoria: 'contacto'
  });

  // Mapa del sitio
  if (data.mapa_del_sitio) {
    data.mapa_del_sitio.forEach(item => {
      chunks.push({
        clientId,
        text: `Sección: ${item.seccion}. Descripción: ${item.descripcion}`,
        categoria: 'mapa_sitio'
      });
    });
  }

  // Servicios de contenido
  if (data.servicios?.contenido) {
    data.servicios.contenido.forEach(servicio => {
      chunks.push({
        clientId,
        text: `Servicio de contenido: ${servicio}`,
        categoria: 'servicios_contenido'
      });
    });
  }

  // Servicios de infraestructura digital
  if (data.servicios?.infraestructura_digital) {
    data.servicios.infraestructura_digital.forEach(servicio => {
      chunks.push({
        clientId,
        text: `Servicio de infraestructura digital: ${servicio}`,
        categoria: 'servicios_infraestructura'
      });
    });
  }

  // Productos destacados
  if (data.productos_destacados) {
    data.productos_destacados.forEach(producto => {
      chunks.push({
        clientId,
        text: `Producto: ${producto.nombre}. Descripción: ${producto.descripcion}`,
        categoria: 'productos'
      });
    });
  }

  // Forma de trabajo
  if (data.forma_de_trabajo) {
    data.forma_de_trabajo.forEach(forma => {
      chunks.push({
        clientId,
        text: `Forma de trabajo: ${forma}`,
        categoria: 'forma_trabajo'
      });
    });
  }

  // Propuesta de valor
  if (data.propuesta_valor) {
    chunks.push({
      clientId,
      text: `Propuesta de valor: ${data.propuesta_valor}`,
      categoria: 'propuesta_valor'
    });
  }

  // Casos de éxito
  if (data.casos_de_exito) {
    data.casos_de_exito.forEach(caso => {
      chunks.push({
        clientId,
        text: `Caso de éxito - Cliente: ${caso.cliente}. Servicio: ${caso.servicio}. Resultado: ${caso.resultado}`,
        categoria: 'casos_exito'
      });
    });
  }

  // FAQs
  if (data.faqs) {
    data.faqs.forEach(faq => {
      chunks.push({
        clientId,
        text: `Pregunta: ${faq.pregunta}. Respuesta: ${faq.respuesta}`,
        categoria: 'faqs'
      });
    });
  }

  return chunks;
}

/**
 * Sube los chunks a Firestore
 */
async function uploadChunks(chunks) {
  console.log(`📤 Subiendo ${chunks.length} chunks a Firestore...`);
  
  // Limpiar colección existente
  const existing = await db.collection('knowledge').where('clientId', '==', 'client1').get();
  console.log(`🗑️  Eliminando ${existing.docs.length} documentos existentes...`);
  const deletePromises = existing.docs.map(doc => doc.ref.delete());
  await Promise.all(deletePromises);

  // Subir nuevos chunks
  const results = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`   Generando embedding para chunk ${i + 1}/${chunks.length}...`);
    
    const embedding = await getEmbedding(chunk.text);
    
    if (embedding) {
      await db.collection('knowledge').add({
        ...chunk,
        embedding,
        createdAt: new Date()
      });
      results.push({ index: i + 1, success: true, preview: chunk.text.substring(0, 50) });
    } else {
      results.push({ index: i + 1, success: false });
    }
  }

  return results;
}

// POST handler
export async function POST() {
  try {
    // Buscar el archivo data.json
    const possiblePaths = [
      resolve(process.cwd(), '../apps/chatbot-redes/data.json'),
      resolve(process.cwd(), '../../apps/chatbot-redes/data.json'),
      resolve(process.cwd(), '../../../apps/chatbot-redes/data.json'),
    ];

    let dataJson = null;
    let usedPath = null;

    for (const path of possiblePaths) {
      if (existsSync(path)) {
        dataJson = readFileSync(path, 'utf-8');
        usedPath = path;
        break;
      }
    }

    if (!dataJson) {
      return NextResponse.json(
        { error: 'No se encontró data.json' },
        { status: 404 }
      );
    }

    // Parsear JSON
    let data;
    try {
      data = JSON.parse(dataJson);
    } catch {
      return NextResponse.json(
        { error: 'Error parseando JSON' },
        { status: 400 }
      );
    }

    // Convertir a chunks
    const chunks = parseDataToChunks(data);
    console.log(`📚 Data dividida en ${chunks.length} chunks`);

    // Mostrar distribución por categoría
    const categorias = {};
    chunks.forEach(c => {
      categorias[c.categoria] = (categorias[c.categoria] || 0) + 1;
    });
    console.log('📊 Distribución por categoría:', categorias);

    // Subir a Firestore
    const results = await uploadChunks(chunks);

    return NextResponse.json({
      success: true,
      totalChunks: chunks.length,
      uploaded: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      categorias,
      sampleResults: results.slice(0, 5)
    });

  } catch (error) {
    console.error('❌ Error en upload-knowledge:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
