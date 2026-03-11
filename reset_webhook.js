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

async function run() {
    console.log('--- Reseteando Webhook ---');

    // 1. Intentar ver que hay
    const findRes = await fetch(`${EVO_URL}/webhook/find/${EVO_INST}`, { headers: { apikey: EVO_KEY } });
    const current = await findRes.json();
    console.log('Actual:', JSON.stringify(current));

    // 2. Configurar (sin el campo events si falla)
    const payload = {
        url: TARGET_URL,
        enabled: true,
        webhookByEvents: false,
        events: ["MESSAGES_UPSERT"]
    };

    console.log('Configurando con URL:', TARGET_URL);
    const setRes = await fetch(`${EVO_URL}/webhook/set/${EVO_INST}`, {
        method: 'POST',
        headers: { 'apikey': EVO_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const resData = await setRes.json();
    console.log('Resultado:', JSON.stringify(resData, null, 2));
}

run();
