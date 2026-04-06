import { query, transaction } from '../config/database';

export interface Attendance {
  id: number;
  no_jemaat: number;
  cg_id: string;
  tanggal: string;
  keterangan: 'hadir' | 'izin' | 'tidak_hadir' | 'tamu';
}

export interface AttendanceCreateData {
  no_jemaat: number;
  cg_id: string;
  tanggal: string;
  keterangan: 'hadir' | 'izin' | 'tidak_hadir' | 'tamu';
}

export interface AttendanceUpdateData {
  keterangan?: 'hadir' | 'izin' | 'tidak_hadir' | 'tamu';
  tanggal?: string;
}

export interface AttendanceFilters {
  cg_id?: string;
  tanggal?: string;
  keterangan?: 'hadir' | 'izin' | 'tidak_hadir' | 'tamu';
  start_date?: string;
  end_date?: string;
}

export interface BulkAttendanceRecord {
  no_jemaat: number;
  keterangan: 'hadir' | 'izin' | 'tidak_hadir' | 'tamu';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const AttendanceModel = {
  async getAll(page: number = 1, limit: number = 20, filters: AttendanceFilters = {}): Promise<PaginatedResult<Attendance>> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (filters.cg_id) {
      conditions.push(`cg_id = $${paramIndex++}`);
      params.push(filters.cg_id);
    }
    if (filters.tanggal) {
      conditions.push(`tanggal = $${paramIndex++}`);
      params.push(filters.tanggal);
    }
    if (filters.keterangan) {
      conditions.push(`keterangan = $${paramIndex++}`);
      params.push(filters.keterangan);
    }
    if (filters.start_date) {
      conditions.push(`tanggal >= $${paramIndex++}`);
      params.push(filters.start_date);
    }
    if (filters.end_date) {
      conditions.push(`tanggal <= $${paramIndex++}`);
      params.push(filters.end_date);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM cgf_attendance ${whereClause}`,
      params,
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await query<Attendance>(
      `SELECT * FROM cgf_attendance ${whereClause} ORDER BY tanggal DESC, id DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...params, limit, offset],
    );

    return {
      data: dataResult.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getById(id: number): Promise<Attendance | null> {
    const result = await query<Attendance>(
      'SELECT * FROM cgf_attendance WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  },

  async create(data: AttendanceCreateData): Promise<Attendance> {
    const result = await query<Attendance>(
      `INSERT INTO cgf_attendance (no_jemaat, cg_id, tanggal, keterangan)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.no_jemaat, data.cg_id, data.tanggal, data.keterangan],
    );
    return result.rows[0];
  },

  async update(id: number, data: AttendanceUpdateData): Promise<Attendance | null> {
    const columns = Object.keys(data);
    if (columns.length === 0) {
      return this.getById(id);
    }

    const values = Object.values(data);
    const setClauses = columns.map((col, i) => `${col} = $${i + 1}`);

    const result = await query<Attendance>(
      `UPDATE cgf_attendance SET ${setClauses.join(', ')} WHERE id = $${columns.length + 1} RETURNING *`,
      [...values, id],
    );
    return result.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM cgf_attendance WHERE id = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  },

  async bulkCreate(cgId: string, tanggal: string, records: BulkAttendanceRecord[]): Promise<Attendance[]> {
    return transaction(async (txQuery) => {
      const created: Attendance[] = [];

      for (const record of records) {
        const result = await txQuery<Attendance>(
          `INSERT INTO cgf_attendance (no_jemaat, cg_id, tanggal, keterangan)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [record.no_jemaat, cgId, tanggal, record.keterangan],
        );
        created.push(result.rows[0]);
      }

      return created;
    });
  },

  async getByMember(noJemaat: number): Promise<Attendance[]> {
    const result = await query<Attendance>(
      `SELECT * FROM cgf_attendance
       WHERE no_jemaat = $1
       ORDER BY tanggal DESC`,
      [noJemaat],
    );
    return result.rows;
  },

  async getByGroup(cgId: string): Promise<Attendance[]> {
    const result = await query<Attendance>(
      `SELECT * FROM cgf_attendance
       WHERE cg_id = $1
       ORDER BY tanggal DESC`,
      [cgId],
    );
    return result.rows;
  },
};
