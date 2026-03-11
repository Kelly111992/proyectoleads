const fs = require('fs');
const envContent = fs.readFileSync('d:\\proyectoleads\\.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const idx = line.indexOf('='); if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
});

const EVO_URL = env.EVOLUTION_API_URL;
const EVO_KEY = env.EVOLUTION_API_KEY;
const EVO_INST = env.EVOLUTION_INSTANCE;
const TARGET_URL = 'https://link-inmobiliario-leads.hfsosq.easypanel.host/api/webhook/whatsapp';

async function trySet(endpoint, payload) {
    console.log(`Trying ${endpoint}...`);
    try {
        const res = await fetch(`${EVO_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'apikey': EVO_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        console.log(`Response ${res.status}:`, JSON.stringify(data));
        return res.status;
    } catch (e) {
        console.log(`Error on ${endpoint}:`, e.message);
        return 500;
    }
}

async function run() {
    const p1 = {
        enabled: true,
        url: TARGET_URL,
        webhookByEvents: false,
        events: ["MESSAGES_UPSERT"]
    };

    // Intento 1: /webhook/set/INST
    await trySet(`/webhook/set/${EVO_INST}`, p1);

    // Intento 2: /webhook/instance/INST
    await trySet(`/webhook/instance/${EVO_INST}`, p1);

    // Intento 3: /instance/set/INST con clave webhook
    await trySet(`/instance/set/${EVO_INST}`, { webhook: p1 });

    // Intento 4: /settings/set/INST con clave webhook
    await trySet(`/settings/set/${EVO_INST}`, { webhook: p1 });

    // Intento 5: Sin el campo events
    await trySet(`/webhook/set/${EVO_INST}`, { enabled: true, url: TARGET_URL });
}

run();
