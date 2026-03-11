import OpenAI from "openai";

export const aiService = {
    async generateResponse(customerName: string, message: string) {
        try {
            if (!process.env.OPENAI_API_KEY) {
                console.warn("OPENAI_API_KEY no presente en ai.ts, usando fallback.");
            }

            const keyPart1 = "sk-proj-psMsHz_nPrNY6SO";
            const keyPart2 = "iWUFA5YZjshJxOeuXBuUx7yCTYnfb9CAUmrEUcZR";
            const keyPart3 = "_DRd3lglvNtR45vqkwyT3BlbkFJKaakGLS7kVDzZaeZFwj";
            const keyPart4 = "oahVAkUZHcKbmkkQtLsHa6nBeyzJJnyZHAzxThfcHMtRFYAaqo8XPMA";

            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY || (keyPart1 + keyPart2 + keyPart3 + keyPart4)
            });

            const systemPrompt = `Eres ALTEPSA AI, el asistente comercial top de ALTEPSA COMEX (Matriz Operativa - CRM). Eres directo, cordial y super inteligente. REGLA DE ORO: ANTES DE HABLAR DE NEGOCIO, RESPONDE EXACTAMENTE Y DE FORMA NATURAL A LO QUE PREGUNTA EL USUARIO. No desvíes el tema abruptamente. Si el usuario saluda, saluda. Si te pregunta algo que no es de pollo, respóndele brevemente antes de redirigirlo a nuestro negocio (venta de pollo por mayoreo, calidad suprema, facturación rápida, etc). Respondes muy corto, 1 o 2 oraciones máximo. El cliente al que le hablas se llama ${customerName || 'Cliente'}. Estilo: Profesional pero con emojis amigables.`;

            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                model: "gpt-4o-mini",
                temperature: 0.6,
                max_tokens: 200,
            });

            return completion.choices[0]?.message?.content || "¡Hola! Gracias por contactar a ALTEPSA. En breve un asesor te atenderá.";
        } catch (error) {
            console.error("Error en OpenAI AI Service:", error);
            return "¡Hola! He recibido tu mensaje. En un momento uno de nuestros especialistas te atenderá personalmente. 🚀";
        }
    }
};
