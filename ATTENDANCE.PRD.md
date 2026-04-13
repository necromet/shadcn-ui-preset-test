# PRD: CGF Attendance Tracking System

## 1. Project Overview

A cell group (CGF) attendance tracking system for church congregations. CGF leaders mark attendance for members during weekly cell group meetings. The system tracks attendance per member per CGF per date, with full history and statistics per cell group and individual member.

## 2. Technical Stack

- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS.
- **UI Components:** Shadcn/ui (Button, Badge, DataTable, Toast, Card, Avatar, Select, Dialog).
- **Icon Library:** Hugeicons.
- **Backend:** Express.js API server (Node.js).
- **Database:** PostgreSQL (using Prisma ORM).
- **Date Handling:** date-fns.

## 3. PostgreSQL Database Schema

```sql
-- Existing Tables (do not modify)

CREATE TABLE public.cgf_info (
  id varchar(5) NOT NULL,
  nama_cgf varchar(255) NOT NULL,
  lokasi_1 varchar(255) NOT NULL,
  lokasi_2 varchar(255) NULL,
  hari varchar(10) NOT NULL,
  CONSTRAINT cgf_info_pkey PRIMARY KEY (id)
);

CREATE TABLE public.cgf_members (
  no_jemaat int4 NOT NULL,
  nama_jemaat varchar(255) NOT NULL,
  nama_cgf varchar(100) NULL,
  no_handphone varchar(20) NULL,
  is_leader bool DEFAULT false NULL,
  created_at timestamp DEFAULT now() NULL,
  CONSTRAINT cgf_members_pkey PRIMARY KEY (no_jemaat),
  CONSTRAINT fk_cgf_members_jemaat FOREIGN KEY (no_jemaat) REFERENCES public.cnx_jemaat_clean(no_jemaat) ON DELETE CASCADE
);

CREATE TABLE public.cgf_attendance (
  id serial4 NOT NULL,
  no_jemaat int4 NOT NULL,
  cg_id varchar(5) NOT NULL,
  tanggal date NOT NULL,
  keterangan public."keterangan_enum" NOT NULL,
  created_at timestamp DEFAULT now() NULL,
  CONSTRAINT cgf_attendance_no_jemaat_cg_id_tanggal_key UNIQUE (no_jemaat, cg_id, tanggal),
  CONSTRAINT cgf_attendance_pkey PRIMARY KEY (id),
  CONSTRAINT fk_attendance_cgf FOREIGN KEY (cg_id) REFERENCES public.cgf_info(id) ON DELETE CASCADE,
  CONSTRAINT fk_attendance_jemaat FOREIGN KEY (no_jemaat) REFERENCES public.cnx_jemaat_clean(no_jemaat) ON DELETE CASCADE
);

-- New Indexes
CREATE INDEX idx_cgf_attendance_cg_id ON cgf_attendance(cg_id);
CREATE INDEX idx_cgf_attendance_tanggal ON cgf_attendance(tanggal);
CREATE INDEX idx_cgf_attendance_no_jemaat ON cgf_attendance(no_jemaat);
```

## 4. Attendance Status (keterangan_enum)

| Status      | Description                                          |
|-------------|------------------------------------------------------|
| `hadir`     | Present / attended                                   |
| `izin`      | Excused / permitted absence                          |
| `alpha`     | Absent without notice                                |

## 5. Core Relationships

```
cnx_jemaat_clean (external)
    │
    └─── cgf_members (no_jemaat FK)
              │
              └─── cgf_info (nama_cgf → id)
                        │
                        └─── cgf_attendance (cg_id FK, no_jemaat FK)
```

## 6. API Endpoints

| Method | Endpoint                            | Description                              |
|--------|-------------------------------------|------------------------------------------|
| GET    | `/api/cgf`                          | List all CGF cell groups                 |
| GET    | `/api/cgf/:cg_id`                   | Get CGF details with member count        |
| GET    | `/api/cgf/:cg_id/members`           | Get all members of a CGF                 |
| GET    | `/api/cgf/:cg_id/attendance`        | Get attendance records for a CGF         |
| POST   | `/api/cgf/:cg_id/attendance`        | Mark attendance for one or more members  |
| GET    | `/api/attendance`                   | Get all attendance (global filter)      |
| GET    | `/api/attendance/member/:no_jemaat` | Get attendance history for a member      |
| GET    | `/api/attendance/stats/cgf/:cg_id` | Get attendance stats for a CGF           |
| GET    | `/api/attendance/stats/member/:no_jemaat` | Get attendance stats for a member  |

### Endpoint Details

#### GET `/api/cgf`

**Response 200:**
```json
{
  "data": [
    {
      "id": "CG01",
      "nama_cgf": "Emmanuel",
      "lokasi_1": "Jl. Sudirman No. 10",
      "lokasi_2": "Jakarta Selatan",
      "hari": "Sabtu",
      "member_count": 15
    }
  ]
}
```

#### GET `/api/cgf/:cg_id/members`

**Response 200:**
```json
{
  "data": [
    {
      "no_jemaat": 1001,
      "nama_jemaat": "John Doe",
      "nama_cgf": "Emmanuel",
      "no_handphone": "08123456789",
      "is_leader": true,
      "today_status": "hadir"
    },
    {
      "no_jemaat": 1002,
      "nama_jemaat": "Jane Smith",
      "nama_cgf": "Emmanuel",
      "no_handphone": "08987654321",
      "is_leader": false,
      "today_status": null
    }
  ]
}
```

#### GET `/api/cgf/:cg_id/attendance`

**Query Parameters:**
```
?tanggal_start=YYYY-MM-DD
?tanggal_end=YYYY-MM-DD
?status=hadir|izin|alpha
&page=1
&limit=50
```

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "no_jemaat": 1001,
      "nama_jemaat": "John Doe",
      "cg_id": "CG01",
      "nama_cgf": "Emmanuel",
      "tanggal": "2026-04-12",
      "keterangan": "hadir",
      "created_at": "2026-04-12T19:30:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 120 }
}
```

#### POST `/api/cgf/:cg_id/attendance`

Mark attendance for one or more members in a single CGF meeting.

**Request Body:**
```json
{
  "tanggal": "2026-04-12",
  "attendances": [
    { "no_jemaat": 1001, "keterangan": "hadir" },
    { "no_jemaat": 1002, "keterangan": "hadir" },
    { "no_jemaat": 1003, "keterangan": "izin" },
    { "no_jemaat": 1004, "keterangan": "alpha" }
  ]
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "cg_id": "CG01",
    "tanggal": "2026-04-12",
    "total_marked": 4,
    "hadir": 2,
    "izin": 1,
    "alpha": 1
  },
  "message": "Attendance recorded successfully"
}
```

**Error 400 (Already marked):**
```json
{
  "success": false,
  "error": "ALREADY_MARKED",
  "message": "Attendance for this CGF on 2026-04-12 has already been recorded"
}
```

**Error 400 (Invalid member):**
```json
{
  "success": false,
  "error": "INVALID_MEMBER",
  "message": "Member 1005 does not belong to CGF CG01"
}
```

#### GET `/api/attendance/member/:no_jemaat`

**Query Parameters:**
```
?cg_id=CG01           (optional, filter by CGF)
?tanggal_start=YYYY-MM-DD
?tanggal_end=YYYY-MM-DD
&page=1
&limit=20
```

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "no_jemaat": 1001,
      "nama_jemaat": "John Doe",
      "cg_id": "CG01",
      "nama_cgf": "Emmanuel",
      "tanggal": "2026-04-12",
      "keterangan": "hadir"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 45 }
}
```

#### GET `/api/attendance/stats/cgf/:cg_id`

**Query Parameters:**
```
?period=month|quarter|year
?tahun=2026
```

**Response 200:**
```json
{
  "data": {
    "cg_id": "CG01",
    "nama_cgf": "Emmanuel",
    "total_members": 15,
    "period": "month",
    "stats": {
      "total_meetings": 4,
      "total_attendance_records": 58,
      "hadir": 45,
      "izin": 8,
      "alpha": 5,
      "attendance_rate": 77.6
    },
    "monthly_summary": [
      { "bulan": "Januari", "hadir": 12, "izin": 2, "alpha": 1 },
      { "bulan": "Februari", "hadir": 11, "izin": 2, "alpha": 2 }
    ]
  }
}
```

#### GET `/api/attendance/stats/member/:no_jemaat`

**Response 200:**
```json
{
  "data": {
    "no_jemaat": 1001,
    "nama_jemaat": "John Doe",
    "cg_id": "CG01",
    "nama_cgf": "Emmanuel",
    "stats": {
      "total_meetings": 48,
      "hadir": 42,
      "izin": 4,
      "alpha": 2,
      "attendance_rate": 87.5
    },
    "recent": [
      { "tanggal": "2026-04-12", "keterangan": "hadir" },
      { "tanggal": "2026-04-05", "keterangan": "hadir" },
      { "tanggal": "2026-03-29", "keterangan": "izin" }
    ]
  }
}
```

## 7. Backend Validation Rules

1. **Unique Constraint:** One attendance record per `(no_jemaat, cg_id, tanggal)` — enforced by DB.
2. **CGF Membership:** Leader can only mark attendance for members whose `nama_cgf` matches the CGF being managed.
3. **Date Validation:** `tanggal` cannot be a future date.
4. **Leader Authorization:** Only `is_leader = true` members can mark attendance (enforced via auth middleware).
5. **Batch Processing:** All-or-nothing — if one member fails validation, entire batch is rejected.
6. **Retroactive Edit:** Leader can update attendance for past dates within the same month only.

## 8. Functional Requirements

### UI Views

#### A. CGF List View (`attendance.jsx`)

- **Card Grid:** Each CGF displayed as a card showing name, location, meeting day, member count.
- **Quick Actions:** "Mark Attendance" button on each card.
- **Search/Filter:** Filter by meeting day (Senin-Selasa-Rabu-Kamis-Jumat-Sabtu-Minggu).

#### B. Mark Attendance View (`attendance.jsx?cg_id=CG01&date=2026-04-12`)

- **Member Checklist:** List all members with toggle buttons for hadir/izin/alpha.
- **Attendance Summary:** Live counter showing hadir/izin/alpha counts as toggles are made.
- **Date Selector:** Shows selected meeting date; defaults to most recent meeting day (based on CGF `hari`).
- **Submit Button:** Full-width, prominent "Simpan Absensi" button.
- **Last Saved Badge:** Shows "Last saved: [timestamp]" if draft exists.

#### C. Attendance History View (within `attendance.jsx`)

- **DataTable:** Columns = Tanggal, CGF, Status (Hadir/Izin/Alpha), Waktu Rekam.
- **Filters:** 
  - Date range picker
  - CGF dropdown (all or specific)
  - Status filter (hadir/izin/alpha)
  - Quick filters: Bulan ini / 3 bulan terakhir
- **Row Actions:** Edit button (for leader, within same month only).

#### D. Member Stats View (within `attendance.jsx`)

- **Personal Card:** Member name, CGF, overall attendance rate.
- **Stats Cards:** Total hadir, izin, alpha counts.
- **Recent Attendance:** Last 10 meetings with status badges.
- **CGF Comparison:** (Optional) How this member compares to CGF average.

### Interaction Patterns

- **Bulk Toggle:** Leader can tap status once to apply to all unchecked members.
- **Optimistic UI:** Checkboxes toggle immediately; API call in background.
- **Toast Notifications:** "Berhasil menyimpan absensi" on success, error message on failure.
- **Auto-refresh:** Refresh attendance list every 60 seconds when page is open.
- **Draft Saving:** If page is closed before submit, save to localStorage; restore on next visit.

### Error Handling UX

| Error Code              | User-Friendly Message                                           |
|-------------------------|----------------------------------------------------------------|
| `ALREADY_MARKED`        | "Absensi untuk CGF ini pada tanggal tersebut sudah tercatat"  |
| `INVALID_MEMBER`        | "[Nama] bukan anggota CGF ini"                                |
| `FUTURE_DATE`           | "Tidak dapat mencatat absensi untuk tanggal mendatang"        |
| `UNAUTHORIZED`          | "Hanya pemimpin CGF yang dapat mencatat absensi"              |
| `OUTDATED_EDIT`         | "Tidak dapat mengubah absensi bulan sebelumnya"               |
| `NETWORK_ERROR`         | "Koneksi terputus. Data akan disimpan secara otomatis saat terhubung kembali" |

## 9. Frontend Components Required

| Component         | Shadcn/ui Source              | Usage                              |
|-------------------|-------------------------------|------------------------------------|
| Button            | `components/ui/button`        | Submit, filters, actions           |
| Badge             | `components/ui/badge`         | Status labels (hadir/izin/alpha)   |
| Card              | `components/ui/card`          | CGF cards, stats display           |
| DataTable         | `components/ui/data-table`    | Attendance history table            |
| Toast             | `components/ui/toast`         | Notifications                       |
| Calendar          | `components/ui/calendar`      | Date picker for filters            |
| Popover           | `components/ui/popover`       | Date picker trigger                 |
| Separator         | `components/ui/separator`     | Section dividers                    |
| Avatar            | `components/ui/avatar`        | Member photos                       |
| Select            | `components/ui/select`        | CGF dropdown, status filter         |
| Dialog            | `components/ui/dialog`        | Confirmations, edit modal           |
| Checkbox          | `components/ui/checkbox`      | Bulk select in member list           |

## 10. File Structure

```
src/
├── pages/
│   └── attendance.tsx              # Main attendance page
├── components/
│   └── attendance/
│       ├── CgfCard.tsx             # CGF listing card
│       ├── CgfList.tsx             # Grid of CGF cards
│       ├── MemberChecklist.tsx     # Attendance marking list
│       ├── AttendanceTable.tsx     # History data table
│       ├── AttendanceFilters.tsx  # Date, CGF, status filters
│       ├── MemberStats.tsx         # Personal attendance stats
│       ├── CgfStats.tsx            # CGF group stats
│       └── StatusBadge.tsx         # hadir/izin/alpha badge
├── hooks/
│   ├── useCgfList.ts               # Fetch CGF list
│   ├── useCgfMembers.ts           # Fetch members by CGF
│   ├── useAttendance.ts           # CRUD attendance
│   ├── useAttendanceStats.ts      # Stats fetching
│   └── useOfflineSync.ts           # localStorage draft sync
├── lib/
│   └── api.ts                      # API client functions
└── types/
    └── attendance.ts               # TypeScript interfaces
```

## 11. Acceptance Criteria

1. CGF leader can mark attendance for all members with a single tap per member.
2. Attendance status (hadir/izin/alpha) is immediately reflected in the UI.
3. Duplicate attendance marking on same date for same CGF is rejected with clear message.
4. Non-leader members can view their own attendance history and stats.
5. History table shows records sorted by date (newest first) with date filtering.
6. CGF stats show accurate hadir/izin/alpha counts and attendance rate percentage.
7. All API errors show Indonesian user-friendly messages.
8. Leader can edit past attendance within the same month.
9. Draft attendance is saved to localStorage if page is closed before submit.
10. Mobile view has large touch targets (minimum 44px) for status toggles.
11. Page auto-refreshes attendance data every 60 seconds.
12. Member stats accurately reflect their personal attendance rate.
