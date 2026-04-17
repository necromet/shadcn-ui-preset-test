# Refactoring Plan: Dynamic Pelayan-Pelayanan Relationship

## Overview

Replace hardcoded boolean columns in `pelayan` table with a dynamic many-to-many relationship using a junction table, based on `pelayanan_info`.

---

## 1. Database Changes

### 1.1 Create Junction Table

```sql
CREATE TABLE pelayan_pelayanan (
    id INT IDENTITY(1,1) PRIMARY KEY,
    no_jemaat VARCHAR(50) NOT NULL,
    pelayanan_id INT NOT NULL,
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (no_jemaat) REFERENCES pelayan(no_jemaat),
    FOREIGN KEY (pelayanan_id) REFERENCES pelayanan_info(pelayanan_id),
    UNIQUE (no_jemaat, pelayanan_id)
);
```

### 1.2 Drop Old Boolean Columns

```sql
ALTER TABLE pelayan DROP COLUMN is_wl;
ALTER TABLE pelayan DROP COLUMN is_majelis;
ALTER TABLE pelayan DROP COLUMN is_komite;
-- ... other boolean columns
```

### 1.3 Data Migration

```sql
-- Migrate is_wl = TRUE
INSERT INTO pelayan_pelayanan (no_jemaat, pelayanan_id, is_active)
SELECT p.no_jemaat, pi.pelayanan_id, 1
FROM pelayan p
CROSS JOIN pelayanan_info pi
WHERE pi.nama_pelayanan = 'WL' AND p.is_wl = 1;

-- Migrate is_majelis = TRUE
INSERT INTO pelayan_pelayanan (no_jemaat, pelayanan_id, is_active)
SELECT p.no_jemaat, pi.pelayanan_id, 1
FROM pelayan p
CROSS JOIN pelayanan_info pi
WHERE pi.nama_pelayanan = 'Majelis' AND p.is_majelis = 1;

-- ... repeat for each boolean column
```

---

## 2. Query Changes

### 2.1 Get All Active Pelayan for a specific pelayanan

**Before:**
```sql
SELECT * FROM pelayan WHERE is_wl = 1;
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

### 2.3 Assign Pelayan to Pelayana

**Before:**
```sql
UPDATE pelayan SET is_wl = 1 WHERE no_jemaat = 'J001';
```

**After:**
```sql
INSERT INTO pelayan_pelayanan (no_jemaat, pelayanan_id, is_active)
VALUES ('J001', (SELECT pelayanan_id FROM pelayanan_info WHERE nama_pelayanan = 'WL'), 1);
```

### 2.4 Remove Pelayan from Pelayana

**Before:**
```sql
UPDATE pelayan SET is_wl = 0 WHERE no_jemaat = 'J001';
```

**After:**
```sql
UPDATE pelayan_pelayanan SET is_active = 0
WHERE no_jemaat = 'J001' AND pelayanan_id = (SELECT pelayanan_id FROM pelayanan_info WHERE nama_pelayanan = 'WL');
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

### 3.2 Service Layer

- Add methods to manage pelayan-pelayanan assignments
- Update existing methods to query through junction table
- Handle both active and inactive assignments

### 3.3 API Endpoints

| Endpoint | Change |
|----------|--------|
| `GET /pelayan/{noJemaat}/pelayanan` | Return list of pelayanan for pelayan |
| `POST /pelayan/{noJemaat}/pelayanan` | Assign new pelayanan |
| `DELETE /pelayan/{noJemaat}/pelayanan/{pelayananId}` | Soft delete (set is_active = 0) |
| `GET /pelayanan/{pelayananId}/pelayan` | Return list of pelayan for pelayanan |

---

## 4. Migration Checklist

- [ ] Create `pelayan_pelayanan` table
- [ ] Write and execute data migration script
- [ ] Drop old boolean columns from `pelayan` table
- [ ] Update Repository/DAO layer
- [ ] Update Service layer
- [ ] Update API endpoints and DTOs
- [ ] Update unit tests
- [ ] Test all CRUD operations

---

## 5. Rollback Plan (If Needed)

```sql
-- Restore boolean columns
ALTER TABLE pelayan ADD is_wl BIT;
ALTER TABLE pelayan ADD is_majelis BIT;
-- ... add back columns

-- Restore data from junction table
UPDATE pelayan SET is_wl = 1 WHERE no_jemaat IN (
    SELECT no_jemaat FROM pelayan_pelayanan pp
    JOIN pelayanan_info pi ON pp.pelayanan_id = pi.pelayanan_id
    WHERE pi.nama_pelayanan = 'WL' AND pp.is_active = 1
);

-- Drop junction table
DROP TABLE pelayan_pelayanan;
```
