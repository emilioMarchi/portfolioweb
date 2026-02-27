/**
 * Servicio de Base de Conocimientos (RAG)
 * Busca información relevante en Firestore filtrando por cliente
 */

import admin from 'firebase-admin';
import { db } from '../firebase.js'; // Importar desde el archivo centralizado
import { estimateTokens } from '../utils/tokenEstimator.js';
import { dotProduct } from './vectorUtils.js';
import genAI from '../gemini.js'; // Importar la instancia de genAI

const UMBRAL_MINIMO = 0.50;

/**
 * Genera el embedding para una consulta
 * @param {string} text - Texto a incrustar.
 * @returns {Promise<number[]|null>} El vector de embedding o null si falla.
 */
async function generateEmbedding(text) {
    try {
        // Telemetry para embeddings: tokens estimados de la consulta
        const inTokens = estimateTokens(text);
        console.log(`🔎 [TELEMETRY] Embedding query tokens (estimate): ${inTokens} for text: "${text.substring(0, 60)}..."`);
        // Usar el modelo de embedding específico solicitado
        const embeddingResult = await genAI.models.embedContent({
            model: 'gemini-embedding-001', // Modelo de embedding implementado
            contents: [{ role: 'user', parts: [{ text }] }]
        });
        return embeddingResult.embeddings?.[0]?.values || null;

    } catch (apiError) {
        console.error('❌ Error de red en Gemini API (Embeddings):', apiError.message);
        return null;
    }
}

/**
 * Busca información relevante en la base de conocimientos
 * @param {string} query - Consulta del usuario
 * @param {string} clientId - ID del cliente
 * @param {number} topK - Número de resultados a retornar
 * @returns {Promise<string>} Contextos relevantes concatenados
 */
export async function searchKnowledgeBase(query, clientId, topK = 3) {
  try {
    const queryVector = await generateEmbedding(query);

    if (!queryVector) return '';

    const safeClientId = clientId || 'client1';

    const snapshot = await db
      .collection('knowledge')
      .where('clientId', '==', safeClientId)
      .get();

    if (snapshot.empty) return '';

    const docs = snapshot.docs.map(doc => doc.data());

    const scoredDocs = docs.map(doc => {
      if (!doc.embedding) {
        return { text: doc.text, score: 0 };
      }

      return {
        text: doc.text,
        score: dotProduct(queryVector, doc.embedding)
      };
    });

    const results = scoredDocs
      .filter(d => d.score >= UMBRAL_MINIMO)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    if (results.length === 0) {
      console.log(`ℹ️ RAG: Sin coincidencias claras para "${query.substring(0, 25)}..."`);
      return '';
    }

    // 📊 Loguear qué trajo el RAG
    console.log('📚 RAG - DOCUMENTOS ENCONTRADOS:');
    results.forEach((r, i) => {
      console.log(`   [${i + 1}] Score: ${r.score.toFixed(3)} | ${r.text.substring(0, 100)}...`);
    });
    console.log(`   Total caracteres: ${results.reduce((acc, r) => acc + r.text.length, 0)}`);

    return results.map(d => d.text).join('\n\n');

  } catch (error) {
    console.error('❌ Error crítico en RAG:', error);
    return '';
  }
}
