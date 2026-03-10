
const axios = require('axios');
require('dotenv').config({ path: 'd:/proyectoleads/.env.local' });

async function sendFinalTest() {
    const url = "https://evolutionapi-evolution-api.ckoomq.easypanel.host/message/sendText/claveai";
    const key = "429683C4C977415CAAFCCE10F7D57E11";
    const phone = "5213318213624";

    console.log(`--- ENVIANDO A ${phone} CON FORMATO 521 ---`);

    try {
        const response = await axios.post(url, {
            number: phone,
            textMessage: {
                text: "Validación Elite 🚀 Formato 521 aplicado directamente desde script. Confirma recepción."
            }
        }, {
            headers: {
                apikey: key,
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ RESPUESTA SERVIDOR:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ ERROR DETALLADO:', error.response ? error.response.data : error.message);
    }
}

sendFinalTest();
