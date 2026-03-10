
const axios = require('axios');
require('dotenv').config({ path: 'd:/proyectoleads/.env.local' });

async function testWhatsApp() {
    const evolutionUrl = process.env.EVOLUTION_API_URL;
    const evolutionKey = process.env.EVOLUTION_API_KEY;
    const instance = process.env.EVOLUTION_INSTANCE;
    const phone = "5213318213624";
    const message = "Prueba final 🚀 Si recibiste esto, la integración de CLAVE.AI es un éxito total.";

    console.log(`Intentando enviar mensaje a ${phone}...`);
    console.log(`URL: ${evolutionUrl}`);
    console.log(`Instancia: ${instance}`);

    try {
        const response = await axios.post(
            `${evolutionUrl}/message/sendText/${instance}`,
            {
                number: phone,
                options: {
                    delay: 1200,
                    presence: 'composing',
                    linkPreview: false,
                },
                textMessage: {
                    text: message,
                },
            },
            {
                headers: {
                    apikey: evolutionKey,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('✅ Mensaje enviado con éxito:', response.data);
    } catch (error) {
        console.error('❌ Error enviando mensaje:', error.response ? error.response.data : error.message);
    }
}

testWhatsApp();
