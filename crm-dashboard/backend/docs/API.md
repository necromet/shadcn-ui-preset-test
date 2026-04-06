# API Reference

Complete reference for the CRM Dashboard Backend API.

**Base URL:** `/api/v1`
**Content-Type:** `application/json`

---

## Response Format

All responses follow a consistent envelope:

```json
{
  "success": true,
  "data": { ... }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": 404,
    "message": "Resource not found"
  }
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request body or parameters |
| 401 | Unauthorized | Missing or invalid authentication token |
| 404 | Not Found | Resource does not exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |

---

## Pagination

All list endpoints accept these query parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | `1` | Page number |
| `limit` | integer | `20` | Items per page |

---

## Members

### List Members

```
GET /members
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number |
| `limit` | integer | Items per page |
| `jenis_kelamin` | string | Filter by gender (`Laki-laki`, `Perempuan`) |
| `kategori_domisili` | string | Filter by domicile category |
| `nama_cgf` | string | Filter by CGF group name |
| `kuliah_kerja` | string | Filter by education/employment status |
| `bulan_lahir` | integer | Filter by birth month (1-12) |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "no_jemaat": 1,
      "nama_jemaat": "John Doe",
      "jenis_kelamin": "Laki-laki",
      "tanggal_lahir": "1990-05-15",
      "alamat": "Jl. Sudirman No. 123",
      "no_hp": "081234567890",
      "email": "john@example.com",
      "kategori_domisili": "Jakarta",
      "nama_cgf": "CGF Alpha",
      "kuliah_kerja": "Kerja"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 150, "totalPages": 8 }
}
```

### Create Member

```
POST /members
```

**Request Body:**

```json
{
  "nama_jemaat": "Jane Doe",
  "jenis_kelamin": "Perempuan",
  "tanggal_lahir": "1995-03-15",
  "alamat": "Jl. Gatot Subroto No. 45",
  "no_hp": "081987654321",
  "email": "jane@example.com",
  "kategori_domisili": "Jakarta",
  "kuliah_kerja": "Kuliah"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "no_jemaat": 151,
    "nama_jemaat": "Jane Doe",
    "jenis_kelamin": "Perempuan"
  }
}
```

### Get Member

```
GET /members/:no_jemaat
```

**Response:** `200 OK` or `404 Not Found`

### Update Member

```
PUT /members/:no_jemaat
```

Request body same as create. Returns `200 OK` with updated member.

### Partial Update Member

```
PATCH /members/:no_jemaat
```

Request body can include any subset of member fields.

### Delete Member

```
DELETE /members/:no_jemaat
```

**Response:** `204 No Content`

### Get Member Events

```
GET /members/:no_jemaat/events
```

Returns all events the member has participated in.

### Get Member Status History

```
GET /members/:no_jemaat/status-history
```

Returns the member's status change history.

---

## Attendance

### List Attendance

```
GET /attendance
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number |
| `limit` | integer | Items per page |
| `cg_id` | string | Filter by CGF group |
| `tanggal` | string | Filter by specific date |
| `keterangan` | string | Filter by status (`hadir`, `izin`, `tidak_hadir`, `tamu`) |
| `start_date` | string | Date range start (YYYY-MM-DD) |
| `end_date` | string | Date range end (YYYY-MM-DD) |

**Response:** `200 OK` (paginated)

### Record Attendance

```
POST /attendance
```

**Request Body:**

```json
{
  "no_jemaat": 1,
  "cg_id": "CGF001",
  "tanggal": "2024-01-15",
  "keterangan": "hadir"
}
```

**Response:** `201 Created`

### Bulk Record Attendance

```
POST /attendance/bulk
```

**Request Body:**

```json
{
  "cg_id": "CGF001",
  "tanggal": "2024-01-15",
  "records": [
    { "no_jemaat": 1, "keterangan": "hadir" },
    { "no_jemaat": 2, "keterangan": "izin" },
    { "no_jemaat": 3, "keterangan": "hadir" }
  ]
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": [...],
  "message": "Created 3 attendance records"
}
```

### Get Attendance Record

```
GET /attendance/:id
```

### Update Attendance Record

```
PUT /attendance/:id
```

### Delete Attendance Record

```
DELETE /attendance/:id
```

**Response:** `204 No Content`

---

## CGF Groups

### List Groups

```
GET /groups
```

**Query Parameters:** `page`, `limit`

### Create Group

```
POST /groups
```

**Request Body:**

```json
{
  "nama_cgf": "CGF Omega",
  "hari": "Rabu",
  "waktu": "19:00",
  "lokasi": "Rumah Pak Budi",
  "pemimpin_nama": "Budi Santoso"
}
```

### Get Group

```
GET /groups/:cgId
```

### Update Group

```
PUT /groups/:cgId
```

### Delete Group

```
DELETE /groups/:cgId
```

**Response:** `204 No Content`

### List Group Members

```
GET /groups/:cgId/members
```

Returns all members assigned to the specified CGF group.

### Add Member to Group

```
POST /groups/:cgId/members
```

**Request Body:**

```json
{
  "no_jemaat": 5,
  "role": "member"
}
```

### Update Member Assignment

```
PUT /groups/:cgId/members/:noJemaat
```

### Remove Member from Group

```
DELETE /groups/:cgId/members/:noJemaat
```

**Response:** `204 No Content`

---

## Events

### List Events

```
GET /events
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number |
| `limit` | integer | Items per page |
| `category` | string | Filter by event category |
| `start_date` | string | Date range start |
| `end_date` | string | Date range end |

### Create Event

```
POST /events
```

**Request Body:**

```json
{
  "nama_event": "Youth Retreat 2024",
  "tanggal": "2024-03-15",
  "lokasi": "Bogor Camp",
  "deskripsi": "Annual youth retreat",
  "category": "retreat"
}
```

### Get Event

```
GET /events/:eventId
```

### Update Event

```
PUT /events/:eventId
```

### Delete Event

```
DELETE /events/:eventId
```

**Response:** `204 No Content`

### List Event Participants

```
GET /events/:eventId/participants
```

### Add Participant

```
POST /events/:eventId/participants
```

**Request Body:**

```json
{
  "no_jemaat": 10,
  "status": "registered"
}
```

### Update Participant

```
PUT /events/:eventId/participants/:id
```

### Remove Participant

```
DELETE /events/:eventId/participants/:id
```

**Response:** `204 No Content`

---

## Ministry

### List Ministry Types

```
GET /types
```

**Query Parameters:** `page`, `limit`

### Create Ministry Type

```
POST /types
```

**Request Body:**

```json
{
  "nama_pelayanan": "Praise & Worship",
  "deskripsi": "Music and worship team"
}
```

### Get Ministry Type

```
GET /types/:pelayananId
```

### Update Ministry Type

```
PUT /types/:pelayananId
```

### Delete Ministry Type

```
DELETE /types/:pelayananId
```

**Response:** `204 No Content`

### List Pelayan (Ministry Members)

```
GET /pelayan
```

**Query Parameters:** `page`, `limit`

### Add Pelayan

```
POST /pelayan
```

**Request Body:**

```json
{
  "no_jemaat": 7,
  "pelayanan_id": "PEL001",
  "role": "leader"
}
```

### Get Pelayan

```
GET /pelayan/:no_jemaat
```

### Update Pelayan

```
PUT /pelayan/:no_jemaat
```

### Partial Update Pelayan

```
PATCH /pelayan/:no_jemaat
```

### Delete Pelayan

```
DELETE /pelayan/:no_jemaat
```

**Response:** `204 No Content`

---

## Status History

### List Status History

```
GET /status-history
```

**Query Parameters:** `page`, `limit`

### Create Status Record

```
POST /status-history
```

**Request Body:**

```json
{
  "no_jemaat": 1,
  "status_baru": "aktif",
  "tanggal": "2024-01-01",
  "keterangan": "Kembali aktif setelah rehat"
}
```

### Get Status Record

```
GET /status-history/:id
```

### Update Status Record

```
PUT /status-history/:id
```

### Delete Status Record

```
DELETE /status-history/:id
```

**Response:** `204 No Content`

---

## Analytics

### Dashboard KPIs

```
GET /analytics/dashboard
```

Returns summary KPIs for the dashboard.

### Member Distribution

```
GET /analytics/members/distribution?type=gender
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | `gender` | Distribution type: `gender`, `age`, `domisili`, `kuliah_kerja` |

### Member Trends

```
GET /analytics/members/trends?start_date=2024-01-01&end_date=2024-12-31
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `start_date` | string | Start date (YYYY-MM-DD) |
| `end_date` | string | End date (YYYY-MM-DD) |

### Birthday Members

```
GET /analytics/members/birthday?month=3
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `month` | integer | Current month | Month number (1-12) |

### Attendance Summary

```
GET /analytics/attendance/summary?start_date=2024-01-01&end_date=2024-12-31
```

Returns aggregate attendance statistics.

### Attendance Trends

```
GET /analytics/attendance/trends?start_date=2024-01-01&end_date=2024-12-31
```

Returns attendance data over time for charting.

### CGF Summary

```
GET /analytics/cgf/summary
```

Returns CGF group statistics including total groups, average size, and top attendance groups.

### Ministry Summary

```
GET /analytics/ministry/summary
```

Returns ministry participation statistics and role distribution.

### Events Summary

```
GET /analytics/events/summary
```

Returns event statistics by category.

---

## Health Check

```
GET /health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5
}
```
