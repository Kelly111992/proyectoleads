const { createClient } = require('@supabase/supabase-js');
const sb = createClient(
    'https://kbdmbejefpldfjybusbd.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZG1iZWplZnBsZGZqeWJ1c2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MDUxMzEsImV4cCI6MjA4MzQ4MTEzMX0.425rGBN9Jw-OmFNDm5yflVZI9DUPmXffMHMTK9RfJIw'
);

async function check() {
    const { data: leads } = await sb.from('elite_leads_view').select('*').limit(1);
    if (leads && leads.length > 0) {
        Object.keys(leads[0]).forEach(k => console.log('col:', k));
    }
}
check();
