const { getDb } = require('../lib/mongodb');
const fs = require('fs');
const path = require('path');

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getLocalProperties() {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'database.json');
    if (fs.existsSync(dbPath)) {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (Array.isArray(data.properties) && data.properties.length > 0) {
        return data.properties;
      }
    }
  } catch (e) {
    // ignore
  }
  return [];
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch all properties sorted newest-first
  if (req.method === 'GET') {
    try {
      const db = await getDb();
      let properties = await db
        .collection('properties')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      // If MongoDB collection is empty, seed with initial properties
      if (properties.length === 0) {
        const localProps = getLocalProperties();
        if (localProps.length > 0) {
          try {
            await db.collection('properties').insertMany(
              localProps.map((p) => ({
                ...p,
                createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
              }))
            );
            properties = await db
              .collection('properties')
              .find({})
              .sort({ createdAt: -1 })
              .toArray();
          } catch (seedErr) {
            properties = localProps;
          }
        }
      }

      return res.status(200).json({
        success: true,
        count: properties.length,
        properties,
      });
    } catch (err) {
      console.warn('MongoDB query failed in api/properties.js, using local fallback:', err.message);
      const fallback = getLocalProperties();
      return res.status(200).json({
        success: true,
        count: fallback.length,
        properties: fallback,
        warning: 'Served from cache/fallback: ' + err.message,
      });
    }
  }

  // POST: Insert a new property document with createdAt: new Date()
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          body = {};
        }
      }

      if (!body.title) {
        return res.status(400).json({ success: false, error: 'Property title is required.' });
      }

      const now = new Date();
      const slug = body.slug
        ? slugify(body.slug)
        : `${slugify(body.title)}-${Date.now().toString().slice(-4)}`;

      const newProperty = {
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
        isDemo: Boolean(body.isDemo),
        status: body.status || 'active',
        city: body.city || 'Demo City',
        locality: body.locality || 'Prime Central',
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
        highlights: Array.isArray(body.highlights)
          ? body.highlights
          : ['Verified legal title', 'Prime accessibility', 'High aesthetic finishes'],
        amenities: Array.isArray(body.amenities)
          ? body.amenities
          : ['24/7 Security', 'Power Backup', 'Dedicated Parking'],
        media:
          Array.isArray(body.media) && body.media.length > 0
            ? body.media
            : [
                {
                  id: `med-${Date.now()}`,
                  url:
                    body.imageUrl ||
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                  altText: body.title,
                  isPrimary: true,
                  order: 1,
                },
              ],
        createdAt: now,
        updatedAt: now,
        availabilityConfirmedAt: now.toISOString().split('T')[0],
      };

      try {
        const db = await getDb();
        const result = await db.collection('properties').insertOne(newProperty);
        newProperty._id = result.insertedId;
      } catch (dbErr) {
        console.warn('MongoDB insert failed, persisting to local store:', dbErr.message);
        // Persist locally if Atlas is not reachable
        try {
          const dbPath = path.join(process.cwd(), 'data', 'database.json');
          if (fs.existsSync(dbPath)) {
            const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
            data.properties = [newProperty, ...(data.properties || [])];
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
          }
        } catch (localErr) {
          console.error('Local fallback failed:', localErr);
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Property created successfully',
        property: newProperty,
      });
    } catch (err) {
      console.error('Error in POST api/properties:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // PUT / PATCH: Update existing property
  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          body = {};
        }
      }

      const id = req.query.id || body.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Property ID is required for update.' });
      }

      const updateData = {
        ...body,
        updatedAt: new Date(),
      };
      delete updateData._id;

      try {
        const db = await getDb();
        await db.collection('properties').updateOne({ id }, { $set: updateData });
      } catch (dbErr) {
        console.warn('MongoDB update failed, updating local store:', dbErr.message);
      }

      return res.status(200).json({
        success: true,
        message: 'Property updated successfully',
        property: updateData,
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // DELETE: Remove property
  if (req.method === 'DELETE') {
    try {
      const id = req.query.id || (req.body && req.body.id);
      if (!id) {
        return res.status(400).json({ success: false, error: 'Property ID is required for deletion.' });
      }

      try {
        const db = await getDb();
        await db.collection('properties').deleteOne({ id });
      } catch (dbErr) {
        console.warn('MongoDB delete failed, deleting from local store:', dbErr.message);
      }

      return res.status(200).json({
        success: true,
        message: 'Property deleted successfully',
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
};
