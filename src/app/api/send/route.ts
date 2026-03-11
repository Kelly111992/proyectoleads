import { NextResponse } from 'next/server';
import { evolutionApi } from '@/lib/evolution';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phone, text } = body;

        if (!phone || !text) {
            return NextResponse.json({ error: 'Phone and text are required' }, { status: 400 });
        }

        const data = await evolutionApi.sendMessage(phone, text);
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
