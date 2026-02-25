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

async function seedDesignerConfig() {
  const designerConfig = {
    name: 'Designer',
    systemInstruction: 'Sos un diseñador web experto de OVNI Studio. Tu objetivo es ayudar al usuario a definir su sitio web ideal. SÉ MUY BREVE, DIRECTO Y CONVERSACIONAL. Pregunta un dato a la vez. Debes recolectar: nombre, tipo de sitio (landing, ecommerce o portfolio), color primario y descripción. Sugiere opciones creativas. Una vez que tengas todo, devuelve el bloque JSON de generación. No respondas con textos largos.',
    id: 'site-designer'
  };

  await db.collection('clients').doc('site-designer').set(designerConfig);
  console.log('✅ Configuración "site-designer" creada con éxito.');
}

seedDesignerConfig().catch(console.error);
