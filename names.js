const fs = require('fs');
const envContent = fs.readFileSync('d:\\proyectoleads\\.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const idx = line.indexOf('=');
    if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
});

const KEY = env.EVOLUTION_API_KEY;
const NEW_URL = 'https://link-inmobiliario-evolution-api.hfsosq.easypanel.host';

fetch(`${NEW_URL}/instance/fetchInstances`, { headers: { apikey: KEY } })
    .then(r => r.json())
    .then(data => {
        // Si es array
        const list = Array.isArray(data) ? data : [data];
        list.forEach((inst, i) => {
            console.log(`=== Instancia ${i + 1} ===`);
            console.log('name:', inst.name);
            console.log('id:', inst.id);
            console.log('connectionStatus:', inst.connectionStatus);
            console.log('');
        });
    })
    .catch(e => console.error(e));
