# PRD: Agentic Events Dashboard & Google Calendar Integration

## 1. Project Overview

A high-performance events management dashboard. The system must support local event creation and a two-way synchronization with Google Calendar.

## 2. Technical Stack

- **Framework:** Next.js 14 (App Router), TypeScript, Tailwind CSS.
- **UI Components:** Shadcn/ui (Calendar, Dialog, Form, Toast, Badge).
- **Database:** PostgreSQL (using Prisma or Drizzle ORM).
- **Authentication:** NextAuth.js (required for Google OAuth2 scopes).
- **Calendar Logic:** date-fns for manipulation; react-day-picker for the UI.
- **API:** Google Calendar API v3.

## 3. PostgreSQL Database Schema

```sql
-- Core Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  category VARCHAR(50) DEFAULT 'general',
  
  -- Google Calendar Sync Fields
  gcal_event_id VARCHAR(255), -- ID from Google
  gcal_link TEXT,             -- Link to view in Google Cal
  last_synced_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User/Auth Integration (Simplified for OAuth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  gcal_access_token TEXT,
  gcal_refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE
);
```

## 4. Google Calendar Integration Requirements

### A. OAuth2 Scopes

The agent must configure NextAuth to request the following scopes:

- `https://www.googleapis.com/auth/calendar.events` — Read/Write access to events.
- `https://www.googleapis.com/auth/calendar.readonly` — To view calendar list.

### B. Sync Logic

1. **Outgoing:** When a user creates/updates an event in the dashboard, the agent must call `calendar.events.insert` or `patch`. Save the returned `google_event_id` to our PostgreSQL DB.

2. **Incoming:** Implement a "Sync" button that fetches the last 30 days of events from Google and upserts them into the local PostgreSQL database based on the `gcal_event_id`.

3. **Conflict Resolution:** The local database `updated_at` timestamp should be the source of truth unless the Google event has a later `updated` field.

## 5. Functional Requirements

### UI Views

- **The Grid:** A responsive monthly calendar grid.
- **The Agenda:** A sidebar list showing "What's happening in the next 7 days."
- **The Sync Status:** A visual badge on each event showing if it is "Synced with Google" or "Local Only."

### Interaction Patterns

- **Range Selection:** Dragging across multiple dates should trigger the "Create Event" modal with those dates pre-filled.
- **Smart Filter:** Filter events by "Source" (Google vs. Local) and "Category."
- **Optimistic UI:** When an event is moved (drag-and-drop), update the UI immediately and handle the API/GCal sync in the background.

## 6. API Endpoints for Agent to Build

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Fetch all events (merged local + cached GCal). |
| POST | `/api/events` | Create local event + push to GCal. |
| PATCH | `/api/events/[id]` | Update local event + update GCal. |
| POST | `/api/sync/gcal` | Manual trigger to pull latest data from Google. |