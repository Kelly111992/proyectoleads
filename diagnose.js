const fs = require('fs');
const envContent = fs.readFileSync('d:\\proyectoleads\\.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const idx = line.indexOf('=');
    if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
});

console.log('=== VALORES ACTUALES EN .env.local ===');
console.log('EVOLUTION_API_URL:', env.EVOLUTION_API_URL);
console.log('EVOLUTION_API_KEY:', env.EVOLUTION_API_KEY ? env.EVOLUTION_API_KEY.substring(0, 15) + '...' : 'NO DEFINIDA');
console.log('EVOLUTION_INSTANCE:', env.EVOLUTION_INSTANCE);
console.log('');

// Verificar AMBAS URLs posibles
const urls = [
    { label: 'VPS VIEJO (ckoomq)', url: env.EVOLUTION_API_URL },
    { label: 'VPS NUEVO (hfsosq)', url: 'https://link-inmobiliario-evolution-api.hfsosq.easypanel.host' }
];

async function checkAll() {
    for (const u of urls) {
        console.log(`--- ${u.label} ---`);
        console.log(`URL: ${u.url}`);
        try {
            const r = await fetch(`${u.url}/instance/fetchInstances`, {
                headers: { apikey: env.EVOLUTION_API_KEY }
            });
            const data = await r.json();

            if (Array.isArray(data)) {
                data.forEach(inst => {
                    console.log(`  Instancia: ${inst.name || inst.instanceName}`);
                    console.log(`  Estado: ${JSON.stringify(inst.connectionStatus || 'N/A')}`);
                });
            } else {
                console.log('  Respuesta:', JSON.stringify(data).substring(0, 200));
            }
        } catch (e) {
            console.log('  Error:', e.message);
        }
        console.log('');
    }

    // Tambien probar envio con cada URL
    for (const u of urls) {
        console.log(`--- TEST ENVIO con ${u.label} ---`);
        try {
            const r = await fetch(`${u.url}/message/sendText/${env.EVOLUTION_INSTANCE}`, {
                method: 'POST',
                headers: { apikey: env.EVOLUTION_API_KEY, 'Content-Type': 'application/json' },
                body: JSON.stringify({ number: '5213318213624', text: 'Test conexion ALTEPSA' })
            });
            const data = await r.json();
            console.log(`  Status: ${r.status}`, JSON.stringify(data).substring(0, 150));
        } catch (e) {
            console.log('  Error:', e.message);
        }
        console.log('');
    }
}

checkAll();
