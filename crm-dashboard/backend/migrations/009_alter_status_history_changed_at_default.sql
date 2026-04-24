-- Migration: 009_alter_status_history_changed_at_default.sql
-- Description: Change default changed_at to UTC+7

ALTER TABLE cnx_jemaat_status_history 
ALTER COLUMN changed_at SET DEFAULT (NOW() + INTERVAL '7 hours');