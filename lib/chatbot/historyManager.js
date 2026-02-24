/**
 * Servicio de Gestión de Historial
 * Maneja la persistencia y recuperación del historial de conversación
 * Optimizado para usar menos llamadas a la API
 */

import { db } from '../firebase.js';

const MAX_RECENT_MESSAGES = 10; // Mensajes recientes a incluir tal cual

/**
 * Obtiene el historial de mensajes de un usuario desde Firestore
 * @param {string} userId - ID único del usuario
 * @returns {Promise<Array>} Array de mensajes del historial
 */
export async function getHistory(userId) {
  try {
    const historyDoc = await db.collection('history').doc(userId).get();
    
    if (historyDoc.exists) {
      return historyDoc.data().messages || [];
    }
    
    return [];
    
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    return [];
  }
}

/**
 * Guarda el historial actualizado de un usuario en Firestore
 * @param {string} userId - ID único del usuario
 * @param {Array} messages - Array de mensajes actualizado
 */
export async function saveHistory(userId, messages) {
  try {
    await db.collection('history').doc(userId).set({ messages });
  } catch (error) {
    console.error('Error guardando historial:', error);
  }
}

/**
 * Agrega un mensaje al historial existente
 * @param {string} userId - ID único del usuario
 * @param {Object} message - Mensaje a agregar {role, content}
 * @returns {Promise<Array>} Historial actualizado
 */
export async function addMessageToHistory(userId, message) {
  const historial = await getHistory(userId);
  const historialActualizado = [...historial, message];
  await saveHistory(userId, historialActualizado);
  return historialActualizado;
}

/**
 * Prepara el historial para enviar a Gemini
 * Simple: solo últimos mensajes (sin resumen para evitar llamadas extra)
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Historial preparado
 */
export async function prepareHistoryForGemini(userId) {
  const messages = await getHistory(userId);
  
  // Últimos mensajes tal cual
  const recentMessages = messages.slice(-MAX_RECENT_MESSAGES);
  
  // No usamos resumen para evitar llamada extra a Gemini
  // El modelo puede entender el contexto de los últimos mensajes
  
  return {
    recentMessages,
    summary: null,
    totalMessages: messages.length
  };
}
