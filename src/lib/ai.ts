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
                        content: `Eres el Agente de Ventas Inteligente de ALTEPSA (Alta Tecnología en Pastas y Ave), una empresa líder en Jalisco dedicada a productos avícolas de la más alta calidad.
            Tu objetivo es atender a clientes mayoristas y minoristas que preguntan por nuestros productos (pollo en canal, pechuga, ala, piel, carne deshuesada, etc.).
            
            REGLAS DE ORO:
            1. Tono: Profesional, confiable, directo y con el espíritu trabajador de una empresa jalisciense.
            2. Objetivo Principal: Capturar el pedido o interés del cliente y canalizarlo con un asesor para cerrar la venta.
            3. Especialidad: Conocimiento profundo en productos de ave y eficiencia tecnológica.
            4. Identidad: Eres "Altepsa Bot".
            
            UBICACIÓN: Álvaro Obregón 1214, Col. La Penal, Guadalajara, Jalisco.
            
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
