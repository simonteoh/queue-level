import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/merchants/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const merchant = await prisma.merchants.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(merchant);
  } catch (error) {
    console.error('Error fetching merchant:', error);
    return NextResponse.json(
      { error: 'Error fetching merchant' },
      { status: 500 }
    );
  }
}

// PUT /api/merchants/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, longitude, latitude, image } = body;

    const updatedMerchant = await prisma.merchants.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        name,
        longitude,
        latitude,
        ...(image && { image }), // Only include image if it's provided
      },
    });

    return NextResponse.json(updatedMerchant);
  } catch (error) {
    console.error('Error updating merchant:', error);
    return NextResponse.json(
      { error: 'Error updating merchant' },
      { status: 500 }
    );
  }
}

// DELETE /api/merchants/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.merchants.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return NextResponse.json({ message: 'Merchant deleted successfully' });
  } catch (error) {
    console.error('Error deleting merchant:', error);
    return NextResponse.json(
      { error: 'Error deleting merchant' },
      { status: 500 }
    );
  }
} 