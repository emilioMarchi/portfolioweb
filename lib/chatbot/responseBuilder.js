/**
 * Servicio de Construcción de Respuestas
 * Genera respuestas inteligentes utilizando Gemini y el contexto disponible
 */

import genAI from '../gemini.js';
import { searchKnowledgeBase } from './knowledgeBase.js';
import { getClientConfig } from './clientConfig.js';

/**
 * Definición de herramientas para Function Calling
 */
const TOOLS = [
  {
    functionDeclarations: [
      {
        name: "generate_site_config",
        description: "Genera la configuración técnica para un sitio web basándose en los datos recolectados del usuario (nombre, tipo de sitio, colores, descripción).",
        parameters: {
          type: "OBJECT",
          properties: {
            nombre: { type: "STRING", description: "Nombre del negocio o sitio" },
            tipo: { type: "STRING", enum: ["landing", "multipage", "ecommerce", "portfolio"], description: "Tipo de sitio web a generar" },
            colores: {
              type: "OBJECT",
              properties: {
                primary: { type: "STRING", description: "Color primario en formato hexadecimal (ej: #ff0000)" },
                secondary: { type: "STRING", description: "Color secundario en formato hexadecimal" }
              },
              required: ["primary"]
            },
            descripcion: { type: "STRING", description: "Descripción breve del negocio para el sitio" }
          },
          required: ["nombre", "tipo", "colores"]
        }
      }
    ]
  }
];

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

  // Si el cliente es el diseñador, añadir instrucciones específicas de recolección de datos
  const isDesigner = clientConfig.name === 'Designer' || clientConfig.id === 'site-designer';
  const designerInstructions = isDesigner ? `
🎯 TU OBJETIVO COMO DISEÑADOR:
1. Debes recolectar 4 datos clave: Nombre del negocio, Tipo de sitio (landing, ecommerce o portfolio), Color primario (hexadecimal) y una breve Descripción.
2. SÉ EXTREMADAMENTE BREVE Y DIRECTO. No des explicaciones largas. Pregunta una cosa a la vez.
3. Sé creativo y sugiere colores si el usuario no está seguro.
4. IMPORTANTE: Una vez que tengas TODOS los datos confirmados, DEBES responder incluyendo un bloque JSON con esta estructura exacta (puedes agregar un mensaje cortito antes del JSON):
{
  "generar_sitio": true,
  "nombre": "Nombre del negocio",
  "tipo": "landing",
  "colores": { "primary": "#ff0000", "secondary": "#000000" },
  "descripcion": "Descripción del sitio"
}
5. NO generes el JSON hasta tener los datos confirmados por el usuario.
` : '';

  return `
Eres ${clientConfig.name}. ${clientConfig.systemInstruction}
${designerInstructions}

📋 INFORMACIÓN DEL NEGOCIO / CONTEXTO:
${relevantContext || "No hay información específica disponible."}

📅 Fecha actual: ${fechaHora}

${historySummary ? `📌 RESUMEN DE LA CONVERSACIÓN ANTERIOR:
${historySummary}

` : ''}${messagesText ? `💬 MENSAJES RECIENTES DE ESTA CONVERSACIÓN:
${messagesText}

` : ''}Usuario actual: "${mensaje}"

🎯 INSTRUCCIONES GENERALES:
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
  if (!textResp) return '';
  
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

    // Configuración del modelo
    const modelOptions = {
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    };

    // Generar contenido con Gemini
    const result = await genAI.models.generateContent({
      ...modelOptions,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    // Obtener la respuesta
    const candidate = result.candidates?.[0];
    const part = candidate?.content?.parts?.[0];
    const textRes = part?.text || '';
    
    let respuestaLimpia = '';
    let accion = 'NONE';
    let target = '';

    // Verificar si hay una llamada a función
    if (part?.functionCall) {
      const fn = part.functionCall;
      console.log(`🚀 IA llamó a función: ${fn.name}`, fn.args);
      
      accion = 'GENERATE_SITE';
      target = JSON.stringify(fn.args);
      respuestaLimpia = `¡Excelente! Ya tengo toda la información necesaria. Voy a generar una previsualización de tu sitio con el nombre "${fn.args.nombre}". ¿Te gustaría verlo?`;
    } else {
      // Intentar parsear el JSON si el modelo lo incluyó en el texto
      if (clientId === 'site-designer' && textRes.includes('"generar_sitio"')) {
        try {
          const jsonMatch = textRes.match(/\{[\s\S]*"generar_sitio"[\s\S]*\}/);
          if (jsonMatch) {
            const siteData = JSON.parse(jsonMatch[0]);
            if (siteData.generar_sitio) {
              accion = 'GENERATE_SITE';
              target = JSON.stringify({
                nombre: siteData.nombre,
                tipo: siteData.tipo,
                colores: siteData.colores,
                descripcion: siteData.descripcion
              });
              // Quitamos el JSON del texto que verá el usuario
              respuestaLimpia = cleanResponse(textRes.replace(jsonMatch[0], '').replace(/```json/g, '').replace(/```/g, ''));
              if (respuestaLimpia.trim() === '') {
                respuestaLimpia = `¡Excelente! Ya tengo toda la información. Voy a generar una previsualización de tu sitio "${siteData.nombre}". ¿Te gustaría verlo?`;
              }
            }
          }
        } catch (e) {
          console.error("Error parseando JSON generado por el diseñador", e);
          respuestaLimpia = cleanResponse(textRes);
        }
      } else {
        respuestaLimpia = cleanResponse(textRes);
      }
    }

    return {
      respuesta: respuestaLimpia,
      accion,
      target,
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
