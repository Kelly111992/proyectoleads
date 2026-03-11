const { createClient } = require('@supabase/supabase-js');
const sb = createClient(
    'https://kbdmbejefpldfjybusbd.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZG1iZWplZnBsZGZqeWJ1c2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MDUxMzEsImV4cCI6MjA4MzQ4MTEzMX0.425rGBN9Jw-OmFNDm5yflVZI9DUPmXffMHMTK9RfJIw'
);

(async () => {
    // Buscar un lead guardado recientemente
    const { data } = await sb.from('leads').select('*').order('created_at', { ascending: false }).limit(20);
    const set = new Set();
    data.forEach(l => {
        set.add(l.source);
    });
    console.log('Sources actuales en tabla leads:', Array.from(set));

    // Si el usuario acaba de escribir un mensaje de prueba al whatsapp...
    const { data: q } = await sb.from('leads').select('*').limit(3).order('created_at', { ascending: false });
    q.forEach(x => {
        console.log(`[${x.created_at}] source: ${x.source}, from_name: ${x.from_name}, phone: ${x.phone}`);
    });
})();
