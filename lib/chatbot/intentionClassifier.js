/**
 * Intention Classifier
 * Usa embeddings para determinar qué función ejecutar basándose en el mensaje del usuario
 */

import genAI from '../gemini.js';
import { dotProduct } from './vectorUtils.js';
import { getFunctionDescriptions, getFunctionByName } from './functionRegistry.js';

const UMBRAL_FUNCION = 0.80; // Threshold más alto para evitar falsos positivos

// Cache de embeddings de funciones
let functionEmbeddingsCache = null;

/**
 * Genera embedding para un texto usando Gemini
 * @param {string} text - Texto a embeber
 * @returns {Promise<number[]>} Vector de embedding
 */
async function getEmbedding(text) {
  const result = await genAI.models.embedContent({
    model: 'gemini-embedding-001',
    contents: [{ role: 'user', parts: [{ text }] }]
  });
  
  return result.embeddings?.[0]?.values || null;
}

/**
 * Obtiene los embeddings de todas las funciones (con cache)
 * @returns {Promise<Array>} Array de objetos {name, description, embedding}
 */
async function getFunctionEmbeddings() {
  if (functionEmbeddingsCache) {
    return functionEmbeddingsCache;
  }

  const functions = getFunctionDescriptions();
  const embeddingsWithNames = [];

  for (const func of functions) {
    const embedding = await getEmbedding(func.description);
    if (embedding) {
      embeddingsWithNames.push({
        name: func.name,
        description: func.description,
        embedding
      });
    }
  }

  // Guardar en cache
  functionEmbeddingsCache = embeddingsWithNames;
  
  return embeddingsWithNames;
}

/**
 * Clasifica la intención del mensaje y determina qué función ejecutar
 * @param {string} userMessage - Mensaje del usuario
 * @returns {Promise<Object>} Objeto con {functionName, confidence, params}
 */
export async function classifyIntention(userMessage) {
  try {
    // Obtener embedding del mensaje del usuario
    const messageEmbedding = await getEmbedding(userMessage);
    
    if (!messageEmbedding) {
      console.log('⚠️ No se pudo obtener embedding del mensaje');
      return {
        functionName: 'generate_conversational_response',
        confidence: 0,
        params: {}
      };
    }

    // Obtener embeddings de funciones
    const functionEmbeddings = await getFunctionEmbeddings();

    // Calcular similitud con cada función
    const scores = functionEmbeddings.map(func => ({
      name: func.name,
      description: func.description,
      score: dotProduct(messageEmbedding, func.embedding)
    }));

    // Ordenar por score descendente
    scores.sort((a, b) => b.score - a.score);

    const bestMatch = scores[0];
    
    console.log(`🎯 Intención: "${bestMatch.name}" (score: ${bestMatch.score.toFixed(3)})`);
    console.log(`   Scores:`, scores.map(s => `${s.name}: ${s.score.toFixed(3)}`).join(', '));

    // Si el score es mayor al threshold, usamos esa función
    if (bestMatch.score >= UMBRAL_FUNCION) {
      return {
        functionName: bestMatch.name,
        confidence: bestMatch.score,
        params: {}
      };
    }

    // Si no hay match claro, usar respuesta conversacional
    return {
      functionName: 'generate_conversational_response',
      confidence: bestMatch.score,
      params: {}
    };

  } catch (error) {
    console.error('❌ Error en classifyIntention:', error);
    return {
      functionName: 'generate_conversational_response',
      confidence: 0,
      params: {},
      error: error.message
    };
  }
}

/**
 * Ejecuta la función seleccionada
 * @param {string} functionName - Nombre de la función
 * @param {Object} context - Contexto con userId, clientId, mensaje, historial
 * @returns {Promise<Object>} Resultado de la función
 */
export async function executeFunction(functionName, context) {
  const func = getFunctionByName(functionName);
  
  if (!func) {
    console.error(`❌ Función no encontrada: ${functionName}`);
    return {
      success: false,
      error: `Función ${functionName} no encontrada`
    };
  }

  try {
    // Preparar parámetros según la función
    const params = {
      userId: context.userId,
      clientId: context.clientId,
      query: context.mensaje,
      mensaje: context.mensaje,
      historial: context.historial
    };

    return await func.execute(params);
    
  } catch (error) {
    console.error(`❌ Error ejecutando función ${functionName}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Reinicia el cache de embeddings (útil para desarrollo)
 */
export function clearFunctionEmbeddingsCache() {
  functionEmbeddingsCache = null;
  console.log('🔄 Cache de embeddings de funciones limpiado');
}
