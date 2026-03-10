import axios from 'axios';

const evolutionUrl = process.env.EVOLUTION_API_URL;
const evolutionKey = process.env.EVOLUTION_API_KEY;
const instance = process.env.EVOLUTION_INSTANCE;

export const evolutionApi = {
    sendMessage: async (phone: string, text: string) => {
        try {
            // Limpiar el número: solo dígitos
            let cleanPhone = phone.replace(/\D/g, '');

            // Lógica específica para México: asegurar formato 521 + 10 dígitos o 52 + 10 dígitos
            if (cleanPhone.startsWith('52') && cleanPhone.length === 12) {
                // Si es 52 + 10 dígitos, a veces requiere el '1' intermedio (521)
                cleanPhone = '521' + cleanPhone.substring(2);
            } else if (cleanPhone.length === 10) {
                cleanPhone = '521' + cleanPhone;
            }

            const response = await axios.post(
                `${evolutionUrl}/message/sendText/${instance}`,
                {
                    number: cleanPhone,
                    text: text // Usando estructura simplificada compatible con V1/V2
                },
                {
                    headers: {
                        apikey: evolutionKey,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error('Error sending WhatsApp message:', error.response?.data || error.message);
            throw error;
        }
    },

    sendMedia: async (phone: string, mediaUrl: string, caption: string) => {
        // Implementación futura segun necesidades de CLAVE.AI
    }
};
