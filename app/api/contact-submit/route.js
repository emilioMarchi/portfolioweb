import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase/firebaseAdmin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { nombre, email, mensaje } = await request.json();

    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Guardar en Firestore
    await db.collection('contactMessages').add({
      nombre,
      email,
      mensaje,
      timestamp: new Date(),
    });

    // Enviar notificación por Resend
    await resend.emails.send({
      from: 'OVNI Studio Contact <onboarding@resend.dev>',
      to: ['emiliomarchi.dev@gmail.com'], // Tu email de notificación
      subject: `Nuevo Mensaje de Contacto: ${nombre}`,
      html: `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong> ${mensaje}</p>
        <p>Enviado desde el portfolio de OVNI Studio.</p>
      `,
    });

    return NextResponse.json({ message: 'Mensaje enviado con éxito' }, { status: 200 });
  } catch (error) {
    console.error('Error al procesar el formulario de contacto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
