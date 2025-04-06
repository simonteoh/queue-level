import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface ModulePermission {
  module: string;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
}


export async function GET(request: NextRequest) {
  try {
    const permissions = await prisma.permissions.findMany({
      include: {
        role_permissions: {
          include: {
            role: true
          }
        }
      }
    });
    return NextResponse.json(permissions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roleId, permissions } = body;

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
    console.error('Permission creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create permissions' },
      { status: 500 }
    );
  }
} 