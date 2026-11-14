import { NextRequest, NextResponse } from 'next/server';
import { getProperties, createProperty } from '@/lib/db';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const properties = getProperties();
    return NextResponse.json({ success: true, count: properties.length, properties });
  } catch (err: any) {
    console.error('Error fetching admin properties:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.price || !body.locality) {
      return NextResponse.json({ success: false, error: 'Title, price, and locality are required.' }, { status: 400 });
    }

    const slug = body.slug ? slugify(body.slug) : slugify(body.title) + '-' + Date.now().toString().slice(-4);

    const property = createProperty({
      slug,
      title: body.title,
      tagline: body.tagline || '',
      transactionType: body.transactionType || 'buy',
      propertyType: body.propertyType || 'Apartment',
      price: Number(body.price),
      priceDisplay: body.priceDisplay || `₹${Number(body.price).toLocaleString('en-IN')}`,
      contactForPrice: Boolean(body.contactForPrice),
      isFeatured: Boolean(body.isFeatured),
      isVerified: Boolean(body.isVerified),
      isDemo: true, // Safeguard: demo tag for non-production listings
      status: body.status || 'active',
      city: body.city || 'Demo City',
      locality: body.locality,
      subLocality: body.subLocality || '',
      addressSummary: body.addressSummary || `${body.locality}, Demo City`,
      builtUpAreaSqFt: Number(body.builtUpAreaSqFt || 1000),
      carpetAreaSqFt: body.carpetAreaSqFt ? Number(body.carpetAreaSqFt) : undefined,
      bedrooms: body.bedrooms ? Number(body.bedrooms) : undefined,
      bathrooms: body.bathrooms ? Number(body.bathrooms) : undefined,
      balconies: body.balconies ? Number(body.balconies) : undefined,
      parkingSpaces: body.parkingSpaces ? Number(body.parkingSpaces) : 1,
      furnishingStatus: body.furnishingStatus || 'Unfurnished',
      possessionStatus: body.possessionStatus || 'Ready to Move',
      possessionDate: body.possessionDate || 'Immediate',
      facing: body.facing || 'North-East',
      description: body.description || 'Verified property opportunity represented by Bricks2Wall.',
      highlights: body.highlights || ['Verified legal title', 'Prime accessibility', 'High aesthetic finishes'],
      amenities: body.amenities || ['24/7 Security', 'Power Backup', 'Dedicated Parking'],
      media: body.media && body.media.length > 0 ? body.media : [
        {
          id: `med-${Date.now()}`,
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          altText: body.title,
          isPrimary: true,
          order: 1
        }
      ],
      reraRegistrationNumber: body.reraRegistrationNumber || '',
      reraApproved: Boolean(body.reraApproved),
      projectDeveloper: body.projectDeveloper || '',
      availabilityConfirmedAt: new Date().toISOString(),
      assignedAgentId: body.assignedAgentId || 'agent-1'
    });

    return NextResponse.json({ success: true, property });
  } catch (err: any) {
    console.error('Error creating property:', err);
    return NextResponse.json({ success: false, error: 'Failed to create property' }, { status: 500 });
  }
}
