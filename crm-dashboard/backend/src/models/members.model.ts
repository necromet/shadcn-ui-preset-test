import { query, transaction } from '../config/database';
import { QueryResult } from 'pg';

export interface Member {
  no_jemaat: number;
  nama_jemaat: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  tanggal_lahir: string;
  tahun_lahir: number;
  bulan_lahir: number;
  kuliah_kerja: string | null;
  no_handphone: string | null;
  ketertarikan_cgf: string | null;
  nama_cgf: string | null;
  kategori_domisili: string | null;
  alamat_domisili: string | null;
  status_aktif: string | null;
  status_keterangan: string | null;
}

export interface MemberCreateData {
  nama_jemaat: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  tanggal_lahir: string;
  tahun_lahir?: number;
  bulan_lahir?: number;
  kuliah_kerja?: string;
  no_handphone?: string;
  ketertarikan_cgf?: string;
  nama_cgf?: string;
  kategori_domisili?: string;
  alamat_domisili?: string;
  status_aktif?: string;
  status_keterangan?: string;
}

export interface MemberUpdateData {
  nama_jemaat?: string;
  jenis_kelamin?: 'Laki-laki' | 'Perempuan';
  tanggal_lahir?: string;
  tahun_lahir?: number;
  bulan_lahir?: number;
  kuliah_kerja?: string;
  no_handphone?: string;
  ketertarikan_cgf?: string;
  nama_cgf?: string;
  kategori_domisili?: string;
  alamat_domisili?: string;
  status_aktif?: string;
  status_keterangan?: string;
}

export interface MemberFilters {
  jenis_kelamin?: 'Laki-laki' | 'Perempuan';
  kategori_domisili?: string;
  nama_cgf?: string;
  kuliah_kerja?: string;
  bulan_lahir?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const MembersModel = {
  async getAll(page: number = 1, limit: number = 20, filters: MemberFilters = {}): Promise<PaginatedResult<Member>> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (filters.jenis_kelamin) {
      conditions.push(`jenis_kelamin = $${paramIndex++}`);
      params.push(filters.jenis_kelamin);
    }
    if (filters.kategori_domisili) {
      conditions.push(`kategori_domisili = $${paramIndex++}`);
      params.push(filters.kategori_domisili);
    }
    if (filters.nama_cgf) {
      conditions.push(`nama_cgf = $${paramIndex++}`);
      params.push(filters.nama_cgf);
    }
    if (filters.kuliah_kerja) {
      conditions.push(`kuliah_kerja = $${paramIndex++}`);
      params.push(filters.kuliah_kerja);
    }
    if (filters.bulan_lahir) {
      conditions.push(`bulan_lahir = $${paramIndex++}`);
      params.push(filters.bulan_lahir);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM cnx_jemaat_clean ${whereClause}`,
      params,
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await query<Member>(
      `SELECT * FROM cnx_jemaat_clean ${whereClause} ORDER BY no_jemaat ASC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
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

  async getById(no_jemaat: number): Promise<Member | null> {
    const result = await query<Member>(
      'SELECT * FROM cnx_jemaat_clean WHERE no_jemaat = $1',
      [no_jemaat],
    );
    return result.rows[0] || null;
  },

  /**
   * Sync cgf_members table based on member's nama_cgf value.
   * If nama_cgf is null/empty/'Belum CGF', set no_jemaat = NULL in cgf_members (keep row for history).
   * Otherwise, upsert into cgf_members with member data.
   */
  async syncCgfMembers(
    no_jemaat: number,
    nama_jemaat: string,
    nama_cgf: string | null | undefined,
    no_handphone: string | null | undefined,
    txQuery?: typeof query,
  ): Promise<void> {
    const queryFn = txQuery || query;
    
    // Determine if member belongs to a CGF
    const validCgf = nama_cgf && nama_cgf.trim() !== '' && nama_cgf !== 'Belum CGF';
    
    if (!validCgf) {
      // Remove from cgf_members if row exists
      await queryFn(
        'DELETE FROM cgf_members WHERE no_jemaat = $1',
        [no_jemaat],
      );
      return;
    }

    // Check if the member is a CForce leader in pelayan table
    const pelayanResult = await queryFn(
      'SELECT is_cforce FROM pelayan WHERE no_jemaat = $1',
      [no_jemaat],
    );
    const isLeaderValue = pelayanResult.rows[0]?.is_cforce ? 1 : 0;

    // Upsert into cgf_members
    await queryFn(
       `INSERT INTO cgf_members (no_jemaat, nama_jemaat, nama_cgf, no_handphone, is_leader)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (no_jemaat) DO UPDATE SET
          nama_jemaat = EXCLUDED.nama_jemaat,
          nama_cgf = EXCLUDED.nama_cgf,
          no_handphone = EXCLUDED.no_handphone,
          is_leader = EXCLUDED.is_leader`,
      [no_jemaat, nama_jemaat, nama_cgf, no_handphone, isLeaderValue],
    );

    // If member is a leader, ensure pelayan.is_cforce is also 1
    if (isLeaderValue === 1) {
      await queryFn(
        'UPDATE pelayan SET is_cforce = 1 WHERE no_jemaat = $1 AND is_cforce = 0',
        [no_jemaat],
      );
    }
  },

  async create(data: MemberCreateData): Promise<Member> {
    return transaction(async (txQuery) => {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = columns.map((_, i) => `$${i + 1}`);

      const result = await txQuery<Member>(
        `INSERT INTO cnx_jemaat_clean (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
        values,
      );
      const member = result.rows[0];
      
      // Sync cgf_members table
      await this.syncCgfMembers(
        member.no_jemaat,
        member.nama_jemaat,
        member.nama_cgf,
        member.no_handphone,
        txQuery,
      );
      
      return member;
    });
  },

  async update(no_jemaat: number, data: MemberUpdateData): Promise<Member | null> {
    return transaction(async (txQuery) => {
      const columns = Object.keys(data);
      if (columns.length === 0) {
        return this.getById(no_jemaat);
      }

      // Fetch current status_aktif before update if it's being changed
      let previousStatusAktif: string | null = null;
      if (data.status_aktif !== undefined) {
        const currentResult = await txQuery<{ status_aktif: string | null }>(
          'SELECT status_aktif FROM cnx_jemaat_clean WHERE no_jemaat = $1',
          [no_jemaat],
        );
        previousStatusAktif = currentResult.rows[0]?.status_aktif ?? null;
      }

      const values = Object.values(data);
      const setClauses = columns.map((col, i) => `${col} = $${i + 1}`);

      const result = await txQuery<Member>(
        `UPDATE cnx_jemaat_clean SET ${setClauses.join(', ')} WHERE no_jemaat = $${columns.length + 1} RETURNING *`,
        [...values, no_jemaat],
      );
      const member = result.rows[0];
      if (!member) {
        return null;
      }

      // Log status change to cnx_jemaat_status_history
      if (data.status_aktif !== undefined && data.status_aktif !== previousStatusAktif) {
        const maxIdResult = await txQuery<{ max_id: number | null }>(
          'SELECT COALESCE(MAX(id), 90000) as max_id FROM cnx_jemaat_status_history WHERE id >= 90000',
        );
        const nextId = (maxIdResult.rows[0]?.max_id ?? 90000) + 1;

        await txQuery(
          `INSERT INTO cnx_jemaat_status_history (id, no_jemaat, status, reason)
           VALUES ($1, $2, $3, $4)`,
          [nextId, no_jemaat, data.status_aktif, data.status_keterangan || null],
        );
      } else if (data.status_keterangan !== undefined) {
        // status_keterangan changed without status_aktif change — update latest history record's reason
        await txQuery(
          `UPDATE cnx_jemaat_status_history SET reason = $1
           WHERE id = (
             SELECT id FROM cnx_jemaat_status_history
             WHERE no_jemaat = $2
             ORDER BY changed_at DESC, id DESC
             LIMIT 1
           )`,
          [data.status_keterangan || null, no_jemaat],
        );
      }

      // Sync cgf_members table
      await this.syncCgfMembers(
        member.no_jemaat,
        member.nama_jemaat,
        member.nama_cgf,
        member.no_handphone,
        txQuery,
      );

      return member;
    });
  },

  async delete(no_jemaat: number): Promise<boolean> {
    return transaction(async (txQuery) => {
      await txQuery('DELETE FROM event_participation WHERE no_jemaat = $1', [no_jemaat]);
      await txQuery('DELETE FROM cnx_jemaat_status_history WHERE no_jemaat = $1', [no_jemaat]);
      await txQuery('DELETE FROM cgf_members WHERE no_jemaat = $1', [no_jemaat]);
      await txQuery('DELETE FROM cgf_attendance WHERE no_jemaat = $1', [no_jemaat]);
      await txQuery('DELETE FROM pelayan WHERE no_jemaat = $1', [no_jemaat]);
      const result = await txQuery(
        'DELETE FROM cnx_jemaat_clean WHERE no_jemaat = $1',
        [no_jemaat],
      );
      return (result.rowCount ?? 0) > 0;
    });
  },

  async search(searchQuery: string): Promise<Member[]> {
    const result = await query<Member>(
      `SELECT * FROM cnx_jemaat_clean
       WHERE nama_jemaat ILIKE $1
          OR no_handphone ILIKE $1
          OR alamat_domisili ILIKE $1
       ORDER BY nama_jemaat ASC
       LIMIT 50`,
      [`%${searchQuery}%`],
    );
    return result.rows;
  },

  async getByFilters(filters: MemberFilters): Promise<Member[]> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (filters.jenis_kelamin) {
      conditions.push(`jenis_kelamin = $${paramIndex++}`);
      params.push(filters.jenis_kelamin);
    }
    if (filters.kategori_domisili) {
      conditions.push(`kategori_domisili = $${paramIndex++}`);
      params.push(filters.kategori_domisili);
    }
    if (filters.nama_cgf) {
      conditions.push(`nama_cgf = $${paramIndex++}`);
      params.push(filters.nama_cgf);
    }
    if (filters.kuliah_kerja) {
      conditions.push(`kuliah_kerja = $${paramIndex++}`);
      params.push(filters.kuliah_kerja);
    }
    if (filters.bulan_lahir) {
      conditions.push(`bulan_lahir = $${paramIndex++}`);
      params.push(filters.bulan_lahir);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query<Member>(
      `SELECT * FROM cnx_jemaat_clean ${whereClause} ORDER BY no_jemaat ASC`,
      params,
    );
    return result.rows;
  },

};
