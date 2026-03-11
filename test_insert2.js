const { createClient } = require('@supabase/supabase-js');
const sb = createClient(
    'https://kbdmbejefpldfjybusbd.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZG1iZWplZnBsZGZqeWJ1c2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MDUxMzEsImV4cCI6MjA4MzQ4MTEzMX0.425rGBN9Jw-OmFNDm5yflVZI9DUPmXffMHMTK9RfJIw'
);

(async () => {
    // Intenta insertar manualmente para ver el error
    const { data, error } = await sb.from('leads').insert([{
        from_address: '123456789@whatsapp.net',
        from_name: 'Test_ALTEPSA',
        phone: '123456789',
        source: 'WhatsApp_AI',
        body_preview: 'hola',
        score: 85,
        stage: 'MQL',
        action_status: 'IA_Respondiendo'
    }]).select();

    if (error) {
        console.error('Error insertando:', error);
    } else {
        console.log('Insertado exitosamente:', data);

        // Limpiar
        await sb.from('leads').delete().eq('from_name', 'Test_ALTEPSA');
    }
})();
