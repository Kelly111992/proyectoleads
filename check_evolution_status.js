
const axios = require('axios');
require('dotenv').config({ path: 'd:/proyectoleads/.env.local' });

async function checkStatus() {
    const evolutionUrl = process.env.EVOLUTION_API_URL;
    const evolutionKey = process.env.EVOLUTION_API_KEY;
    const instance = process.env.EVOLUTION_INSTANCE;

    console.log(`--- REVISANDO ESTADO DE INSTANCIA: ${instance} ---`);

    try {
        const response = await axios.get(
            `${evolutionUrl}/instance/connectionStatus/${instance}`,
            {
                headers: {
                    apikey: evolutionKey
                }
            }
        );
        console.log('✅ ESTADO DE CONEXIÓN:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ ERROR AL CONSULTAR ESTADO:', error.response ? error.response.data : error.message);
    }
}

checkStatus();
