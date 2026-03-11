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

fetch(`${EVO_URL}/webhook/find/${EVO_INST}`, {
    headers: { apikey: EVO_KEY }
})
    .then(r => r.json())
    .then(d => {
        // Buscar el primer webhook
        const webhook = Array.isArray(d) ? d[0] : d;
        console.log('--- WEBHOOK DETALLE ---');
        console.log('URL:', webhook.url);
        console.log('Enabled:', webhook.enabled);
        console.log('Events:', JSON.stringify(webhook.events));
    })
    .catch(e => console.error(e));
