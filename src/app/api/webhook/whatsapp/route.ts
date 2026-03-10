import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { evolutionApi } from '@/lib/evolution';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('--- WEBHOOK EVOLUTION RECEIVED ---');

        const event = body.event;
        const data = body.data;

        // Solo procesamos mensajes recibidos (upsert)
        if (event === 'messages.upsert') {
            const message = data.message;
            const key = message.key;
            const fromMe = key.fromMe;

            // Si el mensaje no es mío (es del lead)
            if (!fromMe) {
                const phone = key.remoteJid.split('@')[0];
                const pushName = data.pushName || 'Desconocido';
                const content = data.message?.conversation || data.message?.extendedTextMessage?.text || 'Mensaje de medios';

                console.log(`Mensaje de: ${pushName} (${phone}): ${content}`);

                // 1. Buscar si el lead ya existe en Supabase
                const { data: existingLead, error: findError } = await supabase
                    .from('leads')
                    .select('*')
                    .eq('phone', phone)
                    .single();

                if (!existingLead) {
                    // 2. Si no existe, crearlo
                    console.log('Creando nuevo lead desde WhatsApp...');
                    const { error: insertError } = await supabase
                        .from('leads')
                        .insert([{
                            from_name: pushName,
                            phone: phone,
                            source: 'WhatsApp_Live',
                            body_preview: content,
                            score: 70, // Score base por interés inicial
                            stage: 'MQL',
                            action_status: 'Nuevo'
                        }]);

                    if (insertError) console.error('Error insertando lead:', insertError);

                    // 3. Respuesta automática de bienvenida (Opcional pero recomendado para UX Elite)
                    const welcomeMsg = `¡Hola ${pushName}! 🤖 Soy el asistente inteligente de CLAVE.AI. He recibido su mensaje: "${content.substring(0, 20)}...". Un asesor se pondrá en contacto pronto.`;
                    await evolutionApi.sendMessage(phone, welcomeMsg);
                } else {
                    // 4. Si ya existe, actualizar el preview del mensaje
                    console.log('Actualizando lead existente...');
                    await supabase
                        .from('leads')
                        .update({
                            body_preview: content,
                            action_status: 'Mensaje Recibido'
                        })
                        .eq('phone', phone);
                }
            }
        }

        return NextResponse.json({ status: 'success' });
    } catch (error: any) {
        console.error('Webhook Error:', error.message);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
