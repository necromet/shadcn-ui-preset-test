import { query, transaction } from '../config/database';

export interface MinistryType {
  pelayanan_id: string;
  nama_pelayanan: string;
}

export interface MinistryTypeCreateData {
  pelayanan_id: string;
  nama_pelayanan: string;
}

export interface MinistryTypeUpdateData {
  nama_pelayanan: string;
}

export interface PelayanBase {
  no_jemaat: number;
  nama_jemaat: string;
  total_pelayanan: number;
  [key: string]: number | string;
}

export interface Pelayan extends PelayanBase {}
export interface PelayanCreateData extends PelayanBase {}
export interface PelayanUpdateData extends PelayanBase {}

export interface PelayanPelayanan {
  id: number;
  no_jemaat: number;
  pelayanan_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  updated_by: number | null;
}

export interface PelayananForPelayan {
  pelayanan_id: string;
  nama_pelayanan: string;
  is_active: boolean;
}

export interface PelayanForPelayanan {
  no_jemaat: number;
  nama_jemaat: string;
  is_active: boolean;
}

export interface PelayananCount {
  pelayanan_id: string;
  nama_pelayanan: string;
  active_count: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BulkAssignmentResult {
  assigned: number;
  skipped: number;
  errors: string[];
}

interface RoleMapping {
  columns: string[];
  colToName: Record<string, string>;
  nameToCol: Record<string, string>;
}

let cachedRoleMapping: RoleMapping | null = null;

async function getRoleMappingFromDb(): Promise<RoleMapping> {
  const result = await query<{ pelayanan_id: string; nama_pelayanan: string }>(
    'SELECT pelayanan_id, nama_pelayanan FROM pelayanan_info ORDER BY nama_pelayanan ASC'
  );

  const columns: string[] = [];
  const colToName: Record<string, string> = {};
  const nameToCol: Record<string, string> = {};

  for (const row of result.rows) {
    const colName = `is_${row.nama_pelayanan.toLowerCase().replace(/\s+/g, '_')}`;
    columns.push(colName);
    colToName[colName] = row.nama_pelayanan;
    nameToCol[row.nama_pelayanan] = colName;
  }

  return { columns, colToName, nameToCol };
}

export async function getRoleMapping(): Promise<RoleMapping> {
  if (!cachedRoleMapping) {
    cachedRoleMapping = await getRoleMappingFromDb();
  }
  return cachedRoleMapping;
}

export async function invalidateRoleMappingCache(): Promise<void> {
  cachedRoleMapping = null;
}

function computeTotalPelayanan(data: Record<string, unknown>, columns: string[]): number {
  return columns.reduce((count, col) => {
    return count + (data[col] ? 1 : 0);
  }, 0);
}

function toSmallint(value: unknown): number {
  if (value === true || value === 1 || value === '1') return 1;
  if (value === false || value === 0 || value === '0') return 0;
  return 0;
}

function convertBooleanRolesToSmallint(
  data: Record<string, unknown>,
  booleanColumns: string[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (booleanColumns.includes(key)) {
      result[key] = toSmallint(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export const MinistryModel = {
  async getAllMinistryTypes(page: number = 1, limit: number = 20): Promise<PaginatedResult<MinistryType>> {
    const offset = (page - 1) * limit;

    const countResult = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM pelayanan_info',
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await query<MinistryType>(
      'SELECT * FROM pelayanan_info ORDER BY nama_pelayanan ASC LIMIT $1 OFFSET $2',
      [limit, offset],
    );

    return {
      data: dataResult.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getMinistryTypeById(pelayananId: string): Promise<MinistryType | null> {
    const result = await query<MinistryType>(
      'SELECT * FROM pelayanan_info WHERE pelayanan_id = $1',
      [pelayananId],
    );
    return result.rows[0] || null;
  },

  async createMinistryType(data: MinistryTypeCreateData): Promise<MinistryType> {
    const result = await query<MinistryType>(
      `INSERT INTO pelayanan_info (pelayanan_id, nama_pelayanan)
       VALUES ($1, $2)
       RETURNING *`,
      [data.pelayanan_id, data.nama_pelayanan],
    );

    await invalidateRoleMappingCache();

    return result.rows[0];
  },

  async upsertMinistryType(data: MinistryTypeCreateData): Promise<MinistryType> {
    const result = await query<MinistryType>(
      `INSERT INTO pelayanan_info (pelayanan_id, nama_pelayanan)
       VALUES ($1, $2)
       ON CONFLICT (pelayanan_id) DO UPDATE
       SET nama_pelayanan = EXCLUDED.nama_pelayanan
       RETURNING *`,
      [data.pelayanan_id, data.nama_pelayanan],
    );

    await invalidateRoleMappingCache();

    return result.rows[0];
  },

  async bulkUpsertMinistryTypes(dataArray: MinistryTypeCreateData[]): Promise<BulkAssignmentResult> {
    const result: BulkAssignmentResult = { assigned: 0, skipped: 0, errors: [] };

    await transaction(async (txQuery) => {
      for (const data of dataArray) {
        try {
          const res = await txQuery(
            `INSERT INTO pelayanan_info (pelayanan_id, nama_pelayanan)
             VALUES ($1, $2)
             ON CONFLICT (pelayanan_id) DO UPDATE
             SET nama_pelayanan = EXCLUDED.nama_pelayanan`,
            [data.pelayanan_id, data.nama_pelayanan],
          );
          if ((res.rowCount ?? 0) > 0) {
            result.assigned++;
          } else {
            result.skipped++;
          }
        } catch (err) {
          result.errors.push(`Failed to upsert ministry ${data.pelayanan_id}: ${(err as Error).message}`);
        }
      }
    });

    await invalidateRoleMappingCache();
    return result;
  },

  async bulkDeleteMinistryTypes(pelayananIds: string[]): Promise<BulkAssignmentResult> {
    const result: BulkAssignmentResult = { assigned: 0, skipped: 0, errors: [] };

    await transaction(async (txQuery) => {
      for (const pelayananId of pelayananIds) {
        try {
          const res = await txQuery(
            'DELETE FROM pelayanan_info WHERE pelayanan_id = $1',
            [pelayananId],
          );
          if ((res.rowCount ?? 0) > 0) {
            result.assigned++;
          } else {
            result.skipped++;
          }
        } catch (err) {
          result.errors.push(`Failed to delete ministry ${pelayananId}: ${(err as Error).message}`);
        }
      }
    });

    await invalidateRoleMappingCache();
    return result;
  },

  async updateMinistryType(pelayananId: string, data: MinistryTypeUpdateData): Promise<MinistryType | null> {
    const result = await query<MinistryType>(
      `UPDATE pelayanan_info SET nama_pelayanan = $1 WHERE pelayanan_id = $2 RETURNING *`,
      [data.nama_pelayanan, pelayananId],
    );

    if (result.rowCount && result.rowCount > 0) {
      await invalidateRoleMappingCache();
    }

    return result.rows[0] || null;
  },

  async deleteMinistryType(pelayananId: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM pelayanan_info WHERE pelayanan_id = $1',
      [pelayananId],
    );

    if (result.rowCount && result.rowCount > 0) {
      await invalidateRoleMappingCache();
    }

    return (result.rowCount ?? 0) > 0;
  },

  async getAllPelayan(page: number = 1, limit: number = 20): Promise<PaginatedResult<Pelayan>> {
    const offset = (page - 1) * limit;

    const countResult = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM pelayan',
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await query<Pelayan>(
      'SELECT * FROM pelayan ORDER BY nama_jemaat ASC LIMIT $1 OFFSET $2',
      [limit, offset],
    );

    return {
      data: dataResult.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getPelayanById(noJemaat: number): Promise<Pelayan | null> {
    const result = await query<Pelayan>(
      'SELECT * FROM pelayan WHERE no_jemaat = $1',
      [noJemaat],
    );
    return result.rows[0] || null;
  },

  async createPelayan(data: PelayanCreateData): Promise<Pelayan> {
    const mapping = await getRoleMapping();
    const booleanColumns = mapping.columns;

    const totalPelayanan = computeTotalPelayanan(data as Record<string, unknown>, booleanColumns);
    const converted = convertBooleanRolesToSmallint(data as Record<string, unknown>, booleanColumns);
    const columns = [...Object.keys(converted), 'total_pelayanan'];
    const values = [...Object.values(converted), totalPelayanan];
    const placeholders = columns.map((_, i) => `$${i + 1}`);

    const result = await transaction(async (txQuery) => {
      const pelayanResult = await txQuery<Pelayan>(
        `INSERT INTO pelayan (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
        values,
      );

      await this._syncJunctionTable(txQuery, data.no_jemaat, data as Record<string, unknown>);

      return pelayanResult;
    });

    return result.rows[0];
  },

  async updatePelayan(noJemaat: number, data: PelayanUpdateData): Promise<Pelayan | null> {
    const columns = Object.keys(data);
    if (columns.length === 0) {
      return this.getPelayanById(noJemaat);
    }

    const existing = await this.getPelayanById(noJemaat);
    if (!existing) return null;

    const mapping = await getRoleMapping();
    const booleanColumns = mapping.columns;

    const converted = convertBooleanRolesToSmallint(data as Record<string, unknown>, booleanColumns);
    const convertedColumns = Object.keys(converted);
    const convertedValues = Object.values(converted);

    const merged = { ...existing, ...converted };
    const totalPelayanan = computeTotalPelayanan(merged as Record<string, unknown>, booleanColumns);

    const setClauses = convertedColumns.map((col, i) => `${col} = $${i + 1}`);
    setClauses.push(`total_pelayanan = $${convertedColumns.length + 1}`);

    const isCforceChanged = 'is_cforce' in data;

    const result = await transaction(async (txQuery) => {
      const pelayanResult = await txQuery<Pelayan>(
        `UPDATE pelayan SET ${setClauses.join(', ')} WHERE no_jemaat = $${convertedColumns.length + 2} RETURNING *`,
        [...convertedValues, totalPelayanan, noJemaat],
      );

      if (isCforceChanged) {
        const cforceValue = (converted.is_cforce === 1 || converted.is_cforce === true) ? 1 : 0;
        await txQuery(
          `UPDATE cgf_members SET is_leader = $1 WHERE no_jemaat = $2`,
          [cforceValue, noJemaat],
        );
      }

      await this._syncJunctionTable(txQuery, noJemaat, merged as Record<string, unknown>);

      return pelayanResult;
    });

    return result.rows[0] || null;
  },

  async deletePelayan(noJemaat: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM pelayan WHERE no_jemaat = $1',
      [noJemaat],
    );
    return (result.rowCount ?? 0) > 0;
  },

  async _syncJunctionTable(
    txQuery: typeof query,
    noJemaat: number,
    data: Record<string, unknown>,
  ): Promise<void> {
    const mapping = await getRoleMapping();

    for (const [colName, roleName] of Object.entries(mapping.colToName)) {
      const isActive = !!data[colName];
      if (isActive) {
        await txQuery(
          `INSERT INTO pelayan_pelayanan (no_jemaat, pelayanan_id, is_active)
           SELECT $1, pelayanan_id, TRUE FROM pelayanan_info WHERE nama_pelayanan = $2
           ON CONFLICT (no_jemaat, pelayanan_id) DO UPDATE SET is_active = TRUE, updated_at = NOW()`,
          [noJemaat, roleName],
        );
      } else {
        await txQuery(
          `UPDATE pelayan_pelayanan SET is_active = FALSE, updated_at = NOW()
           WHERE no_jemaat = $1 AND pelayanan_id = (
             SELECT pelayanan_id FROM pelayanan_info WHERE nama_pelayanan = $2
           )`,
          [noJemaat, roleName],
        );
      }
    }
  },

  async assignPelayanan(noJemaat: number, pelayananId: string, updatedBy?: number): Promise<PelayanPelayanan> {
    const result = await transaction(async (txQuery) => {
      const junctionResult = await txQuery<PelayanPelayanan>(
        `INSERT INTO pelayan_pelayanan (no_jemaat, pelayanan_id, is_active, updated_by)
         VALUES ($1, $2, TRUE, $3)
         ON CONFLICT (no_jemaat, pelayanan_id) DO UPDATE
         SET is_active = TRUE, updated_at = NOW(), updated_by = $3
         RETURNING *`,
        [noJemaat, pelayananId, updatedBy ?? null],
      );

      const pelayananInfo = await txQuery<{ nama_pelayanan: string }>(
        'SELECT nama_pelayanan FROM pelayanan_info WHERE pelayanan_id = $1',
        [pelayananId],
      );
      if (pelayananInfo.rows[0]) {
        const colName = `is_${pelayananInfo.rows[0].nama_pelayanan.toLowerCase().replace(/\s+/g, '_')}`;
        await txQuery(
          `UPDATE pelayan SET ${colName} = 1, total_pelayanan = (
            SELECT COUNT(*) FROM pelayan_pelayanan WHERE no_jemaat = $1 AND is_active = TRUE
          ) WHERE no_jemaat = $1`,
          [noJemaat],
        );
      }

      return junctionResult;
    });

    return result.rows[0];
  },

  async removePelayanan(noJemaat: number, pelayananId: string, updatedBy?: number): Promise<boolean> {
    const result = await transaction(async (txQuery) => {
      const junctionResult = await txQuery(
        `UPDATE pelayan_pelayanan SET is_active = FALSE, updated_at = NOW(), updated_by = $3
         WHERE no_jemaat = $1 AND pelayanan_id = $2`,
        [noJemaat, pelayananId, updatedBy ?? null],
      );

      if ((junctionResult.rowCount ?? 0) > 0) {
        const pelayananInfo = await txQuery<{ nama_pelayanan: string }>(
          'SELECT nama_pelayanan FROM pelayanan_info WHERE pelayanan_id = $1',
          [pelayananId],
        );
        if (pelayananInfo.rows[0]) {
          const colName = `is_${pelayananInfo.rows[0].nama_pelayanan.toLowerCase().replace(/\s+/g, '_')}`;
          await txQuery(
            `UPDATE pelayan SET ${colName} = 0, total_pelayanan = (
              SELECT COUNT(*) FROM pelayan_pelayanan WHERE no_jemaat = $1 AND is_active = TRUE
            ) WHERE no_jemaat = $1`,
            [noJemaat],
          );
        }
      }

      return junctionResult;
    });

    return (result.rowCount ?? 0) > 0;
  },

  async getAllPelayananForPelayan(noJemaat: number): Promise<PelayananForPelayan[]> {
    const result = await query<PelayananForPelayan>(
      `SELECT pi.pelayanan_id, pi.nama_pelayanan,
              COALESCE(pp.is_active, FALSE) as is_active
       FROM pelayanan_info pi
       LEFT JOIN pelayan_pelayanan pp ON pi.pelayanan_id = pp.pelayanan_id
           AND pp.no_jemaat = $1
       ORDER BY pi.nama_pelayanan ASC`,
      [noJemaat],
    );
    return result.rows;
  },

  async getAllPelayanForPelayanan(pelayananId: string, page: number = 1, limit: number = 20): Promise<PaginatedResult<PelayanForPelayanan>> {
    const offset = (page - 1) * limit;

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM pelayan p
       JOIN pelayan_pelayanan pp ON p.no_jemaat = pp.no_jemaat
       WHERE pp.pelayanan_id = $1 AND pp.is_active = TRUE`,
      [pelayananId],
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await query<PelayanForPelayanan>(
      `SELECT p.no_jemaat, p.nama_jemaat, pp.is_active
       FROM pelayan p
       JOIN pelayan_pelayanan pp ON p.no_jemaat = pp.no_jemaat
       WHERE pp.pelayanan_id = $1 AND pp.is_active = TRUE
       ORDER BY p.nama_jemaat ASC
       LIMIT $2 OFFSET $3`,
      [pelayananId, limit, offset],
    );

    return {
      data: dataResult.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async bulkAssignPelayanan(
    noJemaat: number,
    pelayananIds: string[],
    updatedBy?: number,
  ): Promise<BulkAssignmentResult> {
    const result: BulkAssignmentResult = { assigned: 0, skipped: 0, errors: [] };

    await transaction(async (txQuery) => {
      for (const pelayananId of pelayananIds) {
        try {
          const res = await txQuery(
            `INSERT INTO pelayan_pelayanan (no_jemaat, pelayanan_id, is_active, updated_by)
             VALUES ($1, $2, TRUE, $3)
             ON CONFLICT (no_jemaat, pelayanan_id) DO UPDATE
             SET is_active = TRUE, updated_at = NOW(), updated_by = $3`,
            [noJemaat, pelayananId, updatedBy ?? null],
          );
          if ((res.rowCount ?? 0) > 0) {
            result.assigned++;

            const pelayananInfo = await txQuery<{ nama_pelayanan: string }>(
              'SELECT nama_pelayanan FROM pelayanan_info WHERE pelayanan_id = $1',
              [pelayananId],
            );
            if (pelayananInfo.rows[0]) {
              const colName = `is_${pelayananInfo.rows[0].nama_pelayanan.toLowerCase().replace(/\s+/g, '_')}`;
              await txQuery(
                `UPDATE pelayan SET ${colName} = 1 WHERE no_jemaat = $1`,
                [noJemaat],
              );

              // Sync is_cforce to cgf_members.is_leader
              if (colName === 'is_cforce') {
                await txQuery(
                  `UPDATE cgf_members SET is_leader = 1 WHERE no_jemaat = $1`,
                  [noJemaat],
                );
              }
            }
          } else {
            result.skipped++;
          }
        } catch (err) {
          result.errors.push(`Failed to assign pelayanan ${pelayananId}: ${(err as Error).message}`);
        }
      }

      await txQuery(
        `UPDATE pelayan SET total_pelayanan = (
          SELECT COUNT(*) FROM pelayan_pelayanan WHERE no_jemaat = $1 AND is_active = TRUE
        ) WHERE no_jemaat = $1`,
        [noJemaat],
      );
    });

    return result;
  },

  async bulkRemovePelayanan(
    noJemaat: number,
    pelayananIds: string[],
    updatedBy?: number,
  ): Promise<BulkAssignmentResult> {
    const result: BulkAssignmentResult = { assigned: 0, skipped: 0, errors: [] };

    await transaction(async (txQuery) => {
      for (const pelayananId of pelayananIds) {
        try {
          const res = await txQuery(
            `UPDATE pelayan_pelayanan SET is_active = FALSE, updated_at = NOW(), updated_by = $3
             WHERE no_jemaat = $1 AND pelayanan_id = $2 AND is_active = TRUE`,
            [noJemaat, pelayananId, updatedBy ?? null],
          );
          if ((res.rowCount ?? 0) > 0) {
            result.assigned++;

            const pelayananInfo = await txQuery<{ nama_pelayanan: string }>(
              'SELECT nama_pelayanan FROM pelayanan_info WHERE pelayanan_id = $1',
              [pelayananId],
            );
            if (pelayananInfo.rows[0]) {
              const colName = `is_${pelayananInfo.rows[0].nama_pelayanan.toLowerCase().replace(/\s+/g, '_')}`;
              await txQuery(
                `UPDATE pelayan SET ${colName} = 0 WHERE no_jemaat = $1`,
                [noJemaat],
              );

              // Sync is_cforce to cgf_members.is_leader
              if (colName === 'is_cforce') {
                await txQuery(
                  `UPDATE cgf_members SET is_leader = 0 WHERE no_jemaat = $1`,
                  [noJemaat],
                );
              }
            }
          } else {
            result.skipped++;
          }
        } catch (err) {
          result.errors.push(`Failed to remove pelayanan ${pelayananId}: ${(err as Error).message}`);
        }
      }

      await txQuery(
        `UPDATE pelayan SET total_pelayanan = (
          SELECT COUNT(*) FROM pelayan_pelayanan WHERE no_jemaat = $1 AND is_active = TRUE
        ) WHERE no_jemaat = $1`,
        [noJemaat],
      );
    });

    return result;
  },

  async isPelayananAssigned(noJemaat: number, pelayananId: string): Promise<boolean> {
    const result = await query(
      `SELECT 1 FROM pelayan_pelayanan
       WHERE no_jemaat = $1 AND pelayanan_id = $2 AND is_active = TRUE`,
      [noJemaat, pelayananId],
    );
    return (result.rowCount ?? 0) > 0;
  },

  async getPelayananCounts(): Promise<PelayananCount[]> {
    const result = await query<PelayananCount>(
      `SELECT pi.pelayanan_id, pi.nama_pelayanan,
              COUNT(pp.id) FILTER (WHERE pp.is_active = TRUE) as active_count
       FROM pelayanan_info pi
       LEFT JOIN pelayan_pelayanan pp ON pi.pelayanan_id = pp.pelayanan_id
       GROUP BY pi.pelayanan_id, pi.nama_pelayanan
       ORDER BY active_count DESC, pi.nama_pelayanan ASC`,
    );
    return result.rows;
  },

  async getPelayananStatsByPelayanan(pelayananId: string): Promise<{ total: number; pelayan: PelayanForPelayanan[] }> {
    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM pelayan_pelayanan
       WHERE pelayanan_id = $1 AND is_active = TRUE`,
      [pelayananId],
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const pelayanResult = await query<PelayanForPelayanan>(
      `SELECT p.no_jemaat, p.nama_jemaat, pp.is_active
       FROM pelayan p
       JOIN pelayan_pelayanan pp ON p.no_jemaat = pp.no_jemaat
       WHERE pp.pelayanan_id = $1 AND pp.is_active = TRUE
       ORDER BY p.nama_jemaat ASC`,
      [pelayananId],
    );

    return { total, pelayan: pelayanResult.rows };
  },
};
