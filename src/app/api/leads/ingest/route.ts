import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, phone, source, meta_campaign, web_url, message } = body;

        // 1. Validar y Normalizar Source
        const validSources = ['facebook', 'web', 'whatsapp', 'telefono'];
        const normalizedSource = validSources.includes(source?.toLowerCase())
            ? source.toLowerCase()
            : 'web';

        console.log(`🚀 Ingesting Lead [${normalizedSource}]: ${name} (${phone})`);

        // 2. Guardar en Supabase (Fuente de Verdad)
        const { data: lead, error: dbError } = await supabase
            .from('leads')
            .upsert([{
                from_name: name || 'Prospecto Nuevo',
                phone: phone,
                source: normalizedSource,
                body_preview: message || (normalizedSource === 'facebook' ? `Camp: ${meta_campaign}` : `Origen: ${web_url}`),
                stage: 'Nuevo',
                action_status: 'Pendiente Automatización',
                score: 75,
                assigned_agent: 'IA de Ventas' // Asignación por defecto para IA
            }], { onConflict: 'phone' })
            .select()
            .single();

        if (dbError) throw dbError;

        // 3. Disparar Trigger a n8n
        const n8nUrl = process.env.N8N_WEBHOOK_URL;
        if (n8nUrl) {
            try {
                // No esperamos la respuesta de n8n para no bloquear la ingesta
                fetch(n8nUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: 'lead.created',
                        lead: lead,
                        metadata: {
                            campaign: meta_campaign || null,
                            url: web_url || null
                        }
                    })
                }).catch(e => console.error('⚠️ n8n Webhook failed:', e.message));
            } catch (err) {
                console.error('⚠️ Error disparando n8n:', err);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Lead registrado y automatización disparada',
            lead_id: lead.id
        });

    } catch (error: any) {
        console.error('❌ Ingest Error:', error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
