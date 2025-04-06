import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const roles = await prisma.roles.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    const role = await prisma.roles.create({
      data: {
        name,
      },
    });

    return NextResponse.json(role, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Role already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create role' },
      { status: 500 }
    );
  }
} 