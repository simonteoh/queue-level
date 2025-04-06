import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roleId = parseInt(params.id);
    const { permissions } = await request.json();

    // Delete existing permissions for this role
    await prisma.role_permissions.deleteMany({
      where: { roleId },
    });

    // Create new permissions
    const updatedPermissions = await prisma.$transaction(
      permissions.map((permissionId: number) =>
        prisma.role_permissions.create({
          data: {
            roleId,
            permissionId,
          },
        })
      )
    );

    return NextResponse.json(updatedPermissions);
  } catch (error) {
    console.error('Failed to update permissions:', error);
    return NextResponse.json(
      { error: 'Failed to update permissions' },
      { status: 500 }
    );
  }
} 