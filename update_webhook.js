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
const TARGET_URL = 'https://link-inmobiliario-leads.hfsosq.easypanel.host/api/webhook/whatsapp';

async function update() {
    console.log('--- Actualizando Webhook via Instance Set ---');

    // El error anterior sugería que "webhook" no debía existir en /webhook/set.
    // Pero en /instance/set es común.
    const payload = {
        webhook: {
            enabled: true,
            url: TARGET_URL,
            webhookByEvents: false,
            events: ["MESSAGES_UPSERT", "MESSAGES_UPDATE", "MESSAGES_DELETE", "SEND_MESSAGE"]
        }
    };

    const res = await fetch(`${EVO_URL}/instance/set/${EVO_INST}`, {
        method: 'POST',
        headers: { 'apikey': EVO_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log('Resultado:', JSON.stringify(data, null, 2));
}

update();
