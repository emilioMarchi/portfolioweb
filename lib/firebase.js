import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Se intenta usar la clave tal cual viene, reemplazando \n literales
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    
    console.log('✅ Firebase Admin inicializado correctamente (Attempt 3 - Simple Replace)');
  } catch (error) {
    console.error('❌ Error crítico al inicializar Firebase Admin:', error.message);
  }
}

export const db = admin.firestore();
export default admin;
