// lib/gemini.js - Usa API v1beta para embeddings y v1 para generación
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  apiVersion: "v1beta"
});

export default genAI;
