const { getDb } = require('../lib/mongodb');
const fs = require('fs');
const path = require('path');

function getLocalDatabase() {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'database.json');
    if (fs.existsSync(dbPath)) {
      return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
  } catch (e) {
    // ignore
  }
  return { leads: [], viewings: [] };
}

function saveLocalDatabase(data) {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'database.json');
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving local database in api/leads.js:', e);
  }
}

module.exports = async function handler(req, res) {
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

  // GET: Fetch leads sorted newest first
  if (req.method === 'GET') {
    try {
      const db = await getDb();
      const leads = await db.collection('leads').find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({ success: true, count: leads.length, leads });
    } catch (err) {
      const local = getLocalDatabase();
      return res.status(200).json({
        success: true,
        count: (local.leads || []).length,
        leads: local.leads || [],
      });
    }
  }

  // POST: Create a new lead from any frontend form
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

      if (body.website_hp) {
        return res.status(200).json({ success: true, message: 'Enquiry received' });
      }

      const { name, email, phone } = body;
      if (!name || !email || !phone) {
        return res.status(400).json({ success: false, error: 'Name, email, and phone are required.' });
      }

      const now = new Date();
      const leadId = `lead-${Date.now()}`;

      const newLead = {
        id: leadId,
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: String(phone).trim(),
        enquiryType: body.enquiryType || 'general',
        propertyId: body.propertyId || undefined,
        propertyTitle: body.propertyTitle || undefined,
        status: 'New',
        preferredContactMethod: body.preferredContactMethod || 'phone',
        preferredTime: body.preferredTime || undefined,
        viewingDate: body.viewingDate || undefined,
        viewingTimeSlot: body.viewingTimeSlot || undefined,
        message: body.message || undefined,
        source: body.source || 'website',
        consentGiven: true,
        notes: [
          {
            id: `act-${Date.now()}`,
            leadId,
            type: 'status_change',
            author: 'System',
            description: `New ${body.enquiryType || 'general'} enquiry received from ${body.source || 'website'}`,
            timestamp: now.toISOString(),
          },
        ],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      // 1. Persist to MongoDB
      try {
        const db = await getDb();
        await db.collection('leads').insertOne({
          ...newLead,
          createdAt: now,
          updatedAt: now,
        });
      } catch (dbErr) {
        console.warn('MongoDB insert warning in api/leads.js:', dbErr.message);
      }

      // 2. Mirror to local database
      const local = getLocalDatabase();
      if (!Array.isArray(local.leads)) local.leads = [];
      local.leads.unshift(newLead);
      saveLocalDatabase(local);

      return res.status(201).json({
        success: true,
        leadId: newLead.id,
        message: 'Your enquiry has been received successfully.',
      });
    } catch (err) {
      console.error('Error in api/leads.js:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
};
