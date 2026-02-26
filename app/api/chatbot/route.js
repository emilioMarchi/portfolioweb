import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { getHistory, saveHistory, prepareHistoryForGemini } from '../../../lib/chatbot/historyManager.js';
import { generateResponse } from '../../../lib/chatbot/responseBuilder.js';

// 1. Inicializar Firebase Admin solo una vez (se inicializa desde lib/firebase.js)
// Verificamos si ya está inicializado antes de usarlo
const isFirebaseInitialized = admin.apps.length > 0;

// GET - Verificar que la ruta funciona
export async function GET() {
  if (!isFirebaseInitialized) {
    return NextResponse.json({ status: 'Error', message: 'Firebase Admin no inicializado' }, { status: 503 });
  }
  return NextResponse.json({ 
    status: 'OK', 
    message: 'Chatbot API funcionando correctamente'
  });
}

export async function POST(request) {
  try {
    const { userId, clientId, message, apiKey, clearHistory } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Falta userId' }, { status: 400 });
    }
    
    if (!isFirebaseInitialized) {
        return NextResponse.json({ error: 'Firebase Admin no inicializado en el servidor.' }, { status: 503 });
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
          return NextResponse.json({ error: 'Token no corresponde al usuario' }, { status: 401 });
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
        // El usuario ya tiene historial, lo devolvemos para que el frontend lo monte
        return NextResponse.json({
          reply: null, // No hay mensaje nuevo, solo history
          isNewUser: false,
          history: historialActual.recentMessages
        });
      } else {
        // Usuario nuevo o historial limpio, saludo inicial estándar generado por IA
        const iaResponse = await generateResponse(
          "Genera un saludo inicial creativo y breve. Si eres el asistente principal preséntate y ofrece ayuda con automatización e IA. Si eres el diseñador, ve directo al grano y pregunta el nombre del negocio para empezar a diseñar.", 
          [], 
          { clientId: clientId || 'client1' },
          null
        );
        
        // Guardamos este primer mensaje del bot en el historial para que no se pierda
        await saveHistory(scopedUserId, [{ role: 'bot', content: iaResponse.respuesta }]);
        
        return NextResponse.json({
          reply: iaResponse.respuesta,
          isNewUser: true,
          history: [{ role: 'bot', content: iaResponse.respuesta }]
        });
      }
    }

    // FLUJO NORMAL: Procesar mensaje del usuario
    const historialParaIA = [...historialActual.recentMessages, { role: 'user', content: message }];

    const iaResponse = await generateResponse(
      message, 
        historialParaIA, 
      { clientId: clientId || 'client1' },
      null
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