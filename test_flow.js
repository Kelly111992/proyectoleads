const payload = {
    event: 'messages.upsert',
    instance: 'claveai2',
    data: {
        key: { remoteJid: '5213318213624@s.whatsapp.net', fromMe: false, id: 'REAL_' + Date.now() },
        pushName: 'Carlos Restaurante GDL',
        message: { conversation: 'Buenas tardes, necesito cotizacion de pechuga deshuesada' },
        messageType: 'conversation'
    }
};

fetch('http://localhost:3001/api/webhook/whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
})
    .then(r => r.text())
    .then(d => console.log('FULL RESPONSE:', d))
    .catch(e => console.error('Error:', e.message));
