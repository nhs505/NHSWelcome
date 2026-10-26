-- ============================================================================
-- STF-NHS Portal v3.0 — MySQL 8.0+ Enterprise Database Schema & Seed Data
-- Upgradable PDO Architecture (MySQL / MariaDB / PostgreSQL / SQLite compatible)
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. NHS Specialized Groups (6 Groups Total: 00 to 05)
CREATE TABLE IF NOT EXISTS nhs_groups (
    id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    group_code              VARCHAR(10) NOT NULL UNIQUE,
    slug                    VARCHAR(32) NOT NULL UNIQUE,
    icon                    VARCHAR(16) NOT NULL DEFAULT '🔧',
    title_en                VARCHAR(120) NOT NULL,
    title_tl                VARCHAR(120) NOT NULL,
    desc_en                 TEXT NOT NULL,
    desc_tl                 TEXT NOT NULL,
    status                  ENUM('open', 'standby') NOT NULL DEFAULT 'standby',
    build_progress          TINYINT UNSIGNED NOT NULL DEFAULT 15,
    accent_color            VARCHAR(16) NOT NULL DEFAULT '#f0a500',
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users Registry (Admins, Project Members, Plenary Class, Trainees)
CREATE TABLE IF NOT EXISTS users (
    id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sector_code             VARCHAR(32) NOT NULL UNIQUE,
    username                VARCHAR(64) NOT NULL UNIQUE,
    full_name               VARCHAR(120) NOT NULL,
    email                   VARCHAR(160) NOT NULL UNIQUE,
    password_hash           VARCHAR(255) NOT NULL,
    role                    ENUM('admin', 'member', 'trainee') NOT NULL DEFAULT 'trainee',
    member_type             ENUM('none', 'plenary', 'project_member') NOT NULL DEFAULT 'none',
    primary_group_id        INT UNSIGNED NULL,
    avatar_url              TEXT NULL,
    bio                     VARCHAR(255) NULL,
    is_active               TINYINT(1) NOT NULL DEFAULT 1,
    availability_status     ENUM('available', 'busy', 'offline') NOT NULL DEFAULT 'available',
    orientation_completed   TINYINT(1) NOT NULL DEFAULT 0,
    orientation_pct         TINYINT UNSIGNED NOT NULL DEFAULT 0,
    created_by_admin_id     INT UNSIGNED NULL,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_group FOREIGN KEY (primary_group_id) REFERENCES nhs_groups(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Active User Sessions (Enforces Single-Device Lock & Auto-Logout on Tab Close)
CREATE TABLE IF NOT EXISTS user_sessions (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id                 INT UNSIGNED NOT NULL,
    session_token_hash      CHAR(64) NOT NULL UNIQUE,
    device_fingerprint      VARCHAR(255) NOT NULL,
    ip_address              VARCHAR(45) NOT NULL,
    user_agent              VARCHAR(255) NOT NULL,
    is_active               TINYINT(1) NOT NULL DEFAULT 1,
    last_heartbeat_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at              TIMESTAMP NOT NULL,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_active_user_session (user_id, is_active, expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Penetration Defense: Login Brute-Force Rate Limiter
CREATE TABLE IF NOT EXISTS login_attempts (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username_or_ip          VARCHAR(160) NOT NULL,
    attempted_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    was_successful          TINYINT(1) NOT NULL DEFAULT 0,
    INDEX idx_attempt_lookup (username_or_ip, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Per-User Exclusive Settings
CREATE TABLE IF NOT EXISTS user_settings (
    user_id                 INT UNSIGNED PRIMARY KEY,
    theme_mode              ENUM('dark', 'light') NOT NULL DEFAULT 'dark',
    accent_theme            VARCHAR(32) NOT NULL DEFAULT 'gold',
    ui_density              ENUM('comfortable', 'compact') NOT NULL DEFAULT 'comfortable',
    motion_enabled          TINYINT(1) NOT NULL DEFAULT 1,
    glass_blur              TINYINT(1) NOT NULL DEFAULT 1,
    language_code           VARCHAR(10) NOT NULL DEFAULT 'en',
    custom_languages_json   JSON NULL,
    notify_deadlines        TINYINT(1) NOT NULL DEFAULT 1,
    notify_team_updates     TINYINT(1) NOT NULL DEFAULT 1,
    notify_trainee_grad     TINYINT(1) NOT NULL DEFAULT 1,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Project Teams
CREATE TABLE IF NOT EXISTS teams (
    id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    team_name               VARCHAR(120) NOT NULL UNIQUE,
    group_id                INT UNSIGNED NULL,
    lead_user_id            INT UNSIGNED NULL,
    description             TEXT NULL,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_teams_group FOREIGN KEY (group_id) REFERENCES nhs_groups(id) ON DELETE SET NULL,
    CONSTRAINT fk_teams_lead FOREIGN KEY (lead_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Team Memberships
CREATE TABLE IF NOT EXISTS team_members (
    team_id                 INT UNSIGNED NOT NULL,
    user_id                 INT UNSIGNED NOT NULL,
    assigned_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id, user_id),
    CONSTRAINT fk_tm_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_tm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Projects (6 Lifecycle States, Default 'Draft', Default Priority 'None')
CREATE TABLE IF NOT EXISTS projects (
    id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_name            VARCHAR(180) NOT NULL,
    description             TEXT NOT NULL,
    status                  ENUM('Draft', 'In-Progress', 'On-Hold', 'Finish project', 'Archived', 'Deleted')
                            NOT NULL DEFAULT 'Draft',
    priority                ENUM('None', 'Low', 'Medium', 'High')
                            NOT NULL DEFAULT 'None',
    progress_pct            TINYINT UNSIGNED NOT NULL DEFAULT 0,
    assigned_team_id        INT UNSIGNED NULL,
    deadline_start          DATETIME NULL,
    deadline_end            DATETIME NULL,
    created_by_user_id      INT UNSIGNED NOT NULL,
    created_by_label        VARCHAR(120) NOT NULL,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_projects_team FOREIGN KEY (assigned_team_id) REFERENCES teams(id) ON DELETE SET NULL,
    CONSTRAINT fk_projects_creator FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Project File & Image Attachments
CREATE TABLE IF NOT EXISTS project_attachments (
    id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id              INT UNSIGNED NOT NULL,
    file_name               VARCHAR(255) NOT NULL,
    mime_type               VARCHAR(100) NOT NULL,
    file_size_bytes         INT UNSIGNED NOT NULL DEFAULT 0,
    storage_path            TEXT NOT NULL,
    uploaded_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attach_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Calendar Tasks & Auto-Synced Project Deadlines
CREATE TABLE IF NOT EXISTS calendar_events (
    id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title                   VARCHAR(180) NOT NULL,
    description             TEXT NULL,
    tag                     VARCHAR(64) NOT NULL DEFAULT 'General',
    priority                ENUM('None', 'Low', 'Medium', 'High') NOT NULL DEFAULT 'None',
    preset_type             ENUM('today', 'tomorrow', 'next_week', 'next_month', 'custom', 'project_sync')
                            NOT NULL DEFAULT 'custom',
    start_datetime          DATETIME NOT NULL,
    end_datetime            DATETIME NOT NULL,
    linked_project_id       INT UNSIGNED NULL,
    added_by_user_id        INT UNSIGNED NOT NULL,
    added_by_label          VARCHAR(120) NOT NULL,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cal_project FOREIGN KEY (linked_project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_cal_user FOREIGN KEY (added_by_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. User Lesson Progress
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    user_id                 INT UNSIGNED NOT NULL,
    lesson_key              VARCHAR(64) NOT NULL,
    completed_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, lesson_key),
    CONSTRAINT fk_ulp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed 6 NHS Groups
INSERT IGNORE INTO nhs_groups (id, group_code, slug, icon, title_en, title_tl, desc_en, desc_tl, status, build_progress, accent_color) VALUES
(1, '00', 'hardware',  '🔧', 'Hardware Group',            'Hardware Group',            'PC assembly, diagnostics, BIOS, and OS imaging.',        'Pagbuo at pag-aayos ng computer at OS installation.', 'open',    100, '#4ade80'),
(2, '01', 'iot',       '🌐', 'I.O.T Group',               'I.O.T Group',               'Sensors, microcontrollers, and smart automation.',       'Pagkokonekta ng mga sensor at smart devices.',         'standby', 40,  '#c084fc'),
(3, '02', 'network',   '📡', 'Network Group',             'Network Group',             'Switches, routers, VLANs, and Wi-Fi engineering.',       'Pamamahala ng Wi-Fi, switches, VLANs, at routers.',    'standby', 50,  '#38bdf8'),
(4, '03', 'admin',     '🗂️', 'Admin Group',               'Admin Group',               'Operations, documentation, and account governance.',     'Pamamahala ng dokumentasyon at sistema ng operasyon.', 'standby', 35,  '#4ade80'),
(5, '04', 'inventory', '📦', 'Inventory Group',           'Inventory Group',           'Hardware asset tracking and lifecycle auditing.',        'Pagsubaybay sa lahat ng pisikal na kagamitan.',        'standby', 30,  '#fb923c'),
(6, '05', 'itinfra',   '🖥️', 'I.T. Infrastructure Group', 'I.T. Infrastructure Group', 'Proxmox VE, Linux servers, Docker, and SQL databases.', 'Mga server, Proxmox VM, Linux, at SQL databases.',     'open',    100, '#f0a500');

SET FOREIGN_KEY_CHECKS = 1;
