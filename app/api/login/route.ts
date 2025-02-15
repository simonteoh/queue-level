import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { enteredPassword, storedHashedPassword } = body;

        // Validate input
        if (!enteredPassword || !storedHashedPassword) {
            return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
        }

        // Compare password
        const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Success response
        return NextResponse.json({ message: "Authentication successful" }, { status: 200 });

    } catch (error) {
        console.error("Error in authentication:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
