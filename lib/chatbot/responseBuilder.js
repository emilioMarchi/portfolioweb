/**
 * Servicio de Construcción de Respuestas
 * Genera respuestas inteligentes utilizando Gemini y el contexto disponible
 */

import genAI from '../gemini.js';
import { searchKnowledgeBase } from './knowledgeBase.js';
import { getClientConfig } from './clientConfig.js';

/**
 * Obtiene la fecha y hora actual formateada
 * @returns {string} Fecha y hora en formato es-AR
 */
function getFechaHoraActual() {
  return new Date().toLocaleString('es-AR');
}

/**
 * Prepara el texto para síntesis de voz (TTS)
 * @param {string} text - Texto a formatear
 * @returns {string} Texto formateado
 */
function formatForSpeech(text) {
  if (!text) return '';
  return text.trim().replace(/\*/g, '').replace(/\n/g, ' ') + '.';
}

/**
 * Construye el prompt para Gemini con toda la información contextual
 * @param {Object} params - Parámetros para construir el prompt
 * @returns {string} Prompt construido
 */
function buildPrompt({ mensaje, clientConfig, relevantContext, recentMessages, historySummary }) {
  const fechaHora = getFechaHoraActual();

  // Construir los mensajes recientes
  let messagesText = '';
  if (recentMessages && recentMessages.length > 0) {
    messagesText = recentMessages
      .map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`)
      .join('\n');
  }

  return `
Eres ${clientConfig.name}. ${clientConfig.systemInstruction}

📋 INFORMACIÓN DEL NEGOCIO:
${relevantContext || "No hay información específica disponible."}

📅 Fecha actual: ${fechaHora}

${historySummary ? `📌 RESUMEN DE LA CONVERSACIÓN ANTERIOR:
${historySummary}

` : ''}${messagesText ? `💬 MENSAJES RECIENTES DE ESTA CONVERSACIÓN:
${messagesText}

` : ''}Usuario actual: "${mensaje}"

🎯 INSTRUCCIONES IMPORTANTES:
- El resumen de arriba contiene información de conversaciones anteriores que debés usar
- Los mensajes recientes son de ESTA conversación
- Si el usuario pregunta sobre su nombre, datos personales o algo de la conversación, USÁ el historial
- NO digas que no sabes si el historial tiene la información
- NO inventes información
- Respondé en PRIMERA PERSONA, como si fueras vos el asistente
- NO digas "encontré información relevante" - simplemente respondé naturalmente
- NO menciones que sos una IA o que estás usando RAG
- Respondé corto y conversacional (máx 2-3 oraciones)
- NO repitas el nombre del usuario en cada mensaje, usalo solo ocasionalmente para que la charla sea natural.
`;
}

/**
 * Limpia la respuesta de la IA, eliminando bloques de código y parseando JSON si es necesario
 * @param {string} textResp - Respuesta sin limpiar
 * @returns {string} Respuesta limpia
 */
function cleanResponse(textResp) {
  let respuestaLimpia = textResp
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

  return respuestaLimpia;
}

/**
 * Genera una respuesta inteligente utilizando Gemini
 * @param {string} mensaje - Mensaje del usuario
 * @param {Array} historial - Historial de conversación reciente
 * @param {Object} contexto - Contexto adicional (clientId, etc.)
 * @param {string|null} historySummary - Resumen del historial completo
 * @returns {Promise<Object>} Respuesta de la IA
 */
export async function generateResponse(mensaje, historial = [], contexto = {}, historySummary = null) {
  try {
    const clientId = contexto.clientId || 'client1';

    // Mejorar query para RAG si el mensaje es muy corto
    let queryParaRAG = mensaje;

    if (mensaje.length < 15 && historial.length > 0) {
      const ultimoMensajeUsuario = [...historial]
        .reverse()
        .find(m => m.role === 'user');

      if (ultimoMensajeUsuario) {
        queryParaRAG = `${ultimoMensajeUsuario.content} ${mensaje}`;
      }
    }

    // Obtener config del cliente y contexto en paralelo
    const [clientConfig, relevantContext] = await Promise.all([
      getClientConfig(clientId),
      searchKnowledgeBase(queryParaRAG, clientId, 3)
    ]);

    // Construir el prompt con el historial mejorado
    const prompt = buildPrompt({
      mensaje,
      clientConfig,
      relevantContext,
      recentMessages: historial,
      historySummary
    });

    // 📊 Loguear tamaño de datos
    const promptSize = prompt.length;
    const relevantContextSize = relevantContext ? relevantContext.length : 0;
    const historialSize = historial.reduce((acc, m) => acc + m.content.length, 0);
    
    console.log('📊 DATOS ENVIADOS A GEMINI:');
    console.log(`   - Prompt total: ${promptSize} caracteres`);
    console.log(`   - Contexto RAG: ${relevantContextSize} caracteres`);
    console.log(`   - Historial: ${historialSize} caracteres (${historial.length} mensajes)`);
    console.log(`   - Mensaje usuario: ${mensaje.length} caracteres`);

    // Generar contenido con Gemini
    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    });

    // Obtener la respuesta
    const textRes = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Limpiar respuesta
    const respuestaLimpia = cleanResponse(textRes);

    return {
      respuesta: respuestaLimpia,
      accion: 'NONE',
      target: '',
      ttsText: formatForSpeech(respuestaLimpia)
    };

  } catch (error) {
    console.error('❌ Error en Gemini:', error);
    return {
      respuesta: 'Perdón, tuve un problema técnico. ¿Qué decías?',
      accion: 'NONE',
      target: '',
      ttsText: 'Perdón, tuve un problema técnico.'
    };
  }
}
