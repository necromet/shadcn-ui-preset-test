CREATE TABLE cgf_attendance (
    id             SERIAL PRIMARY KEY,
    no_jemaat      INT REFERENCES cgf_members(no_jemaat),
    cg_id          INT REFERENCES cgf_info(id),
    tanggal        DATE NOT NULL,
    keterangan     keterangan_enum NOT NULL,
    created_at     TIMESTAMP DEFAULT NOW(),
    UNIQUE(no_jemaat, cg_id, tanggal)
);

CREATE TABLE cgf_info (
    id    VARCHAR(5) PRIMARY KEY,
    nama_cgf  VARCHAR(255) NOT NULL,
    lokasi_1 VARCHAR(255) NOT NULL,
    lokasi_2  VARCHAR(255),
    hari VARCHAR(10) NOT NULL
);

CREATE TABLE cgf_members (
    no_jemaat     INT PRIMARY KEY,           -- Unique ID for each member
    nama_jemaat   VARCHAR(255) NOT NULL,     -- Member name
    nama_cgf      VARCHAR(100),              -- Group name
    no_handphone  VARCHAR(20),               -- Phone number
    is_leader     BOOLEAN DEFAULT FALSE,     -- The boolean column
    created_at    TIMESTAMP DEFAULT NOW()    -- Optional: tracking when they were added
);

CREATE TABLE pelayanan_info (
    pelayanan_id    VARCHAR(5) PRIMARY KEY,
    nama_pelayanan  VARCHAR(255) NOT NULL
);

CREATE TABLE pelayan (
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

CREATE TABLE cnx_jemaat_clean (
	no_jemaat int4 NOT NULL,
	nama_jemaat varchar(50) NULL,
	jenis_kelamin varchar(50) NULL,
	tanggal_lahir date NULL,
	tahun_lahir int4 NULL,
	bulan_lahir int4 NULL,
	kuliah_kerja varchar(50) NULL,
	no_handphone varchar(50) NULL,
	ketertarikan_cgf varchar(50) NULL,
	nama_cgf varchar(50) NULL,
	kategori_domisili varchar(50) NULL,
	alamat_domisili varchar NULL,
	CONSTRAINT cnx_jemaat_clean_pkey PRIMARY KEY (no_jemaat)
);