-- Migration: 002_create_indexes.sql
-- Description: Performance indexes for common queries

-- cnx_jemaat_clean indexes
CREATE INDEX IF NOT EXISTS idx_jemaat_nama ON cnx_jemaat_clean(nama_jemaat);
CREATE INDEX IF NOT EXISTS idx_jemaat_nama_cgf ON cnx_jemaat_clean(nama_cgf);
CREATE INDEX IF NOT EXISTS idx_jemaat_gender ON cnx_jemaat_clean(jenis_kelamin);
CREATE INDEX IF NOT EXISTS idx_jemaat_domisili ON cnx_jemaat_clean(kategori_domisili);
CREATE INDEX IF NOT EXISTS idx_jemaat_bulan_lahir ON cnx_jemaat_clean(bulan_lahir);
CREATE INDEX IF NOT EXISTS idx_jemaat_kuliah_kerja ON cnx_jemaat_clean(kuliah_kerja);
CREATE INDEX IF NOT EXISTS idx_jemaat_ketertarikan ON cnx_jemaat_clean(ketertarikan_cgf);
CREATE INDEX IF NOT EXISTS idx_jemaat_handphone ON cnx_jemaat_clean(no_handphone);

-- cgf_attendance indexes
CREATE INDEX IF NOT EXISTS idx_attendance_no_jemaat ON cgf_attendance(no_jemaat);
CREATE INDEX IF NOT EXISTS idx_attendance_cg_id ON cgf_attendance(cg_id);
CREATE INDEX IF NOT EXISTS idx_attendance_tanggal ON cgf_attendance(tanggal);
CREATE INDEX IF NOT EXISTS idx_attendance_keterangan ON cgf_attendance(keterangan);
CREATE INDEX IF NOT EXISTS idx_attendance_cg_tanggal ON cgf_attendance(cg_id, tanggal);
CREATE INDEX IF NOT EXISTS idx_attendance_jemaat_tanggal ON cgf_attendance(no_jemaat, tanggal);

-- cgf_members indexes
CREATE INDEX IF NOT EXISTS idx_cgf_members_no_jemaat ON cgf_members(no_jemaat);
CREATE INDEX IF NOT EXISTS idx_cgf_members_nama_cgf ON cgf_members(nama_cgf);
CREATE INDEX IF NOT EXISTS idx_cgf_members_leader ON cgf_members(is_leader);

-- cgf_info indexes
CREATE INDEX IF NOT EXISTS idx_cgf_info_nama ON cgf_info(nama_cgf);
CREATE INDEX IF NOT EXISTS idx_cgf_info_hari ON cgf_info(hari);

-- pelayan indexes
CREATE INDEX IF NOT EXISTS idx_pelayan_nama ON pelayan(nama_jemaat);
CREATE INDEX IF NOT EXISTS idx_pelayan_total ON pelayan(total_pelayanan);

-- Foreign key constraints
ALTER TABLE cgf_attendance
    ADD CONSTRAINT fk_attendance_jemaat
    FOREIGN KEY (no_jemaat) REFERENCES cnx_jemaat_clean(no_jemaat)
    ON DELETE CASCADE;

ALTER TABLE cgf_attendance
    ADD CONSTRAINT fk_attendance_cgf
    FOREIGN KEY (cg_id) REFERENCES cgf_info(id)
    ON DELETE CASCADE;

ALTER TABLE cgf_members
    ADD CONSTRAINT fk_cgf_members_jemaat
    FOREIGN KEY (no_jemaat) REFERENCES cnx_jemaat_clean(no_jemaat)
    ON DELETE CASCADE;

ALTER TABLE pelayan
    ADD CONSTRAINT fk_pelayan_jemaat
    FOREIGN KEY (no_jemaat) REFERENCES cnx_jemaat_clean(no_jemaat)
    ON DELETE CASCADE;
