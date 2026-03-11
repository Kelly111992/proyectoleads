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
            // Extraer key de forma robusta (Evolution API v1 y v2)
            const key = data?.key || data?.message?.key;
            if (!key) {
                console.log('No se encontró key en el payload, ignorando.');
                return NextResponse.json({ status: 'ignored', reason: 'no_key' });
            }

            const fromMe = key.fromMe;

            if (!fromMe) {
                const phone = key.remoteJid?.split('@')[0];
                if (!phone) {
                    return NextResponse.json({ status: 'ignored', reason: 'no_phone' });
                }

                const pushName = data.pushName || 'Prospecto';
                const content = data.message?.conversation
                    || data.message?.extendedTextMessage?.text
                    || data.message?.imageMessage?.caption
                    || 'Mensaje multimedia recibido';

                console.log(`📩 Mensaje de: ${pushName} (${phone}): ${content}`);

                // ═══ PASO 1: Generar respuesta IA ═══
                console.log('🤖 Generando respuesta IA...');
                let aiResponse = '';
                try {
                    aiResponse = await aiService.generateResponse(pushName, content);
                    console.log('✅ IA respondió:', aiResponse.substring(0, 80) + '...');
                } catch (aiErr: any) {
                    console.error('⚠️ Error IA, usando fallback:', aiErr.message);
                    aiResponse = `¡Hola ${pushName}! Gracias por tu interés en ALTEPSA. Un asesor te contactará en breve para atenderte.`;
                }

                // ═══ PASO 2: CRM - Guardar Lead ═══
                const { data: existingLead } = await supabase
                    .from('leads')
                    .select('*')
                    .eq('phone', phone)
                    .single();

                if (!existingLead) {
                    // Asignación automática Round Robin
                    const vendedores = ["Arkel Sales", "Claudia Leads", "Elite AI"];
                    const { count } = await supabase.from('leads').select('*', { count: 'exact', head: true });
                    const assignedTo = vendedores[(count || 0) % vendedores.length];
                    console.log(`👤 NUEVO LEAD: ${pushName} → Asignado a: ${assignedTo}`);

                    // Insert básico (campos que seguro existen)
                    const { error: insertErr } = await supabase
                        .from('leads')
                        .insert([{
                            from_name: pushName,
                            phone: phone,
                            source: 'WhatsApp_AI',
                            body_preview: content,
                            score: 85,
                            stage: 'MQL',
                            action_status: 'IA_Respondiendo'
                        }]);

                    if (insertErr) {
                        console.error('⚠️ Error insertando lead:', insertErr.message);
                    } else {
                        console.log('💾 Lead guardado en Supabase');
                        // Intentar agregar campos CRM
                        try {
                            await supabase
                                .from('leads')
                                .update({ assigned_agent: assignedTo })
                                .eq('phone', phone);
                            console.log('📋 Campos CRM asignados');
                        } catch { console.log('ℹ️ Campos CRM opcionales no disponibles'); }
                    }
                } else {
                    console.log(`🔄 Lead existente: ${pushName}`);
                    await supabase
                        .from('leads')
                        .update({
                            body_preview: content,
                            action_status: 'Conversación_IA'
                        })
                        .eq('phone', phone);
                }

                // ═══ PASO 3: Enviar respuesta WhatsApp ═══
                console.log('📱 Enviando respuesta vía Evolution API...');
                try {
                    await evolutionApi.sendMessage(phone, aiResponse);
                    console.log('✅ Respuesta enviada al prospecto');
                } catch (sendErr: any) {
                    console.error('⚠️ Error enviando WhatsApp:', sendErr.message);
                    // No lanzar error - el lead ya se guardó
                }
            }
        }

        return NextResponse.json({ status: 'success' });
    } catch (error: any) {
        console.error('❌ Webhook Error:', error.message);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
