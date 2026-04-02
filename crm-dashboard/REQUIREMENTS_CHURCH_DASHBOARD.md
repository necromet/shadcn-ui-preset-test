# Connexion Church Management Dashboard — Requirements Document

## 1. Overview

| Field | Detail |
|---|---|
| **Project Name** | Connexion Church Management Dashboard |
| **Stakeholders** | Church Admins, CGF Leaders, Pastoral Team |
| **Primary Data Sources** | PostgreSQL tables: `cnx_jemaat_clean` (member registry), `cgf_members`, `cgf_info`, `cgf_attendance` |
| **Goal** | Centralized dashboard for managing congregation members, CGF groups, attendance tracking, and pastoral analytics |

---

## 2. Data Model Summary

### 2.1 Member Registry (`cnx_jemaat_clean`)

| Column | Type | Description |
|---|---|---|
| `no_jemaat` | INT (PK) | Unique member ID |
| `nama_jemaat` | VARCHAR(255) | Full name |
| `jenis_kelamin` | ENUM('Laki-laki','Perempuan') | Gender |
| `tanggal_lahir` | DATE | Date of birth |
| `tahun_lahir` | INT | Birth year |
| `bulan_lahir` | INT | Birth month |
| `kuliah_kerja` | ENUM('Kuliah','Kerja') | Student or Working |
| `no_handphone` | VARCHAR(20) | Phone number |
| `ketertarikan_cgf` | ENUM('Sudah Join','Belum Join','Tertarik') | CGF interest status |
| `nama_cgf` | VARCHAR(100) | Assigned CGF name |
| `kategori_domisili` | VARCHAR(50) | Area/zone classification |
| `alamat_domisili` | VARCHAR(255) | Full address |

### 2.2 CGF Tables (from `CGF_create_table.sql`)

| Table | Purpose |
|---|---|
| `cgf_members` | Member-to-CGF assignment with leader flag |
| `cgf_info` | CGF metadata (name, leader, schedule, location) |
| `cgf_attendance` | Per-session attendance records (hadir/izin/tidak_hadir/tamu) |

---

## 3. Functional Requirements

### 3.1 Member Management Module

| ID | Requirement | Priority |
|---|---|---|
| MM-01 | Display all members in a filterable, sortable, paginated table | High |
| MM-02 | Add new member with all fields from the registry schema | High |
| MM-03 | Edit existing member details inline or via modal form | High |
| MM-04 | Delete or soft-delete a member record | Medium |
| MM-05 | Search members by name, phone, or `no_jemaat` | High |
| MM-06 | Filter by gender, age range, domisili, CGF status | Medium |
| MM-07 | Bulk import members from CSV/Excel into `cnx_jemaat_clean` table | Medium |
| MM-08 | Export member list to CSV/Excel | Low |
| MM-09 | Show birthday members for current month (derived from `bulan_lahir`) | Medium |

### 3.2 CGF Group Management Module

| ID | Requirement | Priority |
|---|---|---|
| CG-01 | List all CGF groups with name, leader, schedule, and location | High |
| CG-02 | Create new CGF group (`cgf_info` record) | High |
| CG-03 | Edit CGF group details (name, schedule, location) | High |
| CG-04 | Assign/unassign members to a CGF group (`cgf_members`) | High |
| CG-05 | Designate a member as CGF leader (`is_leader = TRUE`) | High |
| CG-06 | View member roster per CGF group | High |
| CG-07 | Filter members by `ketertarikan_cgf` status (Sudah Join / Belum Join / Tertarik) | Medium |

### 3.3 Attendance Tracking Module

| ID | Requirement | Priority |
|---|---|---|
| AT-01 | Record attendance per CGF per date with status enum (hadir/izin/tidak_hadir/tamu) | High |
| AT-02 | Bulk attendance entry — mark all members of a CGF at once for a given date | High |
| AT-03 | View attendance history per member | Medium |
| AT-04 | View attendance history per CGF group | Medium |
| AT-05 | Prevent duplicate attendance records (enforced by `UNIQUE(no_jemaat, cg_id, tanggal)`) | High |
| AT-06 | Edit or delete an attendance record | Medium |

### 3.4 Dashboard & Analytics Module

| ID | Requirement | Priority |
|---|---|---|
| DA-01 | **Overview KPIs**: Total members, Total CGF groups, Members without CGF, Attendance rate (current month) | High |
| DA-02 | **Gender distribution** chart (pie/bar) | Medium |
| DA-03 | **Age distribution** chart (bar by decade) | Medium |
| DA-04 | **Domisili distribution** chart (bar by area) | Medium |
| DA-05 | **CGF size comparison** chart (members per group) | Medium |
| DA-06 | **Attendance trend** line chart (weekly/monthly per CGF or global) | Medium |
| DA-07 | **CGF interest funnel**: Tertarik → Belum Join → Sudah Join conversion | Low |
| DA-08 | **Kuliah vs Kerja** ratio chart | Low |

---

## 4. Non-Functional Requirements

| ID | Requirement | Detail |
|---|---|---|
| NF-01 | **Authentication** | Role-based access (Admin, CGF Leader, Viewer) |
| NF-02 | **Authorization** | CGF Leaders can only manage their own group's data |
| NF-03 | **Database** | PostgreSQL — `cnx_jemaat_clean`, `cgf_members`, `cgf_info`, `cgf_attendance` |
| NF-04 | **Tech Stack (suggested)** | Next.js / React frontend, Node.js API, PostgreSQL, Chart.js or Recharts for analytics |
| NF-05 | **Responsive Design** | Desktop-first, mobile-accessible for attendance entry |
| NF-06 | **Performance** | Tables with <10K rows should load <2s |
| NF-07 | **Data Integrity** | Foreign key constraints as defined in schema; no orphan records |
| NF-08 | **Audit Trail** | `created_at` timestamps on all records (already in schema) |

---

## 5. Suggested Navigation Structure

```
Dashboard (Home)
├── Members
│   ├── All Members (table)
│   ├── Add Member
│   └── Import/Export
├── CGF Groups
│   ├── All Groups (cards/table)
│   ├── Group Detail → Members + Attendance
│   └── Create Group
├── Attendance
│   ├── Take Attendance (bulk entry)
│   └── Attendance History (filterable)
└── Analytics
    ├── Overview
    ├── Demographics
    └── CGF Performance
```

---

## 6. API Endpoints (Suggested)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/members` | List members (with filters) |
| POST | `/api/members` | Create member |
| PUT | `/api/members/:id` | Update member |
| DELETE | `/api/members/:id` | Delete member |
| GET | `/api/cgf` | List all CGF groups |
| POST | `/api/cgf` | Create CGF group |
| PUT | `/api/cgf/:id` | Update CGF group |
| GET | `/api/cgf/:id/members` | Members in a CGF |
| POST | `/api/cgf/:id/attendance` | Record attendance (bulk) |
| GET | `/api/attendance?cg_id=&date=` | Query attendance |
| GET | `/api/analytics/overview` | Dashboard KPIs |

---

## 7. Data Validation Rules

| Field | Rule |
|---|---|
| `no_jemaat` | Auto-increment or manually assigned; unique |
| `nama_jemaat` | Required, max 255 chars |
| `jenis_kelamin` | Must be 'Laki-laki' or 'Perempuan' |
| `no_handphone` | Valid phone format, max 20 chars |
| `ketertarikan_cgf` | Must be one of: 'Sudah Join', 'Belum Join', 'Tertarik' |
| `keterangan` (attendance) | Must be one of: 'hadir', 'izin', 'tidak_hadir', 'tamu' |
| `tanggal` (attendance) | Cannot be a future date |

---

## 8. Future Enhancements (Backlog)

- Push notifications for upcoming CGF schedules
- WhatsApp integration for group messaging (leverages `no_handphone`)
- Pastoral visit tracking module
- Event management (beyond CGF)
- Offering/finance module integration
- Mobile app for CGF leaders
