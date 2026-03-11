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
        console.log('webhooks_data:', JSON.stringify(d));
    })
    .catch(e => console.error('Error:', e.message));
