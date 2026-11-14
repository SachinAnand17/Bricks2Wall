import React from 'react';
import { Metadata } from 'next';
import { getProperties } from '@/lib/db';
import PropertiesClient from '../PropertiesClient';

export const metadata: Metadata = {
  title: 'Rental Properties & Turnkey Residences | Bricks2Wall',
  description: 'Furnished executive apartments, urban residences, and long-term rental leases with transparent documentation.',
};

export default function RentPropertiesPage() {
  const properties = getProperties({ transactionType: 'rent' });

  return (
    <PropertiesClient
      initialProperties={properties}
      title="Curated Rental Residences"
      subtitle="Executive furnished apartments and high-amenity residences ready for seamless move-in."
    />
  );
}
