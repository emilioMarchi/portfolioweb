/**
 * Registro de Funciones del Chatbot
 * Define las funciones disponibles que el intention classifier puede invocar
 */

import { getHistory, saveHistory, prepareHistoryForGemini } from './historyManager.js';
import { searchKnowledgeBase } from './knowledgeBase.js';
import { getClientConfig } from './clientConfig.js';
import { generateResponse } from './responseBuilder.js';

/**
 * Definición de funciones disponibles
 * Cada función tiene:
 * - name: identificador único
 * - description: descripción para el embedding
 * - execute: función que ejecuta la lógica
 */
export const functionRegistry = [
  {
    name: 'get_history',
    description: 'Obtiene el historial de mensajes de la conversación actual con el usuario',
    execute: async ({ userId }) => {
      const history = await getHistory(userId);
      return {
        success: true,
        data: history,
        summary: `El historial tiene ${history.length} mensajes`
      };
    }
  },
  {
    name: 'get_history_summary',
    description: 'Obtiene un resumen del historial de conversación más los mensajes recientes',
    execute: async ({ userId }) => {
      const historyData = await prepareHistoryForGemini(userId);
      return {
        success: true,
        data: historyData,
        summary: historyData.summary || `${historyData.recentMessages.length} mensajes recientes`
      };
    }
  },
  {
    name: 'search_knowledge',
    description: 'Busca información específica en la base de conocimientos del negocio y devuelve el contenido encontrado',
    execute: async ({ query, clientId }) => {
      const results = await searchKnowledgeBase(query, clientId, 3);
      if (!results) {
        return {
          success: true,
          data: null,
          summary: 'No encontré información específica sobre eso'
        };
      }
      // Devolver el contenido real, no solo un mensaje
      return {
        success: true,
        data: results,
        summary: results
      };
    }
  },
  {
    name: 'get_client_config',
    description: 'Obtiene la configuración del cliente como el nombre del asistente y sus instrucciones',
    execute: async ({ clientId }) => {
      const config = await getClientConfig(clientId);
      return {
        success: true,
        data: config,
        summary: `El asistente se llama ${config.name}`
      };
    }
  },
  {
    name: 'generate_conversational_response',
    description: 'Responde al usuario de manera conversacional como un asistente virtual, buscando primero en la base de conocimientos si es necesario',
    execute: async ({ userId, mensaje, historial, clientId }) => {
      // Obtener el historial completo con resumen
      const historyData = await prepareHistoryForGemini(userId);
      
      // Generar respuesta usando el responseBuilder (que ya usa RAG internamente)
      const response = await generateResponse(
        mensaje, 
        historial, 
        { clientId },
        historyData.summary
      );
      return {
        success: true,
        data: response,
        summary: response.respuesta
      };
    }
  }
];

/**
 * Obtiene una función por nombre
 * @param {string} name - Nombre de la función
 * @returns {Object|null} Función encontrada o null
 */
export function getFunctionByName(name) {
  return functionRegistry.find(f => f.name === name) || null;
}

/**
 * Obtiene todas las descripciones de funciones (para embeddings)
 * @returns {Array} Array de descripciones
 */
export function getFunctionDescriptions() {
  return functionRegistry.map(f => ({
    name: f.name,
    description: f.description
  }));
}
