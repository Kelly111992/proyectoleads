const fs = require('fs');
const envContent = fs.readFileSync('d:\\proyectoleads\\.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const idx = line.indexOf('=');
    if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
});

const EVO_URL = env.EVOLUTION_API_URL;
const KEY = env.EVOLUTION_API_KEY;
const INST = env.EVOLUTION_INSTANCE;
const WEBHOOK_URL = 'https://link-inmobiliario-leads.hfsosq.easypanel.host/api/webhook/whatsapp';

async function setWebhook() {
    console.log('=== Configurando Webhook ===');
    console.log('Instancia:', INST);
    console.log('Webhook URL:', WEBHOOK_URL);

    // Primero ver config actual
    const findRes = await fetch(`${EVO_URL}/webhook/find/${encodeURIComponent(INST)}`, {
        headers: { apikey: KEY }
    });
    const current = await findRes.json();
    console.log('Config actual:', JSON.stringify(current).substring(0, 300));

    // Configurar - usar el formato correcto
    const setRes = await fetch(`${EVO_URL}/webhook/set/${encodeURIComponent(INST)}`, {
        method: 'PUT',
        headers: { apikey: KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            enabled: true,
            url: WEBHOOK_URL,
            webhookByEvents: false,
            events: ["MESSAGES_UPSERT"]
        })
    });
    const setData = await setRes.json();
    console.log('Set resultado (PUT):', JSON.stringify(setData).substring(0, 300));

    // Verificar
    const verifyRes = await fetch(`${EVO_URL}/webhook/find/${encodeURIComponent(INST)}`, {
        headers: { apikey: KEY }
    });
    const verify = await verifyRes.json();
    console.log('Verificacion:', JSON.stringify(verify).substring(0, 300));
}

setWebhook().catch(e => console.error(e));
