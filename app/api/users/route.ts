import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const users = await prisma.users.findMany();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Invalid request ${error}` }, { status: 400 });
    }
}


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, firstName, lastName, password } = body;

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        const user = await prisma.users.create({
            data: {
                email,
                firstName,
                lastName,
                password: hashedPassword, // Store the hashed password
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Invalid request: ${error}` }, { status: 400 });
    }
}