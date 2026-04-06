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

  async create(data: MemberCreateData): Promise<Member> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, i) => `$${i + 1}`);

    const result = await query<Member>(
      `INSERT INTO cnx_jemaat_clean (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
      values,
    );
    return result.rows[0];
  },

  async update(no_jemaat: number, data: MemberUpdateData): Promise<Member | null> {
    const columns = Object.keys(data);
    if (columns.length === 0) {
      return this.getById(no_jemaat);
    }

    const values = Object.values(data);
    const setClauses = columns.map((col, i) => `${col} = $${i + 1}`);

    const result = await query<Member>(
      `UPDATE cnx_jemaat_clean SET ${setClauses.join(', ')} WHERE no_jemaat = $${columns.length + 1} RETURNING *`,
      [...values, no_jemaat],
    );
    return result.rows[0] || null;
  },

  async delete(no_jemaat: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM cnx_jemaat_clean WHERE no_jemaat = $1',
      [no_jemaat],
    );
    return (result.rowCount ?? 0) > 0;
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
