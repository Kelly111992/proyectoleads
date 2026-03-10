import Groq from "groq-sdk";

export const aiService = {
    async generateResponse(customerName: string, message: string) {
        try {
            // Inicialización Lazy: Esto asegura que Groq SOLO se instancie
            // cuando se llama a esta función (que ocurre dentro del webhook/servidor)
            const groq = new Groq({
                apiKey: process.env.GROQ_API_KEY || "",
            });

            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `Eres el Agente Inteligente Elite de CLAVE.AI, una empresa líder en automatización y gestión de leads con tecnología futurista. 
            Tu objetivo es interactuar con prospectos que escriben por WhatsApp de manera profesional, persuasiva y orientada a ventas.
            
            REGLAS DE ORO:
            1. Tono: Innovador, tecnológico, futurista y extremadamente profesional.
            2. Objetivo Principal: Calificar al lead y buscar agendar una llamada o demostración.
            3. Personalización: Usa el nombre del cliente (${customerName}) si está disponible.
            4. Brevedad: Mantén las respuestas cortas y directas (máximo 3 párrafos).
            5. Identidad: Eres "CLAVE_AI Bot". Nunca digas que eres un modelo de lenguaje de Groq o Llama.
            
            FLUJO DE CONVERSACIÓN:
            - Si es el primer mensaje: Saluda con entusiasmo y menciona cómo CLAVE.AI puede escalar su negocio.
            - Si pregunta por precios o servicios: Enfócate en el valor y el ROI antes de pedir agendar una llamada para dar una cotización personalizada.
            - Si el mensaje es confuso: Intenta entender su necesidad de negocio principal.
            
            RESPONDE SIEMPRE EN ESPAÑOL.`
                    },
                    {
                        role: "user",
                        content: `Mensaje del cliente (${customerName}): ${message}`
                    }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                max_tokens: 512,
                top_p: 1,
            });

            return completion.choices[0]?.message?.content || "Lo siento, tuve un problema procesando tu mensaje. Un asesor humano te contactará pronto.";
        } catch (error) {
            console.error("Error en Groq AI Service:", error);
            return "¡Hola! He recibido tu mensaje. En un momento uno de nuestros especialistas te atenderá personalmente. 🚀";
        }
    }
};
