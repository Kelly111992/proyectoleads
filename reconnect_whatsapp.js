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

async function reconnect() {
    console.log('=== RECONECTANDO WHATSAPP ===');
    console.log('API:', EVO_URL);
    console.log('Instancia:', EVO_INST);
    console.log('');

    // 1. Ver estado actual
    const stateRes = await fetch(`${EVO_URL}/instance/connectionState/${EVO_INST}`, {
        headers: { apikey: EVO_KEY }
    });
    const state = await stateRes.json();
    console.log('Estado actual:', JSON.stringify(state));

    // 2. Intentar reconectar
    console.log('');
    console.log('Solicitando reconexion...');
    const connectRes = await fetch(`${EVO_URL}/instance/connect/${EVO_INST}`, {
        headers: { apikey: EVO_KEY }
    });
    const connectData = await connectRes.json();

    if (connectData.base64) {
        // Guardar QR como HTML para que el usuario lo vea facil
        const html = `<!DOCTYPE html>
<html><head><title>ALTEPSA - Escanear QR</title></head>
<body style="display:flex;justify-content:center;align-items:center;min-height:100vh;background:#111;flex-direction:column;font-family:sans-serif;">
<h1 style="color:#E30613;margin-bottom:20px;">ALTEPSA - Reconectar WhatsApp</h1>
<p style="color:white;margin-bottom:30px;">Abre WhatsApp > Dispositivos vinculados > Vincular dispositivo</p>
<img src="${connectData.base64}" style="width:400px;height:400px;border-radius:20px;border:4px solid #E30613;" />
<p style="color:#888;margin-top:20px;">Escanea este QR con tu telefono</p>
</body></html>`;

        fs.writeFileSync('d:\\proyectoleads\\qr_reconnect.html', html);
        console.log('');
        console.log('QR GENERADO! Abre este archivo en tu navegador:');
        console.log('d:\\proyectoleads\\qr_reconnect.html');
        console.log('');
        console.log('Instrucciones:');
        console.log('1. Abre WhatsApp en tu telefono');
        console.log('2. Ve a Configuracion > Dispositivos vinculados');
        console.log('3. Toca "Vincular un dispositivo"');
        console.log('4. Escanea el QR que aparece en el archivo HTML');
    } else if (connectData.state === 'open' || connectData.instance?.state === 'open') {
        console.log('YA ESTA CONECTADO! Estado: open');
        console.log('Respuesta:', JSON.stringify(connectData));
    } else {
        console.log('Respuesta completa:', JSON.stringify(connectData, null, 2));
    }
}

reconnect().catch(e => console.error('Error:', e.message));
