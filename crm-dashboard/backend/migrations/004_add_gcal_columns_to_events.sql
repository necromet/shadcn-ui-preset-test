-- Migration: 004_add_gcal_columns_to_events.sql
-- Description: Add Google Calendar sync columns to event_history

ALTER TABLE event_history
  ADD COLUMN IF NOT EXISTS gcal_event_id   VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS gcal_link       TEXT NULL,
  ADD COLUMN IF NOT EXISTS last_synced_at  TIMESTAMP NULL;

CREATE INDEX IF NOT EXISTS idx_event_history_gcal_event_id ON event_history(gcal_event_id);
