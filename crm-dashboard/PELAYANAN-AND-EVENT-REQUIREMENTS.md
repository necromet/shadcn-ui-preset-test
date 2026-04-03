# Church Management System Dashboard

**Last Updated:** 2026-04-03T09:21:43+07:00  
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
WHERE p.is_wl = 1 OR p.is_singer = 1 OR p.is_pianis = 1
      OR p.is_saxophone = 1 OR p.is_filler = 1 OR p.is_bass_gitar = 1
      OR p.is_drum = 1 OR p.is_mulmed = 1 OR p.is_sound = 1
      OR p.is_caringteam = 1 OR p.is_connexion_crew = 1
      OR p.is_supporting_crew = 1 OR p.is_cforce = 1
      OR p.is_cg_leader = 1 OR p.is_community_pic = 1
```

---

### 2. Ministry/Service Participation

#### Service Team Breakdown

- **Data Source:** `pelayan` table (individual boolean service flags)
- **Visualization:** Horizontal bar chart
- **Metrics Displayed:**
  - Worship Leaders (`is_wl`)
  - Singers (`is_singer`)
  - Pianists/Keyboardists (`is_pianis`)
  - Saxophone Players (`is_saxophone`)
  - Filler Musicians (`is_filler`)
  - Bass Guitarists (`is_bass_gitar`)
  - Drummers (`is_drum`)
  - Multimedia/Tech Team (`is_mulmed`)
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
      WHEN (is_wl + is_singer + is_pianis + is_saxophone + is_filler +
            is_bass_gitar + is_drum + is_mulmed + is_sound +
            is_caringteam + is_connexion_crew + is_supporting_crew +
            is_cforce + is_cg_leader + is_community_pic) = 0 THEN 0
      WHEN (is_wl + is_singer + is_pianis + is_saxophone + is_filler +
            is_bass_gitar + is_drum + is_mulmed + is_sound +
            is_caringteam + is_connexion_crew + is_supporting_crew +
            is_cforce + is_cg_leader + is_community_pic) = 1 THEN 1
      WHEN (is_wl + is_singer + is_pianis + is_saxophone + is_filler +
            is_bass_gitar + is_drum + is_mulmed + is_sound +
            is_caringteam + is_connexion_crew + is_supporting_crew +
            is_cforce + is_cg_leader + is_community_pic) = 2 THEN 2
      WHEN (is_wl + is_singer + is_pianis + is_saxophone + is_filler +
            is_bass_gitar + is_drum + is_mulmed + is_sound +
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

#### Upcoming Events

- **Data Source:** `event_history` table + `event_participation` table
- **Visualization:** Calendar view or list view
- **Metrics Displayed:**
  - Next 3 upcoming events by date
  - Event name, date, and category
  - Registration status (from `event_participation`):
    - Registered participants count
    - Registered volunteers/pantria count
    - Capacity percentage (if applicable)
- **Additional Features:**
  - Color-coding by event category (Camp, Retreat, Quarterly, Monthly)
  - Click to view event details
  - "Register" button for volunteers/pantria (if applicable)

#### Event Attendance Trends

- **Data Source:** `event_history` table + `event_participation` table
- **Visualization:** Line chart with optional overlay
- **Metrics Displayed:**
  - Monthly/Quarterly event attendance over time (last 12 months)
  - Separate lines for different event categories
  - Optional: Stacked area showing participation roles (Peserta, Panitia, Volunteer)
- **Calculation Logic:**
```sql
SELECT
  DATE_FORMAT(eh.event_date, '%Y-%m') AS month,
  eh.category,
  COUNT(DISTINCT ep.no_jemaat) AS total_attendees,
  SUM(CASE WHEN ep.role = 'Peserta' THEN 1 ELSE 0 END) AS peserta_count,
  SUM(CASE WHEN ep.role IN ('Panitia', 'Volunteer') THEN 1 ELSE 0 END) AS volunteer_panitia_count
FROM event_history eh
LEFT JOIN event_participation ep ON eh.event_id = ep.event_id
WHERE eh.event_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(eh.event_date, '%Y-%m'), eh.category
ORDER BY month, eh.category
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
  AVG(attendance_count) AS avg_attendance,
  SUM(attendance_count) AS total_attendance
FROM event_history eh
JOIN (
    SELECT event_id, COUNT(DISTINCT no_jemaat) AS attendance_count
    FROM event_participation
    GROUP BY event_id
) ep ON eh.event_id = ep.event_id
WHERE eh.event_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY eh.category
ORDER BY avg_attendance DESC
```

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
    CASE WHEN p.is_wl = 1 THEN 'Worship Leader' END,
    CASE WHEN p.is_singer = 1 THEN 'Singer' END,
    -- ... other ministries
    SEPARATOR ', '
  ) AS ministries
FROM pelayan p
JOIN cnx_jemaat_status_history csh ON p.no_jemaat = csh.no_jemaat
WHERE (p.is_wl = 1 OR p.is_singer = 1 OR /* ... all service flags */)
  AND csh.status = 'Active'
  AND csh.changed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND NOT EXISTS (
    SELECT 1 FROM pelayan p2
    WHERE p2.no_jemaat = p.no_jemaat
      AND (p2.is_wl = 1 OR p2.is_singer = 1 OR /* ... all service flags */)
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

### Phase 2: Engagement Depth (Weeks 3-4)

1. **Service Frequency Distribution** - Histogram of `total_pelayanan`
2. **Upcoming Events Calendar** - Next 3 events with registration stats
3. **Worship Team Composition** - Donut chart (Vocalists vs. Instrumentalists)

### Phase 3: Analytics & Insights (Weeks 5-6)

1. **Event Attendance Trends** - Line chart over time
2. **Member Engagement Score** - Composite metric gauge
3. **Multi-Skill Members Analysis** - Radar chart or histogram

### Phase 4: Advanced Features (Ongoing)

1. Drill-down capabilities from all visualizations to member lists
2. Export functionality (PDF, CSV) for reports
3. Alert system for significant changes (e.g., multiple status changes)
4. Goal tracking against historical baselines or targets
5. Predictive analytics for future staffing needs

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
    SUM(CASE WHEN is_wl = 1 THEN 1 ELSE 0 END) AS count,
    ROUND(SUM(CASE WHEN is_wl = 1 THEN 1 ELSE 0 END) * 100.0 /
          NULLIF(SUM(CASE WHEN is_wl = 1 OR is_singer = 1 OR is_pianis = 1 OR
                       is_saxophone = 1 OR is_filler = 1 OR is_bass_gitar = 1 OR
                       is_drum = 1 OR is_mulmed = 1 OR is_sound = 1 OR
                       is_caringteam = 1 OR is_connexion_crew = 1 OR
                       is_supporting_crew = 1 OR is_cforce = 1 OR
                       is_cg_leader = 1 OR is_community_pic = 1), 0), 1) AS percentage
FROM pelayan
UNION ALL
SELECT
    'Singer' AS ministry,
    SUM(CASE WHEN is_singer = 1 THEN 1 ELSE 0 END) AS count,
    ROUND(SUM(CASE WHEN is_singer = 1 THEN 1 ELSE 0 END) * 100.0 /
          NULLIF(SUM(CASE WHEN is_wl = 1 OR is_singer = 1 OR is_pianis = 1 OR
                       is_saxophone = 1 OR is_filler = 1 OR is_bass_gitar = 1 OR
                       is_drum = 1 OR is_mulmed = 1 OR is_sound = 1 OR
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