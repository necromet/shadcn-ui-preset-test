# Church Management System — Events Requirements

**Last Updated:** 2026-04-23T09:08:00+07:00  
**System:** Church Management System (CRM Dashboard)  
**Database Tables:** `event_history`, `event_participation`  
**Related Tables:** `cnx_jemaat_clean`

---

## Overview

This document defines the complete event management requirements for the CRM Dashboard, covering the database schema, API endpoints, frontend components, and all dashboard visualizations related to church events. It is designed around the existing PostgreSQL tables `event_history` and `event_participation`.

---

## Database Schema

### Table: `event_history`

Stores all church events (past and future).

```sql
CREATE TABLE public.event_history (
    event_id        serial4 NOT NULL,
    event_name      varchar(255) NOT NULL,
    event_date      date NOT NULL,
    category        public."event_category_enum" NOT NULL,
    "location"      varchar(255) NULL,
    description     text NULL,
    gcal_event_id   varchar(255) NULL,
    gcal_link       text NULL,
    last_synced_at  timestamptz NULL,
    CONSTRAINT event_history_pkey PRIMARY KEY (event_id)
);

-- Indexes
CREATE INDEX idx_event_history_category ON public.event_history USING btree (category);
CREATE INDEX idx_event_history_date ON public.event_history USING btree (event_date);
CREATE INDEX idx_event_history_gcal_event_id ON public.event_history USING btree (gcal_event_id);
```

**Field Definitions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `event_id` | serial4 (PK) | Auto | Unique event identifier |
| `event_name` | varchar(255) | Yes | Display name of the event |
| `event_date` | date | Yes | Date the event takes place |
| `category` | event_category_enum | Yes | Event classification |
| `location` | varchar(255) | No | Venue or location name |
| `description` | text | No | Detailed event description |
| `gcal_event_id` | varchar(255) | No | Google Calendar event ID for sync |
| `gcal_link` | text | No | Direct link to Google Calendar event |
| `last_synced_at` | timestamptz | No | Timestamp of last Google Calendar sync |

**Enum: `event_category_enum`**
- `Camp` — Multi-day camping events
- `Retreat` — Spiritual retreats (2-3 days)
- `Quarterly` — Tri-monthly fellowship gatherings
- `Monthly` — Monthly worship nights or recurring events
- `Special` — Christmas, New Year, one-off celebrations
- `Workshop` — Training, leadership meetings, workshops

---

### Table: `event_participation`

Links church members to events they attend, organize, or volunteer for.

```sql
CREATE TABLE public.event_participation (
    id              serial4 NOT NULL,
    event_id        int4 NOT NULL,
    no_jemaat       int4 NOT NULL,
    "role"          public."event_role_enum" DEFAULT 'Peserta'::event_role_enum NOT NULL,
    registered_at   timestamp DEFAULT now() NULL,
    CONSTRAINT event_participation_event_id_no_jemaat_key UNIQUE (event_id, no_jemaat),
    CONSTRAINT event_participation_pkey PRIMARY KEY (id),
    CONSTRAINT fk_event_participation_event
        FOREIGN KEY (event_id) REFERENCES public.event_history(event_id) ON DELETE CASCADE,
    CONSTRAINT fk_event_participation_jemaat
        FOREIGN KEY (no_jemaat) REFERENCES public.cnx_jemaat_clean(no_jemaat) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_event_participation_event ON public.event_participation USING btree (event_id);
CREATE INDEX idx_event_participation_jemaat ON public.event_participation USING btree (no_jemaat);
CREATE INDEX idx_event_participation_role ON public.event_participation USING btree (role);
```

**Field Definitions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | serial4 (PK) | Auto | Unique participation record ID |
| `event_id` | int4 (FK) | Yes | References `event_history.event_id` |
| `no_jemaat` | int4 (FK) | Yes | References `cnx_jemaat_clean.no_jemaat` |
| `role` | event_role_enum | Yes | Participation role (default: Peserta) |
| `registered_at` | timestamp | Auto | When the member registered |

**Enum: `event_role_enum`**
- `Peserta` — Regular attendee / participant
- `Panitia` — Committee member / organizer
- `Volunteer` — Volunteer helper

**Constraints:**
- `UNIQUE(event_id, no_jemaat)` — A member can only be registered once per event
- `ON DELETE CASCADE` on both foreign keys — Deleting an event or member removes participation records

---

### Entity Relationship

```
event_history (1) ──── (N) event_participation (N) ──── (1) cnx_jemaat_clean
     │                           │                              │
     │                           │                              │
  event_id (PK)          event_id (FK)                no_jemaat (FK)
  event_name             no_jemaat (FK)                nama_jemaat
  event_date             role                          jenis_kelamin
  category               registered_at                 ... (member fields)
  location
  description
  gcal_event_id
  gcal_link
  last_synced_at
```

---

## API Endpoints

### Events CRUD

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/events` | List all events (paginated, filterable) | Query: `page`, `limit`, `category`, `start_date`, `end_date` | `{ success, data: Event[], meta: Pagination }` |
| `POST` | `/events` | Create a new event | `EventCreate` | `{ success, data: Event }` |
| `GET` | `/events/:eventId` | Get single event by ID | — | `{ success, data: Event }` |
| `PUT` | `/events/:eventId` | Update an event | `EventUpdate` | `{ success, data: Event }` |
| `DELETE` | `/events/:eventId` | Delete an event | — | `204 No Content` |

### Event Participation

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/events/:eventId/participants` | List all participants of an event | — | `{ success, data: EventParticipation[] }` |
| `POST` | `/events/:eventId/participants` | Register a member to an event | `EventParticipationCreate` | `{ success, data: EventParticipation }` |
| `PUT` | `/events/:eventId/participants/:id` | Update participant role | `EventParticipationUpdate` | `{ success, data: EventParticipation }` |
| `DELETE` | `/events/:eventId/participants/:id` | Remove participant from event | — | `204 No Content` |

### Member Events

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/members/:no_jemaat/events` | List all events a member participated in | — | `{ success, data: Event[] }` |

---

### Request/Response Schemas

**EventCreate** (POST /events)
```json
{
  "event_name": "Easter Retreat 2026",
  "event_date": "2026-04-03",
  "category": "Retreat",
  "location": "Villa Istana Bunga, Lembang",
  "description": "Retreat Paskah dengan tema ...",
  "gcal_event_id": null,
  "gcal_link": null,
  "last_synced_at": null
}
```

**EventUpdate** (PUT /events/:eventId)
```json
{
  "event_name": "Updated Event Name",
  "location": "New Location"
}
```

**EventParticipationCreate** (POST /events/:eventId/participants)
```json
{
  "no_jemaat": 1001,
  "role": "Peserta"
}
```

**EventParticipationUpdate** (PUT /events/:eventId/participants/:id)
```json
{
  "role": "Panitia"
}
```

**Error Response**
```json
{
  "success": false,
  "error": {
    "code": 404,
    "message": "Event not found"
  }
}
```

**Validation Error Response**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "event_date", "message": "Required" }
    ]
  }
}
```

---

## Frontend Components

### 1. Events Page (`src/pages/Events.jsx`)

Full CRUD event management page.

**Features:**
- Paginated event table (10 per page)
- Search by event name, location, description
- Category filter dropdown
- Color-coded category badges
- Date display with relative labels (Today, Tomorrow, In X days, Past)
- Google Calendar sync status indicator (Synced / Not synced)
- Edit and Delete action buttons per row
- Add Event button (header)

**UI Elements Used:**
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
- `Button`, `Badge`
- `EmptyState`

**Data Source:** `getEvents(filters)` → `GET /events` API

**Category Color Map:**

| Category | Badge Class |
|----------|-------------|
| Camp | `bg-blue-100 text-blue-800` |
| Retreat | `bg-purple-100 text-purple-800` |
| Quarterly | `bg-green-100 text-green-800` |
| Monthly | `bg-orange-100 text-orange-800` |
| Special | `bg-pink-100 text-pink-800` |
| Workshop | `bg-yellow-100 text-yellow-800` |

---

### 2. Upcoming Events Widget (`src/components/dashboard/UpcomingEvents.jsx`)

Dashboard card showing events in the next 7 days.

**Features:**
- Lists upcoming events within 7 days
- Source filter (All / Google Calendar / Local Only)
- Category filter (All / Camp / Retreat / Quarterly / Monthly / Special / Workshop)
- Sync status badge per event (Synced = green + cloud icon, Local = amber + hard-drive icon)
- Google Calendar link for synced events
- Participant count display
- Relative date labels

**UI Elements Used:**
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Badge`, `Button`, `Separator`
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`

**Data Source:** `getUpcomingEvents(days)` — filters local `event_history` mock data by date range (hardcoded reference date: 2026-04-03)

---

### 3. Event Attendance Trends (`src/components/dashboard/EventAttendanceTrends.jsx`)

Dual-view event analytics card with trend line chart and interactive calendar.

**Tabs:**

#### Trends Tab
- Multi-line chart (Recharts `LineChart`) with one line per event category
- X-axis: months, Y-axis: attendance count
- Legend with category color coding
- Custom tooltip showing category + count on hover
- Categories: Camp, Retreat, Quarterly, Monthly, Special, Workshop

#### Calendar Tab
- Month-by-month calendar grid (custom CSS grid, not a library)
- Month navigation (prev/next)
- Day-click reveals event details for that date
- Category-colored dots on days with events (up to 3 visible, overflow indicator)
- Stats: total events, days with events
- Selected day panel: event cards with name, location, category badge, sync status, description, GCal link

**UI Elements Used:**
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Badge`, `Button`, `Separator`
- Recharts: `LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`, `Legend`

**Data Sources:**
- `fetchEventAttendanceTrends()` → `GET /analytics/events/attendance-trend`
- `getEvents({ limit: 100 })` → `GET /events?limit=100`

**Category Chart Colors:**

| Category | CSS Variable |
|----------|-------------|
| Camp | `var(--chart-1)` |
| Retreat | `var(--chart-2)` |
| Quarterly | `var(--chart-3)` |
| Monthly | `var(--chart-4)` |
| Special | `var(--chart-5)` |
| Workshop | `var(--chart-6)` |

---

## Dashboard Visualizations

### 1. Upcoming Events (Section 3.1)

- **Data Source:** `event_history` table + `event_participation` table
- **Visualization:** Calendar view or list view
- **Metrics Displayed:**
  - Next 3 upcoming events by date
  - Event name, date, and category
  - Registration status from `event_participation`:
    - Registered participants count
    - Registered volunteers/panitia count
    - Capacity percentage (if applicable)
- **Features:**
  - Color-coding by event category (Camp, Retreat, Quarterly, Monthly)
  - Click to view event details
  - "Register" button for volunteers/panitia (if applicable)

### 2. Event Attendance Trends (Section 3.2)

- **Data Source:** `event_history` table + `event_participation` table
- **Visualization:** Line chart with optional overlay
- **Metrics Displayed:**
  - Monthly/Quarterly event attendance over time (last 12 months)
  - Separate lines for different event categories
  - Optional: Stacked area showing participation roles (Peserta, Panitia, Volunteer)
- **Calculation Logic:**
```sql
SELECT
  DATE_TRUNC('month', eh.event_date) AS month,
  eh.category,
  COUNT(DISTINCT ep.no_jemaat) AS total_attendees,
  COUNT(DISTINCT CASE WHEN ep.role = 'Peserta' THEN ep.no_jemaat END) AS peserta_count,
  COUNT(DISTINCT CASE WHEN ep.role IN ('Panitia', 'Volunteer') THEN ep.no_jemaat END) AS volunteer_panitia_count
FROM event_history eh
LEFT JOIN event_participation ep ON eh.event_id = ep.event_id
WHERE eh.event_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', eh.event_date), eh.category
ORDER BY month, eh.category;
```

### 3. Most Popular Event Types (Section 3.3)

- **Data Source:** `event_history` table + `event_participation` table
- **Visualization:** Bar chart
- **Metrics Displayed:**
  - Average attendance by event category
  - Total events held by category (last 12 months)
  - Engagement rate (attendance per event)
- **Calculation Logic:**
```sql
SELECT
  eh.category,
  COUNT(DISTINCT eh.event_id) AS event_count,
  AVG(ep_counts.attendance) AS avg_attendance,
  SUM(ep_counts.attendance) AS total_attendance
FROM event_history eh
JOIN (
    SELECT event_id, COUNT(DISTINCT no_jemaat) AS attendance
    FROM event_participation
    GROUP BY event_id
) ep_counts ON eh.event_id = ep_counts.event_id
WHERE eh.event_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY eh.category
ORDER BY avg_attendance DESC;
```

### 4. Event Participation Summary (Section 5.3)

- **Data Source:** `event_history` table + `event_participation` table
- **Visualization:** Summary cards
- **Metrics Displayed for Most Recent Event:**
  - Event name and date
  - Total attendance
  - Breakdown by role: Peserta, Panitia, Volunteer
  - Comparison to similar past events (same category)
  - Trend indicator (up/down/same vs. previous similar event)
- **Calculation Logic:**
```sql
SELECT
  eh.event_id,
  eh.event_name,
  eh.event_date,
  eh.category,
  COUNT(DISTINCT ep.no_jemaat) AS total_attendance,
  COUNT(DISTINCT CASE WHEN ep.role = 'Peserta' THEN ep.no_jemaat END) AS peserta,
  COUNT(DISTINCT CASE WHEN ep.role = 'Panitia' THEN ep.no_jemaat END) AS panitia,
  COUNT(DISTINCT CASE WHEN ep.role = 'Volunteer' THEN ep.no_jemaat END) AS volunteer
FROM event_history eh
LEFT JOIN event_participation ep ON eh.event_id = ep.event_id
WHERE eh.event_id = $1
GROUP BY eh.event_id, eh.event_name, eh.event_date, eh.category;
```

### 5. Event Participation by Member

- **Data Source:** `event_participation` table + `event_history`
- **Visualization:** Table or list within member profile
- **Metrics Displayed:**
  - All events attended by a specific member
  - Role at each event
  - Registration date
- **Query:**
```sql
SELECT
  eh.event_name,
  eh.event_date,
  eh.category,
  eh.location,
  ep.role,
  ep.registered_at
FROM event_participation ep
JOIN event_history eh ON ep.event_id = eh.event_id
WHERE ep.no_jemaat = $1
ORDER BY eh.event_date DESC;
```

---

## Insights Enabled by Event Data

### 1. Resource Forecasting
Predict volunteer and material needs based on historical participation patterns per event category.

### 2. Engagement Segmentation
Identify most engaged members — those who frequently volunteer across multiple event types (cross-reference `event_participation.role = 'Volunteer'` across different events).

### 3. Event Optimization
Determine optimal timing and format for different event categories by analyzing attendance trends over time.

### 4. ROI Measurement
Compare attendance and engagement across event types to guide resource allocation decisions.

### 5. Community Building
Track growth in volunteer base as an indicator of ownership and commitment. Monitor `event_participation` records where `role IN ('Panitia', 'Volunteer')` over time.

### 6. Member Engagement Score Component
Event attendance is a 30% weight component in the composite Member Engagement Score:
- Frequency of event participation
- Role diversity (Peserta → Volunteer → Panitia progression)
- Recency of last event participation

### 7. At-Risk Member Detection
Previously active members with no event participation in 90+ days should be flagged for pastoral follow-up.

---

## Sample Queries

### Event Statistics Dashboard Card

```sql
SELECT
  COUNT(*) FILTER (WHERE event_date >= CURRENT_DATE) AS upcoming_events,
  COUNT(*) FILTER (WHERE event_date < CURRENT_DATE) AS past_events,
  COUNT(*) FILTER (WHERE event_date >= DATE_TRUNC('month', CURRENT_DATE)
                    AND event_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month') AS events_this_month,
  COUNT(*) FILTER (WHERE gcal_event_id IS NOT NULL) AS synced_events
FROM event_history;
```

### Average Attendance by Category (Last 12 Months)

```sql
SELECT
  eh.category,
  COUNT(DISTINCT eh.event_id) AS event_count,
  ROUND(AVG(participant_counts.cnt), 1) AS avg_attendance
FROM event_history eh
JOIN (
  SELECT event_id, COUNT(DISTINCT no_jemaat) AS cnt
  FROM event_participation
  GROUP BY event_id
) participant_counts ON eh.event_id = participant_counts.event_id
WHERE eh.event_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY eh.category
ORDER BY avg_attendance DESC;
```

### Top Volunteers (Most Events Volunteered)

```sql
SELECT
  ep.no_jemaat,
  j.nama_jemaat,
  COUNT(DISTINCT ep.event_id) AS events_volunteered,
  COUNT(DISTINCT CASE WHEN ep.role = 'Panitia' THEN ep.event_id END) AS as_panitia,
  COUNT(DISTINCT CASE WHEN ep.role = 'Volunteer' THEN ep.event_id END) AS as_volunteer
FROM event_participation ep
JOIN cnx_jemaat_clean j ON ep.no_jemaat = j.no_jemaat
WHERE ep.role IN ('Panitia', 'Volunteer')
GROUP BY ep.no_jemaat, j.nama_jemaat
ORDER BY events_volunteered DESC
LIMIT 20;
```

### Monthly Event Attendance Trend

```sql
SELECT
  TO_CHAR(DATE_TRUNC('month', eh.event_date), 'YYYY-MM') AS month,
  eh.category,
  COUNT(DISTINCT ep.no_jemaat) AS total_attendees,
  COUNT(DISTINCT CASE WHEN ep.role = 'Peserta' THEN ep.no_jemaat END) AS peserta_count,
  COUNT(DISTINCT CASE WHEN ep.role IN ('Panitia', 'Volunteer') THEN ep.no_jemaat END) AS volunteer_panitia_count
FROM event_history eh
LEFT JOIN event_participation ep ON eh.event_id = ep.event_id
WHERE eh.event_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', eh.event_date), eh.category
ORDER BY month, eh.category;
```

### Members with No Recent Event Participation (90+ days)

```sql
SELECT
  j.no_jemaat,
  j.nama_jemaat,
  j.nama_cgf,
  MAX(eh.event_date) AS last_event_date,
  CURRENT_DATE - MAX(eh.event_date) AS days_since_last_event
FROM cnx_jemaat_clean j
LEFT JOIN event_participation ep ON j.no_jemaat = ep.no_jemaat
LEFT JOIN event_history eh ON ep.event_id = eh.event_id
GROUP BY j.no_jemaat, j.nama_jemaat, j.nama_cgf
HAVING MAX(eh.event_date) < CURRENT_DATE - INTERVAL '90 days'
    OR MAX(eh.event_date) IS NULL
ORDER BY last_event_date ASC NULLS FIRST;
```

### Role Progression for a Member

```sql
SELECT
  eh.event_date,
  eh.event_name,
  eh.category,
  ep.role,
  ep.registered_at
FROM event_participation ep
JOIN event_history eh ON ep.event_id = eh.event_id
WHERE ep.no_jemaat = $1
ORDER BY eh.event_date ASC;
```

---

## Implementation Status

### Backend (Implemented)

| Component | File | Status |
|-----------|------|--------|
| Data model & interfaces | `backend/src/models/events.model.ts` | Done |
| CRUD operations | `backend/src/models/events.model.ts` | Done |
| Participation operations | `backend/src/models/events.model.ts` | Done |
| REST routes | `backend/src/routes/events.routes.ts` | Done |
| Zod validation | `backend/src/routes/validators.ts` | Done |
| DB migrations | `backend/migrations/003_add_missing_tables.sql` | Done |
| GCal sync columns | `backend/migrations/004_add_gcal_columns_to_events.sql` | Done |
| Seed data (19 events) | `backend/scripts/seed-events.ts` | Done |

### Frontend (Implemented)

| Component | File | Status |
|-----------|------|--------|
| Events list page | `src/pages/Events.jsx` | Done |
| Upcoming events widget | `src/components/dashboard/UpcomingEvents.jsx` | Done |
| Attendance trends + calendar | `src/components/dashboard/EventAttendanceTrends.jsx` | Done |
| Mock data layer | `src/data/mock.js` (lines 221-282, 404-419, 963-978) | Done |

### Pending / To Implement

| Feature | Description | Priority |
|---------|-------------|----------|
| Event Create/Edit forms | Modal or page for creating and editing events | High |
| Participant management UI | Add/remove/edit participants from event detail view | High |
| Event detail page | Individual event page with full participant list | High |
| Most Popular Event Types chart | Bar chart of avg attendance by category | Medium |
| Event Participation Summary card | Last event stats with comparison | Medium |
| Member event history view | Show events attended in member profile | Medium |
| Top Volunteers leaderboard | Ranked list of most active volunteers | Low |
| At-risk detection via events | Flag members with 90+ days no participation | Low |
| Role progression tracking | Visual timeline of Peserta → Volunteer → Panitia | Low |

---

## Design Principles

1. **Consistency with existing tables** — All features must work with the established `event_history` and `event_participation` schemas. No new event-related tables without migration approval.
2. **Category-driven visualization** — The 6 event categories (Camp, Retreat, Quarterly, Monthly, Special, Workshop) are the primary dimension for analytics breakdowns.
3. **Role-based participation** — The 3 roles (Peserta, Panitia, Volunteer) define member engagement level and are used in scoring and segmentation.
4. **Google Calendar as optional sync** — Events can exist without GCal sync. The UI must handle both synced and local-only events gracefully.
5. **Timezone-aware date handling** — Event dates are stored as `date` type. Frontend must parse date strings directly (`split('-')`) to avoid browser timezone offsets.
6. **Pagination on all list endpoints** — Default page size: 20 for API, 10 for frontend tables. Filterable by category and date range.

---

*This document should be reviewed and updated whenever event-related database schema changes are made.*
