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

async function tryAll() {
    const endpoints = [
        { method: 'POST', path: `/webhook/set/${encodeURIComponent(INST)}` },
        { method: 'PUT', path: `/webhook/set/${encodeURIComponent(INST)}` },
        { method: 'POST', path: `/instance/update/${encodeURIComponent(INST)}` },
        { method: 'PUT', path: `/instance/update/${encodeURIComponent(INST)}` },
    ];

    const payloads = [
        { enabled: true, url: WEBHOOK_URL, webhookByEvents: false, events: ["MESSAGES_UPSERT"] },
        { webhook: { enabled: true, url: WEBHOOK_URL, webhookByEvents: false, events: ["MESSAGES_UPSERT"] } },
    ];

    for (const ep of endpoints) {
        for (const payload of payloads) {
            try {
                const r = await fetch(`${EVO_URL}${ep.path}`, {
                    method: ep.method,
                    headers: { apikey: KEY, 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const d = await r.json();
                const hasWebhook = JSON.stringify(payload).includes('"webhook"');
                console.log(`${ep.method} ${ep.path} [${hasWebhook ? 'nested' : 'flat'}] => ${r.status}: ${JSON.stringify(d).substring(0, 100)}`);
            } catch (e) {
                console.log(`${ep.method} ${ep.path} => ERROR: ${e.message}`);
            }
        }
    }
}

tryAll();
