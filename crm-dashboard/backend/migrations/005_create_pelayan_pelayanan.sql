-- Migration: 005_create_pelayan_pelayanan.sql
-- Description: Create junction table for pelayan-pelayanan many-to-many relationship

-- 1. Create junction table
CREATE TABLE IF NOT EXISTS pelayan_pelayanan (
    id SERIAL PRIMARY KEY,
    no_jemaat INTEGER NOT NULL,
    pelayanan_id VARCHAR(5) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    FOREIGN KEY (no_jemaat) REFERENCES pelayan(no_jemaat) ON DELETE CASCADE,
    FOREIGN KEY (pelayanan_id) REFERENCES pelayanan_info(pelayanan_id) ON DELETE CASCADE,
    UNIQUE (no_jemaat, pelayanan_id)
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS IX_pelayan_pelayanan_no_jemaat ON pelayan_pelayanan(no_jemaat);
CREATE INDEX IF NOT EXISTS IX_pelayan_pelayanan_pelayanan_id ON pelayan_pelayanan(pelayanan_id);
CREATE INDEX IF NOT EXISTS IX_pelayan_pelayanan_active ON pelayan_pelayanan(is_active);

-- 3. Auto update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pelayan_pelayanan_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_pelayan_pelayanan_update_timestamp ON pelayan_pelayanan;
CREATE TRIGGER trigger_pelayan_pelayanan_update_timestamp
BEFORE UPDATE ON pelayan_pelayanan
FOR EACH ROW EXECUTE FUNCTION update_pelayan_pelayanan_updated_at();

-- 4. Auto maintain total_pelayanan on pelayan table
CREATE OR REPLACE FUNCTION update_pelayan_total_pelayanan()
RETURNS TRIGGER AS $$
DECLARE
    target_no_jemaat INTEGER;
BEGIN
    IF TG_OP = 'DELETE' THEN
        target_no_jemaat := OLD.no_jemaat;
    ELSE
        target_no_jemaat := NEW.no_jemaat;
    END IF;

    UPDATE pelayan
    SET total_pelayanan = (
        SELECT COUNT(*) FROM pelayan_pelayanan
        WHERE no_jemaat = target_no_jemaat AND is_active = TRUE
    )
    WHERE no_jemaat = target_no_jemaat;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_total_pelayanan ON pelayan_pelayanan;
CREATE TRIGGER trigger_update_total_pelayanan
AFTER INSERT OR UPDATE OR DELETE ON pelayan_pelayanan
FOR EACH ROW EXECUTE FUNCTION update_pelayan_total_pelayanan();

-- 5. Data migration: migrate existing boolean columns to junction table
-- Matches by nama_pelayanan to be resilient to different ID formats
INSERT INTO pelayan_pelayanan (no_jemaat, pelayanan_id, is_active)
SELECT p.no_jemaat, pi.pelayanan_id, TRUE
FROM pelayan p
CROSS JOIN LATERAL (
    VALUES
        ('is_wl', 'Worship Leader'),
        ('is_singer', 'Singer'),
        ('is_pianis', 'Pianist'),
        ('is_saxophone', 'Saxophone'),
        ('is_filler', 'Filler Musician'),
        ('is_bass_gitar', 'Bass Guitarist'),
        ('is_drum', 'Drummer'),
        ('is_mulmed', 'Multimedia'),
        ('is_sound', 'Sound Engineer'),
        ('is_caringteam', 'Caring Team'),
        ('is_connexion_crew', 'Connexion Crew'),
        ('is_supporting_crew', 'Supporting Crew'),
        ('is_cforce', 'CForce'),
        ('is_cg_leader', 'CG Leader'),
        ('is_community_pic', 'Community PIC'),
        ('is_others', 'Others')
) AS mappings(col_name, role_name)
JOIN pelayanan_info pi ON pi.nama_pelayanan = mappings.role_name
WHERE (CASE mappings.col_name
    WHEN 'is_wl' THEN p.is_wl
    WHEN 'is_singer' THEN p.is_singer
    WHEN 'is_pianis' THEN p.is_pianis
    WHEN 'is_saxophone' THEN p.is_saxophone
    WHEN 'is_filler' THEN p.is_filler
    WHEN 'is_bass_gitar' THEN p.is_bass_gitar
    WHEN 'is_drum' THEN p.is_drum
    WHEN 'is_mulmed' THEN p.is_mulmed
    WHEN 'is_sound' THEN p.is_sound
    WHEN 'is_caringteam' THEN p.is_caringteam
    WHEN 'is_connexion_crew' THEN p.is_connexion_crew
    WHEN 'is_supporting_crew' THEN p.is_supporting_crew
    WHEN 'is_cforce' THEN p.is_cforce
    WHEN 'is_cg_leader' THEN p.is_cg_leader
    WHEN 'is_community_pic' THEN p.is_community_pic
    WHEN 'is_others' THEN p.is_others
END) = 1
ON CONFLICT (no_jemaat, pelayanan_id) DO NOTHING;
