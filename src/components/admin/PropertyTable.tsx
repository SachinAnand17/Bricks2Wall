'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye, ShieldCheck, Sparkles, X, Check } from 'lucide-react';
import { Property, TransactionType } from '@/types';
import { formatINR } from '@/lib/utils';

interface PropertyTableProps {
  properties: Property[];
  onRefresh: () => void;
}

export default function PropertyTable({ properties, onRefresh }: PropertyTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    transactionType: 'buy' as TransactionType,
    propertyType: 'Apartment' as any,
    price: 8500000,
    locality: 'Demo Locality',
    builtUpAreaSqFt: 1200,
    bedrooms: 2,
    bathrooms: 2,
    description: '',
    isFeatured: false,
    status: 'active' as any,
  });

  const openCreateModal = () => {
    setEditingProperty(null);
    setFormData({
      title: '',
      tagline: '',
      transactionType: 'buy',
      propertyType: 'Apartment',
      price: 8500000,
      locality: 'Demo Locality',
      builtUpAreaSqFt: 1200,
      bedrooms: 2,
      bathrooms: 2,
      description: 'Verified residential opportunity represented by Bricks2Wall.',
      isFeatured: false,
      status: 'active',
    });
    setModalOpen(true);
  };

  const openEditModal = (prop: Property) => {
    setEditingProperty(prop);
    setFormData({
      title: prop.title,
      tagline: prop.tagline || '',
      transactionType: prop.transactionType,
      propertyType: prop.propertyType,
      price: prop.price,
      locality: prop.locality,
      builtUpAreaSqFt: prop.builtUpAreaSqFt,
      bedrooms: prop.bedrooms || 2,
      bathrooms: prop.bathrooms || 2,
      description: prop.description,
      isFeatured: prop.isFeatured,
      status: prop.status,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProperty) {
        // PATCH
        const res = await fetch(`/api/admin/properties/${editingProperty.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setModalOpen(false);
          onRefresh();
        }
      } else {
        // POST
        const res = await fetch('/api/admin/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setModalOpen(false);
          onRefresh();
        }
      }
    } catch (err) {
      console.error('Failed to save property:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this property record?')) {
      try {
        const res = await fetch(`/api/admin/properties/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) onRefresh();
      } catch (err) {
        console.error('Error deleting property:', err);
      }
    }
  };

  const filtered = properties.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.locality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-canvas-grey shadow-sm overflow-hidden">
      
      {/* Table Header Controls */}
      <div className="p-5 border-b border-canvas-grey flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg font-semibold text-navy-midnight">
            Property Portfolio Inventory
          </h3>
          <p className="text-xs text-text-slate">
            Manage public listings, pricing, and publication states
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 px-3 text-xs bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
          />

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-midnight text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-gold-champagne" />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* Listings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-text-ink">
          <thead className="bg-canvas-ivory/80 text-[11px] font-semibold uppercase text-text-slate border-b border-canvas-grey">
            <tr>
              <th className="py-3 px-4">Property</th>
              <th className="py-3 px-4">Intent</th>
              <th className="py-3 px-4">Locality</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Badges</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-canvas-grey">
            {filtered.map((prop) => (
              <tr key={prop.id} className="hover:bg-canvas-ivory/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0 bg-canvas-ivory">
                      <Image
                        src={prop.media[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                        alt={prop.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-navy-midnight line-clamp-1 max-w-[200px]">
                        {prop.title}
                      </p>
                      <span className="text-[10px] text-text-muted">
                        {prop.propertyType} • {prop.builtUpAreaSqFt} sq ft
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-canvas-ivory border border-canvas-grey">
                    {prop.transactionType}
                  </span>
                </td>

                <td className="py-3 px-4 text-text-slate">
                  {prop.locality}
                </td>

                <td className="py-3 px-4 font-semibold text-navy-midnight">
                  {formatINR(prop.price)}
                </td>

                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    prop.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {prop.status}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    {prop.isFeatured && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-navy-midnight text-white">
                        Featured
                      </span>
                    )}
                    {prop.isDemo && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-100 text-amber-800">
                        DEMO
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/properties/${prop.slug}`}
                      target="_blank"
                      className="p-1.5 text-text-slate hover:text-navy-midnight hover:bg-canvas-ivory rounded"
                      title="View on site"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => openEditModal(prop)}
                      className="p-1.5 text-text-slate hover:text-gold-deep hover:bg-canvas-ivory rounded"
                      title="Edit listing"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(prop.id)}
                      className="p-1.5 text-text-slate hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-canvas-grey mb-4">
              <h3 className="font-serif text-lg font-semibold text-navy-midnight">
                {editingProperty ? 'Edit Property Listing' : 'Create New Property Listing'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-text-muted hover:text-navy-midnight rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-text-slate">Listing Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-10 px-3 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-text-slate">Intent</label>
                  <select
                    value={formData.transactionType}
                    onChange={(e) => setFormData({ ...formData, transactionType: e.target.value as any })}
                    className="w-full h-10 px-2 border border-canvas-grey rounded-xl text-xs"
                  >
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text-slate">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                    className="w-full h-10 px-2 border border-canvas-grey rounded-xl text-xs"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Penthouse">Sky Villa / Penthouse</option>
                    <option value="Office Suite">Office Suite</option>
                    <option value="Retail Frontage">Retail Frontage</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-text-slate">Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full h-10 px-3 border border-canvas-grey rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text-slate">Locality *</label>
                  <input
                    type="text"
                    required
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full h-10 px-3 border border-canvas-grey rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-text-slate">Built-up Sq Ft</label>
                  <input
                    type="number"
                    value={formData.builtUpAreaSqFt}
                    onChange={(e) => setFormData({ ...formData, builtUpAreaSqFt: Number(e.target.value) })}
                    className="w-full h-10 px-3 border border-canvas-grey rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-text-slate">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    className="w-full h-10 px-3 border border-canvas-grey rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-text-slate">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                    className="w-full h-10 px-3 border border-canvas-grey rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text-slate">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-canvas-grey rounded-xl text-xs resize-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-gold-deep"
                  />
                  <span>Mark as Featured on Homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-canvas-grey flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-canvas-grey text-text-slate hover:bg-canvas-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-navy-midnight text-white font-semibold hover:bg-gold-deep transition-colors"
                >
                  {editingProperty ? 'Update Listing' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
