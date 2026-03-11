const fs = require('fs');
const envContent = fs.readFileSync('d:\\proyectoleads\\.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const idx = line.indexOf('='); if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
});

const EVO_URL = env.EVOLUTION_API_URL;
const EVO_KEY = env.EVOLUTION_API_KEY;
const EVO_INST = env.EVOLUTION_INSTANCE;

console.log('Probando envio manual...');
fetch(`${EVO_URL}/message/sendText/${EVO_INST}`, {
    method: 'POST',
    headers: { 'apikey': EVO_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
        number: '5213318213624',
        text: 'Hola, prueba de envio manual desde el servidor.'
    })
})
    .then(r => r.json())
    .then(d => console.log('Resultado:', JSON.stringify(d)))
    .catch(e => console.error(e));
