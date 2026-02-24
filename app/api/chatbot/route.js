import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import genAI from '../../../lib/gemini';

// Función auxiliar: producto punto para similitud cosenoidal
function dotProduct(v1, v2) {
  if (!v1 || !v2 || v1.length !== v2.length) return 0;
  return v1.reduce((acc, val, i) => acc + val * v2[i], 0);
}

// Buscar en la base de conocimientos (RAG)
async function searchKnowledgeBase(query, clientId, topK = 3) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY no definida.');
      return '';
    }

    let queryVector;

    const embeddingResult = await genAI.models.embedContent({
      model: "gemini-embedding-001",
      contents: [{ role: "user", parts: [{ text: query }] }]
    });

    queryVector = embeddingResult.embeddings?.[0]?.values;

    if (!queryVector) return '';

    const safeClientId = clientId || 'client1';

    const snapshot = await db
      .collection('knowledge')
      .where('clientId', '==', safeClientId)
      .get();

    if (snapshot.empty) return '';

    const docs = snapshot.docs.map(doc => doc.data());

    const UMBRAL_MINIMO = 0.50;

    const scoredDocs = docs.map(doc => {
      if (!doc.embedding) {
        return { text: doc.text, score: 0 };
      }
      return {
        text: doc.text,
        score: dotProduct(queryVector, doc.embedding)
      };
    });

    const results = scoredDocs
      .filter(d => d.score >= UMBRAL_MINIMO)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    if (results.length === 0) {
      console.log(`ℹ️ RAG: Sin coincidencias claras para "${query.substring(0, 25)}..."`);
      return '';
    }

    console.log(`✅ RAG: ${results.length} fragmentos relevantes encontrados.`);
    return results.map(d => d.text).join('\n\n');

  } catch (error) {
    console.error('❌ Error crítico en RAG:', error);
    return '';
  }
}

// Obtener configuración del cliente
async function getClientConfig(clientId) {
  try {
    const doc = await db.collection('clients').doc(clientId).get();
    
    if (doc.exists) return doc.data();

    return {
      systemInstruction: 'Sos un asistente virtual atento y cordial.',
      name: 'Asistente'
    };
  } catch (error) {
    console.error('Error obteniendo config de cliente:', error);
    return {
      systemInstruction: 'Sos un asistente virtual atento y cordial.',
      name: 'Asistente'
    };
  }
}

// Generar respuesta con Gemini
async function generateResponse(mensaje, historial = [], contexto = {}) {
  try {
    const clientId = contexto.clientId || 'client1';

    let queryParaRAG = mensaje;

    if (mensaje.length < 15 && historial.length > 0) {
      const ultimoMensajeUsuario = [...historial]
        .reverse()
        .find(m => m.role === 'user');

      if (ultimoMensajeUsuario) {
        queryParaRAG = `${ultimoMensajeUsuario.content} ${mensaje}`;
      }
    }

    const [clientConfig, relevantContext] = await Promise.all([
      getClientConfig(clientId),
      searchKnowledgeBase(queryParaRAG, clientId, 3)
    ]);

    const fechaHora = new Date().toLocaleString('es-AR');

    // Construir el historial de conversación para el prompt (solo últimos 6 mensajes)
    let historialTexto = '';
    if (historial && historial.length > 0) {
      const ultimosMensajes = historial.slice(-6); // Solo últimos 6 mensajes
      historialTexto = ultimosMensajes.map(m => 
        m.role === 'user' ? `Usuario: ${m.content}` : `Asistente: ${m.content}`
      ).join('\n');
    }

    const prompt = `
Sos ${clientConfig.name}. ${clientConfig.systemInstruction}

Información del negocio:
${relevantContext || "No hay información específica disponible."}

Fecha: ${fechaHora}

${historialTexto ? `📝 HISTORIAL DE ESTA CONVERSACIÓN (IMPORTANTÍSIMO - SON DATOS REALES, NO LOS INVENTES):\n${historialTexto}\n\n` : ''}Usuario dice: "${mensaje}"

INSTRUCCIONES IMPORTANTES:
- El historial de arriba ES REAL y contiene información que el usuario te ha dicho
- Si el usuario pregunta sobre su nombre, datos personales o algo de la conversación, USÁ el historial
- NO digas que no sabes si el historial tiene la información
- NO inventes información que no esté en el historial
- Respondé corto y conversacional (máx 2-3 oraciones). No escribas frases largas.
- NO uses el nombre del usuario todo el tiempo, solo si es necesario o natural.
`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    });

    let textRes = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Limpiar respuesta
    let respuestaLimpia = textRes
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // Parsear JSON si viene en formato {"texto": "..."}
    try {
      const parsed = JSON.parse(respuestaLimpia);
      if (parsed.texto || parsed.text || parsed.message) {
        respuestaLimpia = parsed.texto || parsed.text || parsed.message;
      }
    } catch {
      // No es JSON, usar texto tal cual
    }

    return {
      respuesta: respuestaLimpia,
      accion: 'NONE',
      target: ''
    };

  } catch (error) {
    console.error('❌ Error en Gemini:', error);
    return {
      respuesta: 'Perdón, tuve un problema técnico. ¿Qué decías?',
      accion: 'NONE',
      target: ''
    };
  }
}

// GET - Verificar que la ruta funciona
export async function GET() {
  return NextResponse.json({ 
    status: 'OK', 
    message: 'Chatbot API funcionando correctamente' 
  });
}

// POST - Procesar mensajes
export async function POST(request) {
  try {
    const { userId, clientId, message } = await request.json();

    if (!userId || !message) {
      return NextResponse.json(
        { error: 'Faltan userId o mensaje' },
        { status: 400 }
      );
    }

    // Obtener historial desde Firestore
    let historialActual = [];
    try {
      const historyDoc = await db.collection('history').doc(userId).get();
      if (historyDoc.exists) {
        historialActual = historyDoc.data().messages || [];
      }
    } catch (err) {
      console.log('ℹ️ Sin historial previo');
    }

    const historialParaIA = [...historialActual, { role: 'user', content: message }];

    // Generar respuesta
    const iaResponse = await generateResponse(message, historialParaIA, { clientId });

    // Actualizar historial
    const historialFinal = [...historialParaIA, { role: 'bot', content: iaResponse.respuesta }];
    await db.collection('history').doc(userId).set({ messages: historialFinal });

    return NextResponse.json({
      userText: message,
      reply: iaResponse.respuesta,
      accion: iaResponse.accion,
      target: iaResponse.target
    });

  } catch (error) {
    console.error('❌ Error en /api/chatbot:', error);
    return NextResponse.json(
      { error: 'Error procesando mensaje', details: error.message },
      { status: 500 }
    );
  }
}
