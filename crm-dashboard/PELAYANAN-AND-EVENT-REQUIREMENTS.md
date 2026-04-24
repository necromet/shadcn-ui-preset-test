# Church Management System Dashboard

**Last Updated:** 2026-04-03T18:45:00+07:00  
**System:** Church Management System  
**Database Tables:** `pelayanan_info`, `pelayan`, `cnx_jemaat_status_history`, `event_history`, `event_participation`

---

## Overview

This document outlines the recommended dashboard components for a church management system based on the available database schema. The dashboard is designed to provide church leadership with actionable insights into member engagement, ministry participation, event analytics, and overall church health.

---

## Core Dashboard Sections

### 1. Member Overview

#### Active vs. Inactive Members

- **Data Source:** `cnx_jemaat_status_history` table
- **Visualization:** Pie chart showing distribution of member statuses
- **Metrics Displayed:**
  - Count and percentage of Active members
  - Count and percentage of Inactive members
  - Count and percentage of Sabbatical members
  - Count and percentage of Moved members
- **Additional Features:**
  - Trend line showing status changes over the last 6 months
  - Hover tooltip with exact counts and dates of changes
  - Filter options for date range (last 30 days, 90 days, 6 months, 1 year)

#### Total Members Serving

- **Data Source:** `pelayan` table (boolean service flags)
- **Visualization:** Stat counter with trend indicator
- **Metrics Displayed:**
  - Total count of members serving in any ministry (`is_*` flags = true)
  - Percentage of active members who are serving
  - Month-over-month change in serving members
- **Calculation Logic:**
```sql
SELECT
  COUNT(DISTINCT p.no_jemaat) AS total_serving,
  (COUNT(DISTINCT p.no_jemaat) * 100.0 /
   (SELECT COUNT(*) FROM cnx_jemaat_status_history
    WHERE status = 'Active' AND changed_at = (
      SELECT MAX(changed_at) FROM cnx_jemaat_status_history
      WHERE no_jemaat = p.no_jemaat
    ))) AS serving_percentage
FROM pelayan p
WHERE p.is_worship_leader = 1 OR p.is_singer = 1 OR p.is_pianist = 1
      OR p.is_saxophone = 1 OR p.is_filler = 1 OR p.is_bass_guitarist = 1
      OR p.is_drummer = 1 OR p.is_multimedia = 1 OR p.is_sound = 1
      OR p.is_caringteam = 1 OR p.is_connexion_crew = 1
      OR p.is_supporting_crew = 1 OR p.is_cforce = 1
      OR p.is_cg_leader = 1 OR p.is_community_pic = 1
      OR p.is_others = 1
```

---

### 2. Ministry/Service Participation

#### Service Team Breakdown

- **Data Source:** `pelayan` table (individual boolean service flags)
- **Visualization:** Horizontal bar chart
- **Metrics Displayed:**
  - Worship Leaders (`is_worship_leader`)
  - Singers (`is_singer`)
  - Pianists/Keyboardists (`is_pianist`)
  - Saxophone Players (`is_saxophone`)
  - Filler Musicians (`is_filler`)
  - Bass Guitarists (`is_bass_guitarist`)
  - Drummers (`is_drummer`)
  - Multimedia/Tech Team (`is_multimedia`)
  - Sound Engineers (`is_sound`)
  - Care Team (`is_caringteam`)
  - Connexion Crew (`is_connexion_crew`)
  - Supporting Crew (`is_supporting_crew`)
  - CForce (`is_cforce`)
  - CG Leaders (`is_cg_leader`)
  - Community PIC (`is_community_pic`)
- **Additional Features:**
  - Sorting options (alphabetical, by count ascending/descending)
  - Clickable bars to drill down to member list for each ministry
  - Percentage of total serving members for each ministry

#### Multi-Skill Members Analysis

- **Data Source:** `pelayan` table (count of true service flags per member)
- **Visualization:** Radar chart or histogram
- **Metrics Displayed:**
  - Distribution of members by number of ministries served (1, 2, 3, 4+)
  - Average number of ministries per serving member
  - Percentage of members serving in multiple ministries
- **Calculation Logic:**
```sql
SELECT
  (CASE
      WHEN (is_worship_leader + is_singer + is_pianist + is_saxophone + is_filler +
            is_bass_guitarist + is_drummer + is_multimedia + is_sound +
            is_caringteam + is_connexion_crew + is_supporting_crew +
            is_cforce + is_cg_leader + is_community_pic) = 0 THEN 0
      WHEN (is_worship_leader + is_singer + is_pianist + is_saxophone + is_filler +
            is_bass_guitarist + is_drummer + is_multimedia + is_sound +
            is_caringteam + is_connexion_crew + is_supporting_crew +
            is_cforce + is_cg_leader + is_community_pic) = 1 THEN 1
      WHEN (is_worship_leader + is_singer + is_pianist + is_saxophone + is_filler +
            is_bass_guitarist + is_drummer + is_multimedia + is_sound +
            is_caringteam + is_connexion_crew + is_supporting_crew +
            is_cforce + is_cg_leader + is_community_pic) = 2 THEN 2
      WHEN (is_worship_leader + is_singer + is_pianist + is_saxophone + is_filler +
            is_bass_guitarist + is_drummer + is_multimedia + is_sound +
            is_caringteam + is_connexion_crew + is_supporting_crew +
            is_cforce + is_cg_leader + is_community_pic) = 3 THEN 3
      ELSE 4
  END) AS ministries_count,
  COUNT(*) AS member_count
FROM pelayan
GROUP BY ministries_count
ORDER BY ministries_count
```

#### Worship Team Composition

- **Data Source:** `pelayan` table (worship-related flags)
- **Visualization:** Donut chart
- **Metrics Displayed:**
  - Vocalists (Singers + Worship Leaders)
  - Instrumentalists (Pianist, Saxophone, Bass, Drums, Filler)
- **Drill-down Options:**
  - Vocal breakdown: Singers vs. Worship Leaders
  - Instrument breakdown: Pianist, Saxophone, Bass, Drums, Filler

---

### 3. Event Analytics

> **Full specification:** See [EVENT-REQUIREMENTS.MD](./EVENT-REQUIREMENTS.MD) for complete database schema, API endpoints, frontend component details, and all event-related queries.

#### Database Schema

**Table: `event_history`**
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `event_id` | serial4 (PK) | No | Auto-increment |
| `event_name` | varchar(255) | No | Event display name |
| `event_date` | date | No | Event date |
| `category` | event_category_enum | No | Camp, Retreat, Quarterly, Monthly, Special, Workshop |
| `location` | varchar(255) | Yes | Venue |
| `description` | text | Yes | Event details |
| `gcal_event_id` | varchar(255) | Yes | Google Calendar sync ID |
| `gcal_link` | text | Yes | Google Calendar URL |
| `last_synced_at` | timestamptz | Yes | Last sync timestamp |

**Table: `event_participation`**
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | serial4 (PK) | No | Auto-increment |
| `event_id` | int4 (FK) | No | → `event_history.event_id` (CASCADE) |
| `no_jemaat` | int4 (FK) | No | → `cnx_jemaat_clean.no_jemaat` (CASCADE) |
| `role` | event_role_enum | No | Peserta (default), Panitia, Volunteer |
| `registered_at` | timestamp | Auto | `DEFAULT now()` |

- **Unique constraint:** `UNIQUE(event_id, no_jemaat)` — one registration per member per event
- **Indexes:** `idx_event_history_category`, `idx_event_history_date`, `idx_event_history_gcal_event_id`, `idx_event_participation_event`, `idx_event_participation_jemaat`, `idx_event_participation_role`

#### API Endpoints (Implemented)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/events` | List events (paginated, filterable by `category`, `start_date`, `end_date`) |
| POST | `/events` | Create event (validated via Zod `EventCreateSchema`) |
| GET | `/events/:eventId` | Get single event |
| PUT | `/events/:eventId` | Update event (validated via Zod `EventUpdateSchema`) |
| DELETE | `/events/:eventId` | Delete event |
| GET | `/events/:eventId/participants` | List event participants |
| POST | `/events/:eventId/participants` | Add participant (validated via Zod `EventParticipationCreateSchema`) |
| PUT | `/events/:eventId/participants/:id` | Update participant role |
| DELETE | `/events/:eventId/participants/:id` | Remove participant |
| GET | `/members/:no_jemaat/events` | List events for a member |

#### Frontend Components (Implemented)

| Component | File | Description |
|-----------|------|-------------|
| Events Page | `src/pages/Events.jsx` | Full event list with search, category filter, pagination (10/page), sync status |
| Upcoming Events | `src/components/dashboard/UpcomingEvents.jsx` | Dashboard widget: next 7 days, source/category filters |
| Event Attendance Trends | `src/components/dashboard/EventAttendanceTrends.jsx` | Line chart by category + interactive calendar view |

#### Upcoming Events Widget

- **Data Source:** `event_history` table + `event_participation` table
- **Visualization:** Calendar view or list view
- **Metrics Displayed:**
  - Next 3 upcoming events by date
  - Event name, date, and category
  - Registration status (from `event_participation`):
    - Registered participants count
    - Registered volunteers/panitia count
    - Capacity percentage (if applicable)
- **Additional Features:**
  - Color-coding by event category (Camp, Retreat, Quarterly, Monthly)
  - Click to view event details
  - "Register" button for volunteers/panitia (if applicable)
  - Source filter (All / Google Calendar synced / Local only)
  - Google Calendar link for synced events

#### Event Attendance Trends

- **Data Source:** `event_history` table + `event_participation` table
- **Visualization:** Line chart with optional overlay + interactive calendar tab
- **Metrics Displayed:**
  - Monthly/Quarterly event attendance over time (last 12 months)
  - Separate lines for different event categories (Camp, Retreat, Quarterly, Monthly, Special, Workshop)
  - Optional: Stacked area showing participation roles (Peserta, Panitia, Volunteer)
- **Calculation Logic:**
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

#### Most Popular Event Types

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
  ROUND(AVG(ep_counts.attendance), 1) AS avg_attendance,
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

#### Event Participation Summary (Recent Activity)

- **Data Source:** `event_history` table + `event_participation` table
- **Visualization:** Summary cards
- **Metrics Displayed for Most Recent Event:**
  - Event name and date
  - Total attendance
  - Breakdown by role: Peserta, Panitia, Volunteer
  - Comparison to similar past events (same category)
  - Trend indicator (up/down/same vs. previous similar event)
- **Query:**
```sql
SELECT
  eh.event_id, eh.event_name, eh.event_date, eh.category,
  COUNT(DISTINCT ep.no_jemaat) AS total_attendance,
  COUNT(DISTINCT CASE WHEN ep.role = 'Peserta' THEN ep.no_jemaat END) AS peserta,
  COUNT(DISTINCT CASE WHEN ep.role = 'Panitia' THEN ep.no_jemaat END) AS panitia,
  COUNT(DISTINCT CASE WHEN ep.role = 'Volunteer' THEN ep.no_jemaat END) AS volunteer
FROM event_history eh
LEFT JOIN event_participation ep ON eh.event_id = ep.event_id
WHERE eh.event_date <= CURRENT_DATE
GROUP BY eh.event_id, eh.event_name, eh.event_date, eh.category
ORDER BY eh.event_date DESC
LIMIT 1;
```

#### Insights from Event Data

1. **Resource Forecasting:** Predict volunteer and material needs based on historical participation
2. **Engagement Segmentation:** Identify most engaged members (frequent volunteers across event types)
3. **Event Optimization:** Determine optimal timing and format for different event categories
4. **ROI Measurement:** Compare attendance and engagement across event types to guide resource allocation
5. **Community Building:** Track growth in volunteer base as indicator of ownership and commitment

---

### 4. Engagement Metrics

#### Service Frequency Distribution

- **Data Source:** `pelayan.total_pelayanan` column
- **Visualization:** Histogram
- **Metrics Displayed:**
  - Distribution of total services served among members
  - Buckets: 0, 1-5, 6-10, 11-20, 21-50, 51+ services
  - Average services served per active member
  - Median services served
- **Calculation Logic:**
```sql
SELECT
  CASE
    WHEN total_pelayanan = 0 THEN '0'
    WHEN total_pelayanan BETWEEN 1 AND 5 THEN '1-5'
    WHEN total_pelayanan BETWEEN 6 AND 10 THEN '6-10'
    WHEN total_pelayanan BETWEEN 11 AND 20 THEN '11-20'
    WHEN total_pelayanan BETWEEN 21 AND 50 THEN '21-50'
    ELSE '51+'
  END AS service_range,
  COUNT(*) AS member_count,
  AVG(total_pelayanan) AS avg_services
FROM pelayan p
JOIN cnx_jemaat_status_history csh ON p.no_jemaat = csh.no_jemaat
WHERE csh.status = 'Active'
  AND csh.changed_at = (
    SELECT MAX(changed_at) FROM cnx_jemaat_status_history
    WHERE no_jemaat = p.no_jemaat
  )
GROUP BY service_range
ORDER BY
  CASE service_range
    WHEN '0' THEN 0
    WHEN '1-5' THEN 1
    WHEN '6-10' THEN 2
    WHEN '11-20' THEN 3
    WHEN '21-50' THEN 4
    ELSE 5
  END
```

#### Member Engagement Score

- **Data Source:** Multiple tables (composite metric)
- **Visualization:** Gauge chart or progress bar + distribution histogram
- **Components:**
  - Service Participation (40% weight): Based on `pelayan` service flags and `total_pelayanan`
  - Event Attendance (30% weight): Based on `event_participation` frequency
  - Status Stability (20% weight): Based on `cnx_jemaat_status_history` (Active status consistency)
  - Ministry Versatility (10% weight): Based on number of different service areas
- **Score Range:** 0-100
- **Visualization:**
  - Overall church average engagement score
  - Distribution of scores across membership (histogram)
  - Trend of average engagement over time

---

### 5. Recent Activity Feed

#### Latest Status Changes

- **Data Source:** `cnx_jemaat_status_history` table
- **Visualization:** Table with recent entries
- **Fields Displayed:**
  - Member name (from `pelayan` table join)
  - Previous status → New status
  - Date of change
  - Reason for change
- **Default Sort:** Most recent first
- **Default Limit:** Last 10 changes
- **Filters:** Status type, date range

#### New Serving Members

- **Data Source:** `pelayan` table + status history
- **Visualization:** List with member details
- **Criteria:** Members who recently started serving (within last 30 days)
- **Logic:**
```sql
-- Members who have service flags set to true recently
-- and either had no service before or status change to Active
SELECT
  p.nama_jemaat,
  MIN(csh.changed_at) AS start_date,
  GROUP_CONCAT(
    CASE WHEN p.is_worship_leader = 1 THEN 'Worship Leader' END,
    CASE WHEN p.is_singer = 1 THEN 'Singer' END,
    -- ... other ministries
    SEPARATOR ', '
  ) AS ministries
FROM pelayan p
JOIN cnx_jemaat_status_history csh ON p.no_jemaat = csh.no_jemaat
WHERE (p.is_worship_leader = 1 OR p.is_singer = 1 OR /* ... all service flags */)
  AND csh.status = 'Active'
  AND csh.changed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND NOT EXISTS (
    SELECT 1 FROM pelayan p2
    WHERE p2.no_jemaat = p.no_jemaat
      AND (p2.is_worship_leader = 1 OR p2.is_singer = 1 OR /* ... all service flags */)
      AND p2.no_jemaat IN (
        SELECT no_jemaat FROM cnx_jemaat_status_history
        WHERE changed_at < csh.changed_at
          AND status = 'Active'
        ORDER BY changed_at DESC LIMIT 1
      )
  )
GROUP BY p.no_jemaat, p.nama_jemaat
ORDER BY start_date DESC
LIMIT 10
```

#### Event Participation Summary

- **Data Source:** `event_history` table + `event_participation` table
- **Visualization:** Summary cards
- **Metrics Displayed for Most Recent Event:**
  - Event name and date
  - Total attendance
  - Breakdown by role: Peserta, Panitia, Volunteer
  - Comparison to similar past events (same category)
  - Trend indicator (up/down/same vs. previous similar event)

---

### 6. Pastoral Care Dashboard

#### Care Visit Tracker

- **Data Source:** `cnx_jemaat_status_history` table + `pelayan` table
- **UI Components:** `Card`, `Table`, `Avatar`, `AvatarFallback`, `Badge`, `Progress`, `Dialog`, `Button`, `Input`, `Select`, `Separator`
- **Visualization:** Kanban-style board with columns for Visit Status (Scheduled, Completed, Follow-up Needed, Overdue)
- **Metrics Displayed:**
  - Total pastoral visits this month vs. target
  - Visit completion rate with `Progress` bar indicator
  - Members requiring follow-up (flagged via status history patterns)
  - Average time between visits per member
- **Non-Generic UI Concepts:**
  - **Heat Map Calendar:** A CSS grid-based month view where each cell's background intensity reflects visit volume (using semantic `bg-primary/10` through `bg-primary` opacity scale). Built with `Card` cells inside a responsive grid, not a third-party calendar library.
  - **Member Proximity Radar:** Circular layout showing members grouped by last visit recency (inner ring = visited this week, outer ring = 30+ days). Each member rendered as an `Avatar` with `Badge` overlay showing days since last visit.
  - **Care Pulse Indicator:** Animated `Progress` bar that fills in real-time as visits are completed during the day, with a `Separator` marking the halfway target.

#### At-Risk Member Alerts

- **Data Source:** `cnx_jemaat_status_history` table (status change patterns)
- **UI Components:** `Alert`, `AlertDescription`, `Avatar`, `AvatarFallback`, `Badge`, `Button`, `Card`, `Separator`
- **Visualization:** Priority-sorted alert list
- **Criteria for At-Risk Flags:**
  - Members with status change to Inactive within last 30 days
  - Members with 2+ status changes in 6 months (instability indicator)
  - Members on Sabbatical for 3+ months without reintegration plan
  - Previously active members with no event participation in 90+ days
- **Non-Generic UI Concepts:**
  - **Risk Score Meter:** Each alert card displays a segmented horizontal bar (5 segments) using `Badge` components with variant="outline" for inactive segments and variant="destructive" for active risk segments. Not a progress bar—a discrete risk level indicator.
  - **Cascading Alert Cards:** `Card` components with `data-[severity="high"]:border-destructive` custom data attributes for severity-based border styling. Cards expand on click to reveal `Dialog` with full member history.
  - **Action Funnel:** Inline `Button` group at bottom of each alert card: "Assign Caregiver" → "Schedule Visit" → "Mark Resolved", with `Separator` dividers between actions.

---

### 7. Communication Hub

#### Announcement Board

- **Data Source:** Application-level announcements table (to be created)
- **UI Components:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `Badge`, `Button`, `Avatar`, `AvatarFallback`, `Separator`, `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- **Visualization:** Tabbed view with categories (Urgent, Ministry Updates, General, Archived)
- **Metrics Displayed:**
  - Active announcements count per category
  - Read/unread status per announcement
  - Announcement author and timestamp
  - Pinned announcements (always visible)
- **Non-Generic UI Concepts:**
  - **Notification Ripple Effect:** When a new announcement is posted, existing announcement cards animate a subtle border pulse using CSS `@keyframes` with `border-primary` color. Pure CSS, no JavaScript animation library.
  - **Priority Gradient Cards:** Announcement `Card` components use a left-border accent gradient (`border-l-4` with `border-l-primary` for normal, `border-l-destructive` for urgent, `border-l-secondary` for ministry). The gradient effect comes from stacking `bg-gradient-to-r from-primary/20 to-transparent` behind the card content.
  - **Smart Preview Cards:** Announcement content truncated with `truncate` class, expandable via `Dialog` overlay. The trigger uses `asChild` prop on `Button` to make the entire card clickable.

#### Communication Log

- **Data Source:** Interaction history (to be linked with member profiles)
- **UI Components:** `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `Avatar`, `AvatarFallback`, `Badge`, `Input`, `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `Button`
- **Visualization:** Filterable `Table` of all communications
- **Fields Displayed:**
  - Member contacted (with `Avatar`)
  - Communication type (Call, Visit, Message, Email)
  - Date and time
  - Outcome (Completed, No Response, Follow-up Needed)
  - Assigned pastoral staff
- **Non-Generic UI Concepts:**
  - **Timeline Thread View:** Toggle between `Table` view and a vertical timeline. The timeline uses `Separator` (vertical orientation) as the spine, with `Card` components branching alternately left/right. Each card shows communication details with `Avatar` and timestamp.
  - **Interaction Density Sparkline:** Above the table, a row of small `Card` components (one per day of the current month) showing communication count as a vertical bar using `Progress` with `orientation="vertical"` (custom extension). Visual pattern reveals communication rhythm.

---

### 8. Small Group (CG) Management

#### CG Health Dashboard

- **Data Source:** `pelayan` table (`is_cg_leader` flag) + `event_participation` table + `cnx_jemaat_status_history`
- **UI Components:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `Avatar`, `AvatarFallback`, `Badge`, `Progress`, `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `Button`, `Separator`, `Empty`
- **Visualization:** Grid of `Card` components, one per Community Group
- **Metrics Displayed per CG:**
  - CG Leader name and `Avatar`
  - Member count vs. capacity (e.g., 8/12) with `Progress` bar
  - Attendance rate for last 4 meetings (mini `Badge` row: 85%, 90%, 75%, 88%)
  - New members this quarter
  - Members at risk (Inactive/Sabbatical)
- **Non-Generic UI Concepts:**
  - **CG Vitality Ring:** Each CG card displays a circular progress indicator built with CSS `conic-gradient` applied to a `div` with `rounded-full`, ringed by `border-4 border-background`. The conic gradient uses `--primary` CSS variable for filled portion and `--muted` for unfilled. Score ranges: Green (80-100%), Yellow (50-79%), Red (<50%).
  - **Member Constellation View:** Clicking a CG card opens a `Dialog` showing members arranged in a circle around the CG Leader's `Avatar` in the center. Connections between members who serve together in ministries shown as SVG lines. Uses `Avatar` + `Badge` for each member node.
  - **Attendance Spark Bar:** A horizontal sequence of 4 tiny `div` elements inside each card, each with height proportional to attendance percentage and `bg-primary` or `bg-muted` based on threshold. Not a chart—a custom CSS bar visualization.

#### CG Growth Tracker

- **Data Source:** `cnx_jemaat_status_history` + CG membership records
- **UI Components:** `Card`, `Progress`, `Badge`, `Separator`, `Table`, `Avatar`, `AvatarFallback`
- **Visualization:** Growth comparison across CGs
- **Metrics Displayed:**
  - Net member growth per CG (last quarter)
  - CGs with declining membership (flagged with `Badge` variant="destructive")
  - CGs at capacity (flagged with `Badge` variant="secondary")
  - Average CG size trend
- **Non-Generic UI Concepts:**
  - **Growth Trajectory Arrows:** Each CG card shows a directional indicator built with Lucide `TrendingUp`/`TrendingDown` icons inside a `Badge`. The `Badge` variant changes based on growth direction: variant="default" for growth, variant="destructive" for decline, variant="outline" for stable.
  - **Capacity Pressure Gauge:** Stacked `Progress` bars inside a `Card` showing three zones: Underfilled (<50%, `bg-muted`), Optimal (50-80%, `bg-primary`), Overfilled (>80%, `bg-secondary`). The current fill level shown as a `Separator` marker across all three bars.

---

### 9. Member Journey Timeline

#### Individual Member Timeline

- **Data Source:** `cnx_jemaat_status_history` + `event_participation` + `pelayan` table
- **UI Components:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `Avatar`, `AvatarFallback`, `Badge`, `Separator`, `Button`, `Dialog`, `DialogContent`, `DialogTitle`, `DialogDescription`, `Select`, `Input`
- **Visualization:** Vertical timeline showing all milestones for a selected member
- **Events Displayed:**
  - Status changes (Active → Inactive → Active)
  - Event participation (first event, milestones like 10th event)
  - Ministry onboarding (started serving in a new ministry)
  - CG membership changes
  - Service count milestones (10th, 25th, 50th service)
- **Non-Generic UI Concepts:**
  - **Branching Timeline:** Instead of a single vertical line, the timeline branches horizontally when multiple events occur on the same date. Uses `flex` with `gap-*` for branches, `Separator` for the main spine. Each branch is a `Card` with `className="relative"` containing the event details.
  - **Milestone Halo Effect:** Significant milestones (baptism, 1-year serving, leadership appointment) get a `Card` with a CSS `box-shadow` halo using `shadow-primary/30` and `shadow-lg`. Regular events use `shadow-sm`. Pure CSS distinction, no JavaScript conditionals.
  - **Time Compression Slider:** A `Select` component at the top lets users choose time density (Week/Month/Quarter/Year). This controls which events are grouped together. Dense periods show stacked `Badge` components; sparse periods show individual `Card` components.

#### Congregation Journey Overview

- **Data Source:** Aggregated from all member timelines
- **UI Components:** `Card`, `CardHeader`, `CardTitle`, `CardContent`, `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `Badge`, `Avatar`, `AvatarFallback`, `Progress`, `Separator`
- **Visualization:** Cohort analysis view
- **Metrics Displayed:**
  - New members joined per quarter (cohort size)
  - Cohort retention rates at 3, 6, 12 months
  - Average time from joining to first service
  - Average time from joining to CG membership
- **Non-Generic UI Concepts:**
  - **Retention Waterfall:** A horizontal bar chart built entirely with `Card` + CSS `width` percentages. Each bar represents a cohort, with segments colored by retention status: `bg-primary` (still active), `bg-muted` (inactive), `bg-secondary` (moved). The visual "waterfall" effect comes from bars of decreasing width.
  - **Journey Phase Badges:** Members are categorized into journey phases displayed as `Badge` variants: variant="outline" for Newcomer (<3 months), variant="secondary" for Growing (3-12 months), variant="default" for Established (1+ year), variant="destructive" for Drifting (no engagement 90+ days).

---

### 10. Volunteer Scheduling Dashboard

#### Service Schedule Matrix

- **Data Source:** `pelayan` table (service flags) + scheduling table (to be created)
- **UI Components:** `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `Avatar`, `AvatarFallback`, `Badge`, `Button`, `Dialog`, `DialogContent`, `DialogTitle`, `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `Input`, `Card`, `CardHeader`, `CardTitle`, `CardContent`, `Separator`
- **Visualization:** Weekly schedule grid (rows = team members, columns = service dates)
- **Metrics Displayed:**
  - Scheduled vs. available members per service date
  - Ministry coverage percentage per week
  - Members with scheduling conflicts
  - Open slots requiring assignment
- **Non-Generic UI Concepts:**
  - **Availability Heat Grid:** A CSS Grid table where each cell's background color indicates availability: `bg-primary/20` (available), `bg-primary` (scheduled), `bg-destructive/20` (unavailable), `bg-muted` (no response). Cells are `div` elements with `size-8` and `rounded-sm`, creating a visual heat map pattern. Not a calendar component—a custom grid.
  - **Drag-to-Assign Ghost:** When dragging an `Avatar` from the available pool to a schedule slot, a semi-transparent ghost clone follows the cursor (CSS `opacity-50` + `pointer-events-none` on the clone). The drop target highlights with `ring-2 ring-primary`. Radix primitives handle the drag state.
  - **Conflict Resolver Modal:** `Dialog` triggered when a scheduling conflict is detected. Shows conflicting assignments side-by-side in a two-column `flex` layout with `Separator` between columns. Each side is a `Card` with member `Avatar`, `Badge` showing ministry role, and `Button` to swap or remove assignment.

#### Volunteer Availability Heatmap

- **Data Source:** Historical scheduling data + member preferences
- **UI Components:** `Card`, `CardHeader`, `CardTitle`, `CardContent`, `Badge`, `Progress`, `Avatar`, `AvatarFallback`, `Separator`, `Select`
- **Visualization:** Year-at-a-glance availability density
- **Metrics Displayed:**
  - Peak availability periods (most members available)
  - Low-coverage periods (need recruitment)
  - Individual member reliability score (honored commitments / total assignments)
  - Ministry-specific availability patterns
- **Non-Generic UI Concepts:**
  - **GitHub-Style Contribution Grid:** A 52×7 CSS Grid (weeks × days) where each cell is a `div` with `size-3 rounded-[2px]`. Background color uses a 5-level opacity scale based on available volunteer count: `bg-muted` (0), `bg-primary/20` (1-3), `bg-primary/40` (4-6), `bg-primary/70` (7-9), `bg-primary` (10+). Tooltip via `Dialog` on hover shows exact counts.
  - **Reliability Score Rings:** Each volunteer's `Avatar` is surrounded by a CSS `border-2` ring colored by reliability: `border-primary` (>90%), `border-secondary` (70-90%), `border-destructive` (<70%). The ring uses `rounded-full` with `border` applied directly to the `Avatar` component.

---

## Specific Insights Enabled by Data

### From `pelayan` Table:

1. **Ministry Gap Analysis:** Identify understaffed areas (e.g., zero drummers, need more sound tech)
2. **Leadership Identification:** Find members serving in 3+ areas with consistent participation
3. **Specialization vs. Versatility:** Balance between focused specialists and multi-skilled volunteers
4. **Service Recognition:** Track long-term servants via `total_pelayanan` for appreciation programs
5. **Succession Planning:** Identify members serving in leadership roles (CForce, CG Leader, Community PIC)

### From `cnx_jemaat_status_history` Table:

1. **Retention Analytics:** Monitor member churn vs. growth trends
2. **Seasonal Patterns:** Identify predictable cycles in status changes (e.g., more moves during school year ends)
3. **Pastoral Care Triggers:** Flag members moving to Inactive/Sabbatical for caring team follow-up
4. **Reintegration Tracking:** Monitor Sabbatical to Active transitions for effectiveness of break programs
5. **Geographic Insights:** Analyze "Moved" status patterns for potential ministry expansion needs

### From Event Tables:

1. **Resource Forecasting:** Predict volunteer and material needs based on historical participation
2. **Engagement Segmentation:** Identify most engaged members (frequent volunteers across event types)
3. **Event Optimization:** Determine optimal timing and format for different event categories
4. **ROI Measurement:** Compare attendance and engagement across event types to guide resource allocation
5. **Community Building:** Track growth in volunteer base as indicator of ownership and commitment

---

## Recommended Priority Implementation

### Phase 1: Foundation (Weeks 1-2)

1. **Member Status Overview** - Pie chart + trend line
2. **Ministry Participation Bar Chart** - Horizontal bars by ministry
3. **Recent Status Changes Table** - Last 10 updates
4. **At-Risk Member Alerts** - Priority-sorted alert list with risk score meters

### Phase 2: Engagement Depth (Weeks 3-4)

1. **Service Frequency Distribution** - Histogram of `total_pelayanan`
2. **Upcoming Events Calendar** - Next 3 events with registration stats
3. **Worship Team Composition** - Donut chart (Vocalists vs. Instrumentalists)
4. **CG Health Dashboard** - Grid of CG cards with vitality rings

### Phase 3: Analytics & Insights (Weeks 5-6)

1. **Event Attendance Trends** - Line chart over time
2. **Member Engagement Score** - Composite metric gauge
3. **Multi-Skill Members Analysis** - Radar chart or histogram
4. **Care Visit Tracker** - Kanban board with heat map calendar

### Phase 4: Community & Communication (Weeks 7-8)

1. **Announcement Board** - Tabbed communication hub with priority gradient cards
2. **Prayer Wall** - Masonry card grid with prayer count ripple effects
3. **CG Growth Tracker** - Growth trajectory arrows and capacity pressure gauges
4. **Member Journey Timeline** - Branching timeline with milestone halo effects

### Phase 5: Scheduling & Operations (Weeks 9-10)

1. **Service Schedule Matrix** - Weekly grid with availability heat map
2. **Volunteer Availability Heatmap** - GitHub-style contribution grid
3. **Prayer Follow-up Tracker** - Pipeline stage cards with coverage meter
4. **Communication Log** - Timeline thread view with interaction density sparklines

### Phase 6: Advanced Features (Ongoing)

1. Drill-down capabilities from all visualizations to member lists
2. Export functionality (PDF, CSV) for reports
3. Alert system for significant changes (e.g., multiple status changes)
4. Goal tracking against historical baselines or targets
5. Predictive analytics for future staffing needs
6. Congregation Journey Overview with retention waterfall and cohort analysis
7. Member Constellation View for CG relationship mapping

---

## Implementation Notes & SQL Query Suggestions

### Performance Considerations

1. **Materialized Views:** Consider creating materialized views for complex aggregations that update periodically (e.g., nightly)
2. **Indexing Strategy:** Ensure proper indexing on foreign keys and frequently filtered columns:
   - `cnx_jemaat_status_history(no_jemaat, changed_at, status)`
   - `event_participation(no_jemaat, event_id, role)`
   - `pelayan(no_jemaat)` (primary key)
3. **Caching Layer:** Implement caching for dashboard queries with appropriate TTL (5-15 minutes)

---

### Sample Optimized Queries

#### Active Member Count with Latest Status

```sql
SELECT
    csh.status,
    COUNT(*) AS member_count
FROM (
    SELECT
        no_jemaat,
        status,
        ROW_NUMBER() OVER (PARTITION BY no_jemaat ORDER BY changed_at DESC) as rn
    FROM cnx_jemaat_status_history
) csh
WHERE csh.rn = 1
GROUP BY csh.status
```

---

#### Ministry Participation with Percentages

```sql
SELECT
    'Worship Leader' AS ministry,
    SUM(CASE WHEN is_worship_leader = 1 THEN 1 ELSE 0 END) AS count,
    ROUND(SUM(CASE WHEN is_worship_leader = 1 THEN 1 ELSE 0 END) * 100.0 /
          NULLIF(SUM(CASE WHEN is_worship_leader = 1 OR is_singer = 1 OR is_pianist = 1 OR
                       is_saxophone = 1 OR is_filler = 1 OR is_bass_guitarist = 1 OR
                       is_drummer = 1 OR is_multimedia = 1 OR is_sound = 1 OR
                       is_caringteam = 1 OR is_connexion_crew = 1 OR
                       is_supporting_crew = 1 OR is_cforce = 1 OR
                       is_cg_leader = 1 OR is_community_pic = 1), 0), 1) AS percentage
FROM pelayan
UNION ALL
SELECT
    'Singer' AS ministry,
    SUM(CASE WHEN is_singer = 1 THEN 1 ELSE 0 END) AS count,
    ROUND(SUM(CASE WHEN is_singer = 1 THEN 1 ELSE 0 END) * 100.0 /
          NULLIF(SUM(CASE WHEN is_worship_leader = 1 OR is_singer = 1 OR is_pianist = 1 OR
                       is_saxophone = 1 OR is_filler = 1 OR is_bass_guitarist = 1 OR
                       is_drummer = 1 OR is_multimedia = 1 OR is_sound = 1 OR
                       is_caringteam = 1 OR is_connexion_crew = 1 OR
                       is_supporting_crew = 1 OR is_cforce = 1 OR
                       is_cg_leader = 1 OR is_community_pic = 1), 0), 1) AS percentage
FROM pelayan
-- ... repeat for all ministries
```

---

#### Event Participation Trends

```sql
WITH monthly_events AS (
    SELECT
        DATE_FORMAT(eh.event_date, '%Y-%m') AS year_month,
        eh.category,
        eh.event_name,
        eh.event_date,
        COUNT(DISTINCT ep.no_jemaat) AS attendance
    FROM event_history eh
    LEFT JOIN event_participation ep ON eh.event_id = ep.event_id
    WHERE eh.event_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY DATE_FORMAT(eh.event_date, '%Y-%m'), eh.category, eh.event_name, eh.event_date
)
SELECT
    year_month,
    category,
    AVG(attendance) AS avg_attendance,
    SUM(attendance) AS total_attendance,
    COUNT(*) AS event_count
FROM monthly_events
GROUP BY year_month, category
ORDER BY year_month, category;
```

---

## Dashboard Design Principles

1. **Clarity Over Complexity:** Prioritize clear, interpretable visualizations
2. **Actionable Insights:** Every metric should suggest a potential action or decision
3. **Consistent Timeframes:** Use consistent date ranges across related widgets (default: last 12 months)
4. **Mobile Responsiveness:** Ensure dashboard works on tablets for church leaders on-the-go
5. **Accessibility:** Follow WCAG guidelines for color contrast and screen reader compatibility
6. **Real-time Feel:** Update key metrics regularly (every 15-30 minutes) without requiring full refresh
7. **Drill-down Path:** Allow users to click from summary metrics to detailed lists for follow-up

---

## Maintenance & Evolution

### Quarterly Review Process

1. **Usage Analytics:** Track which dashboard elements are most/least viewed
2. **Feedback Collection:** Survey church leaders on usefulness and missing insights
3. **Data Quality Checks:** Verify accuracy of source data and calculations
4. **New Metrics Identification:** Add metrics based on emerging ministry priorities
5. **Visualization Updates:** Improve or replace visualizations based on effectiveness

### Success Metrics

1. **Adoption Rate:** Percentage of church leaders accessing dashboard weekly
2. **Decision Impact:** Number of ministry decisions informed by dashboard insights
3. **Engagement Correlation:** Improvement in key engagement metrics over time
4. **User Satisfaction:** Quarterly feedback scores from dashboard users

---

*This documentation should be reviewed and updated quarterly to reflect changes in ministry structure, data availability, and leadership priorities.*