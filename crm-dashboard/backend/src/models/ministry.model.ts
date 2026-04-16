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

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const BOOLEAN_ROLE_COLUMNS = [
  'is_wl', 'is_singer', 'is_pianis', 'is_saxophone', 'is_filler',
  'is_bass_gitar', 'is_drum', 'is_mulmed', 'is_sound', 'is_caringteam',
  'is_connexion_crew', 'is_supporting_crew', 'is_cforce', 'is_cg_leader', 'is_community_pic',
  'is_others'
];

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

    const result = await query<Pelayan>(
      `INSERT INTO pelayan (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
      values,
    );
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

    // Use transaction to update both pelayan and cgf_members atomically
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
};
