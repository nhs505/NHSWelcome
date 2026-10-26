-- ============================================================================
-- NHS Welcome & Orientation Portal — Relational SQL Schema
-- Project Lead: Sector 111
-- Compatible with SQLite 3.35+, PostgreSQL 14+, and MySQL 8.0+
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. NHS Operational Groups (6 Groups Total: Group 00 to Group 05)
CREATE TABLE IF NOT EXISTS nhs_groups (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    group_code              VARCHAR(10) NOT NULL UNIQUE,   -- '00', '01', '02', '03', '04', '05'
    slug                    VARCHAR(32) NOT NULL UNIQUE,   -- 'hardware', 'iot', 'network', 'admin', 'inventory', 'itinfra'
    icon                    VARCHAR(16) NOT NULL DEFAULT '🔧',
    tag_en                  VARCHAR(64) NOT NULL,
    tag_tl                  VARCHAR(64) NOT NULL,
    title_en                VARCHAR(120) NOT NULL,
    title_tl                VARCHAR(120) NOT NULL,
    desc_en                 TEXT NOT NULL,
    desc_tl                 TEXT NOT NULL,
    status                  VARCHAR(16) NOT NULL DEFAULT 'standby'
                            CHECK (status IN ('open', 'standby')),
    build_progress          INTEGER NOT NULL DEFAULT 15
                            CHECK (build_progress BETWEEN 0 AND 100),
    recommended_for_recruit BOOLEAN NOT NULL DEFAULT 0,
    accent_color            VARCHAR(32) NOT NULL DEFAULT '#f0a500',
    sort_order              INTEGER NOT NULL DEFAULT 0,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Registry (Recruits, Old Members, and System Admins)
CREATE TABLE IF NOT EXISTS users (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    sector_code             VARCHAR(32) NOT NULL UNIQUE,   -- e.g., 'SECTOR-111', 'REC-2026-01'
    full_name               VARCHAR(120) NOT NULL,
    email                   VARCHAR(160) UNIQUE,
    password_hash           VARCHAR(255),
    role                    VARCHAR(16) NOT NULL DEFAULT 'recruit'
                            CHECK (role IN ('recruit', 'member', 'admin')),
    primary_group_id        INTEGER REFERENCES nhs_groups(id) ON DELETE SET NULL,
    preferred_lang          VARCHAR(5) NOT NULL DEFAULT 'en'
                            CHECK (preferred_lang IN ('en', 'tl')),
    is_active               BOOLEAN NOT NULL DEFAULT 1,
    joined_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Group Upcoming Features (Displayed when a group is in 'standby')
CREATE TABLE IF NOT EXISTS group_features (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id                INTEGER NOT NULL REFERENCES nhs_groups(id) ON DELETE CASCADE,
    feature_en              VARCHAR(200) NOT NULL,
    feature_tl              VARCHAR(200) NOT NULL,
    sort_order              INTEGER NOT NULL DEFAULT 0
);

-- 4. Learning Tracks (Belonging to Hardware Group, I.T. Infrastructure, etc.)
CREATE TABLE IF NOT EXISTS tracks (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    track_key               VARCHAR(40) NOT NULL UNIQUE,
    group_id                INTEGER NOT NULL REFERENCES nhs_groups(id) ON DELETE CASCADE,
    icon                    VARCHAR(16) NOT NULL DEFAULT '📘',
    color_hex               VARCHAR(16) NOT NULL DEFAULT '#f0a500',
    difficulty_level        VARCHAR(16) NOT NULL DEFAULT 'beginner'
                            CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    level_label_en          VARCHAR(64) NOT NULL,
    level_label_tl          VARCHAR(64) NOT NULL,
    title_en                VARCHAR(140) NOT NULL,
    title_tl                VARCHAR(140) NOT NULL,
    desc_en                 TEXT NOT NULL,
    desc_tl                 TEXT NOT NULL,
    analogy_en              TEXT NOT NULL,
    analogy_tl              TEXT NOT NULL,
    sort_order              INTEGER NOT NULL DEFAULT 0,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Lessons (In-App Lesson Viewer Modules)
CREATE TABLE IF NOT EXISTS lessons (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    track_id                INTEGER NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    lesson_number           INTEGER NOT NULL,
    title_en                VARCHAR(160) NOT NULL,
    title_tl                VARCHAR(160) NOT NULL,
    desc_en                 VARCHAR(255) NOT NULL,
    desc_tl                 VARCHAR(255) NOT NULL,
    body_en                 TEXT NOT NULL,
    body_tl                 TEXT NOT NULL,
    cli_snippet             TEXT,
    key_takeaway_en         TEXT,
    key_takeaway_tl         TEXT,
    quiz_question_en        TEXT,
    quiz_question_tl        TEXT,
    quiz_options_json       TEXT,
    quiz_correct_index      INTEGER DEFAULT 0,
    estimated_minutes       INTEGER NOT NULL DEFAULT 15,
    is_available            BOOLEAN NOT NULL DEFAULT 0,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (track_id, lesson_number)
);

-- 6. User Lesson Progress
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id                 INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id               INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    status                  VARCHAR(16) NOT NULL DEFAULT 'completed'
                            CHECK (status IN ('in_progress', 'completed')),
    quiz_passed             BOOLEAN NOT NULL DEFAULT 0,
    completed_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, lesson_id)
);

-- 7. Recruit Orientation Checklist Tasks
CREATE TABLE IF NOT EXISTS recruit_onboarding_tasks (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    task_key                VARCHAR(40) NOT NULL UNIQUE,
    title_en                VARCHAR(160) NOT NULL,
    title_tl                VARCHAR(160) NOT NULL,
    desc_en                 TEXT NOT NULL,
    desc_tl                 TEXT NOT NULL,
    sort_order              INTEGER NOT NULL DEFAULT 0
);

-- 8. User Onboarding Task Progress
CREATE TABLE IF NOT EXISTS user_onboarding_progress (
    user_id                 INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id                 INTEGER NOT NULL REFERENCES recruit_onboarding_tasks(id) ON DELETE CASCADE,
    completed_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, task_id)
);

-- 9. Operational Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    author_user_id          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    target_audience         VARCHAR(16) NOT NULL DEFAULT 'all'
                            CHECK (target_audience IN ('all', 'recruit', 'member', 'admin')),
    badge_label             VARCHAR(32) NOT NULL DEFAULT 'OPS BULLETIN',
    title_en                VARCHAR(160) NOT NULL,
    title_tl                VARCHAR(160) NOT NULL,
    body_en                 TEXT NOT NULL,
    body_tl                 TEXT NOT NULL,
    is_pinned               BOOLEAN NOT NULL DEFAULT 0,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. System Admin Audit Log
CREATE TABLE IF NOT EXISTS audit_logs (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_user_id           INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action_type             VARCHAR(64) NOT NULL,
    target_entity           VARCHAR(64) NOT NULL,
    details                 TEXT,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_tracks_group ON tracks(group_id);
CREATE INDEX IF NOT EXISTS idx_lessons_track ON lessons(track_id, lesson_number);
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_lesson_progress(user_id);
