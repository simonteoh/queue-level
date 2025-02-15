import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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