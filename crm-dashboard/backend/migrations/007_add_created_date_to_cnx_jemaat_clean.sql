-- Migration: 007_add_created_date_to_cnx_jemaat_clean
-- Description: Add created_date column to cnx_jemaat_clean with NOW() as default for existing and new data
-- Date: 2026-04-24

-- Add created_date column with default NOW()
-- The DEFAULT NOW() will automatically set existing rows to current timestamp
ALTER TABLE cnx_jemaat_clean
ADD COLUMN IF NOT EXISTS created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger function to ensure created_date is always set on INSERT
CREATE OR REPLACE FUNCTION set_created_date_if_null()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.created_date IS NULL THEN
        NEW.created_date := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (will be skipped if already exists due to IF NOT EXISTS behavior in PostgreSQL)
DROP TRIGGER IF EXISTS trg_cnx_jemaat_clean_created_date ON cnx_jemaat_clean;
CREATE TRIGGER trg_cnx_jemaat_clean_created_date
    BEFORE INSERT ON cnx_jemaat_clean
    FOR EACH ROW
    EXECUTE FUNCTION set_created_date_if_null();