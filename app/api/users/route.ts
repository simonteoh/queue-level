import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const users = await prisma.users.findMany({
            orderBy: {
                id: 'asc',
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                created_at: true,
            },
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
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