-- Rollback: 009_alter_status_history_changed_at_default.rollback.sql
-- Description: Revert default changed_at to original

ALTER TABLE cnx_jemaat_status_history 
ALTER COLUMN changed_at SET DEFAULT NOW();