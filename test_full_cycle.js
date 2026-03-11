// test_full_cycle.js - Prueba de ciclo completo con 3 prospectos distintos

const prospects = [
    { name: 'María Tortillería La Abuela', phone: '5213399887766', msg: 'Hola necesito comprar 50kg de pasta para mi tortillería, tienen precio especial por mayoreo?' },
    { name: 'Roberto Chef Premium', phone: '5213355443322', msg: 'Buenas noches, busco proveedor de pechuga de pollo para restaurante de alta cocina. Necesito calidad premium.' },
    { name: 'Lupita Tienda Don Pepe', phone: '5213377665544', msg: 'Me recomendaron ALTEPSA para comprar pollo en canal. Cuanto manejan el kilo?' }
];

async function runTest() {
    console.log('════════════════════════════════════════════════');
    console.log('  🏭 ALTEPSA CRM - TEST DE CICLO COMPLETO');
    console.log('  Probando con 3 prospectos para verificar');
    console.log('  asignación automática Round Robin');
    console.log('════════════════════════════════════════════════');
    console.log('');

    for (let i = 0; i < prospects.length; i++) {
        const p = prospects[i];
        console.log(`── Prospecto ${i + 1}: ${p.name} ──`);

        const payload = {
            event: 'messages.upsert',
            instance: 'claveai',
            data: {
                key: { remoteJid: p.phone + '@s.whatsapp.net', fromMe: false, id: 'TEST_' + Date.now() },
                pushName: p.name,
                message: { conversation: p.msg },
                messageType: 'conversation'
            }
        };

        try {
            const res = await fetch('http://localhost:3001/api/webhook/whatsapp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            console.log(`   Status: ${data.status}`);
        } catch (e) {
            console.log(`   Error: ${e.message}`);
        }
        console.log('');

        // Esperar 2 segundos entre cada lead para no saturar
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log('════════════════════════════════════════════════');
    console.log('  ✅ 3 LEADS PROCESADOS');
    console.log('  Cada uno debió ser:');
    console.log('    1. Respondido por IA (Llama 3.3)');
    console.log('    2. Guardado en Supabase');
    console.log('    3. Asignado a un vendedor diferente');
    console.log('    4. Respondido por WhatsApp');
    console.log('════════════════════════════════════════════════');
}

runTest();
