-- Migration: 006_add_dynamic_pelayan_columns_trigger.sql
-- Description: Trigger to automatically add int2 column to pelayan table when new pelayanan_info is inserted

CREATE OR REPLACE FUNCTION add_pelayan_column()
RETURNS TRIGGER AS $$
DECLARE
  col_name text;
BEGIN
  col_name := 'is_' || lower(replace(trim(NEW.nama_pelayanan), ' ', '_'));
  
  EXECUTE format(
    'ALTER TABLE pelayan ADD COLUMN IF NOT EXISTS %I int2 DEFAULT 0',
    col_name
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_pelayan_column
AFTER INSERT ON pelayanan_info
FOR EACH ROW EXECUTE FUNCTION add_pelayan_column();

CREATE OR REPLACE FUNCTION drop_pelayan_column()
RETURNS TRIGGER AS $$
DECLARE
  col_name text;
BEGIN
  col_name := 'is_' || lower(replace(trim(OLD.nama_pelayanan), ' ', '_'));
  
  EXECUTE format(
    'ALTER TABLE pelayan DROP COLUMN IF EXISTS %I',
    col_name
  );
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_drop_pelayan_column
AFTER DELETE ON pelayanan_info
FOR EACH ROW EXECUTE FUNCTION drop_pelayan_column();
