import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
    try {
        const merchants = await prisma.merchants.findMany();
        return NextResponse.json(merchants, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Invalid request ${error}` }, { status: 400 });
    }
}


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, latitude, longitude } = body;


        const merchant = await prisma.merchants.create({
            data: {
                name,
                latitude,
                longitude
            },
        });

        return NextResponse.json(merchant, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Invalid request: ${error}` }, { status: 400 });
    }
}