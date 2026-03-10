
const axios = require('axios');
require('dotenv').config({ path: 'd:/proyectoleads/.env.local' });

async function createNewInstance() {
    const url = "https://evolutionapi-evolution-api.ckoomq.easypanel.host/instance/create";
    const key = "429683C4C977415CAAFCCE10F7D57E11";
    const newName = "claveai2";

    console.log(`--- CREANDO INSTANCIA: ${newName} ---`);

    try {
        const response = await axios.post(url, {
            instanceName: newName,
            token: "", // Opcional, se genera automáticamente si está vacío
            qrcode: true
        }, {
            headers: {
                apikey: key,
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ INSTANCIA CREADA:', JSON.stringify(response.data, null, 2));
        console.log('\n🚀 ACCIÓN REQUERIDA: Escanea el código QR que aparece en tu panel para la nueva instancia "claveai2".');
    } catch (error) {
        console.error('❌ ERROR AL CREAR:', error.response ? error.response.data : error.message);
    }
}

createNewInstance();
