
const axios = require('axios');
require('dotenv').config({ path: 'd:/proyectoleads/.env.local' });

async function multidimensionalTest() {
    const url = "https://evolutionapi-evolution-api.ckoomq.easypanel.host/message/sendText/claveai";
    const key = "429683C4C977415CAAFCCE10F7D57E11";
    const baseNumber = "3318213624";

    // Formatos a probar
    const formats = [
        "521" + baseNumber, // Formato móvil México estándar con 1
        "52" + baseNumber,  // Formato WhatsApp oficial (a veces sin el 1)
        baseNumber          // Formato local (poco probable pero por si acaso)
    ];

    for (const phone of formats) {
        console.log(`--- PROBANDO FORMATO: ${phone} ---`);
        try {
            const response = await axios.post(url, {
                number: phone,
                textMessage: {
                    text: `Test CLAVE.AI - Formato: ${phone}. Responde si te llega alguno.`
                }
            }, {
                headers: {
                    apikey: key,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`✅ ${phone}: Enviado`);
        } catch (error) {
            console.error(`❌ ${phone}: Error`, error.response ? error.response.data : error.message);
        }
    }
}

multidimensionalTest();
