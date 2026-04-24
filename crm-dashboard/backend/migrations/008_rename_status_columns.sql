-- Migration: 008_rename_status_columns.sql
-- Description: Rename status column to status_after and add status_before column

-- Drop existing index on status column
DROP INDEX IF EXISTS idx_status_history_status;

-- Rename status column to status_after
ALTER TABLE cnx_jemaat_status_history RENAME COLUMN status TO status_after;

-- Add status_before column (nullable, as first status change may have no previous status)
ALTER TABLE cnx_jemaat_status_history ADD COLUMN status_before member_status_enum NULL;

-- Create new indexes
CREATE INDEX IF NOT EXISTS idx_status_history_status_after ON cnx_jemaat_status_history(status_after);
CREATE INDEX IF NOT EXISTS idx_status_history_status_before ON cnx_jemaat_status_history(status_before);