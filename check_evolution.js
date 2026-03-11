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

// Listar instancias con detalle completo
fetch(EVO_URL + '/instance/fetchInstances', {
    headers: { apikey: EVO_KEY }
})
    .then(r => r.json())
    .then(instances => {
        console.log('Total instancias:', instances.length);
        instances.forEach((inst, i) => {
            console.log('');
            console.log('--- Instancia', i + 1, '---');
            console.log('Name:', inst.name || inst.instanceName);
            console.log('ID:', inst.id);
            console.log('Status:', JSON.stringify(inst.connectionStatus || 'N/A'));
        });

        // Intentar reconectar la instancia
        const instName = instances[0]?.name || instances[0]?.instanceName || EVO_INST;
        console.log('');
        console.log('=== Intentando reconectar:', instName, '===');

        return fetch(EVO_URL + '/instance/connect/' + instName, {
            headers: { apikey: EVO_KEY }
        });
    })
    .then(r => r.json())
    .then(d => {
        console.log('Reconexion resultado:', JSON.stringify(d, null, 2));
        if (d.base64) {
            console.log('');
            console.log('QR CODE GENERADO - Escanea con WhatsApp para reconectar');
            console.log('(Abre este QR en el navegador o escanea desde la app de WhatsApp)');
        }
    })
    .catch(e => console.error('Error:', e.message));
