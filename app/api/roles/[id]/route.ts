import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/roles/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const role = await prisma.roles.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        role_permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    return NextResponse.json(
      { error: 'Failed to fetch role' },
      { status: 500 }
    );
  }
}

// PUT /api/roles/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name } = body;

    const updatedRole = await prisma.roles.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        name,
      },
    });

    return NextResponse.json(updatedRole);
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { error: 'Error updating role' },
      { status: 500 }
    );
  }
}

// DELETE /api/roles/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.roles.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return NextResponse.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json(
      { error: 'Error deleting role' },
      { status: 500 }
    );
  }
} 