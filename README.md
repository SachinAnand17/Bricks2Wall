# Bricks2Wall — Digital Property Discovery & Advisory Platform

> **"Property, With Perspective"**  
> A premium, trustworthy real-estate brokerage and advisory platform engineered for high performance, verified listings, and lead conversion.

---

## 1. Brand & Architectural Identity

- **Design Philosophy**: Refined white, warm ivory (`#F8F6F0`), champagne gold (`#C8A45D`), deep gold (`#9B783A`), and restrained midnight navy (`#10243A`).
- **Typography**: Serif editorial display (*Playfair Display*) paired with high-legibility UI sans (*Inter*).
- **Brand Assets Location**:
  - Horizontal Primary Logo: `/public/brand/brand-logo.jpg`
  - Emblem / Favicon Source: `/public/brand/favicon-source.jpg`
  - Mobile Emblem Crop: `/public/brand/brand-emblem.jpg`
  - 5.1-second Intro Video: `/public/brand/intro-video.mp4`
  - Multi-size Favicons & App Icons: `/public/favicon.ico`, `/public/apple-touch-icon.png`, `/public/android-chrome-192x192.png`, `/public/android-chrome-512x512.png`.

---

## 2. Platform Architecture & Capabilities

### Public Frontend & Conversion Engine
- **First-Entry Intro Reveal**: Full-screen 5.1s H.264 video playback with muted autoplay, `playsInline`, Skip button, branded poster fallback, upward slide transition upon completion, session storage (`b2w_intro_seen`) once-per-session guard, and "Replay Intro" control in footer.
- **Top Announcement Bar**: Admin-managed notification banner.
- **Hero & Search Module**: Real-time property filter bar across Buy / Rent / Commercial, location, property type, budget, and bedrooms, synchronised with URL query parameters.
- **Property Catalogue & Detail Pages**:
  - Complete multi-filter system with active chips and URL persistence.
  - Interactive Map view vs. Grid view toggle with locality clusters and privacy-aware address masking.
  - Detail page with large responsive image gallery, full-screen modal lightbox, carpet area vs built-up specs, RERA registration numbers, amenities, and assigned advisor profile.
  - Direct inquiry and "Schedule a Viewing" appointment booking.
  - Share via clipboard and WhatsApp.
- **Content Pages**:
  - `/locations` & `/locations/[slug]`: Neighbourhood character, connectivity links, and benchmark ₹/sq ft rates.
  - `/services`: Residential buying, corporate leasing, luxury penthouses, legal due diligence.
  - `/about`: Company story, 4 trust anchors, leadership team.
  - `/agents` & `/agents/[slug]`: Advisor directory with direct contact links and assigned listings.
  - `/insights` & `/insights/[slug]`: Practical guides on RERA title due diligence, market outlook, and commercial leasing.
  - `/contact`: General enquiry, direct phone, WhatsApp link, and office location card.
  - `/book-a-visit`: Dedicated on-site visit scheduling flow.
  - `/privacy-policy`, `/terms`, `/disclaimer`: Fully compliant legal documents.
  - `/thank-you`: Confirmation page with direct advisor escalation numbers.
  - `/404`: Custom branded HTTP 404 page with search redirection.

### Administration Portal & Lightweight CRM (`/admin`)
- **Access Passkey**: Default demo passkey: `admin123`
- **Dashboard**: Live counts for total properties, active listings, total inquiries, new leads, scheduled viewings, lead source attribution, and pipeline breakdown.
- **Property Portfolio CRUD**:
  - Create, edit, toggle featured, update pricing, update availability dates, and delete listings.
  - Clear `DEMO` watermarking for test environments.
- **Lead CRM & Pipeline**:
  - Multi-tab lead inbox (`New`, `Assigned`, `Contacted`, `Qualified`, `Viewing scheduled`, `Negotiation`, `Converted`, `Closed`, `Spam`).
  - Search by visitor name, email, phone, or target property.
  - Assign leads to specific property advisors.
  - Add internal timestamped notes and log contact attempts.
  - Track viewing appointments.
- **Content Management (CMS)**:
  - Live editing of announcement banner text, hero headline/subhead, phone numbers, email, and RERA disclaimer.
- **Roles & Permissions (RBAC)**:
  - Matrix display for Owner / Super Admin, Listing Manager, Sales Manager, Agent, Content Editor, and Read-only Analyst.

---

## 3. Data Storage & Persistence

The platform features a typed repository pattern:
- **Local / Self-Contained Development**: Persistent file-backed JSON database at `data/database.json`. All property additions, edits, lead captures, status updates, notes, and CMS changes are written to disk and survive server restarts.
- **Production PostgreSQL Migration**: Complete relational SQL schema provided in `scripts/schema.sql` ready for Amazon RDS PostgreSQL (Multi-AZ) with tables: `users`, `agents`, `locations`, `properties`, `property_media`, `leads`, `lead_activities`, `viewing_appointments`, and `audit_logs`.

---

## 4. Production High-Availability Infrastructure (AWS)

As designed in `infra/main.tf` conforming to Section 13 of the brief:
```
Visitor
  │
  ▼
Route 53 (DNS)
  │
  ▼
CloudFront CDN + AWS WAF (DDoS / Rate Limiting / Bot Protection)
  ├── Static assets, images, video → S3 Object Storage
  │
  ▼
Application Load Balancer (HTTPS Multi-AZ)
  │
  ▼
ECS Fargate Tasks (Min 2 tasks across 2-3 Availability Zones)
  ├── Next.js Application Service
  ├── Background Worker Queue Consumer
  │             │
  ▼             ▼
Amazon RDS     ElastiCache Redis     Amazon SQS
PostgreSQL     (Session & Search     (Notification &
Multi-AZ       Response Cache)       Lead Queue)
```

---

## 5. Load Testing (k6)

Load testing scripts are provided in `tests/load/k6-load-test.js`:
- Staged execution: Ramp up to 20 users (expected peak), sustain, burst to 50 users (2x burst), and verify:
  - `p(95)` read latency < 500ms
  - `p(95)` search latency < 1000ms
  - Error rate < 1%

To run with k6:
```bash
k6 run tests/load/k6-load-test.js
```

---

## 6. Local Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server (runs on port 4000)
npm run dev

# 3. Build for production
npm run build

# 4. Start production server (runs on port 4000)
npm start
```
Public site runs at `http://localhost:4000`  
Admin portal runs at `http://localhost:4000/admin` (Passkey: `admin123`)

---

## 7. Remaining Owner Inputs Prior to Public Launch

1. **Production Domain & DNS**: Point Route 53 or external DNS to the CloudFront distribution / ALB.
2. **Transactional Messaging Credentials**: Connect Amazon SES, Twilio, or WhatsApp Cloud API for live SMS/email notifications.
3. **Replace Demo Listings with Live Inventory**: Remove all records tagged `isDemo: true` via `/admin` and insert verified real property inventory, deeds, and RERA numbers.
4. **Google Search Console & GA4**: Replace sample GA4 ID in `src/lib/analytics.ts` with brand-owned Measurement ID.
