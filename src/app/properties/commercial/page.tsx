import React from 'react';
import { Metadata } from 'next';
import { getProperties } from '@/lib/db';
import PropertiesClient from '../PropertiesClient';

export const metadata: Metadata = {
  title: 'Commercial Properties & Office Suites | Bricks2Wall',
  description: 'Grade-A office suites, retail frontages, and commercial investments for modern corporate occupiers.',
};

export default function CommercialPropertiesPage() {
  const properties = getProperties({ transactionType: 'commercial' });

  return (
    <PropertiesClient
      initialProperties={properties}
      title="Commercial & Office Suites"
      subtitle="Grade-A corporate floorplates, boutique office suites, and high-footfall retail frontages."
    />
  );
}
