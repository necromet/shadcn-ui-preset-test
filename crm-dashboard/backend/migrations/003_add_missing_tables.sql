-- Migration: 003_add_missing_tables.sql
-- Description: Tables for status_history, events, and event_participation

-- Status history table
CREATE TABLE IF NOT EXISTS cnx_jemaat_status_history (
    id          SERIAL PRIMARY KEY,
    no_jemaat   INT NOT NULL,
    status      member_status_enum NOT NULL,
    changed_at  TIMESTAMP DEFAULT NOW(),
    reason      TEXT NULL
);

-- Events history table
CREATE TABLE IF NOT EXISTS event_history (
    event_id        SERIAL PRIMARY KEY,
    event_name      VARCHAR(255) NOT NULL,
    event_date      DATE NOT NULL,
    category        event_category_enum NOT NULL,
    location        VARCHAR(255) NULL,
    description     TEXT NULL
);

-- Event participation table
CREATE TABLE IF NOT EXISTS event_participation (
    id              SERIAL PRIMARY KEY,
    event_id        INT NOT NULL,
    no_jemaat       INT NOT NULL,
    role            event_role_enum NOT NULL DEFAULT 'Peserta',
    registered_at   TIMESTAMP DEFAULT NOW(),
    UNIQUE(event_id, no_jemaat)
);

-- Foreign keys for new tables
ALTER TABLE cnx_jemaat_status_history
    ADD CONSTRAINT fk_status_history_jemaat
    FOREIGN KEY (no_jemaat) REFERENCES cnx_jemaat_clean(no_jemaat)
    ON DELETE CASCADE;

ALTER TABLE event_participation
    ADD CONSTRAINT fk_event_participation_event
    FOREIGN KEY (event_id) REFERENCES event_history(event_id)
    ON DELETE CASCADE;

ALTER TABLE event_participation
    ADD CONSTRAINT fk_event_participation_jemaat
    FOREIGN KEY (no_jemaat) REFERENCES cnx_jemaat_clean(no_jemaat)
    ON DELETE CASCADE;

-- Indexes for new tables
CREATE INDEX IF NOT EXISTS idx_status_history_no_jemaat ON cnx_jemaat_status_history(no_jemaat);
CREATE INDEX IF NOT EXISTS idx_status_history_status ON cnx_jemaat_status_history(status);
CREATE INDEX IF NOT EXISTS idx_status_history_changed_at ON cnx_jemaat_status_history(changed_at);
CREATE INDEX IF NOT EXISTS idx_status_history_jemaat_date ON cnx_jemaat_status_history(no_jemaat, changed_at);

CREATE INDEX IF NOT EXISTS idx_event_history_date ON event_history(event_date);
CREATE INDEX IF NOT EXISTS idx_event_history_category ON event_history(category);

CREATE INDEX IF NOT EXISTS idx_event_participation_event ON event_participation(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participation_jemaat ON event_participation(no_jemaat);
CREATE INDEX IF NOT EXISTS idx_event_participation_role ON event_participation(role);
