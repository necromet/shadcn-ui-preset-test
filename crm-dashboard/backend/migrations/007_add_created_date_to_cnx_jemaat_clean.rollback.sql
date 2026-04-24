-- Rollback for: 007_add_created_date_to_cnx_jemaat_clean
-- Description: Remove created_date column from cnx_jemaat_clean

DROP TRIGGER IF EXISTS trg_cnx_jemaat_clean_created_date ON cnx_jemaat_clean;
DROP FUNCTION IF EXISTS set_created_date_if_null();

ALTER TABLE cnx_jemaat_clean DROP COLUMN IF EXISTS created_date;