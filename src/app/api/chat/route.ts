import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

export async function POST(req: Request) {
    try {
        const { messages, leadName } = await req.json();

        // Check if key is available
        if (!process.env.GROQ_API_KEY) {
            console.warn("GROQ_API_KEY not found. Returning mock response.");
            return NextResponse.json({
                success: true,
                text: `¡Hola ${leadName || 'Cliente'}! Soy la IA de ALTEPSA (Modo Simulation). Por ahora no tengo mi llave maestra (GROQ_API_KEY) activada en este entorno, pero cuando la tenga te enviaré cotizaciones en milisegundos.`
            });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const systemPrompt = `Eres ALTEPSA AI, el asistente comercial número 1 para ALTEPSA COMEX (Matriz Operativa - CRM). Eres directo, cordial y siempre enfocado en VENDER pollo por mayoreo (calidad Suprema, envíos rápidos, facturación disponible, etc). Respondes muy corto, 1 o 2 oraciones, no repites lo mismo. El cliente potencial al que hablas se llama ${leadName || 'Cliente'}. Estilo: Profesional pero con algunos emojis amigables.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.6,
            max_tokens: 300,
        });

        const aiMessage = chatCompletion.choices[0]?.message?.content || "No pude generar una respuesta. ¿Me lo repites?";

        return NextResponse.json({ success: true, text: aiMessage });

    } catch (error: any) {
        console.error("GROQ Chat Error:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
