import { query, transaction } from '../config/database';

export interface CGFGroup {
  id: string;
  nama_cgf: string;
  lokasi_1: string;
  lokasi_2: string | null;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
}

export interface CGFGroupCreateData {
  id: string;
  nama_cgf: string;
  lokasi_1: string;
  lokasi_2?: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
}

export interface CGFGroupUpdateData {
  nama_cgf?: string;
  lokasi_1?: string;
  lokasi_2?: string;
  hari?: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
}

export interface CGFMember {
  no_jemaat: number;
  nama_cgf: string;
  is_leader: boolean;
}

export interface CGFMemberCreateData {
  no_jemaat: number;
  nama_cgf: string;
  is_leader?: boolean;
}

export interface CGFMemberUpdateData {
  nama_cgf?: string;
  is_leader?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const CGFModel = {
  async getAllGroups(page: number = 1, limit: number = 20): Promise<PaginatedResult<CGFGroup>> {
    const offset = (page - 1) * limit;

    const countResult = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM cgf_info',
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await query<CGFGroup>(
      'SELECT * FROM cgf_info ORDER BY nama_cgf ASC LIMIT $1 OFFSET $2',
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

  async getGroupById(id: string): Promise<CGFGroup | null> {
    const result = await query<CGFGroup>(
      'SELECT * FROM cgf_info WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  },

  async createGroup(data: CGFGroupCreateData): Promise<CGFGroup> {
    const result = await query<CGFGroup>(
      `INSERT INTO cgf_info (id, nama_cgf, lokasi_1, lokasi_2, hari)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.id, data.nama_cgf, data.lokasi_1, data.lokasi_2 || null, data.hari],
    );
    return result.rows[0];
  },

  async updateGroup(id: string, data: CGFGroupUpdateData): Promise<CGFGroup | null> {
    const columns = Object.keys(data);
    if (columns.length === 0) {
      return this.getGroupById(id);
    }

    const values = Object.values(data);
    const setClauses = columns.map((col, i) => `${col} = $${i + 1}`);

    const result = await query<CGFGroup>(
      `UPDATE cgf_info SET ${setClauses.join(', ')} WHERE id = $${columns.length + 1} RETURNING *`,
      [...values, id],
    );
    return result.rows[0] || null;
  },

  async deleteGroup(id: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM cgf_info WHERE id = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  },

  async getMembersByGroup(cgId: string): Promise<CGFMember[]> {
    const result = await query<CGFMember>(
      `SELECT cm.no_jemaat, cm.nama_cgf, cm.is_leader
       FROM cgf_members cm
       JOIN cgf_info ci ON cm.nama_cgf = ci.nama_cgf
       WHERE ci.id = $1
       ORDER BY cm.is_leader DESC, cm.no_jemaat ASC`,
      [cgId],
    );
    return result.rows;
  },

  async addMemberToGroup(data: CGFMemberCreateData): Promise<CGFMember> {
    const result = await query<CGFMember>(
      `INSERT INTO cgf_members (no_jemaat, nama_cgf, is_leader)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.no_jemaat, data.nama_cgf, data.is_leader || false],
    );
    return result.rows[0];
  },

  async updateMemberAssignment(id: number, data: CGFMemberUpdateData): Promise<CGFMember | null> {
    const columns = Object.keys(data);
    if (columns.length === 0) {
      const result = await query<CGFMember>(
        'SELECT * FROM cgf_members WHERE no_jemaat = $1',
        [id],
      );
      return result.rows[0] || null;
    }

    const values = Object.values(data);
    const setClauses = columns.map((col, i) => `${col} = $${i + 1}`);

    const result = await query<CGFMember>(
      `UPDATE cgf_members SET ${setClauses.join(', ')} WHERE no_jemaat = $${columns.length + 1} RETURNING *`,
      [...values, id],
    );
    return result.rows[0] || null;
  },

  async removeMemberFromGroup(noJemaat: number, cgId: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM cgf_members 
       WHERE no_jemaat = $1 AND nama_cgf = (
         SELECT nama_cgf FROM cgf_info WHERE id = $2
       )`,
      [noJemaat, cgId],
    );
    return (result.rowCount ?? 0) > 0;
  },
};
