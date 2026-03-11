import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { evolutionApi } from '@/lib/evolution';
import { aiService } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('--- WEBHOOK EVOLUTION RECEIVED (ALTEPSA CRM ACTIVE) ---');
        console.log('Event:', body.event);

        const event = body.event;
        const data = body.data;

        if (event === 'messages.upsert') {
            // Extraer key de forma robusta (Evolution API v1 y v2 envían en sitios distintos)
            const key = data?.key || data?.message?.key;
            if (!key) {
                console.log('No se encontró key en el payload, ignorando.');
                return NextResponse.json({ status: 'ignored', reason: 'no_key' });
            }

            const fromMe = key.fromMe;

            if (!fromMe) {
                const phone = key.remoteJid?.split('@')[0];
                if (!phone) {
                    console.log('No se pudo extraer teléfono.');
                    return NextResponse.json({ status: 'ignored', reason: 'no_phone' });
                }

                const pushName = data.pushName || 'Prospecto';
                // Extraer contenido del mensaje de múltiples posibles campos
                const content = data.message?.conversation
                    || data.message?.extendedTextMessage?.text
                    || data.message?.imageMessage?.caption
                    || 'Mensaje multimedia recibido';

                console.log(`📩 Mensaje de: ${pushName} (${phone}): ${content}`);

                // ═══════════════════════════════════════
                // PASO 1: Generar respuesta IA (Llama 3.3)
                // ═══════════════════════════════════════
                console.log('🤖 Generando respuesta IA...');
                const aiResponse = await aiService.generateResponse(pushName, content);
                console.log('✅ Respuesta IA generada:', aiResponse.substring(0, 80) + '...');

                // ═══════════════════════════════════════
                // PASO 2: CRM - Guardar/Actualizar Lead
                // ═══════════════════════════════════════
                const { data: existingLead } = await supabase
                    .from('leads')
                    .select('*')
                    .eq('phone', phone)
                    .single();

                if (!existingLead) {
                    // Asignación automática (Round Robin)
                    const vendedores = ["Arkel Sales", "Claudia Leads", "Elite AI"];
                    const { count } = await supabase.from('leads').select('*', { count: 'exact', head: true });
                    const assignedTo = vendedores[(count || 0) % vendedores.length];

                    console.log(`👤 NUEVO LEAD: ${pushName} → Asignado a: ${assignedTo}`);

                    await supabase
                        .from('leads')
                        .insert([{
                            from_name: pushName,
                            phone: phone,
                            source: 'WhatsApp_AI',
                            body_preview: content,
                            score: 85,
                            stage: 'MQL',
                            action_status: 'IA_Respondiendo',
                            assigned_to: assignedTo,
                            priority: 'Media',
                            last_follow_up: new Date().toISOString()
                        }]);

                    console.log('💾 Lead guardado en Supabase con éxito');
                } else {
                    console.log(`🔄 Lead existente actualizado: ${pushName}`);
                    await supabase
                        .from('leads')
                        .update({
                            body_preview: content,
                            action_status: 'Conversación_IA',
                            last_follow_up: new Date().toISOString()
                        })
                        .eq('phone', phone);
                }

                // ═══════════════════════════════════════
                // PASO 3: Enviar respuesta por WhatsApp
                // ═══════════════════════════════════════
                console.log('📱 Enviando respuesta por WhatsApp...');
                await evolutionApi.sendMessage(phone, aiResponse);
                console.log('✅ Respuesta enviada con éxito al prospecto');
            }
        }

        return NextResponse.json({ status: 'success' });
    } catch (error: any) {
        console.error('❌ Webhook Error:', error.message);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
