-- =============================================================================
-- STUDIFY SYSTEM - SUPABASE POSTGRESQL DATABASE SCHEMA (V-PRO MAX)
-- =============================================================================

-- 1. جدول المراكز / المديرين (Centers / Managers)
CREATE TABLE IF NOT EXISTS centers (
    id TEXT PRIMARY KEY,
    manager_name TEXT,
    password TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    eval_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. جدول المساعدين وصلاحياتهم (Assistants & Permissions)
CREATE TABLE IF NOT EXISTS assistants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_assistants_center ON assistants(center_id);

-- 3. جدول الباقات والأسعار (Packages & Fees)
CREATE TABLE IF NOT EXISTS packages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC DEFAULT 0,
    has_installments BOOLEAN DEFAULT false,
    installment_price NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (center_id, name)
);
CREATE INDEX IF NOT EXISTS idx_packages_center ON packages(center_id);

-- 4. جدول الطلاب الشامل (Students Full Registry)
CREATE TABLE IF NOT EXISTS students (
    id TEXT NOT NULL,
    center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
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
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (center_id, id)
);
CREATE INDEX IF NOT EXISTS idx_students_center ON students(center_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(center_id, status);

-- 5. جدول سجلات الحضور اليومي (Attendance Daily Logs)
CREATE TABLE IF NOT EXISTS attendance_records (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    student_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (center_id, date, student_id)
);
CREATE INDEX IF NOT EXISTS idx_att_center_date ON attendance_records(center_id, date);

-- 6. جدول الإيرادات والمقبوضات (Finances Revenue)
CREATE TABLE IF NOT EXISTS finances_revenue (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    source TEXT DEFAULT 'manual',
    method TEXT DEFAULT 'cash',
    student_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rev_center_date ON finances_revenue(center_id, date);

-- 7. جدول المصروفات (Finances Expenses)
CREATE TABLE IF NOT EXISTS finances_expenses (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    reason TEXT NOT NULL,
    method TEXT DEFAULT 'cash',
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_exp_center_date ON finances_expenses(center_id, date);

-- 8. جدول المذكرات والكتب (Booklets Stock & Sales)
CREATE TABLE IF NOT EXISTS booklets (
    id TEXT NOT NULL,
    center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC DEFAULT 0,
    stock INT DEFAULT 0,
    sales JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (center_id, id)
);
CREATE INDEX IF NOT EXISTS idx_booklets_center ON booklets(center_id);

-- 9. جدول المناهج الدراسية (Syllabus)
CREATE TABLE IF NOT EXISTS syllabus (
    id TEXT NOT NULL,
    center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
    class_name TEXT,
    title TEXT,
    lectures JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (center_id, id)
);
CREATE INDEX IF NOT EXISTS idx_syllabus_center ON syllabus(center_id);

-- 10. جدول طلاب الحصة السريعة (Session Students)
CREATE TABLE IF NOT EXISTS session_students (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    student_name TEXT,
    phone TEXT,
    class_name TEXT,
    paid NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_session_st_center_date ON session_students(center_id, date);

-- 11. جدول طلبات وقرارات المدير (Manager Requests / Decisions)
CREATE TABLE IF NOT EXISTS manager_requests (
    id TEXT PRIMARY KEY,
    center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
    assistant_name TEXT,
    type TEXT NOT NULL,
    student_id TEXT,
    student_name TEXT,
    amount NUMERIC DEFAULT 0,
    reason TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_requests_center ON manager_requests(center_id);

-- 12. جدول رسائل وإشعارات المساعدين (Assistant Notifications)
CREATE TABLE IF NOT EXISTS assistant_messages (
    id TEXT PRIMARY KEY,
    center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
    title TEXT,
    message TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_asst_msgs_center ON assistant_messages(center_id);

-- 13. جدول الإعلانات والتوجيهات العامة (Global Announcements)
CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY,
    center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT,
    author TEXT,
    read_by JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_announcements_center ON announcements(center_id);

-- 14. جدول سجل النشاطات (Activity Audit Logs)
CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
    user_name TEXT,
    action TEXT,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_logs_center ON activity_logs(center_id);

-- 15. جدول حالة فتح/إغلاق اليومية (Daily Shift Status)
CREATE TABLE IF NOT EXISTS daily_status (
    center_id TEXT PRIMARY KEY REFERENCES centers(id) ON DELETE CASCADE,
    is_approved BOOLEAN DEFAULT false,
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    shift_status TEXT DEFAULT 'closed',
    settings JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR SECURE CLIENT-SIDE ACCESS
-- =============================================================================
ALTER TABLE centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE finances_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE finances_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE booklets ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_status ENABLE ROW LEVEL SECURITY;

-- Allow anon key full CRUD
CREATE POLICY "Anon Full Access Centers" ON centers FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Assistants" ON assistants FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Packages" ON packages FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Students" ON students FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Attendance" ON attendance_records FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Revenue" ON finances_revenue FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Expenses" ON finances_expenses FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Booklets" ON booklets FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Syllabus" ON syllabus FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access SessionStudents" ON session_students FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Requests" ON manager_requests FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Messages" ON assistant_messages FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Announcements" ON announcements FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Logs" ON activity_logs FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access DailyStatus" ON daily_status FOR ALL TO anon USING (true) WITH CHECK (true);

-- Enable Realtime on critical live tables
ALTER PUBLICATION supabase_realtime ADD TABLE manager_requests, assistant_messages, announcements, daily_status;
