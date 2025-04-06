import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roleId, permissions } = body;

    // Create role permissions
    const createdPermissions = await prisma.$transaction(
      permissions.map((permissionId: number) =>
        prisma.role_permissions.create({
          data: {
            roleId,
            permissionId,
          },
        })
      )
    );

    return NextResponse.json(createdPermissions, { status: 201 });
  } catch (error) {
    console.error('Failed to add permissions:', error);
    return NextResponse.json(
      { error: 'Failed to add permissions' },
      { status: 500 }
    );
  }
} 