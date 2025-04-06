import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const permission = await prisma.role_permissions.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        role: true,
      },
    });

    if (!permission) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(permission);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch permission' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { roleId, permissionId } = await request.json();

    const updatedPermission = await prisma.role_permissions.update({
      where: { id: parseInt(params.id) },
      data: {
        roleId,
        permissionId,
      },
    });

    return NextResponse.json(updatedPermission);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update permission' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.role_permissions.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return NextResponse.json({ message: 'Permission deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete permission' },
      { status: 500 }
    );
  }
} 