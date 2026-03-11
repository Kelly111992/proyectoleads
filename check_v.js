const fs = require('fs');
const envContent = fs.readFileSync('d:\\proyectoleads\\.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const idx = line.indexOf('=');
    if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
});

const EVO_URL = env.EVOLUTION_API_URL;
const EVO_KEY = env.EVOLUTION_API_KEY;

async function run() {
    const r = await fetch(`${EVO_URL}/instance/fetchInstances`, {
        headers: { apikey: EVO_KEY }
    });
    console.log('--- Headers ---');
    r.headers.forEach((v, k) => console.log(`${k}: ${v}`));
}

run();
