/**
 * Script para subir la base de conocimientos dividida en chunks pequeños
 * Uso: node scripts/uploadKnowledgeBase.js
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// NO cargar .env.local aquí - Next.js ya lo hace automáticamente cuando corre el dev server
// Pero para node standalone, necesitamos las vars. Las definimos más abajo.
console.log('📝 Variables de entorno disponibles:', Object.keys(process.env).filter(k => k.includes('FIREBASE') || k.includes('GEMINI')));

import admin from 'firebase-admin';
import genAI from '../lib/gemini.js';

// Configurar credenciales igual que en lib/firebase.js
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

// Inicializar Firebase Admin
if (!admin.apps.length) {
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
  data.mapa_del_sitio.forEach(item => {
    chunks.push({
      clientId,
      text: `Sección: ${item.seccion}. Descripción: ${item.descripcion}`,
      categoria: 'mapa_sitio'
    });
  });

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
      console.log(`   ✅ Chunk ${i + 1} subido: ${chunk.text.substring(0, 50)}...`);
    } else {
      console.log(`   ❌ Chunk ${i + 1} falló: sin embedding`);
    }
  }

  console.log('✅ Upload completado!');
}

/**
 * Main
 */
async function main() {
  try {
    // Cargar data
    const data = parseJsonData(readFileSync('../apps/chatbot-redes/data.json', 'utf-8'));
    
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
    await uploadChunks(chunks);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
}

// Helper para parsear JSON
function parseJsonData(jsonString) {
  // Eliminar comentarios si los hay
  const cleanJson = jsonString
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  return JSON.parse(cleanJson);
}

main();
