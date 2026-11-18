import { NextRequest, NextResponse } from 'next/server';
import { getProperties, createProperty, updateProperty, deleteProperty } from '@/lib/db';
import { getDb } from '@/lib/mongodb';
import { FilterState, TransactionType, Property } from '@/types';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: FilterState = {
      transactionType: (searchParams.get('type') as TransactionType) || 'all',
      propertyType: searchParams.get('propertyType') || 'all',
      locality: searchParams.get('locality') || 'all',
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      bedrooms: searchParams.get('bedrooms') || 'all',
      furnishing: searchParams.get('furnishing') || 'all',
      possession: searchParams.get('possession') || 'all',
      sortBy: (searchParams.get('sortBy') as FilterState['sortBy']) || 'newest',
      searchQuery: searchParams.get('q') || undefined,
    };

    // Try fetching from MongoDB Atlas
    try {
      const db = await getDb();
      let query: any = {};

      if (filters.transactionType && filters.transactionType !== 'all') {
        query.transactionType = filters.transactionType;
      }
      if (filters.propertyType && filters.propertyType !== 'all') {
        query.propertyType = { $regex: new RegExp(`^${filters.propertyType}$`, 'i') };
      }
      if (filters.bedrooms && filters.bedrooms !== 'all') {
        const beds = parseInt(filters.bedrooms, 10);
        if (!isNaN(beds)) query.bedrooms = beds;
      }

      let mongoProperties = await db
        .collection('properties')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      if (mongoProperties.length > 0) {
        let list = mongoProperties.map((doc: any) => {
          const { _id, ...rest } = doc;
          return { ...rest, id: rest.id || _id.toString() } as Property;
        });

        if (filters.locality && filters.locality !== 'all') {
          const loc = filters.locality.toLowerCase();
          list = list.filter(
            (p) =>
              (p.locality && p.locality.toLowerCase().includes(loc)) ||
              (p.city && p.city.toLowerCase().includes(loc))
          );
        }

        if (filters.minPrice !== undefined && filters.minPrice > 0) {
          list = list.filter((p) => p.price >= (filters.minPrice ?? 0));
        }
        if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
          list = list.filter((p) => p.price <= (filters.maxPrice ?? Infinity));
        }
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase().trim();
          list = list.filter(
            (p) =>
              (p.title && p.title.toLowerCase().includes(q)) ||
              (p.locality && p.locality.toLowerCase().includes(q)) ||
              (p.description && p.description.toLowerCase().includes(q))
          );
        }

        return NextResponse.json({
          success: true,
          count: list.length,
          properties: list,
          source: 'mongodb',
        });
      }
    } catch (mongoErr: any) {
      console.warn('MongoDB query warning in /api/properties GET, using local store:', mongoErr.message);
    }

    // Fallback to local store
    const properties = getProperties(filters);
    return NextResponse.json({
      success: true,
      count: properties.length,
      properties,
      source: 'local',
    });
  } catch (err: any) {
    console.error('Error fetching properties:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json({ success: false, error: 'Property title is required.' }, { status: 400 });
    }

    const now = new Date();
    const slug = body.slug
      ? slugify(body.slug)
      : `${slugify(body.title)}-${Date.now().toString().slice(-4)}`;

    const newProperty: Property = {
      id: body.id || `prop-${Date.now()}`,
      slug,
      title: body.title,
      tagline: body.tagline || '',
      transactionType: body.transactionType || 'buy',
      propertyType: body.propertyType || 'Apartment',
      price: Number(body.price || 0),
      priceDisplay: body.priceDisplay || `₹${Number(body.price || 0).toLocaleString('en-IN')}`,
      contactForPrice: Boolean(body.contactForPrice),
      isFeatured: Boolean(body.isFeatured),
      isVerified: Boolean(body.isVerified),
      isDemo: Boolean(body.isDemo ?? true),
      status: body.status || 'active',
      city: body.city || 'Demo City',
      locality: body.locality || 'Prime Locality',
      subLocality: body.subLocality || '',
      addressSummary: body.addressSummary || `${body.locality || 'Prime'}, Demo City`,
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
      highlights: Array.isArray(body.highlights) && body.highlights.length > 0
        ? body.highlights
        : ['Verified legal title', 'Prime accessibility', 'High aesthetic finishes'],
      amenities: Array.isArray(body.amenities) && body.amenities.length > 0
        ? body.amenities
        : ['24/7 Security', 'Power Backup', 'Dedicated Parking'],
      media: Array.isArray(body.media) && body.media.length > 0
        ? body.media
        : [
            {
              id: `med-${Date.now()}`,
              url: body.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
              altText: body.title,
              isPrimary: true,
              order: 1,
            },
          ],
      availabilityConfirmedAt: body.availabilityConfirmedAt || now.toISOString().split('T')[0],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    // Try persisting to MongoDB Atlas
    let persistedInMongo = false;
    try {
      const db = await getDb();
      await db.collection('properties').insertOne({
        ...newProperty,
        createdAt: now,
        updatedAt: now,
      });
      persistedInMongo = true;
    } catch (dbErr: any) {
      console.warn('MongoDB insert warning in /api/properties POST, persisting locally:', dbErr.message);
    }

    // Always mirror to local store for reliability
    createProperty(newProperty);

    return NextResponse.json(
      {
        success: true,
        message: 'Property created successfully',
        property: newProperty,
        persistedInMongo,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error in POST /api/properties:', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to create property' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Property ID is required' }, { status: 400 });
    }

    try {
      const db = await getDb();
      await db.collection('properties').updateOne(
        { $or: [{ id }, { slug: id }] },
        { $set: { ...updates, updatedAt: new Date() } }
      );
    } catch (e: any) {
      console.warn('MongoDB update warning:', e.message);
    }

    const updated = updateProperty(id, updates);
    return NextResponse.json({ success: true, property: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Property ID is required' }, { status: 400 });
    }

    try {
      const db = await getDb();
      await db.collection('properties').deleteOne({ $or: [{ id }, { slug: id }] });
    } catch (e: any) {
      console.warn('MongoDB delete warning:', e.message);
    }

    deleteProperty(id);
    return NextResponse.json({ success: true, message: 'Property deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
