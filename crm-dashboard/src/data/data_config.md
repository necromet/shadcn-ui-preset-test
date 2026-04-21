# Church Management Database Tables Configuration

This document contains the table structures from `create_table.sql` that define the database schema for the church management system. These tables correspond to the mock data in `mock.js`.

## Tables Overview

| Table Name | Description |
|------------|-------------|
| cgf_attendance | Tracks attendance records for CGF (Cell Group Fellowship) meetings |
| cgf_info | Information about CGF groups including name, location, and schedule |
| cgf_members | Members assigned to CGF groups with leadership status |
| pelayanan_info | Information about service/ministry types |
| pelayan | Members serving in various ministry roles |
| cnx_jemaat_clean | Clean member data including personal information and CGF interest |

## Table Details

### cgf_attendance
| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | SERIAL | Primary key | PRIMARY KEY |
| no_jemaat | INT | Member ID | REFERENCES cgf_members(no_jemaat) |
| cg_id | INT | CGF group ID | REFERENCES cgf_info(id) |
| tanggal | DATE | Meeting date | NOT NULL |
| keterangan | keterangan_enum | Attendance status (hadir, izin, tidak_hadir, tamu) | NOT NULL |
| created_at | TIMESTAMP | Record creation timestamp | DEFAULT NOW() |
| UNIQUE(no_jemaat, cg_id, tanggal) | - | Ensures no duplicate attendance records per member per group per date |

### cgf_info
| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | VARCHAR(5) | CGF group ID | PRIMARY KEY |
| nama_cgf | VARCHAR(255) | CGF group name | NOT NULL |
| lokasi_1 | VARCHAR(255) | Primary location | NOT NULL |
| lokasi_2 | VARCHAR(255) | Secondary location | NULL |
| hari | VARCHAR(10) | Meeting day | NOT NULL |

### cgf_members
| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| no_jemaat | INT | Member ID | PRIMARY KEY |
| nama_jemaat | VARCHAR(255) | Member name | NOT NULL |
| nama_cgf | VARCHAR(100) | CGF group name | NULL |
| no_handphone | VARCHAR(20) | Phone number | NULL |
| is_leader | BOOLEAN | Leadership status | DEFAULT FALSE |
| created_at | TIMESTAMP | Record creation timestamp | DEFAULT NOW() |

### pelayanan_info
| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| pelayanan_id | VARCHAR(5) | Service ID | PRIMARY KEY |
| nama_pelayanan | VARCHAR(255) | Service name | NOT NULL |

### pelayan
| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| no_jemaat | INT | Member ID | PRIMARY KEY |
| nama_jemaat | VARCHAR(255) | Member name | NOT NULL |
| is_worship_leader | SMALLINT | Worship Leader | DEFAULT 0 |
| is_singer | SMALLINT | Singer | DEFAULT 0 |
| is_pianist | SMALLINT | Pianist | DEFAULT 0 |
| is_saxophone | SMALLINT | Saxophone player | DEFAULT 0 |
| is_filler | SMALLINT | Filler musician | DEFAULT 0 |
| is_bass_guitarist | SMALLINT | Bass guitarist | DEFAULT 0 |
| is_drummer | SMALLINT | Drummer | DEFAULT 0 |
| is_multimedia | SMALLINT | Multimedia team | DEFAULT 0 |
| is_sound | SMALLINT | Sound engineer | DEFAULT 0 |
| is_caringteam | SMALLINT | Caring team | DEFAULT 0 |
| is_connexion_crew | SMALLINT | Connexion crew | DEFAULT 0 |
| is_supporting_crew | SMALLINT | Supporting crew | DEFAULT 0 |
| is_cforce | SMALLINT | CForce | DEFAULT 0 |
| is_cg_leader | SMALLINT | CG Leader | DEFAULT 0 |
| is_community_pic | SMALLINT | Community PIC | DEFAULT 0 |
| is_others | SMALLINT | Other services | DEFAULT 0 |
| total_pelayanan | INT | Total service count | DEFAULT 0 |

### cnx_jemaat_clean
| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| no_jemaat | int4 | Member ID | NOT NULL, PRIMARY KEY |
| nama_jemaat | varchar(50) | Member name | NULL |
| jenis_kelamin | varchar(50) | Gender | NULL |
| tanggal_lahir | date | Birth date | NULL |
| tahun_lahir | int4 | Birth year | NULL |
| bulan_lahir | int4 | Birth month | NULL |
| kuliah_kerja | varchar(50) | Education/Work status | NULL |
| no_handphone | varchar(50) | Phone number | NULL |
| ketertarikan_cgf | varchar(50) | CGF interest level | NULL |
| nama_cgf | varchar(50) | CGF group name | NULL |
| kategori_domisili | varchar(50) | Residential area category | NULL |
| alamat_domisili | varchar | Full residential address | NULL |

## Data Relationships

- **cgf_members** references **cnx_jemaat_clean** via `no_jemaat`
- **cgf_attendance** references both **cgf_members** and **cgf_info** via foreign keys
- **pelayan** references **cnx_jemaat_clean** via `no_jemaat`

## Mock Data Mapping

The mock data in `mock.js` provides sample data for these tables:
- `members` array corresponds to `cnx_jemaat_clean` table
- `pelayan` array corresponds to `pelayan` table  
- `cgfGroups` array corresponds to `cgf_info` table
- `cgfMembers` array corresponds to `cgf_members` table
- `cgfAttendance` array corresponds to `cgf_attendance` table
- Additional arrays like `cnx_jemaat_status_history`, `event_history`, etc. provide extended functionality

## Usage

This configuration can be used to:
- Generate database schemas
- Create mock data generators
- Validate data structures
- Document API endpoints
- Build data migration scripts