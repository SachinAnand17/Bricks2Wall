-- Bricks2Wall Production PostgreSQL Schema for AWS RDS (Multi-AZ)
-- Compliant with Master Brief Section 11 & 13

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & STAFF
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(64) NOT NULL DEFAULT 'agent',
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. AGENTS / ADVISORS
CREATE TABLE IF NOT EXISTS agents (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(255) NOT NULL,
    license_number VARCHAR(128),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    whatsapp VARCHAR(32) NOT NULL,
    photo_url TEXT NOT NULL,
    bio TEXT NOT NULL,
    specializations TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. LOCATIONS / LOCALITIES
CREATE TABLE IF NOT EXISTS locations (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(128) NOT NULL,
    tagline VARCHAR(255),
    overview TEXT,
    key_connectivity TEXT[] DEFAULT '{}',
    lifestyle_amenities TEXT[] DEFAULT '{}',
    average_price_sqft VARCHAR(128),
    hero_image_url TEXT,
    lat NUMERIC(10, 7),
    lng NUMERIC(10, 7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PROPERTIES (Active Portfolio)
CREATE TABLE IF NOT EXISTS properties (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    tagline TEXT,
    transaction_type VARCHAR(32) NOT NULL CHECK (transaction_type IN ('buy', 'rent', 'commercial')),
    property_type VARCHAR(64) NOT NULL,
    price NUMERIC(15, 2) NOT NULL,
    price_display VARCHAR(128),
    contact_for_price BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT TRUE,
    is_demo BOOLEAN DEFAULT FALSE,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    
    city VARCHAR(128) NOT NULL,
    locality VARCHAR(255) NOT NULL,
    sub_locality VARCHAR(255),
    address_summary TEXT NOT NULL,
    lat NUMERIC(10, 7),
    lng NUMERIC(10, 7),
    
    built_up_area_sqft NUMERIC(10, 2) NOT NULL,
    carpet_area_sqft NUMERIC(10, 2),
    bedrooms INTEGER,
    bathrooms INTEGER,
    balconies INTEGER,
    parking_spaces INTEGER DEFAULT 1,
    furnishing_status VARCHAR(64),
    possession_status VARCHAR(64),
    possession_date VARCHAR(64),
    facing VARCHAR(32),
    floor_number VARCHAR(64),
    total_floors INTEGER,
    maintenance_charges VARCHAR(128),
    
    description TEXT NOT NULL,
    highlights TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    
    rera_registration_number VARCHAR(128),
    rera_approved BOOLEAN DEFAULT FALSE,
    project_developer VARCHAR(255),
    
    assigned_agent_id VARCHAR(64) REFERENCES agents(id) ON DELETE SET NULL,
    availability_confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for ultra-fast query performance
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_transaction_type ON properties(transaction_type);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_locality ON properties(locality);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

-- 5. PROPERTY MEDIA
CREATE TABLE IF NOT EXISTS property_media (
    id VARCHAR(64) PRIMARY KEY,
    property_id VARCHAR(64) NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    alt_text TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 1
);

-- 6. LEADS / CRM INQUIRIES
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    enquiry_type VARCHAR(64) NOT NULL,
    property_id VARCHAR(64) REFERENCES properties(id) ON DELETE SET NULL,
    property_title VARCHAR(255),
    status VARCHAR(64) NOT NULL DEFAULT 'New',
    preferred_contact_method VARCHAR(32) DEFAULT 'phone',
    preferred_time VARCHAR(128),
    viewing_date DATE,
    viewing_time_slot VARCHAR(64),
    message TEXT,
    source VARCHAR(64) DEFAULT 'website',
    assigned_to_agent_id VARCHAR(64) REFERENCES agents(id) ON DELETE SET NULL,
    consent_given BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- 7. LEAD ACTIVITIES & NOTES
CREATE TABLE IF NOT EXISTS lead_activities (
    id VARCHAR(64) PRIMARY KEY,
    lead_id VARCHAR(64) NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    activity_type VARCHAR(64) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. VIEWING APPOINTMENTS
CREATE TABLE IF NOT EXISTS viewing_appointments (
    id VARCHAR(64) PRIMARY KEY,
    lead_id VARCHAR(64) REFERENCES leads(id) ON DELETE SET NULL,
    property_id VARCHAR(64) REFERENCES properties(id) ON DELETE SET NULL,
    property_title VARCHAR(255) NOT NULL,
    visitor_name VARCHAR(255) NOT NULL,
    visitor_phone VARCHAR(32) NOT NULL,
    visitor_email VARCHAR(255),
    preferred_date DATE NOT NULL,
    time_slot VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'pending',
    assigned_agent_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor VARCHAR(255) NOT NULL,
    action VARCHAR(128) NOT NULL,
    entity VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
