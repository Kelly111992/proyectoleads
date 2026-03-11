import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        service: 'LeadMaster Elite',
        timestamp: new Date().toISOString()
    });
}
