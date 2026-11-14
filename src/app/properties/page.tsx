import React from 'react';
import { Metadata } from 'next';
import { getProperties } from '@/lib/db';
import { FilterState, TransactionType } from '@/types';
import PropertiesClient from './PropertiesClient';

export const metadata: Metadata = {
  title: 'All Properties | Bricks2Wall Real Estate Advisory',
  description: 'Explore verified residential apartments, luxury penthouses, executive rentals, and commercial suites.',
};

export default function PropertiesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const filters: FilterState = {
    transactionType: (searchParams?.type as TransactionType) || 'all',
    propertyType: searchParams?.propertyType || 'all',
    locality: searchParams?.locality || 'all',
    minPrice: searchParams?.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined,
    bedrooms: searchParams?.bedrooms || 'all',
    sortBy: (searchParams?.sortBy as FilterState['sortBy']) || 'newest',
    searchQuery: searchParams?.q || undefined,
  };

  const properties = getProperties(filters);

  return (
    <PropertiesClient
      initialProperties={properties}
      title="Verified Property Opportunities"
      subtitle="Carefully reviewed listings with authentic floor plans, title checks, and transparent pricing."
    />
  );
}
