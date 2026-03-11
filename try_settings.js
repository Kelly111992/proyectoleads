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

async function run() {
    // Probar con settings/set
    const r = await fetch(`${EVO_URL}/settings/set/${encodeURIComponent(INST)}`, {
        method: 'POST',
        headers: { apikey: KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            rejectCall: false,
            groupsIgnore: true,
            alwaysOnline: false,
            readMessages: false,
            readStatus: false,
            syncFullHistory: false,
            webhookUrl: WEBHOOK_URL,
            webhookByEvents: false,
            webhookBase64: false,
            webhookEvents: ["MESSAGES_UPSERT"]
        })
    });
    console.log('settings/set Status:', r.status);
    const d = await r.text();
    console.log('Response:', d.substring(0, 500));
}

run();
