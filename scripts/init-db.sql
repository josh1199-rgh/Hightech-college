CREATE DATABASE IF NOT EXISTS hightech_college;

\c hightech_college;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category_id VARCHAR(255) NOT NULL,
    duration VARCHAR(50),
    level VARCHAR(50),
    format VARCHAR(100),
    description TEXT,
    skills TEXT[],
    next_cohort VARCHAR(100),
    tuition VARCHAR(50),
    rating FLOAT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    image VARCHAR(500),
    exam_body VARCHAR(100),
    location VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_title ON courses USING gin (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses (category_id);
CREATE INDEX IF NOT EXISTS idx_courses_active_featured ON courses (active, featured);
CREATE INDEX IF NOT EXISTS idx_courses_next_cohort ON courses (next_cohort);

CREATE TABLE IF NOT EXISTS course_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    program VARCHAR(255) NOT NULL,
    kcse_grade VARCHAR(10),
    intake_period VARCHAR(100),
    message TEXT,
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    status_notes TEXT,
    course_id UUID REFERENCES courses(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON student_applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_created ON student_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_course ON student_applications (course_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON student_applications (applicant_name);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_composite ON student_applications (status, created_at DESC);

CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Unread',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_status ON contact_messages (status);
CREATE INDEX IF NOT EXISTS idx_messages_created ON contact_messages (created_at DESC);

CREATE TABLE IF NOT EXISTS campus_life_highlights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    image VARCHAR(500),
    description TEXT,
    tag VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campus_life_category ON campus_life_highlights (category);

CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_banner TEXT,
    announcement_active BOOLEAN DEFAULT TRUE,
    hotline_phone VARCHAR(20),
    whatsapp_phone VARCHAR(20),
    campus_location VARCHAR(255),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(50) NOT NULL,
    entity VARCHAR(50),
    entity_id VARCHAR(255),
    user_id UUID REFERENCES users(id),
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs (created_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_applications_updated_at BEFORE UPDATE ON student_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_campus_life_updated_at BEFORE UPDATE ON campus_life_highlights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION insert_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (action, entity, entity_id, user_id, ip_address, user_agent)
    VALUES (TG_OP, TG_TABLE_NAME, NEW.id, NEW.id, NULL, NULL);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hightech;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hightech;