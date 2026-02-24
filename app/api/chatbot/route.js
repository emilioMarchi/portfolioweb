import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { getHistory, saveHistory, prepareHistoryForGemini } from '../../../lib/chatbot/historyManager.js';
import { generateResponse } from '../../../lib/chatbot/responseBuilder.js';

// Inicializar Firebase Admin si no está ya inicializado
if (!admin.apps.length) {
  try {
    const serviceAccount = {
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

// GET - Verificar que la ruta funciona
export async function GET() {
  return NextResponse.json({ 
    status: 'OK', 
    message: 'Chatbot API funcionando correctamente'
  });
}

export async function POST(request) {
  try {
    const { userId, clientId, message, apiKey } = await request.json();

    if (!userId || !message) {
      return NextResponse.json(
        { error: 'Faltan userId o mensaje' },
        { status: 400 }
      );
    }

    // Verificar token de Firebase Auth
    if (apiKey && apiKey.startsWith('ey')) { // Tokens de Firebase startsWith 'ey'
      try {
        const decodedToken = await admin.auth().verifyIdToken(apiKey)
        if (decodedToken.uid !== userId) {
          return NextResponse.json(
            { error: 'Token no corresponde al usuario' },
            { status: 401 }
          )
        }
        console.log('✅ Usuario Firebase verificado:', decodedToken.uid)
      } catch (authError) {
        console.warn('Token inválido:', authError.message)
        // Aceptar si no hay token o es fallback
      }
    } else {
      console.log('⚠️ Modo sin auth - usuario:', userId)
    }

    // Obtener historial (últimos 10 mensajes)
    const historialActual = await prepareHistoryForGemini(userId);
    const historialParaIA = [...historialActual.recentMessages, { role: 'user', content: message }];

    // Generar respuesta directamente (sin intention classifier para evitar llamada extra)
    // generateResponse ya incluye RAG internamente
    const iaResponse = await generateResponse(
      message, 
        historialParaIA, 
      { clientId: clientId || 'client1' },
      null // sin summary para evitar llamada extra
    );

    // Actualizar historial
    const historialFinal = [...historialParaIA, { role: 'bot', content: iaResponse.respuesta }];
    await saveHistory(userId, historialFinal);

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
