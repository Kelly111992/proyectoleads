
const axios = require('axios');
require('dotenv').config({ path: 'd:/proyectoleads/.env.local' });

async function listInstances() {
    const evolutionUrl = process.env.EVOLUTION_API_URL;
    const evolutionKey = process.env.EVOLUTION_API_KEY;

    console.log(`--- LISTANDO INSTANCIAS EN: ${evolutionUrl} ---`);

    try {
        const response = await axios.get(
            `${evolutionUrl}/instance/fetchInstances`,
            {
                headers: {
                    apikey: evolutionKey
                }
            }
        );
        console.log('✅ NOMBRES DE INSTANCIAS:', response.data.map(i => i.instanceName || i.name));
    } catch (error) {
        console.error('❌ ERROR AL LISTAR:', error.response ? error.response.data : error.message);
    }
}

listInstances();
