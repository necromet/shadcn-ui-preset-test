# Refactoring Plan: Dynamic Pelayan-Pelayanan Relationship

## Overview

Replace hardcoded boolean columns in `pelayan` table with a dynamic many-to-many relationship using a junction table, based on `pelayanan_info`.

---

## 1. Database Changes

### 1.1 Create Junction Table

```sql
CREATE TABLE public.pelayan_pelayanan (
    id SERIAL PRIMARY KEY,
    no_jemaat INTEGER NOT NULL,
    pelayanan_id INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    FOREIGN KEY (no_jemaat) REFERENCES pelayan(no_jemaat) ON DELETE CASCADE,
    FOREIGN KEY (pelayanan_id) REFERENCES pelayanan_info(pelayanan_id) ON DELETE CASCADE,
    UNIQUE (no_jemaat, pelayanan_id)
);

-- Performance Indexes
CREATE INDEX IX_pelayan_pelayanan_no_jemaat ON pelayan_pelayanan(no_jemaat);
CREATE INDEX IX_pelayan_pelayanan_pelayanan_id ON pelayan_pelayanan(pelayanan_id);
CREATE INDEX IX_pelayan_pelayanan_active ON pelayan_pelayanan(is_active);

-- Auto update updated_at timestamp
CREATE TRIGGER trigger_pelayan_pelayanan_update_timestamp
BEFORE UPDATE ON pelayan_pelayanan
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 1.2 Drop Old Boolean Columns

> ⚠️ **CRITICAL WARNING**: Do NOT drop these columns immediately. Only execute this step **AFTER** all application changes are deployed, fully tested and running stable for multiple deploy cycles. Keep rollback possibility open at all times.

```sql
-- ONLY RUN THIS WHEN FULLY CONFIRMED STABLE
ALTER TABLE pelayan DROP COLUMN is_worship_leader;
ALTER TABLE pelayan DROP COLUMN is_singer;
ALTER TABLE pelayan DROP COLUMN is_pianist;
ALTER TABLE pelayan DROP COLUMN is_saxophone;
ALTER TABLE pelayan DROP COLUMN is_filler;
ALTER TABLE pelayan DROP COLUMN is_bass_guitarist;
ALTER TABLE pelayan DROP COLUMN is_drummer;
ALTER TABLE pelayan DROP COLUMN is_multimedia;
ALTER TABLE pelayan DROP COLUMN is_sound;
ALTER TABLE pelayan DROP COLUMN is_caringteam;
ALTER TABLE pelayan DROP COLUMN is_connexion_crew;
ALTER TABLE pelayan DROP COLUMN is_supporting_crew;
ALTER TABLE pelayan DROP COLUMN is_cforce;
ALTER TABLE pelayan DROP COLUMN is_cg_leader;
ALTER TABLE pelayan DROP COLUMN is_community_pic;
-- Note: is_others was not mapped in pelayanan_info. This will be migrated manually as required
ALTER TABLE pelayan DROP COLUMN is_others;

-- total_pelayanan column will still be kept and maintained by trigger
CREATE OR REPLACE FUNCTION update_pelayan_total_pelayanan()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE pelayan 
    SET total_pelayanan = (
        SELECT COUNT(*) FROM pelayan_pelayanan 
        WHERE no_jemaat = NEW.no_jemaat AND is_active = TRUE
    )
    WHERE no_jemaat = NEW.no_jemaat;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_total_pelayanan
AFTER INSERT OR UPDATE OR DELETE ON pelayan_pelayanan
FOR EACH ROW EXECUTE FUNCTION update_pelayan_total_pelayanan();
```

### 1.3 Data Migration

```sql
BEGIN TRANSACTION;

-- Migrate all existing boolean columns - using ACTUAL pelayanan_id from pelayanan_info table
INSERT INTO pelayan_pelayanan (no_jemaat, pelayanan_id, is_active)
SELECT no_jemaat, pelayanan_id, TRUE
FROM (
    SELECT no_jemaat, 70001 as pelayanan_id FROM pelayan WHERE is_worship_leader = 1 UNION ALL
    SELECT no_jemaat, 70002 FROM pelayan WHERE is_singer = 1 UNION ALL
    SELECT no_jemaat, 70003 FROM pelayan WHERE is_pianist = 1 UNION ALL
    SELECT no_jemaat, 70004 FROM pelayan WHERE is_saxophone = 1 UNION ALL
    SELECT no_jemaat, 70005 FROM pelayan WHERE is_filler = 1 UNION ALL
    SELECT no_jemaat, 70006 FROM pelayan WHERE is_bass_guitarist = 1 UNION ALL
    SELECT no_jemaat, 70007 FROM pelayan WHERE is_drummer = 1 UNION ALL
    SELECT no_jemaat, 70008 FROM pelayan WHERE is_multimedia = 1 UNION ALL
    SELECT no_jemaat, 70009 FROM pelayan WHERE is_sound = 1 UNION ALL
    SELECT no_jemaat, 70010 FROM pelayan WHERE is_caringteam = 1 UNION ALL
    SELECT no_jemaat, 70011 FROM pelayan WHERE is_connexion_crew = 1 UNION ALL
    SELECT no_jemaat, 70012 FROM pelayan WHERE is_supporting_crew = 1 UNION ALL
    SELECT no_jemaat, 70013 FROM pelayan WHERE is_cforce = 1 UNION ALL
    SELECT no_jemaat, 70014 FROM pelayan WHERE is_cg_leader = 1 UNION ALL
    SELECT no_jemaat, 70015 FROM pelayan WHERE is_community_pic = 1
) t
WHERE NOT EXISTS (
    SELECT 1 FROM pelayan_pelayanan pp
    WHERE pp.no_jemaat = t.no_jemaat AND pp.pelayanan_id = t.pelayanan_id
);

COMMIT TRANSACTION;
```

---

## 2. Query Changes

### 2.1 Get All Active Pelayan for a specific pelayanan

**Before:**
```sql
SELECT * FROM pelayan WHERE is_worship_leader = 1;
```

**After:**
```sql
SELECT p.* FROM pelayan p
JOIN pelayan_pelayanan pp ON p.no_jemaat = pp.no_jemaat
JOIN pelayanan_info pi ON pp.pelayanan_id = pi.pelayanan_id
WHERE pi.nama_pelayanan = 'WL' AND pp.is_active = 1;
```

### 2.2 Get All Pelayanan for a specific pelayan

**Before:**
```sql
SELECT * FROM pelayan WHERE no_jemaat = 'J001';
```

**After:**
```sql
SELECT pi.*, pp.is_active FROM pelayanan_info pi
LEFT JOIN pelayan_pelayanan pp ON pi.pelayanan_id = pp.pelayanan_id
    AND pp.no_jemaat = 'J001';
```

### 2.3 Assign Pelayan to Pelayanan

**Before:**
```sql
UPDATE pelayan SET is_worship_leader = 1 WHERE no_jemaat = 'J001';
```

**After:**
```sql
INSERT INTO pelayan_pelayanan (no_jemaat, pelayanan_id, is_active, updated_by)
VALUES ('J001', 70001, TRUE, CURRENT_USER_ID)
ON CONFLICT (no_jemaat, pelayanan_id) DO UPDATE 
SET is_active = TRUE, updated_at = NOW(), updated_by = CURRENT_USER_ID;
```

### 2.4 Remove Pelayan from Pelayanan

**Before:**
```sql
UPDATE pelayan SET is_worship_leader = 0 WHERE no_jemaat = 'J001';
```

**After:**
```sql
UPDATE pelayan_pelayanan SET is_active = FALSE
WHERE no_jemaat = 'J001' AND pelayanan_id = 70001;
```

---

## 3. Service/API Changes

### 3.1 Repository Layer

| Method | Changes |
|--------|---------|
| `findByNoJemaat(noJemaat)` | Include pelayan_pelayanan join |
| `findByPelayanan(pelayananName)` | New method: join through junction table |
| `assignPelayanan(noJemaat, pelayananId)` | Insert into pelayan_pelayanan |
| `removePelayanan(noJemaat, pelayananId)` | Update is_active = 0 |
| `getAllPelayananForPelayan(noJemaat)` | Return list of active pelayanan |
| `getAllPelayanForPelayanan(pelayananName)` | Return list of active pelayan |
| `bulkAssignPelayanan()` | Bulk assignment operations |
| `bulkRemovePelayanan()` | Bulk removal operations |
| `isPelayananAssigned()` | Check assignment existence |
| `getPelayananCounts()` | Dashboard statistics |

### 3.2 Service Layer

- Add methods to manage pelayan-pelayanan assignments
- Update existing methods to query through junction table
- Handle both active and inactive assignments
- Add validation that pelayanan_id exists in pelayanan_info
- Implement audit logging for all assignment changes
- Add permission checks for modification operations
- Handle cache invalidation after assignment changes

### 3.3 API Endpoints

| Endpoint | Change |
|----------|--------|
| `GET /pelayan/{noJemaat}/pelayanan` | Return list of pelayanan for pelayan |
| `POST /pelayan/{noJemaat}/pelayanan` | Assign new pelayanan |
| `DELETE /pelayan/{noJemaat}/pelayanan/{pelayananId}` | Soft delete (set is_active = 0) |
| `GET /pelayanan/{pelayananId}/pelayan` | Return list of pelayan for pelayanan |
| `PATCH /pelayan/{noJemaat}/pelayanan` | Bulk update multiple assignments |
| `GET /pelayanan/stats` | Get count statistics per pelayanan |

---

## 4. Migration Checklist

- [ ] Create `pelayan_pelayanan` table with indexes
- [ ] Write data migration script with transactions and duplicate checks
- [ ] Run migration in dry-run mode first
- [ ] Execute data migration
- [ ] Verify migrated data counts match original values
- [ ] Deploy all application code changes
- [ ] Verify system stability for 1-2 deploy cycles
- [ ] **ONLY AFTER FULL VERIFICATION:** Drop old boolean columns from `pelayan` table
- [ ] Update Repository/DAO layer
- [ ] Update Service layer (validation, audit, permissions)
- [ ] Update API endpoints and DTOs
- [ ] Update unit tests
- [ ] Update existing reports / exports
- [ ] Test all CRUD operations
- [ ] Test bulk operations
- [ ] Add trigger to automatically maintain total_pelayanan counter on pelayan table
- [ ] Test rollback procedure

---

## 5. Rollback Plan (If Needed)

```sql
-- Restore boolean columns (use original column types: int2 from pelayan table)
ALTER TABLE pelayan ADD is_worship_leader int2 DEFAULT 0;
ALTER TABLE pelayan ADD is_singer int2 DEFAULT 0;
ALTER TABLE pelayan ADD is_pianist int2 DEFAULT 0;
ALTER TABLE pelayan ADD is_saxophone int2 DEFAULT 0;
ALTER TABLE pelayan ADD is_filler int2 DEFAULT 0;
ALTER TABLE pelayan ADD is_bass_guitarist int2 DEFAULT 0;
ALTER TABLE pelayan ADD is_drummer int2 DEFAULT 0;
ALTER TABLE pelayan ADD is_multimedia int2 DEFAULT 0;
ALTER TABLE pelayan ADD is_sound int2 DEFAULT 0;
ALTER TABLE pelayan ADD is_caringteam int2 DEFAULT 0;
ALTER TABLE pelayan ADD is_connexion_crew int2 DEFAULT 0;
ALTER TABLE pelayan ADD is_supporting_crew int2 DEFAULT 0;
ALTER TABLE pelayan ADD is_cforce int2 DEFAULT 0;
ALTER TABLE pelayan ADD is_cg_leader int2 DEFAULT 0;
ALTER TABLE pelayan ADD is_community_pic int2 DEFAULT 0;
ALTER TABLE pelayan ADD is_others int2 DEFAULT 0;

-- Restore data from junction table
UPDATE pelayan p SET 
    is_worship_leader = EXISTS(SELECT 1 FROM pelayan_pelayanan pp WHERE pp.no_jemaat = p.no_jemaat AND pp.pelayanan_id = 70001 AND pp.is_active = TRUE),
    is_singer = EXISTS(SELECT 1 FROM pelayan_pelayanan pp WHERE pp.no_jemaat = p.no_jemaat AND pp.pelayanan_id = 70002 AND pp.is_active = TRUE),
    is_pianist = EXISTS(SELECT 1 FROM pelayan_pelayanan pp WHERE pp.no_jemaat = p.no_jemaat AND pp.pelayanan_id = 70003 AND pp.is_active = TRUE),
    is_saxophone = EXISTS(SELECT 1 FROM pelayan_pelayanan pp WHERE pp.no_jemaat = p.no_jemaat AND pp.pelayanan_id = 70004 AND pp.is_active = TRUE),
    is_filler = EXISTS(SELECT 1 FROM pelayan_pelayanan pp WHERE pp.no_jemaat = p.no_jemaat AND pp.pelayanan_id = 70005 AND pp.is_active = TRUE),
    is_bass_guitarist = EXISTS(SELECT 1 FROM pelayan_pelayanan pp WHERE pp.no_jemaat = p.no_jemaat AND pp.pelayanan_id = 70006 AND pp.is_active = TRUE),
    is_drummer = EXISTS(SELECT 1 FROM pelayan_pelayanan pp WHERE pp.no_jemaat = p.no_jemaat AND pp.pelayanan_id = 70007 AND pp.is_active = TRUE),
    is_multimedia = EXISTS(SELECT 1 FROM pelayan_pelayanan pp WHERE pp.no_jemaat = p.no_jemaat AND pp.pelayanan_id = 70008 AND pp.is_active = TRUE),
    is_sound = EXISTS(SELECT 1 FROM pelayan_pelayanan pp WHERE pp.no_jemaat = p.no_jemaat AND pp.pelayanan_id = 70009 AND pp.is_active = TRUE),
    is_caringteam = EXISTS(SELECT 1 FROM pelayan_pelayanan pp WHERE pp.no_jemaat = p.no_jemaat AND pp.pelayanan_id = 70010 AND pp.is_active = TRUE),
    is_connexion_crew = EXISTS(SELECT 1 FROM pelayan_pelayanan pp WHERE pp.no_jemaat = p.no_jemaat AND pp.pelayanan_id = 70011 AND pp.is_active = TRUE),
    is_supporting_crew = EXISTS(SELECT 1 FROM pelayan_pelayanan pp WHERE pp.no_jemaat = p.no_jemaat AND pp.pelayanan_id = 70012 AND pp.is_active = TRUE),
    is_cforce = EXISTS(SELECT 1 FROM pelayan_pelayanan pp WHERE pp.no_jemaat = p.no_jemaat AND pp.pelayanan_id = 70013 AND pp.is_active = TRUE),
    is_cg_leader = EXISTS(SELECT 1 FROM pelayan_pelayanan pp WHERE pp.no_jemaat = p.no_jemaat AND pp.pelayanan_id = 70014 AND pp.is_active = TRUE),
    is_community_pic = EXISTS(SELECT 1 FROM pelayan_pelayanan pp WHERE pp.no_jemaat = p.no_jemaat AND pp.pelayanan_id = 70015 AND pp.is_active = TRUE);

-- Drop junction table
DROP TABLE pelayan_pelayanan CASCADE;
```
