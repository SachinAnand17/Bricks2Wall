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
    console.error('Error saving local database in api/viewings.js:', e);
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

  // POST: Book an on-site viewing walkthrough
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
        return res.status(200).json({ success: true, message: 'Viewing booked' });
      }

      const { visitorName, visitorPhone, preferredDate, timeSlot, notes, propertyId, propertyTitle } = body;

      if (!visitorName || !visitorPhone || !preferredDate) {
        return res.status(400).json({ success: false, error: 'Name, phone number, and preferred date are required.' });
      }

      const now = new Date();
      const leadId = `lead-${Date.now()}`;
      const viewingId = `view-${Date.now()}`;

      const newLead = {
        id: leadId,
        name: String(visitorName).trim(),
        email: body.visitorEmail ? String(body.visitorEmail).trim().toLowerCase() : 'viewing-request@bricks2wall.com',
        phone: String(visitorPhone).trim(),
        enquiryType: 'viewing',
        propertyId: propertyId || 'general',
        propertyTitle: propertyTitle || 'General Site Walkthrough',
        status: 'Viewing scheduled',
        preferredContactMethod: 'phone',
        viewingDate: String(preferredDate).trim(),
        viewingTimeSlot: timeSlot || '11:00 AM – 1:00 PM',
        message: notes || undefined,
        source: 'book_visit',
        consentGiven: true,
        notes: [
          {
            id: `act-${Date.now()}`,
            leadId,
            type: 'status_change',
            author: 'System',
            description: `Viewing appointment requested for ${preferredDate} at ${timeSlot || '11:00 AM'}`,
            timestamp: now.toISOString(),
          },
        ],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      const newViewing = {
        id: viewingId,
        leadId,
        propertyId: propertyId || 'general',
        propertyTitle: propertyTitle || 'General Site Walkthrough',
        visitorName: String(visitorName).trim(),
        visitorPhone: String(visitorPhone).trim(),
        visitorEmail: newLead.email,
        preferredDate: String(preferredDate).trim(),
        timeSlot: timeSlot || '11:00 AM – 1:00 PM',
        status: 'pending',
        notes: notes || undefined,
        createdAt: now.toISOString(),
      };

      // 1. Persist to MongoDB
      try {
        const db = await getDb();
        await db.collection('leads').insertOne({ ...newLead, createdAt: now, updatedAt: now });
        await db.collection('viewings').insertOne({ ...newViewing, createdAt: now });
      } catch (dbErr) {
        console.warn('MongoDB insert warning in api/viewings.js:', dbErr.message);
      }

      // 2. Mirror to local database
      const local = getLocalDatabase();
      if (!Array.isArray(local.leads)) local.leads = [];
      if (!Array.isArray(local.viewings)) local.viewings = [];
      local.leads.unshift(newLead);
      local.viewings.unshift(newViewing);
      saveLocalDatabase(local);

      return res.status(201).json({
        success: true,
        leadId: newLead.id,
        viewingId: newViewing.id,
        message: 'Viewing appointment requested successfully.',
      });
    } catch (err) {
      console.error('Error in api/viewings.js:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
};
