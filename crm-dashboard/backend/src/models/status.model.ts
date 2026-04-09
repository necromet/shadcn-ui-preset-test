import { query } from '../config/database';

export interface StatusHistory {
  id: number;
  no_jemaat: number;
  status: 'Active' | 'Inactive' | 'No Information' | 'Moved';
  changed_at: string;
  reason: string | null;
}

export interface StatusHistoryCreateData {
  no_jemaat: number;
  status: 'Active' | 'Inactive' | 'No Information' | 'Moved';
  reason?: string;
}

export interface StatusHistoryUpdateData {
  status?: 'Active' | 'Inactive' | 'No Information' | 'Moved';
  reason?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const StatusModel = {
  async getAll(page: number = 1, limit: number = 20): Promise<PaginatedResult<StatusHistory>> {
    const offset = (page - 1) * limit;

    const countResult = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM cnx_jemaat_status_history',
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await query<StatusHistory>(
      `SELECT * FROM cnx_jemaat_status_history
       ORDER BY changed_at DESC
       LIMIT $1 OFFSET $2`,
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

  async getById(id: number): Promise<StatusHistory | null> {
    const result = await query<StatusHistory>(
      'SELECT * FROM cnx_jemaat_status_history WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  },

  async create(data: StatusHistoryCreateData): Promise<StatusHistory> {
    const result = await query<StatusHistory>(
      `INSERT INTO cnx_jemaat_status_history (no_jemaat, status, reason)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.no_jemaat, data.status, data.reason || null],
    );
    return result.rows[0];
  },

  async update(id: number, data: StatusHistoryUpdateData): Promise<StatusHistory | null> {
    const columns = Object.keys(data);
    if (columns.length === 0) {
      return this.getById(id);
    }

    const values = Object.values(data);
    const setClauses = columns.map((col, i) => `${col} = $${i + 1}`);

    const result = await query<StatusHistory>(
      `UPDATE cnx_jemaat_status_history SET ${setClauses.join(', ')} WHERE id = $${columns.length + 1} RETURNING *`,
      [...values, id],
    );
    return result.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM cnx_jemaat_status_history WHERE id = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  },

  async getByMember(noJemaat: number): Promise<StatusHistory[]> {
    const result = await query<StatusHistory>(
      `SELECT * FROM cnx_jemaat_status_history
       WHERE no_jemaat = $1
       ORDER BY changed_at DESC`,
      [noJemaat],
    );
    return result.rows;
  },
};
