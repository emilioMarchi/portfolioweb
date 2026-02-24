import { NextResponse } from 'next/server';
import { getHistory, saveHistory, prepareHistoryForGemini } from '../../../lib/chatbot/historyManager.js';
import { generateResponse } from '../../../lib/chatbot/responseBuilder.js';

// GET - Verificar que la ruta funciona
export async function GET() {
  return NextResponse.json({ 
    status: 'OK', 
    message: 'Chatbot API funcionando correctamente'
  });
}

// POST - Procesar mensajes (flujo simplificado para evitar muchas llamadas a API)
export async function POST(request) {
  try {
    const { userId, clientId, message } = await request.json();

    if (!userId || !message) {
      return NextResponse.json(
        { error: 'Faltan userId o mensaje' },
        { status: 400 }
      );
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
