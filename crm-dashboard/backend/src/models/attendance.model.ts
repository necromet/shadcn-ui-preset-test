import { query, transaction } from '../config/database';

export interface Attendance {
  id: number;
  no_jemaat: number;
  cg_id: string;
  tanggal: string;
  keterangan: 'hadir' | 'tidak_hadir';
}

export interface AttendanceEnriched extends Attendance {
  nama_jemaat: string;
  nama_cgf: string;
  jenis_kelamin: string;
  is_leader: boolean;
}

export interface AttendanceCreateData {
  no_jemaat: number;
  cg_id: string;
  tanggal: string;
  keterangan: 'hadir' | 'tidak_hadir';
}

export interface AttendanceUpdateData {
  keterangan?: 'hadir' | 'tidak_hadir';
  tanggal?: string;
}

export interface AttendanceFilters {
  cg_id?: string;
  tanggal?: string;
  keterangan?: 'hadir' | 'tidak_hadir';
  start_date?: string;
  end_date?: string;
}

export interface BulkAttendanceRecord {
  no_jemaat: number;
  keterangan: 'hadir' | 'tidak_hadir';
}

export interface AttendanceValidationResult {
  valid: boolean;
  error?: string;
  message?: string;
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

  async validateAttendance(cgId: string, tanggal: string, records: BulkAttendanceRecord[]): Promise<AttendanceValidationResult> {
    const existingForDate = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM cgf_attendance WHERE cg_id = $1 AND tanggal = $2`,
      [cgId, tanggal],
    );
    if (parseInt(existingForDate.rows[0].count, 10) > 0) {
      return {
        valid: false,
        error: 'ALREADY_MARKED',
        message: `Absensi untuk CGF ini pada tanggal ${tanggal} sudah tercatat`,
      };
    }

    const groupMemberIds = await query<{ no_jemaat: number }>(
      `SELECT no_jemaat FROM cgf_members WHERE cg_id = $1`,
      [cgId],
    );
    const memberIds = new Set(groupMemberIds.rows.map(r => r.no_jemaat));

    for (const record of records) {
      if (!memberIds.has(record.no_jemaat)) {
        const member = await query<{ nama_jemaat: string }>(
          `SELECT nama_jemaat FROM cnx_jemaat_clean WHERE no_jemaat = $1`,
          [record.no_jemaat],
        );
        return {
          valid: false,
          error: 'INVALID_MEMBER',
          message: `${member.rows[0]?.nama_jemaat || record.no_jemaat} bukan anggota CGF ini`,
        };
      }
    }

    return { valid: true };
  },

  async isMemberOfCGF(noJemaat: number, cgId: string): Promise<boolean> {
    const result = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM cgf_members WHERE no_jemaat = $1 AND cg_id = $2`,
      [noJemaat, cgId],
    );
    return parseInt(result.rows[0].count, 10) > 0;
  },

  async exists(noJemaat: number, cgId: string, tanggal: string): Promise<boolean> {
    const result = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM cgf_attendance WHERE no_jemaat = $1 AND cg_id = $2 AND tanggal = $3`,
      [noJemaat, cgId, tanggal],
    );
    return parseInt(result.rows[0].count, 10) > 0;
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

  async getEnrichedAll(page: number = 1, limit: number = 20, filters: AttendanceFilters = {}): Promise<PaginatedResult<AttendanceEnriched>> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (filters.cg_id) {
      conditions.push(`a.cg_id = $${paramIndex++}`);
      params.push(filters.cg_id);
    }
    if (filters.tanggal) {
      conditions.push(`a.tanggal = $${paramIndex++}`);
      params.push(filters.tanggal);
    }
    if (filters.keterangan) {
      conditions.push(`a.keterangan = $${paramIndex++}`);
      params.push(filters.keterangan);
    }
    if (filters.start_date) {
      conditions.push(`a.tanggal >= $${paramIndex++}`);
      params.push(filters.start_date);
    }
    if (filters.end_date) {
      conditions.push(`a.tanggal <= $${paramIndex++}`);
      params.push(filters.end_date);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM cgf_attendance a ${whereClause}`,
      params,
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await query<AttendanceEnriched>(
      `SELECT a.id, a.no_jemaat, a.cg_id, TO_CHAR(a.tanggal, 'YYYY-MM-DD') as tanggal, a.keterangan,
              m.nama_jemaat, m.jenis_kelamin,
              g.nama_cgf,
              COALESCE(cm.is_leader, false) as is_leader
       FROM cgf_attendance a
       LEFT JOIN cnx_jemaat_clean m ON a.no_jemaat = m.no_jemaat
       LEFT JOIN cgf_info g ON a.cg_id = g.id
       LEFT JOIN cgf_members cm ON a.no_jemaat = cm.no_jemaat AND cm.nama_cgf = g.nama_cgf
       ${whereClause}
       ORDER BY a.tanggal DESC, a.id DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
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

  async getEnrichedById(id: number): Promise<AttendanceEnriched | null> {
    const result = await query<AttendanceEnriched>(
      `SELECT a.id, a.no_jemaat, a.cg_id, TO_CHAR(a.tanggal, 'YYYY-MM-DD') as tanggal, a.keterangan,
              m.nama_jemaat, m.jenis_kelamin,
              g.nama_cgf,
              COALESCE(cm.is_leader, false) as is_leader
       FROM cgf_attendance a
       LEFT JOIN cnx_jemaat_clean m ON a.no_jemaat = m.no_jemaat
       LEFT JOIN cgf_info g ON a.cg_id = g.id
       LEFT JOIN cgf_members cm ON a.no_jemaat = cm.no_jemaat AND cm.nama_cgf = g.nama_cgf
       WHERE a.id = $1`,
      [id],
    );
    return result.rows[0] || null;
  },

  async getMembersWithStatus(cgId: string, tanggal: string): Promise<AttendanceEnriched[]> {
    const result = await query<AttendanceEnriched>(
      `SELECT cm.no_jemaat, m.nama_jemaat, m.jenis_kelamin,
              cm.is_leader,
              g.id as cg_id,
              g.nama_cgf,
              CASE WHEN a.keterangan IS NOT NULL THEN a.keterangan ELSE null END as today_status
       FROM cgf_members cm
       JOIN cgf_info g ON cm.nama_cgf = g.nama_cgf
       LEFT JOIN cnx_jemaat_clean m ON cm.no_jemaat = m.no_jemaat
       LEFT JOIN cgf_attendance a ON cm.no_jemaat = a.no_jemaat AND a.cg_id = g.nama_cgf AND a.tanggal = $1
       WHERE g.id = $2`,
      [tanggal, cgId],
    );
    return result.rows;
  },

  async getCGFAttendanceList(): Promise<{
    cg_id: string;
    nama_cgf: string;
    leader_name: string;
    jadwal: string;
    lokasi: string;
    member_count: number;
    attendance_rate: number;
  }[]> {
    const result = await query<{
      cg_id: string;
      nama_cgf: string;
      leader_name: string;
      jadwal: string;
      lokasi: string;
    }>(
      `SELECT g.cg_id, g.nama_cgf, g.leader_name, g.jadwal, g.lokasi
       FROM cgf_groups g
       ORDER BY g.nama_cgf`,
    );

    const groups = result.rows;
    const enriched = [];

    for (const group of groups) {
      const memberCount = await query<{ count: string }>(
        `SELECT COUNT(*) as count FROM cgf_members WHERE cg_id = $1`,
        [group.cg_id],
      );

      const attendanceStats = await query<{ hadir: string; total: string }>(
        `SELECT 
           COUNT(CASE WHEN keterangan = 'hadir' THEN 1 END) as hadir,
           COUNT(*) as total
         FROM cgf_attendance WHERE cg_id = $1`,
        [group.cg_id],
      );

      const member_count = parseInt(memberCount.rows[0].count, 10);
      const hadir = parseInt(attendanceStats.rows[0].hadir, 10);
      const total = parseInt(attendanceStats.rows[0].total, 10);
      const attendance_rate = total > 0 ? Math.round((hadir / total) * 100) : 0;

      enriched.push({
        ...group,
        member_count,
        attendance_rate,
      });
    }

    return enriched;
  },

  async getCGFAttendanceStats(cgId: string): Promise<{
    cg_id: string;
    nama_cgf: string;
    total_members: number;
    total_meetings: number;
    total_records: number;
    hadir: number;
    tidak_hadir: number;
    attendance_rate: number;
    monthly_summary: { bulan: string; hadir: number; tidak_hadir: number }[];
  } | null> {
    const group = await query<{ cg_id: string; nama_cgf: string }>(
      `SELECT cg_id, nama_cgf FROM cgf_groups WHERE cg_id = $1`,
      [cgId],
    );
    if (group.rows.length === 0) return null;

    const memberCount = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM cgf_members WHERE cg_id = $1`,
      [cgId],
    );

    const attendanceStats = await query<{ hadir: string; tidak_hadir: string; total: string }>(
      `SELECT 
         COUNT(CASE WHEN keterangan = 'hadir' THEN 1 END) as hadir,
         COUNT(CASE WHEN keterangan = 'tidak_hadir' THEN 1 END) as tidak_hadir,
         COUNT(*) as total
       FROM cgf_attendance WHERE cg_id = $1`,
      [cgId],
    );

    const uniqueDates = await query<{ count: string }>(
      `SELECT COUNT(DISTINCT tanggal) as count FROM cgf_attendance WHERE cg_id = $1`,
      [cgId],
    );

    const monthlySummary = await query<{
      month_key: string;
      month_label: string;
      hadir: string;
      tidak_hadir: string;
    }>(
      `SELECT 
         TO_CHAR(tanggal, 'YYYY-MM') as month_key,
         TO_CHAR(tanggal, 'Month YYYY') as month_label,
         COUNT(CASE WHEN keterangan = 'hadir' THEN 1 END) as hadir,
         COUNT(CASE WHEN keterangan = 'tidak_hadir' THEN 1 END) as tidak_hadir
       FROM cgf_attendance
       WHERE cg_id = $1
       GROUP BY TO_CHAR(tanggal, 'YYYY-MM'), TO_CHAR(tanggal, 'Month YYYY')
       ORDER BY month_key`,
      [cgId],
    );

    const total_members = parseInt(memberCount.rows[0].count, 10);
    const hadir = parseInt(attendanceStats.rows[0].hadir, 10);
    const tidak_hadir = parseInt(attendanceStats.rows[0].tidak_hadir, 10);
    const total_records = parseInt(attendanceStats.rows[0].total, 10);
    const total_meetings = parseInt(uniqueDates.rows[0].count, 10);
    const attendance_rate = total_records > 0 ? Math.round((hadir / total_records) * 100) : 0;

    return {
      cg_id: group.rows[0].cg_id,
      nama_cgf: group.rows[0].nama_cgf,
      total_members,
      total_meetings,
      total_records,
      hadir,
      tidak_hadir,
      attendance_rate,
      monthly_summary: monthlySummary.rows.map(row => ({
        bulan: row.month_label.trim(),
        hadir: parseInt(row.hadir, 10),
        tidak_hadir: parseInt(row.tidak_hadir, 10),
      })),
    };
  },

  async getMemberAttendanceStats(noJemaat: number): Promise<{
    no_jemaat: number;
    nama_jemaat: string;
    cg_id: string | null;
    nama_cgf: string | null;
    total_meetings: number;
    hadir: number;
    tidak_hadir: number;
    attendance_rate: number;
    recent: { tanggal: string; keterangan: string; nama_cgf: string }[];
  } | null> {
    const member = await query<{ no_jemaat: number; nama_jemaat: string }>(
      `SELECT no_jemaat, nama_jemaat FROM cnx_jemaat_clean WHERE no_jemaat = $1`,
      [noJemaat],
    );
    if (member.rows.length === 0) return null;

    const attendanceStats = await query<{ hadir: string; tidak_hadir: string; total: string }>(
      `SELECT 
         COUNT(CASE WHEN keterangan = 'hadir' THEN 1 END) as hadir,
         COUNT(CASE WHEN keterangan = 'tidak_hadir' THEN 1 END) as tidak_hadir,
         COUNT(*) as total
       FROM cgf_attendance WHERE no_jemaat = $1`,
      [noJemaat],
    );

    const recent = await query<{ tanggal: string; keterangan: string; nama_cgf: string }>(
      `SELECT a.tanggal, a.keterangan, g.nama_cgf
       FROM cgf_attendance a
       LEFT JOIN cgf_groups g ON a.cg_id = g.cg_id
       WHERE a.no_jemaat = $1
       ORDER BY a.tanggal DESC
       LIMIT 5`,
      [noJemaat],
    );

    const cgAssignment = await query<{ cg_id: string; nama_cgf: string }>(
      `SELECT cm.cg_id, g.nama_cgf
       FROM cgf_members cm
       LEFT JOIN cgf_groups g ON cm.cg_id = g.cg_id
       WHERE cm.no_jemaat = $1`,
      [noJemaat],
    );

    const hadir = parseInt(attendanceStats.rows[0].hadir, 10);
    const tidak_hadir = parseInt(attendanceStats.rows[0].tidak_hadir, 10);
    const total = parseInt(attendanceStats.rows[0].total, 10);
    const attendance_rate = total > 0 ? Math.round((hadir / total) * 100) : 0;

    return {
      no_jemaat: member.rows[0].no_jemaat,
      nama_jemaat: member.rows[0].nama_jemaat,
      cg_id: cgAssignment.rows[0]?.cg_id || null,
      nama_cgf: cgAssignment.rows[0]?.nama_cgf || null,
      total_meetings: total,
      hadir,
      tidak_hadir,
      attendance_rate,
      recent: recent.rows.map(r => ({
        tanggal: r.tanggal,
        keterangan: r.keterangan,
        nama_cgf: r.nama_cgf,
      })),
    };
  },
};
