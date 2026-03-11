import { NextResponse } from 'next/server';
import OpenAI from "openai";

export async function POST(req: Request) {
    try {
        const { messages, leadName } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            console.warn("OPENAI_API_KEY no presente, configurando fallback de demo local.");
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || "fallback_a_qui_evitamos_que_git_bloquee"
        });

        // We make sure the system prompt enforces answering correctly and naturally.
        const systemPrompt = `Eres ALTEPSA AI, el asistente comercial top de ALTEPSA COMEX (Matriz Operativa - CRM). Eres directo, cordial y super inteligente. REGLA DE ORO: ANTES DE HABLAR DENEGOCIO, RESPONDE EXACTAMENTE Y DE FORMA NATURAL A LO QUE PREGUNTA EL USUARIO. No desvíes el tema abruptamente. Si el usuario saluda, saluda. Si te pregunta algo que no es de pollo, respóndele brevemente antes de redirigirlo a nuestro negocio (venta de pollo por mayoreo, calidad suprema, facturación rápida, etc). Respondes muy corto, 1 o 2 oraciones máximo. El cliente al que le hablas se llama ${leadName || 'Cliente'}. Estilo: Profesional pero con emojis amigables.`;

        const chatCompletion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            model: "gpt-4o-mini",
            temperature: 0.6,
            max_tokens: 200, // lower tokens to keep answers succinct natively
        });

        const aiMessage = chatCompletion.choices[0]?.message?.content || "No pude procesar eso... ¿me lo puedes repetir?";

        return NextResponse.json({ success: true, text: aiMessage });

    } catch (error: any) {
        console.error("OpenAI Chat Error:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
