import { NextRequest, NextResponse } from 'next/server';
import { getProperties } from '@/lib/db';
import { FilterState, TransactionType } from '@/types';

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

    const properties = getProperties(filters);

    return NextResponse.json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (err: any) {
    console.error('Error fetching properties:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
