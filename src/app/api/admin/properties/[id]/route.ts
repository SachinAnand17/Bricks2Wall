import { NextRequest, NextResponse } from 'next/server';
import { updateProperty, deleteProperty } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = updateProperty(params.id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, property: updated });
  } catch (err: any) {
    console.error('Error updating property:', err);
    return NextResponse.json({ success: false, error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = deleteProperty(params.id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Property deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting property:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete property' }, { status: 500 });
  }
}
