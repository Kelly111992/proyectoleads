const { createClient } = require('@supabase/supabase-js');
const sb = createClient(
    'https://kbdmbejefpldfjybusbd.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZG1iZWplZnBsZGZqeWJ1c2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MDUxMzEsImV4cCI6MjA4MzQ4MTEzMX0.425rGBN9Jw-OmFNDm5yflVZI9DUPmXffMHMTK9RfJIw'
);

async function check() {
    const { data } = await sb.from('leads').select('*').limit(1);
    if (data && data[0]) {
        const cols = Object.keys(data[0]);
        console.log('COLUMNAS_LEADS:', cols.join('|'));
    }

    const { data: vd } = await sb.from('elite_leads_view').select('*').limit(1);
    if (vd && vd[0]) {
        const cols = Object.keys(vd[0]);
        console.log('COLUMNAS_VIEW:', cols.join('|'));
    }
}

check();
