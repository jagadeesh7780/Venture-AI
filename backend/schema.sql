-- ====================================================================
-- PostgreSQL Database Schema for AI Business Digital Twin (Step 1)
-- ====================================================================

-- 1. Create Users Table (Argon2 Hashed Passwords, Never Plain Text)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index on email for fast authentication lookups
CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);
CREATE INDEX IF NOT EXISTS ix_users_id ON users (id);

-- 2. Create Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    investment_budget NUMERIC(14, 2) NOT NULL,
    exact_location VARCHAR(500) NOT NULL,
    nearby_places TEXT NOT NULL,
    equipment_status VARCHAR(50) NOT NULL CHECK (
        equipment_status IN ('I have all equipment', 'I have some equipment', 'I need equipment')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index on business name
CREATE INDEX IF NOT EXISTS ix_businesses_name ON businesses (name);
CREATE INDEX IF NOT EXISTS ix_businesses_id ON businesses (id);
