import React from 'react';
import { Metadata } from 'next';
import { getProperties } from '@/lib/db';
import PropertiesClient from '../PropertiesClient';

export const metadata: Metadata = {
  title: 'Buy Residential Properties | Bricks2Wall',
  description: 'Purchase verified residential apartments, penthouses, and modern family residences with transparent advisory.',
};

export default function BuyPropertiesPage() {
  const properties = getProperties({ transactionType: 'buy' });

  return (
    <PropertiesClient
      initialProperties={properties}
      title="Residential Purchase Opportunities"
      subtitle="Discover premium verified homes, from contemporary 2-bed apartments to expansive sky villas."
    />
  );
}
