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
    const { userId, clientId, message, apiKey, clearHistory } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Falta userId' },
        { status: 400 }
      );
    }

    // Si se solicita limpiar el historial, lo borramos antes de procesar
    if (clearHistory) {
      await saveHistory(`${userId}_${clientId || 'client1'}`, []);
    }

    // Verificar token de Firebase Auth
    if (apiKey && apiKey.startsWith('ey')) { 
      try {
        const decodedToken = await admin.auth().verifyIdToken(apiKey)
        if (decodedToken.uid !== userId) {
          return NextResponse.json(
            { error: 'Token no corresponde al usuario' },
            { status: 401 }
          )
        }
      } catch (authError) {
        console.warn('Token inválido:', authError.message)
      }
    }

    // Obtener historial scopeado por cliente
    const scopedUserId = `${userId}_${clientId || 'client1'}`;
    const historialActual = await prepareHistoryForGemini(scopedUserId);
    
    // CASO ESPECIAL: Si no hay mensaje, es una petición de SALUDO INICIAL
    if (!message) {
      if (historialActual.recentMessages.length > 0) {
        // El usuario ya tiene historial, saludamos reconociéndolo
        const lastMessage = historialActual.recentMessages[historialActual.recentMessages.length - 1];
        const contextPrompt = `El usuario ha vuelto al chat. Su historial tiene ${historialActual.totalMessages} mensajes. Salúdalo de forma breve y profesional, reconociendo que ha vuelto.`;
        
        const iaResponse = await generateResponse(
          contextPrompt, 
          historialActual.recentMessages, 
          { clientId: clientId || 'client1' },
          null
        );
        
        return NextResponse.json({
          reply: iaResponse.respuesta,
          isNewUser: false,
          history: historialActual.recentMessages
        });
      } else {
        // Usuario nuevo, saludo inicial estándar generado por IA
        const iaResponse = await generateResponse(
          "Genera un saludo inicial creativo y breve. Si eres el asistente principal preséntate y ofrece ayuda con automatización e IA. Si eres el diseñador, ve directo al grano y pregunta el nombre del negocio para empezar a diseñar.", 
          [], 
          { clientId: clientId || 'client1' },
          null
        );
        
        return NextResponse.json({
          reply: iaResponse.respuesta,
          isNewUser: true
        });
      }
    }

    // FLUJO NORMAL: Procesar mensaje del usuario
    const historialParaIA = [...historialActual.recentMessages, { role: 'user', content: message }];

    // Generar respuesta directamente (sin intention classifier para evitar llamada extra)
    // generateResponse ya incluye RAG internamente
    const iaResponse = await generateResponse(
      message, 
        historialParaIA, 
      { clientId: clientId || 'client1' },
      null // sin summary para evitar llamada extra
    );

    // Actualizar historial scopeado
    const historialFinal = [...historialParaIA, { role: 'bot', content: iaResponse.respuesta }];
    await saveHistory(scopedUserId, historialFinal);

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
