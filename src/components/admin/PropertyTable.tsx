'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye, ShieldCheck, Sparkles, X, Check, Upload, ImagePlus, Loader2, Star, ArrowLeft } from 'lucide-react';
import { Property, TransactionType } from '@/types';
import { formatINR } from '@/lib/utils';
import GlassSelect from '@/components/ui/GlassSelect';

interface PropertyTableProps {
  properties: Property[];
  onRefresh: () => void;
}

export default function PropertyTable({ properties, onRefresh }: PropertyTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');

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
    media: [] as Array<{ id: string; url: string; altText: string; isPrimary: boolean; order: number }>,
  });

  const openCreateModal = () => {
    setEditingProperty(null);
    setCustomUrlInput('');
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
      media: [
        {
          id: `med-${Date.now()}`,
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          altText: 'Sample Property Photo',
          isPrimary: true,
          order: 1,
        },
      ],
    });
    setModalOpen(true);
  };

  const openEditModal = (prop: Property) => {
    setEditingProperty(prop);
    setCustomUrlInput('');
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
      media: prop.media && prop.media.length > 0 ? [...prop.media] : [],
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (json.success && json.files && json.files.length > 0) {
        setFormData((prev) => {
          const updated = [...prev.media, ...json.files];
          // Ensure first image is marked primary if none was
          const hasPrimary = updated.some((m) => m.isPrimary);
          if (!hasPrimary && updated.length > 0) {
            updated[0].isPrimary = true;
          }
          return { ...prev, media: updated };
        });
      } else {
        // Fallback: Read client-side as Data URL
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          const file = files[i];
          reader.onload = (re) => {
            if (re.target?.result) {
              setFormData((prev) => ({
                ...prev,
                media: [
                  ...prev.media,
                  {
                    id: `med-${Date.now()}-${i}`,
                    url: String(re.target?.result),
                    altText: file.name,
                    isPrimary: prev.media.length === 0 && i === 0,
                    order: prev.media.length + i + 1,
                  },
                ],
              }));
            }
          };
          reader.readAsDataURL(file);
        }
      }
    } catch (err) {
      console.error('Upload failed, falling back to base64 preview:', err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAddCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setFormData((prev) => {
      const newMedia = [
        ...prev.media,
        {
          id: `med-${Date.now()}`,
          url: customUrlInput.trim(),
          altText: 'Custom Image',
          isPrimary: prev.media.length === 0,
          order: prev.media.length + 1,
        },
      ];
      return { ...prev, media: newMedia };
    });
    setCustomUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const filtered = prev.media.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((m) => m.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return { ...prev, media: filtered };
    });
  };

  const handleSetPrimary = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.map((m, i) => ({
        ...m,
        isPrimary: i === index,
      })),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a listing title.');
      return;
    }
    if (!formData.locality.trim()) {
      alert('Please enter a locality name.');
      return;
    }

    setIsSaving(true);
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
        } else {
          const errData = await res.json().catch(() => ({}));
          alert('Failed to update property: ' + (errData.error || res.statusText));
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
        } else {
          const errData = await res.json().catch(() => ({}));
          alert('Failed to create property: ' + (errData.error || res.statusText));
        }
      }
    } catch (err) {
      console.error('Failed to save property:', err);
      alert('An unexpected error occurred while saving the property listing.');
    } finally {
      setIsSaving(false);
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

  const safeProperties = properties || [];
  const filtered = safeProperties.filter((p) =>
    (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.locality || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Full-Screen Dedicated Property Studio for Creating & Editing Listings
  if (modalOpen) {
    const primaryImg =
      formData.media.find((m) => m.isPrimary)?.url ||
      formData.media[0]?.url ||
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Full-Screen Studio Top Navigation Header */}
        <div className="bg-white rounded-2xl border border-canvas-grey p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="p-2 sm:p-2.5 rounded-xl border border-canvas-grey text-text-slate hover:text-navy-midnight hover:bg-canvas-ivory transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
              title="Return to Portfolio Table"
            >
              <ArrowLeft className="w-4 h-4 text-gold-deep" />
              <span>Back</span>
            </button>
            <div className="h-7 w-[1px] bg-canvas-grey hidden sm:block" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-gold-champagne/20 text-gold-deep border border-gold-champagne/40">
                  {editingProperty ? 'Edit Mode' : 'New Listing'}
                </span>
                <h2 className="font-serif text-base sm:text-xl lg:text-2xl font-bold text-navy-midnight truncate max-w-[200px] sm:max-w-none">
                  {editingProperty ? `${formData.title || 'Untitled'}` : 'Create New Property Listing'}
                </h2>
              </div>
              <p className="text-[11px] sm:text-xs text-text-slate mt-0.5 hidden xs:block">
                Configure verified specs, pricing, gallery media, and live publication state
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 justify-end shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-canvas-grey text-text-slate hover:bg-canvas-ivory text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-navy-midnight text-white text-xs font-semibold hover:bg-gold-deep transition-all shadow-md disabled:opacity-50 cursor-pointer text-center"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin text-gold-champagne" />
              ) : (
                <Check className="w-4 h-4 text-gold-champagne" />
              )}
              <span>{editingProperty ? 'Update Listing' : 'Publish Listing'}</span>
            </button>
          </div>
        </div>

        {/* Full-Screen Studio Grid Form */}
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Details & Media (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: Basic Information */}
            <div className="bg-white rounded-2xl border border-canvas-grey p-6 shadow-sm space-y-4">
              <div className="pb-3 border-b border-canvas-grey flex items-center justify-between">
                <h3 className="font-serif text-base font-semibold text-navy-midnight">
                  1. Listing Identification
                </h3>
                <span className="text-[11px] text-text-muted">* Required fields</span>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-text-slate block">
                  Listing Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Signature Sky Villa • Expressway Vista"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-11 px-4 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne text-xs sm:text-sm bg-canvas-ivory/30 font-medium"
                />
              </div>

              {/* Tagline */}
              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-text-slate block">
                  Marketing Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  placeholder="e.g. Panoramic golf course views with private plunge pool & wrap-around balcony"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full h-11 px-4 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne text-xs sm:text-sm bg-canvas-ivory/30"
                />
              </div>

              {/* Locality */}
              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-text-slate block">
                  Locality / Neighbourhood Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 128, Expressway Corridor, Noida"
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  className="w-full h-11 px-4 border border-canvas-grey rounded-xl text-xs sm:text-sm bg-canvas-ivory/30 focus:outline-none focus:border-gold-champagne font-medium"
                />
              </div>
            </div>

            {/* Card 2: Financials & Spatial Specifications */}
            <div className="bg-white rounded-2xl border border-canvas-grey p-6 shadow-sm space-y-4">
              <div className="pb-3 border-b border-canvas-grey">
                <h3 className="font-serif text-base font-semibold text-navy-midnight">
                  2. Pricing & Spatial Dimensions
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-xs text-text-slate">
                      Price (INR) *
                    </label>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FAF6EE] text-[#9E782F] border border-[#C8A45D]/40">
                      {formatINR(formData.price, false)} ({formatINR(formData.price, true)})
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full h-11 px-4 border border-canvas-grey rounded-xl text-xs sm:text-sm bg-canvas-ivory/30 focus:outline-none focus:border-gold-champagne font-semibold text-navy-midnight"
                  />
                </div>

                {/* Built-up Sq Ft */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-xs text-text-slate">
                    Built-up Area (Sq Ft)
                  </label>
                  <input
                    type="number"
                    min={100}
                    value={formData.builtUpAreaSqFt}
                    onChange={(e) =>
                      setFormData({ ...formData, builtUpAreaSqFt: Number(e.target.value) })
                    }
                    className="w-full h-11 px-4 border border-canvas-grey rounded-xl text-xs sm:text-sm bg-canvas-ivory/30 focus:outline-none focus:border-gold-champagne font-medium"
                  />
                </div>

                {/* Bedrooms */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-xs text-text-slate">
                    Bedrooms (BHK Count)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    className="w-full h-11 px-4 border border-canvas-grey rounded-xl text-xs sm:text-sm bg-canvas-ivory/30 focus:outline-none focus:border-gold-champagne font-medium"
                  />
                </div>

                {/* Bathrooms */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-xs text-text-slate">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                    className="w-full h-11 px-4 border border-canvas-grey rounded-xl text-xs sm:text-sm bg-canvas-ivory/30 focus:outline-none focus:border-gold-champagne font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Architectural Description */}
            <div className="bg-white rounded-2xl border border-canvas-grey p-6 shadow-sm space-y-4">
              <div className="pb-3 border-b border-canvas-grey">
                <h3 className="font-serif text-base font-semibold text-navy-midnight">
                  3. Architectural Overview & Highlights
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-text-slate block">
                  Listing Description
                </label>
                <textarea
                  rows={5}
                  placeholder="Detail the floor plan layout, imported Italian marble finishes, VRV air conditioning, double-height ceiling, private elevator lobby, club amenities, and possession timeline..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-4 border border-canvas-grey rounded-xl text-xs sm:text-sm resize-y bg-canvas-ivory/30 focus:outline-none focus:border-gold-champagne leading-relaxed"
                />
              </div>
            </div>

            {/* Card 4: Property Photos & Media Gallery Studio */}
            <div className="bg-white rounded-2xl border border-canvas-grey p-6 shadow-sm space-y-4">
              <div className="pb-3 border-b border-canvas-grey flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImagePlus className="w-5 h-5 text-gold-deep" />
                  <h3 className="font-serif text-base font-semibold text-navy-midnight">
                    4. Property Photos & High-Res Media Gallery
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-canvas-ivory border border-canvas-grey text-text-slate">
                  {formData.media.length} image(s) attached
                </span>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-[#C8A45D]/40 hover:border-gold-deep rounded-2xl p-6 text-center bg-canvas-ivory/40 transition-colors">
                <input
                  type="file"
                  id="property-gallery-file-input"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="property-gallery-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2 py-2"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-canvas-grey flex items-center justify-center text-gold-deep">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-gold-deep" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-navy-midnight hover:underline block">
                      {uploading
                        ? 'Uploading and optimizing image files...'
                        : 'Click to Upload Property Images from Device'}
                    </span>
                    <p className="text-xs text-text-muted mt-0.5">
                      JPEG, PNG, WEBP • Select multiple photos at once
                    </p>
                  </div>
                </label>
              </div>

              {/* Direct Web URL */}
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <input
                  type="text"
                  placeholder="Or paste an image web link (https://...)"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 h-10 px-3.5 text-base sm:text-xs bg-white border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
                />
                <button
                  type="button"
                  onClick={handleAddCustomUrl}
                  className="px-4 h-10 text-xs bg-canvas-ivory border border-canvas-grey rounded-xl font-semibold text-navy-midnight hover:bg-gold-champagne/20 transition-colors shrink-0 cursor-pointer flex items-center justify-center"
                >
                  Add URL
                </button>
              </div>

              {/* Interactive Gallery Thumbnails */}
              {formData.media.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] text-text-muted font-medium">
                    Manage attached photos. Click &quot;Make Cover&quot; to choose which image appears as the primary card photo:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
                    {formData.media.map((img, idx) => (
                      <div
                        key={img.id || idx}
                        className={`relative rounded-xl overflow-hidden border-2 aspect-video bg-canvas-ivory group shadow-sm transition-all ${
                          img.isPrimary
                            ? 'border-gold-deep ring-2 ring-gold-deep/40'
                            : 'border-canvas-grey hover:border-text-slate'
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={img.altText || 'Property Image'}
                          fill
                          className="object-cover"
                        />

                        {/* Primary Cover Badge */}
                        {img.isPrimary && (
                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-navy-midnight text-gold-champagne shadow flex items-center gap-1 z-10 border border-gold-champagne/40">
                            <Star className="w-3 h-3 fill-gold-champagne text-gold-champagne" />
                            <span>Primary Cover</span>
                          </div>
                        )}

                        {/* Order Number Badge */}
                        <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black/60 text-white z-10">
                          #{idx + 1}
                        </div>

                        {/* Hover Overlay with Action Buttons (Visible on mobile for touch, hover on desktop) */}
                        <div className="absolute inset-0 bg-black/65 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 z-20">
                          {!img.isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(idx)}
                              className="px-2.5 py-1 rounded-lg bg-white text-navy-midnight text-[10px] font-bold hover:bg-gold-champagne transition-colors shadow cursor-pointer"
                              title="Set as Main Cover Photo"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow cursor-pointer"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Publication Settings & Live Preview (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 5: Publication & Classification */}
            <div className="bg-white rounded-2xl border border-canvas-grey p-6 shadow-sm space-y-4">
              <div className="pb-3 border-b border-canvas-grey">
                <h3 className="font-serif text-base font-semibold text-navy-midnight">
                  Publication Settings
                </h3>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-text-slate block">
                  Listing Status
                </label>
                <GlassSelect
                  value={formData.status}
                  onChange={(val) => setFormData({ ...formData, status: val as any })}
                  options={[
                    { value: 'active', label: 'Active & Publicly Visible' },
                    { value: 'under_offer', label: 'Under Offer' },
                    { value: 'sold', label: 'Sold & Transacted' },
                    { value: 'draft', label: 'Draft (Internal Only)' },
                  ]}
                  size="md"
                />
              </div>

              {/* Transaction Intent */}
              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-text-slate block">
                  Transaction Intent
                </label>
                <GlassSelect
                  value={formData.transactionType}
                  onChange={(val) => setFormData({ ...formData, transactionType: val as any })}
                  options={[
                    { value: 'buy', label: 'Buy (Residential/Commercial)' },
                    { value: 'rent', label: 'Rent / Serviced Lease' },
                    { value: 'commercial', label: 'Commercial Portfolio' },
                  ]}
                  size="md"
                />
              </div>

              {/* Property Category */}
              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-text-slate block">
                  Property Category
                </label>
                <GlassSelect
                  value={formData.propertyType}
                  onChange={(val) => setFormData({ ...formData, propertyType: val as any })}
                  options={[
                    { value: 'Apartment', label: 'Luxury Apartment' },
                    { value: 'Penthouse', label: 'Sky Villa / Penthouse' },
                    { value: 'Villa', label: 'Independent Villa' },
                    { value: 'Office Suite', label: 'Corporate Office Suite' },
                    { value: 'Retail Frontage', label: 'High-Street Retail Frontage' },
                    { value: 'Commercial Floor', label: 'Commercial Floor' },
                  ]}
                  size="md"
                />
              </div>

              {/* Featured on Homepage */}
              <div className="pt-2">
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-canvas-grey bg-canvas-ivory/50 cursor-pointer hover:border-gold-champagne/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="mt-0.5 rounded text-gold-deep focus:ring-gold-champagne w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-xs text-navy-midnight block">
                      Feature on Homepage Showcase
                    </span>
                    <span className="text-[11px] text-text-slate block mt-0.5">
                      Pin this property to the front curated showcase grid for top buyer priority.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Card 6: Live Website Card Preview */}
            <div className="bg-white rounded-2xl border border-canvas-grey p-6 shadow-sm space-y-4">
              <div className="pb-3 border-b border-canvas-grey flex items-center justify-between">
                <h3 className="font-serif text-base font-semibold text-navy-midnight">
                  Live Card Preview
                </h3>
                <span className="text-[11px] text-text-muted">Public Catalog Card</span>
              </div>

              <div className="rounded-2xl border border-canvas-grey overflow-hidden shadow-sm bg-white">
                <div className="relative aspect-[16/10] bg-canvas-ivory">
                  <Image
                    src={primaryImg}
                    alt={formData.title || 'Property Cover'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-navy-midnight text-white shadow">
                      {formData.transactionType}
                    </span>
                    {formData.isFeatured && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-champagne text-navy-midnight shadow">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold text-navy-midnight">
                      {formatINR(formData.price, true)}
                    </span>
                    <span className="text-[11px] text-text-muted capitalize">
                      {formData.propertyType}
                    </span>
                  </div>

                  <p className="font-serif text-sm font-semibold text-navy-midnight line-clamp-1">
                    {formData.title || 'Untitled Property'}
                  </p>

                  <p className="text-xs text-text-slate line-clamp-1">
                    {formData.locality || 'Locality, City'}
                  </p>

                  <div className="pt-2 border-t border-canvas-grey flex items-center justify-between text-[11px] text-text-slate">
                    <span>{formData.bedrooms} BHK</span>
                    <span>•</span>
                    <span>{formData.bathrooms} Baths</span>
                    <span>•</span>
                    <span>{formData.builtUpAreaSqFt} sq ft</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-text-muted italic text-center">
                Updates in real time as you edit specifications
              </p>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-4 rounded-2xl bg-canvas-ivory/60 border border-canvas-grey flex flex-col gap-2.5">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-navy-midnight text-white text-xs font-semibold hover:bg-gold-deep transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gold-champagne" />
                ) : (
                  <Check className="w-4 h-4 text-gold-champagne" />
                )}
                <span>{editingProperty ? 'Update Listing Now' : 'Publish Listing Now'}</span>
              </button>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-full py-2.5 rounded-xl border border-canvas-grey text-text-slate hover:bg-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel & Return
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-canvas-grey shadow-sm overflow-hidden">
      
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-canvas-grey flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-base sm:text-lg font-semibold text-navy-midnight">
            Property Portfolio Inventory
          </h3>
          <p className="text-xs text-text-slate">
            Manage public listings, pricing, and publication states
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 px-3.5 text-base sm:text-xs bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne w-full sm:w-56"
          />

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-midnight text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep transition-colors shadow-sm shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold-champagne" />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* Mobile Card Listing View (< md) */}
      <div className="md:hidden divide-y divide-canvas-grey">
        {filtered.map((prop) => (
          <div key={prop.id} className="p-4 space-y-3 hover:bg-canvas-ivory/20 transition-colors">
            <div className="flex items-start gap-3">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-canvas-ivory border border-canvas-grey">
                <Image
                  src={prop.media[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                  alt={prop.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-canvas-ivory border border-canvas-grey">
                    {prop.transactionType}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    prop.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {prop.status}
                  </span>
                  {prop.isFeatured && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-navy-midnight text-white">
                      Featured
                    </span>
                  )}
                </div>
                <p className="font-semibold text-sm text-navy-midnight truncate">
                  {prop.title}
                </p>
                <p className="text-xs text-text-slate truncate mt-0.5">
                  {prop.locality}
                </p>
                <p className="text-xs font-bold text-navy-midnight mt-1">
                  {formatINR(prop.price)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-text-muted pt-1">
              <span>{prop.propertyType} • {prop.builtUpAreaSqFt} sq ft</span>
              {Boolean(prop.bedrooms && prop.bedrooms > 0) && <span>{prop.bedrooms} BHK</span>}
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-canvas-grey/60">
              <Link
                href={`/properties/${prop.slug}`}
                target="_blank"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-canvas-grey text-text-slate hover:text-navy-midnight text-xs font-medium bg-canvas-ivory/50"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </Link>
              <button
                onClick={() => openEditModal(prop)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-navy-midnight text-white text-xs font-medium hover:bg-gold-deep transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-gold-champagne" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(prop.id)}
                className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                title="Delete listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-text-muted text-xs">
            No properties found matching your search.
          </div>
        )}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block overflow-x-auto">
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
    </div>
  );
}
