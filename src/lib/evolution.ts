import axios from 'axios';

const evolutionUrl = process.env.EVOLUTION_API_URL;
const evolutionKey = process.env.EVOLUTION_API_KEY;
const instance = process.env.EVOLUTION_INSTANCE;

export const evolutionApi = {
    sendMessage: async (phone: string, text: string) => {
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
                        text: text,
                    },
                },
                {
                    headers: {
                        apikey: evolutionKey,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            throw error;
        }
    },

    sendMedia: async (phone: string, mediaUrl: string, caption: string) => {
        // Implementación futura segun necesidades de CLAVE.AI
    }
};
