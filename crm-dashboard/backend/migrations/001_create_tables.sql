-- Migration: 001_create_tables.sql
-- Description: Initial schema creation for CRM Dashboard

-- Create enum type for attendance status
DO $$ BEGIN
    CREATE TYPE keterangan_enum AS ENUM ('hadir', 'izin', 'tidak_hadir', 'tamu');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create enum type for status history
DO $$ BEGIN
    CREATE TYPE member_status_enum AS ENUM ('Active', 'Inactive', 'No Information', 'Moved');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create enum type for event categories
DO $$ BEGIN
    CREATE TYPE event_category_enum AS ENUM ('Camp', 'Retreat', 'Quarterly', 'Monthly', 'Special', 'Workshop');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create enum type for event roles
DO $$ BEGIN
    CREATE TYPE event_role_enum AS ENUM ('Peserta', 'Panitia', 'Volunteer');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create enum type for gender
DO $$ BEGIN
    CREATE TYPE gender_enum AS ENUM ('Laki-laki', 'Perempuan');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Main members table (cnx_jemaat_clean)
CREATE TABLE IF NOT EXISTS cnx_jemaat_clean (
    no_jemaat           INT PRIMARY KEY,
    nama_jemaat         VARCHAR(255) NOT NULL,
    jenis_kelamin       gender_enum NULL,
    tanggal_lahir       DATE NULL,
    tahun_lahir         INT NULL,
    bulan_lahir         INT NULL,
    kuliah_kerja        VARCHAR(50) NULL,
    no_handphone        VARCHAR(50) NULL,
    ketertarikan_cgf    VARCHAR(50) NULL,
    nama_cgf            VARCHAR(100) NULL,
    kategori_domisili   VARCHAR(50) NULL,
    alamat_domisili     TEXT NULL
);

-- CGF Info table
CREATE TABLE IF NOT EXISTS cgf_info (
    id          VARCHAR(5) PRIMARY KEY,
    nama_cgf    VARCHAR(255) NOT NULL,
    lokasi_1    VARCHAR(255) NOT NULL,
    lokasi_2    VARCHAR(255),
    hari        VARCHAR(10) NOT NULL
);

-- CGF Members assignment table
CREATE TABLE IF NOT EXISTS cgf_members (
    id              SERIAL PRIMARY KEY,
    no_jemaat       INT NOT NULL,
    nama_cgf        VARCHAR(100) NOT NULL,
    is_leader       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(no_jemaat, nama_cgf)
);

-- CGF Attendance table
CREATE TABLE IF NOT EXISTS cgf_attendance (
    id              SERIAL PRIMARY KEY,
    no_jemaat       INT NOT NULL,
    cg_id           VARCHAR(5) NOT NULL,
    tanggal         DATE NOT NULL,
    keterangan      keterangan_enum NOT NULL,
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(no_jemaat, cg_id, tanggal)
);

-- Ministry types table (pelayanan_info)
CREATE TABLE IF NOT EXISTS pelayanan_info (
    pelayanan_id    VARCHAR(5) PRIMARY KEY,
    nama_pelayanan  VARCHAR(255) NOT NULL
);

-- Ministry members table (pelayan)
CREATE TABLE IF NOT EXISTS pelayan (
    no_jemaat           INT PRIMARY KEY,
    nama_jemaat         VARCHAR(255) NOT NULL,
    is_worship_leader               SMALLINT DEFAULT 0,
    is_singer           SMALLINT DEFAULT 0,
    is_pianist           SMALLINT DEFAULT 0,
    is_saxophone        SMALLINT DEFAULT 0,
    is_filler           SMALLINT DEFAULT 0,
    is_bass_guitarist       SMALLINT DEFAULT 0,
    is_drummer             SMALLINT DEFAULT 0,
    is_multimedia           SMALLINT DEFAULT 0,
    is_sound            SMALLINT DEFAULT 0,
    is_caringteam       SMALLINT DEFAULT 0,
    is_connexion_crew   SMALLINT DEFAULT 0,
    is_supporting_crew  SMALLINT DEFAULT 0,
    is_cforce           SMALLINT DEFAULT 0,
    is_cg_leader        SMALLINT DEFAULT 0,
    is_community_pic    SMALLINT DEFAULT 0,
    is_others           SMALLINT DEFAULT 0,
    total_pelayanan     INT DEFAULT 0
);

-- Migration tracking table
CREATE TABLE IF NOT EXISTS _migrations (
    id          SERIAL PRIMARY KEY,
    filename    VARCHAR(255) NOT NULL UNIQUE,
    applied_at  TIMESTAMP DEFAULT NOW()
);
