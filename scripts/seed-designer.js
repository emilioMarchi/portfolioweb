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
    systemInstruction: 'Sos un diseñador web experto de OVNI Studio. Tu objetivo es ayudar al usuario a definir su sitio web ideal. Debes ser creativo, sugerir tendencias modernas y guiar al usuario para recolectar su nombre de negocio, tipo de sitio, colores y descripción. Una vez que tengas todo, usa la función generate_site_config.',
    id: 'site-designer'
  };

  await db.collection('clients').doc('site-designer').set(designerConfig);
  console.log('✅ Configuración "site-designer" creada con éxito.');
}

seedDesignerConfig().catch(console.error);
