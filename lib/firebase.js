import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Ruta absoluta a .env.local desde la raíz del proyecto (subimos de lib/ a la raíz)
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

// Initialize Firebase Admin with a robust credential strategy
if (!admin.apps.length) {
  try {
    // Prefer a JSON service account file if present at project root
    // Also support a custom path via FIREBASE_SERVICE_ACCOUNT_PATH
    let serviceAccount = null;
    const jsonPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    if (fs.existsSync(jsonPath)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      serviceAccount = require(jsonPath);
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const customPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      if (fs.existsSync(customPath)) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        serviceAccount = require(customPath);
      }
    } else {
      // Fallback to environment variables (multi-line private key handling)
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      if (privateKey && typeof privateKey === 'string') {
        // Convert literal \n sequences to real newlines
        privateKey = privateKey.replace(/\\n/g, '\n');
      }
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      };
    }

    // Debug: log which service account is being used (avoid leaking private data)
    const usedAccountEmail = serviceAccount && (serviceAccount.client_email || serviceAccount.clientEmail) ? (serviceAccount.client_email || serviceAccount.clientEmail) : 'unknown';
    console.log('🔎 Firebase Admin using service account:', usedAccountEmail);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    
    console.log('✅ Firebase Admin inicializado correctamente');
  } catch (error) {
    console.error('❌ Error crítico al inicializar Firebase Admin:', error.message);
    console.error('Error details:', error);
  }
}

export const db = admin.firestore();
export default admin;
