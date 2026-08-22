-- ==============================================================================
-- V66 MIGRATION: REMOVE SUPABASE AUTH & USE NORMAL TABLES (AS REQUESTED)
-- ==============================================================================

-- 1. Create a simple table for the manager (Since auth.users is no longer used)
CREATE TABLE IF NOT EXISTS manager_account (
    id INT PRIMARY KEY DEFAULT 1,
    username TEXT DEFAULT 'ahmedqutb11232@gmail.com',
    password TEXT DEFAULT '123456'
);

-- Insert the default manager account (Change password if needed)
INSERT INTO manager_account (id, username, password) 
VALUES (1, 'ahmedqutb11232@gmail.com', '123456') 
ON CONFLICT (id) DO NOTHING;

-- 2. Drop the old assistants table (which was linked to auth.users)
DROP TABLE IF EXISTS assistants CASCADE;

-- 3. Recreate the assistants table as a normal standalone table
CREATE TABLE assistants (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. CRITICAL: Disable Row Level Security (RLS) on all tables 
-- Because we are no longer using Supabase Auth tokens, the app must access data anonymously.
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE assistants DISABLE ROW LEVEL SECURITY;
ALTER TABLE packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE finances DISABLE ROW LEVEL SECURITY;
ALTER TABLE booklets DISABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus DISABLE ROW LEVEL SECURITY;
ALTER TABLE session_students DISABLE ROW LEVEL SECURITY;
ALTER TABLE communications DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE manager_account DISABLE ROW LEVEL SECURITY;

-- 5. Drop the RPC function we made earlier as it's no longer needed
DROP FUNCTION IF EXISTS update_user_password(UUID, TEXT);
