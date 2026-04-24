-- Rollback: 008_rename_status_columns.rollback.sql
-- Description: Revert renaming of status column and removal of status_before

-- Drop indexes for new columns
DROP INDEX IF EXISTS idx_status_history_status_after;
DROP INDEX IF EXISTS idx_status_history_status_before;

-- Drop status_before column
ALTER TABLE cnx_jemaat_status_history DROP COLUMN IF EXISTS status_before;

-- Rename status_after column back to status
ALTER TABLE cnx_jemaat_status_history RENAME COLUMN status_after TO status;

-- Recreate original index on status column
CREATE INDEX IF NOT EXISTS idx_status_history_status ON cnx_jemaat_status_history(status);