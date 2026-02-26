import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

// Forzar carga de variables desde .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testFirebaseConnection() {
  console.log('--- TEST DE CONEXIÓN FIREBASE ADMIN ---');
  
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  console.log('Project ID:', projectId);
  console.log('Client Email:', clientEmail);
  console.log('Private Key definida:', !!privateKey);

  if (!privateKey) {
    console.error('❌ ERROR: FIREBASE_PRIVATE_KEY no está definida.');
    return;
  }

  // 1. Limpieza rigurosa de la clave
  privateKey = privateKey.trim();
  
  // Quitar comillas si las tiene al principio y al final
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  } else if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
    privateKey = privateKey.slice(1, -1);
  }

  // 2. Reemplazo de saltos de línea (cubriendo los dos casos más comunes)
  privateKey = privateKey.replace(/\\n/g, '\n');

  console.log('Longitud de la clave procesada:', privateKey.length);
  console.log('Empieza con:', privateKey.substring(0, 30));
  console.log('Termina con:', privateKey.substring(privateKey.length - 30));

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });
    
    // Si llegamos aquí, la inicialización funcionó. Hacemos una prueba real de conexión.
    console.log('✅ Firebase Admin SDK inicializado. Probando acceso a Firestore...');
    const db = admin.firestore();
    const testDoc = await db.collection('test_connection').limit(1).get();
    console.log('✅ Conexión a Firestore exitosa. La clave es válida.');

  } catch (error) {
    console.error('❌ Error crítico de Firebase:', error.message);
    if (error.code) console.error('Código de error:', error.code);
  }
}

testFirebaseConnection();
