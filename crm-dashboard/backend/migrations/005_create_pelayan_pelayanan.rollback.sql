-- Rollback: 005_create_pelayan_pelayanan.rollback.sql
-- Description: Rollback pelayan_pelayanan junction table

DROP TRIGGER IF EXISTS trigger_update_total_pelayanan ON pelayan_pelayanan;
DROP TRIGGER IF EXISTS trigger_pelayan_pelayanan_update_timestamp ON pelayan_pelayanan;
DROP FUNCTION IF EXISTS update_pelayan_total_pelayanan();
DROP FUNCTION IF EXISTS update_pelayan_pelayanan_updated_at();
DROP TABLE IF EXISTS pelayan_pelayanan CASCADE;
