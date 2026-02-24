// lib/firebase.js
import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // Configurar con credentials explícitas para entorno serverless
    const serviceAccount = {
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    console.log('📦 Firebase Admin SDK inicializado correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar Firebase Admin:', error);
  }
}

export const db = admin.firestore();
export default admin;
