
const LEAD_DATA = {
    event: 'messages.upsert',
    instance: 'claveai2',
    data: {
        key: {
            remoteJid: '5213312345678@s.whatsapp.net',
            fromMe: false,
            id: 'ABC123XYZ'
        },
        pushName: 'Carlos Distribuidor',
        message: {
            conversation: 'Hola, me interesa comprar 500kg de pechuga de pollo para mi restaurante. ¿Tienen precios de mayoreo?'
        },
        messageType: 'conversation'
    }
};

async function simulate() {
    console.log('🚀 Iniciando simulación de lead real para ALTEPSA...');

    try {
        const response = await fetch('http://localhost:3000/api/webhook/whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(LEAD_DATA)
        });

        const result = await response.json();
        console.log('✅ Webhook procesado:', result);
        console.log('\n--- Flujo Realizado ---');
        console.log('1. Entrada: Mensaje de WhatsApp recibido.');
        console.log('2. IA: Procesando respuesta con Llama 3.3...');
        console.log('3. CRM: Creando lead y auto-asignando vendedor...');
        console.log('4. Salida: Respuesta enviada por WhatsApp.');
    } catch (error) {
        console.error('❌ Error en simulación:', error.message);
    }
}

simulate();
