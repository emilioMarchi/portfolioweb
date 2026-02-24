/**
 * Chatbot Services Index
 * Exporta todos los módulos del chatbot de forma centralizada
 */

// Utilidades
export { dotProduct } from './vectorUtils.js';

// Servicios
export { searchKnowledgeBase } from './knowledgeBase.js';
export { getClientConfig } from './clientConfig.js';
export { getHistory, saveHistory, addMessageToHistory } from './historyManager.js';
export { generateResponse } from './responseBuilder.js';

// MCP Nativo - Registry y Classifier
export { functionRegistry, getFunctionByName, getFunctionDescriptions } from './functionRegistry.js';
export { classifyIntention, executeFunction, clearFunctionEmbeddingsCache } from './intentionClassifier.js';
