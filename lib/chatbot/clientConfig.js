/**
 * Servicio de Configuración del Cliente
 * Obtiene la configuración personalizada de cada cliente desde Firestore
 */

import { db } from '../firebase.js';

const DEFAULT_CONFIG = {
  systemInstruction: 'Sos un asistente virtual atento y cordial. NO repitas tu nombre en cada mensaje. Solo usalo cuando sea necesario.',
  name: 'OVNI'
};

/**
 * Obtiene la configuración del cliente desde Firestore
 * @param {string} clientId - ID del cliente
 * @returns {Promise<Object>} Configuración del cliente
 */
export async function getClientConfig(clientId) {
  try {
    const doc = await db.collection('clients').doc(clientId).get();
    
    if (doc.exists) return doc.data();

    return DEFAULT_CONFIG;

  } catch (error) {
    console.error('Error obteniendo config de cliente:', error);
    return DEFAULT_CONFIG;
  }
}
