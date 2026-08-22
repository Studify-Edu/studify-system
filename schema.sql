-- =============================================================================
-- STUDIFY SYSTEM - SUPABASE POSTGRESQL SCHEMA (SINGLE-TENANT & SECURE)
-- =============================================================================

-- 1. جدول الإعدادات العامة (Settings) - يدمج بيانات المركز، وحالة اليومية، والإعلانات
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY DEFAULT 1,
    manager_name TEXT DEFAULT 'المدير العام',
    daily_shift_status TEXT DEFAULT 'closed',
    daily_approved_by TEXT,
    announcements JSONB DEFAULT '[]'::jsonb,
    eval_data JSONB DEFAULT '{}'::jsonb,
    config JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- 2. جدول المساعدين (Assistants) - يربط حساب Supabase Auth بصلاحيات المساعد
CREATE TABLE IF NOT EXISTS assistants (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. جدول الباقات والأسعار (Packages)
CREATE TABLE IF NOT EXISTS packages (
    name TEXT PRIMARY KEY,
    price NUMERIC DEFAULT 0,
    has_installments BOOLEAN DEFAULT false,
    installment_price NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. جدول الطلاب (Students)
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    parent_phone TEXT,
    class_name TEXT,
    payment_plan TEXT DEFAULT 'cash',
    paid NUMERIC DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    notes TEXT,
    status TEXT DEFAULT 'active',
    installments JSONB DEFAULT '[]'::jsonb,
    payments JSONB DEFAULT '[]'::jsonb,
    attendance_dates JSONB DEFAULT '[]'::jsonb,
    last_modified BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);

-- 5. جدول سجلات الحضور اليومي (Attendance)
CREATE TABLE IF NOT EXISTS attendance_records (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    date DATE NOT NULL,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (date, student_id)
);
CREATE INDEX IF NOT EXISTS idx_att_date ON attendance_records(date);

-- 6. جدول الماليات (Finances) - يدمج الإيرادات والمصروفات
CREATE TABLE IF NOT EXISTS finances (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('revenue', 'expense')),
    date DATE NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    description TEXT,
    source TEXT DEFAULT 'manual',
    method TEXT DEFAULT 'cash',
    student_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_finances_date_type ON finances(date, type);

-- 7. جدول المذكرات (Booklets)
CREATE TABLE IF NOT EXISTS booklets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC DEFAULT 0,
    stock INT DEFAULT 0,
    sales JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. جدول المناهج (Syllabus)
CREATE TABLE IF NOT EXISTS syllabus (
    id TEXT PRIMARY KEY,
    class_name TEXT,
    title TEXT,
    lectures JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. جدول طلاب الحصة المؤقتين (Session Students)
CREATE TABLE IF NOT EXISTS session_students (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    date DATE NOT NULL,
    student_name TEXT,
    phone TEXT,
    class_name TEXT,
    paid NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_session_date ON session_students(date);

-- 10. جدول التواصل والطلبات (Communications) - يدمج طلبات المدير ورسائل المساعدين
CREATE TABLE IF NOT EXISTS communications (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('manager_request', 'assistant_message')),
    sub_type TEXT,
    sender_name TEXT,
    title TEXT,
    message TEXT,
    amount NUMERIC DEFAULT 0,
    student_id TEXT,
    status TEXT DEFAULT 'pending',
    read_by JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. جدول سجل النشاطات (Activity Logs)
CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_name TEXT,
    action TEXT,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (100% SECURE FOR AUTHENTICATED USERS ONLY)
-- =============================================================================
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE booklets ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow ONLY authenticated users (Logged in via Supabase Auth) to access data
CREATE POLICY "Auth Full Access Settings" ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Full Access Assistants" ON assistants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Full Access Packages" ON packages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Full Access Students" ON students FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Full Access Attendance" ON attendance_records FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Full Access Finances" ON finances FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Full Access Booklets" ON booklets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Full Access Syllabus" ON syllabus FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Full Access SessionStudents" ON session_students FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Full Access Communications" ON communications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth Full Access Logs" ON activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Enable Realtime on live tables
ALTER PUBLICATION supabase_realtime ADD TABLE settings, communications;
