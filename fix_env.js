const fs = require('fs');
const envPath = 'd:\\proyectoleads\\.env.local';
let envContent = fs.readFileSync(envPath, 'utf8');

// Reemplazar EVOLUTION_API_URL
envContent = envContent.replace(
    /EVOLUTION_API_URL=.*/,
    'EVOLUTION_API_URL=https://link-inmobiliario-evolution-api.hfsosq.easypanel.host'
);

// Reemplazar EVOLUTION_INSTANCE
envContent = envContent.replace(
    /EVOLUTION_INSTANCE=.*/,
    'EVOLUTION_INSTANCE=Link Inmobiliario'
);

fs.writeFileSync(envPath, envContent);
console.log('ENV ACTUALIZADO!');
console.log('');

// Verificar
const env = {};
envContent.split('\n').forEach(line => {
    const idx = line.indexOf('=');
    if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
});
console.log('EVOLUTION_API_URL:', env.EVOLUTION_API_URL);
console.log('EVOLUTION_INSTANCE:', env.EVOLUTION_INSTANCE);
console.log('');
console.log('Probando envio de mensaje de prueba...');

const KEY = env.EVOLUTION_API_KEY;
fetch(`${env.EVOLUTION_API_URL}/message/sendText/${encodeURIComponent(env.EVOLUTION_INSTANCE)}`, {
    method: 'POST',
    headers: { apikey: KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ number: '5213318213624', text: 'ALTEPSA CRM conectado exitosamente. Sistema operativo.' })
})
    .then(r => r.json())
    .then(d => console.log('RESULTADO ENVIO:', JSON.stringify(d).substring(0, 200)))
    .catch(e => console.error('Error:', e.message));
