import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { evolutionApi } from '@/lib/evolution';
import { aiService } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('--- WEBHOOK EVOLUTION RECEIVED (AI BRAIN ACTIVE) ---');

        const event = body.event;
        const data = body.data;

        if (event === 'messages.upsert') {
            const message = data.message;
            const key = message.key;
            const fromMe = key.fromMe;

            if (!fromMe) {
                const phone = key.remoteJid.split('@')[0];
                const pushName = data.pushName || 'Desconocido';
                const content = data.message?.conversation || data.message?.extendedTextMessage?.text || 'Mensaje de medios';

                console.log(`Mensaje de: ${pushName} (${phone}): ${content}`);

                // 1. Generar respuesta inteligente con Groq Llama 3.3
                const aiResponse = await aiService.generateResponse(pushName, content);

                // 2. Buscar si el lead ya existe en Supabase
                const { data: existingLead } = await supabase
                    .from('leads')
                    .select('*')
                    .eq('phone', phone)
                    .single();

                if (!existingLead) {
                    console.log('Creando nuevo lead con cerebro de IA...');
                    await supabase
                        .from('leads')
                        .insert([{
                            from_name: pushName,
                            phone: phone,
                            source: 'WhatsApp_Live',
                            body_preview: content,
                            score: 85,
                            stage: 'MQL',
                            action_status: 'IA_Respondiendo'
                        }]);
                } else {
                    await supabase
                        .from('leads')
                        .update({
                            body_preview: content,
                            action_status: 'Conversación_IA'
                        })
                        .eq('phone', phone);
                }

                // 3. Enviar la respuesta generada por la IA
                await evolutionApi.sendMessage(phone, aiResponse);
            }
        }

        return NextResponse.json({ status: 'success' });
    } catch (error: any) {
        console.error('Webhook Error:', error.message);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
