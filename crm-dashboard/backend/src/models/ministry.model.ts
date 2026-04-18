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

export interface Pelayan {
  no_jemaat: number;
  nama_jemaat: string;
  is_wl: boolean;
  is_singer: boolean;
  is_pianis: boolean;
  is_saxophone: boolean;
  is_filler: boolean;
  is_bass_gitar: boolean;
  is_drum: boolean;
  is_mulmed: boolean;
  is_sound: boolean;
  is_caringteam: boolean;
  is_connexion_crew: boolean;
  is_supporting_crew: boolean;
  is_cforce: boolean;
  is_cg_leader: boolean;
  is_community_pic: boolean;
  is_others?: boolean;
  total_pelayanan: number;
}

export interface PelayanCreateData {
  no_jemaat: number;
  nama_jemaat: string;
  is_wl?: boolean;
  is_singer?: boolean;
  is_pianis?: boolean;
  is_saxophone?: boolean;
  is_filler?: boolean;
  is_bass_gitar?: boolean;
  is_drum?: boolean;
  is_mulmed?: boolean;
  is_sound?: boolean;
  is_caringteam?: boolean;
  is_connexion_crew?: boolean;
  is_supporting_crew?: boolean;
  is_cforce?: boolean;
  is_cg_leader?: boolean;
  is_community_pic?: boolean;
  is_others?: boolean;
}

export interface PelayanUpdateData {
  nama_jemaat?: string;
  is_wl?: boolean;
  is_singer?: boolean;
  is_pianis?: boolean;
  is_saxophone?: boolean;
  is_filler?: boolean;
  is_bass_gitar?: boolean;
  is_drum?: boolean;
  is_mulmed?: boolean;
  is_sound?: boolean;
  is_caringteam?: boolean;
  is_connexion_crew?: boolean;
  is_supporting_crew?: boolean;
  is_cforce?: boolean;
  is_cg_leader?: boolean;
  is_community_pic?: boolean;
  is_others?: boolean;
}

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

const BOOLEAN_ROLE_COLUMNS = [
  'is_wl', 'is_singer', 'is_pianis', 'is_saxophone', 'is_filler',
  'is_bass_gitar', 'is_drum', 'is_mulmed', 'is_sound', 'is_caringteam',
  'is_connexion_crew', 'is_supporting_crew', 'is_cforce', 'is_cg_leader', 'is_community_pic',
  'is_others'
];

const BOOLEAN_COL_TO_ROLE_NAME: Record<string, string> = {
  is_wl: 'Worship Leader',
  is_singer: 'Singer',
  is_pianis: 'Pianist',
  is_saxophone: 'Saxophone',
  is_filler: 'Filler Musician',
  is_bass_gitar: 'Bass Guitarist',
  is_drum: 'Drummer',
  is_mulmed: 'Multimedia',
  is_sound: 'Sound Engineer',
  is_caringteam: 'Caring Team',
  is_connexion_crew: 'Connexion Crew',
  is_supporting_crew: 'Supporting Crew',
  is_cforce: 'CForce',
  is_cg_leader: 'CG Leader',
  is_community_pic: 'Community PIC',
};

function computeTotalPelayanan(data: PelayanCreateData | PelayanUpdateData): number {
  return BOOLEAN_ROLE_COLUMNS.reduce((count, col) => {
    return count + ((data as Record<string, unknown>)[col] ? 1 : 0);
  }, 0);
}

function toSmallint(value: unknown): number {
  if (value === true || value === 1 || value === '1') return 1;
  if (value === false || value === 0 || value === '0') return 0;
  return 0;
}

function convertBooleanRolesToSmallint(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (BOOLEAN_ROLE_COLUMNS.includes(key)) {
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
    return result.rows[0];
  },

  async updateMinistryType(pelayananId: string, data: MinistryTypeUpdateData): Promise<MinistryType | null> {
    const result = await query<MinistryType>(
      `UPDATE pelayanan_info SET nama_pelayanan = $1 WHERE pelayanan_id = $2 RETURNING *`,
      [data.nama_pelayanan, pelayananId],
    );
    return result.rows[0] || null;
  },

  async deleteMinistryType(pelayananId: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM pelayanan_info WHERE pelayanan_id = $1',
      [pelayananId],
    );
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
    const totalPelayanan = computeTotalPelayanan(data);
    const converted = convertBooleanRolesToSmallint(data as unknown as Record<string, unknown>);
    const columns = [...Object.keys(converted), 'total_pelayanan'];
    const values = [...Object.values(converted), totalPelayanan];
    const placeholders = columns.map((_, i) => `$${i + 1}`);

    const result = await transaction(async (txQuery) => {
      const pelayanResult = await txQuery<Pelayan>(
        `INSERT INTO pelayan (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
        values,
      );

      // Sync boolean roles to junction table
      await this._syncJunctionTable(txQuery, data.no_jemaat, data as unknown as Record<string, unknown>);

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

    const converted = convertBooleanRolesToSmallint(data as unknown as Record<string, unknown>);
    const convertedColumns = Object.keys(converted);
    const convertedValues = Object.values(converted);

    const merged = { ...existing, ...converted };
    const totalPelayanan = computeTotalPelayanan(merged as unknown as PelayanCreateData);

    const setClauses = convertedColumns.map((col, i) => `${col} = $${i + 1}`);
    setClauses.push(`total_pelayanan = $${convertedColumns.length + 1}`);

    // Check if is_cforce is being set to true
    const isCforceChanged = 'is_cforce' in data;
    const isCforceTrue = converted.is_cforce === 1;

    // Use transaction to update both pelayan, cgf_members, and junction table atomically
    const result = await transaction(async (txQuery) => {
      const pelayanResult = await txQuery<Pelayan>(
        `UPDATE pelayan SET ${setClauses.join(', ')} WHERE no_jemaat = $${convertedColumns.length + 2} RETURNING *`,
        [...convertedValues, totalPelayanan, noJemaat],
      );

      // If is_cforce is set to true, update cgf_members.is_leader to true
      if (isCforceChanged && isCforceTrue) {
        await txQuery(
          `UPDATE cgf_members SET is_leader = 1 WHERE no_jemaat = $1`,
          [noJemaat],
        );
      }

      // Sync boolean roles to junction table
      await this._syncJunctionTable(txQuery, noJemaat, merged as unknown as Record<string, unknown>);

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

  // --- Junction Table Helper ---

  async _syncJunctionTable(
    txQuery: typeof query,
    noJemaat: number,
    data: Record<string, unknown>,
  ): Promise<void> {
    for (const [colName, roleName] of Object.entries(BOOLEAN_COL_TO_ROLE_NAME)) {
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

  // --- Junction Table Methods ---

  async assignPelayanan(noJemaat: number, pelayananId: string, updatedBy?: number): Promise<PelayanPelayanan> {
    const result = await query<PelayanPelayanan>(
      `INSERT INTO pelayan_pelayanan (no_jemaat, pelayanan_id, is_active, updated_by)
       VALUES ($1, $2, TRUE, $3)
       ON CONFLICT (no_jemaat, pelayanan_id) DO UPDATE
       SET is_active = TRUE, updated_at = NOW(), updated_by = $3
       RETURNING *`,
      [noJemaat, pelayananId, updatedBy ?? null],
    );
    return result.rows[0];
  },

  async removePelayanan(noJemaat: number, pelayananId: string, updatedBy?: number): Promise<boolean> {
    const result = await query(
      `UPDATE pelayan_pelayanan SET is_active = FALSE, updated_at = NOW(), updated_by = $3
       WHERE no_jemaat = $1 AND pelayanan_id = $2`,
      [noJemaat, pelayananId, updatedBy ?? null],
    );
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
          } else {
            result.skipped++;
          }
        } catch (err) {
          result.errors.push(`Failed to assign pelayanan ${pelayananId}: ${(err as Error).message}`);
        }
      }
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
          } else {
            result.skipped++;
          }
        } catch (err) {
          result.errors.push(`Failed to remove pelayanan ${pelayananId}: ${(err as Error).message}`);
        }
      }
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
