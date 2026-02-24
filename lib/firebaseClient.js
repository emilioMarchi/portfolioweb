// lib/firebaseClient.js - Cliente Firebase para autenticación anónima
import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'

// Configuración - usar variables públicas de entorno
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForAnon",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID 
    ? `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com` 
    : "localhost",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID 
    ? `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com` 
    : "localhost.appspot.com",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000"
}

// Inicializar solo una vez
let app, auth
try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
} catch (e) {
  console.warn("Firebase init warning:", e)
}

/**
 * Obtiene o crea un usuario anónimo de Firebase
 * @returns {Promise<{userId: string, token: string}>}
 */
export async function getOrCreateAnonymousUser() {
  return new Promise((resolve, reject) => {
    if (!auth) {
      // Fallback si Firebase no está configurado
      const fallbackId = localStorage.getItem('chatbot_userId') 
        || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('chatbot_userId', fallbackId)
      resolve({ userId: fallbackId, token: null })
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe()
      
      if (user) {
        // Usuario ya autenticado
        const token = await user.getIdToken()
        localStorage.setItem('chatbot_userId', user.uid)
        localStorage.setItem('chatbot_authToken', token)
        resolve({ userId: user.uid, token })
      } else {
        // Crear nuevo usuario anónimo
        try {
          const result = await signInAnonymously(auth)
          const user = result.user
          const token = await user.getIdToken()
          localStorage.setItem('chatbot_userId', user.uid)
          localStorage.setItem('chatbot_authToken', token)
          resolve({ userId: user.uid, token })
        } catch (error) {
          console.error("Error en signInAnonymously:", error)
          // Fallback si falla
          const fallbackId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          localStorage.setItem('chatbot_userId', fallbackId)
          resolve({ userId: fallbackId, token: null })
        }
      }
    })
  })
}

/**
 * Obtiene el token actual
 * @returns {Promise<string|null>}
 */
export async function getAuthToken() {
  if (!auth?.currentUser) return null
  try {
    return await auth.currentUser.getIdToken()
  } catch {
    return null
  }
}
