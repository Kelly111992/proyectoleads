const { createClient } = require('@supabase/supabase-js');
const sb = createClient(
    'https://kbdmbejefpldfjybusbd.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZG1iZWplZnBsZGZqeWJ1c2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MDUxMzEsImV4cCI6MjA4MzQ4MTEzMX0.425rGBN9Jw-OmFNDm5yflVZI9DUPmXffMHMTK9RfJIw'
);

async function check() {
    console.log('=== LEADS DE WHATSAPP AI ===');
    const { data: leads } = await sb.from('leads').select('*').eq('source', 'WhatsApp_AI').order('created_at', { ascending: false }).limit(5);
    if (leads && leads.length > 0) {
        leads.forEach(l => {
            console.log(l.id, l.from_name, l.phone, l.source, l.body_preview, l.action_status);
        });
    } else {
        console.log('No hay leads con source=WhatsApp_AI');
    }

    console.log('\n=== ELITE LEADS VIEW ===');
    const { data: viewData } = await sb.from('elite_leads_view').select('*').order('created_at', { ascending: false }).limit(5);
    if (viewData && viewData.length > 0) {
        viewData.forEach(l => {
            console.log(l.id, l.name, l.phone, l.source, l.status, l.agent);
        });
    } else {
        console.log('La vista elite_leads_view esta vacia');
    }
}

check();
