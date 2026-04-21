-- Rollback: 006_add_dynamic_pelayan_columns_trigger.sql
-- Description: Remove the trigger and function that auto-adds columns to pelayan table

DROP TRIGGER IF EXISTS trigger_add_pelayan_column ON pelayanan_info;
DROP FUNCTION IF EXISTS add_pelayan_column();
