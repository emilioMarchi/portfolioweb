import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
if (!process.env.FIREBASE_PROJECT_ID) {
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function clearHistory() {
  try {
    const snapshot = await db.collection('history').get();
    
    if (snapshot.empty) {
      console.log('No hay documentos en el historial para borrar.');
      return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`✅ Se borraron ${snapshot.size} historiales de chat.`);
  } catch (error) {
    console.error('Error al borrar el historial:', error);
  }
}

clearHistory().catch(console.error);
