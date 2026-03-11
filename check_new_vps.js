// Verificar instancias en el VPS NUEVO (link-inmobiliario)
const NEW_URL = 'https://link-inmobiliario-evolution-api.hfsosq.easypanel.host';
const KEY = 'B67415CAAFCCE10F7D57E11214309700';

async function check() {
    console.log('=== INSTANCIAS EN VPS NUEVO (hfsosq) ===');

    const r = await fetch(`${NEW_URL}/instance/fetchInstances`, {
        headers: { apikey: KEY }
    });
    const data = await r.json();

    if (Array.isArray(data)) {
        console.log('Total:', data.length);
        data.forEach((inst, i) => {
            console.log(`\n--- Instancia ${i + 1} ---`);
            console.log('Name:', inst.name || inst.instanceName);
            console.log('ID:', inst.id);
            console.log('Status:', JSON.stringify(inst.connectionStatus));
        });
    } else {
        console.log('Respuesta:', JSON.stringify(data));

        // Si la key no sirve, probar con la del .env.local
        const fs = require('fs');
        const envContent = fs.readFileSync('d:\\proyectoleads\\.env.local', 'utf8');
        const env = {};
        envContent.split('\n').forEach(line => {
            const idx = line.indexOf('=');
            if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
        });

        console.log('\nProbando con la key del .env.local...');
        const r2 = await fetch(`${NEW_URL}/instance/fetchInstances`, {
            headers: { apikey: env.EVOLUTION_API_KEY }
        });
        const data2 = await r2.json();
        console.log('Respuesta:', JSON.stringify(data2).substring(0, 500));
    }
}

check().catch(e => console.error(e));
