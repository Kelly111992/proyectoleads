const fs = require('fs');
const envContent = fs.readFileSync('d:\\proyectoleads\\.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const idx = line.indexOf('=');
    if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
});

const EVO_URL = env.EVOLUTION_API_URL;
const EVO_KEY = env.EVOLUTION_API_KEY;
const EVO_INST = env.EVOLUTION_INSTANCE;
const TARGET_WEBHOOK_URL = 'https://link-inmobiliario-leads.hfsosq.easypanel.host/api/webhook/whatsapp';

async function updateWebhook() {
    console.log('--- Configurando Webhook Real ---');

    const payload = {
        enabled: true,
        url: TARGET_WEBHOOK_URL,
        webhookByEvents: false, // Usar un solo webhook para todos los eventos
        events: [
            "MESSAGES_UPSERT",
            "MESSAGES_UPDATE",
            "MESSAGES_DELETE",
            "SEND_MESSAGE"
        ]
    };

    try {
        const res = await fetch(`${EVO_URL}/webhook/set/${EVO_INST}`, {
            method: 'POST',
            headers: {
                'apikey': EVO_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log('Resultado del Set Webhook:', JSON.stringify(data, null, 2));

        if (data.status === 'SUCCESS' || data.url) {
            console.log('\n✅ WEBHOOK CONFIGURADO EXITOSAMENTE');
            console.log('URL:', TARGET_WEBHOOK_URL);
            console.log('Eventos: MESSAGES_UPSERT (activado)');
        }
    } catch (e) {
        console.error('Error configurando webhook:', e.message);
    }
}

updateWebhook();
