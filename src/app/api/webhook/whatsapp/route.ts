import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { evolutionApi } from '@/lib/evolution';
import { aiService } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('--- WEBHOOK EVOLUTION RECEIVED (ALTEPSA ALIGNMENT) ---');

        const event = body.event;
        const data = body.data;

        if (event === 'messages.upsert') {
            const key = data?.key || data?.message?.key;
            if (!key) return NextResponse.json({ status: 'ignored' });

            const fromMe = key.fromMe;
            if (!fromMe) {
                const phone = key.remoteJid?.split('@')[0];
                if (!phone) return NextResponse.json({ status: 'ignored' });

                const pushName = data.pushName || 'Prospecto';
                const content = data.message?.conversation
                    || data.message?.extendedTextMessage?.text
                    || data.message?.imageMessage?.caption
                    || 'Mensaje multimedia recibido';

                // ═══ PASO 1: Respuesta IA (Sincronizada con Simulador) ═══
                let aiResponse = await aiService.generateResponse(pushName, content);

                // ═══ PASO 2: CRM - Guardar/Actualizar Lead ═══
                const vendors = ["Arkel Sales", "Claudia Leads", "IA de Ventas"];

                // Buscar si ya existe para no cambiar el agente asignado
                const { data: existingLead } = await supabase
                    .from('leads')
                    .select('assigned_agent')
                    .eq('phone', phone)
                    .single();

                const assignedTo = existingLead?.assigned_agent || vendors[Math.floor(Math.random() * vendors.length)];

                // Upsert para manejar unicidad de teléfono igual que en el simulador
                const { error: upsertErr } = await supabase
                    .from('leads')
                    .upsert([{
                        from_address: `${phone}@whatsapp.net`,
                        from_name: pushName,
                        phone: phone,
                        source: 'whatsapp',
                        body_preview: content,
                        score: 85,
                        stage: 'Nuevo', // Emparejado con STAGES[0] de page.tsx
                        action_status: 'IA_Conversando',
                        assigned_agent: assignedTo
                    }], { onConflict: 'phone' });

                if (upsertErr) console.error('⚠️ CRM Error:', upsertErr.message);

                // ═══ PASO 3: Disparar Automatización Universal (n8n) ═══
                const n8nUrl = process.env.N8N_WEBHOOK_URL;
                if (n8nUrl) {
                    fetch(n8nUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            event: 'lead.created',
                            lead: {
                                id: phone, // temporal si no tenemos el ID real del upsert inmediato
                                from_name: pushName,
                                phone: phone,
                                source: 'whatsapp',
                                body_preview: content
                            }
                        })
                    }).catch(e => console.error('⚠️ n8n WA trigger failed:', e.message));
                }

                // ═══ PASO 4: Enviar respuesta WhatsApp ═══
                try {
                    await evolutionApi.sendMessage(phone, aiResponse);
                } catch (sendErr: any) {
                    console.error('⚠️ WA Send Error:', sendErr.message);
                }
            }
        }

        return NextResponse.json({ status: 'success' });
    } catch (error: any) {
        console.error('❌ Webhook Critical Error:', error.message);
        return NextResponse.json({ status: 'error' }, { status: 500 });
    }
}
