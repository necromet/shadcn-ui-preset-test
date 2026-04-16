import { query } from '../config/database';

export interface DashboardKPIs {
  total_members: number;
  active_members: number;
  inactive_members: number;
  new_members_this_month: number;
  total_cgf_groups: number;
  total_ministry_members: number;
  upcoming_events: number;
  attendance_rate_this_month: number;
}

export interface DistributionItem {
  label: string;
  value: number;
  percentage: number;
}

export interface AttendanceTrendItem {
  period: string;
  total_expected: number;
  total_present: number;
  attendance_rate: number;
}

export interface CGFSizeItem {
  cg_id: number;
  nama_cgf: string;
  member_count: number;
}

export interface BirthdayMember {
  no_jemaat: number;
  nama_jemaat: string;
  tanggal_lahir: string;
  upcoming_birthday: string;
  age_turning: number;
}

export interface StatusDistributionItem {
  status_aktif: string;
  count: number;
}

export interface MinistryParticipationItem {
  role: string;
  count: number;
}

export interface AtRiskMember {
  no_jemaat: number;
  nama_jemaat: string;
  last_attendance: string | null;
  days_since_attendance: number;
  current_status: string;
}

export interface UpcomingEvent {
  event_id: number;
  event_name: string;
  event_date: string;
  category: string;
  location: string | null;
}

export interface CGHealthItem {
  nama_cgf: string;
  total_members: number;
  attendance_rate: number;
  last_activity: string | null;
}

export const AnalyticsModel = {
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    const result = await query<DashboardKPIs>(`
      SELECT
        (SELECT COUNT(*) FROM cnx_jemaat_clean) as total_members,
        (SELECT COUNT(*) FROM cgf_info) as total_cgf_groups,
        (SELECT COUNT(DISTINCT no_jemaat) FROM pelayan) as total_ministry_members,
        (SELECT COUNT(nama_cgf) from cnx_jemaat_clean where nama_cgf = 'Belum CGF') as members_without_cgf
    `);
    return result.rows[0];
  },

  async getGenderDistribution(): Promise<DistributionItem[]> {
    const result = await query<{ jenis_kelamin: string; count: string }>(`
      SELECT jenis_kelamin, COUNT(*) as count
      FROM cnx_jemaat_clean
      GROUP BY jenis_kelamin
      ORDER BY count DESC
    `);

    const total = result.rows.reduce((sum, r) => sum + parseInt(r.count, 10), 0);

    return result.rows.map((r) => ({
      label: r.jenis_kelamin,
      value: parseInt(r.count, 10),
      percentage: total > 0 ? Math.round((parseInt(r.count, 10) / total) * 100 * 10) / 10 : 0,
    }));
  },

  async getAgeDistribution(): Promise<DistributionItem[]> {
    const result = await query<{ age_group: string; count: string }>(`
      SELECT
        CASE
          WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, tanggal_lahir::date)) < 13 THEN 'Anak-anak (<13)'
          WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, tanggal_lahir::date)) < 18 THEN 'Remaja (13-17)'
          WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, tanggal_lahir::date)) < 26 THEN 'Dewasa Muda (18-25)'
          WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, tanggal_lahir::date)) < 36 THEN 'Dewasa (26-35)'
          WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, tanggal_lahir::date)) < 51 THEN 'Dewasa (36-50)'
          ELSE 'Senior (50+)'
        END as age_group,
        COUNT(*) as count
      FROM cnx_jemaat_clean
      GROUP BY age_group
      ORDER BY MIN(EXTRACT(YEAR FROM AGE(CURRENT_DATE, tanggal_lahir::date)))
    `);

    const total = result.rows.reduce((sum, r) => sum + parseInt(r.count, 10), 0);

    return result.rows.map((r) => ({
      label: r.age_group,
      value: parseInt(r.count, 10),
      percentage: total > 0 ? Math.round((parseInt(r.count, 10) / total) * 100 * 10) / 10 : 0,
    }));
  },

  async getDomisiliDistribution(): Promise<DistributionItem[]> {
    const result = await query<{ kategori_domisili: string; count: string }>(`
      SELECT COALESCE(kategori_domisili, 'Unknown') as kategori_domisili, COUNT(*) as count
      FROM cnx_jemaat_clean
      GROUP BY kategori_domisili
      ORDER BY count DESC
    `);

    const total = result.rows.reduce((sum, r) => sum + parseInt(r.count, 10), 0);

    return result.rows.map((r) => ({
      label: r.kategori_domisili,
      value: parseInt(r.count, 10),
      percentage: total > 0 ? Math.round((parseInt(r.count, 10) / total) * 100 * 10) / 10 : 0,
    }));
  },

  async getCGFSizes(): Promise<CGFSizeItem[]> {
    const result = await query<{ cg_id: string; nama_cgf: string; member_count: string }>(`
    SELECT ci.id as cg_id,
    ci.nama_cgf,
    count(cm.nama_cgf) as member_count
    FROM cgf_info ci
    LEFT JOIN cgf_members cm on ci.nama_cgf = cm.nama_cgf
    GROUP BY 1, 2
    ORDER BY count(cm.nama_cgf) DESC
    `);

    return result.rows.map((r) => ({
      cg_id: parseInt(r.cg_id, 10),
      nama_cgf: r.nama_cgf,
      member_count: parseInt(r.member_count, 10),
    }));
  },

  async getAttendanceTrend(startDate: string, endDate: string): Promise<AttendanceTrendItem[]> {
    const result = await query<{
      period: string;
      total_expected: string;
      total_present: string;
    }>(`
      SELECT
        TO_CHAR(tanggal::date, 'YYYY-MM') as period,
        COUNT(*) as total_expected,
        COUNT(*) FILTER (WHERE keterangan = 'hadir') as total_present
      FROM cgf_attendance
      WHERE tanggal >= $1 AND tanggal <= $2
      GROUP BY period
      ORDER BY period ASC
    `, [startDate, endDate]);

    return result.rows.map((r) => ({
      period: r.period,
      total_expected: parseInt(r.total_expected, 10),
      total_present: parseInt(r.total_present, 10),
      attendance_rate: parseInt(r.total_expected, 10) > 0
        ? Math.round((parseInt(r.total_present, 10) / parseInt(r.total_expected, 10)) * 100 * 10) / 10
        : 0,
    }));
  },

  async getCGFInterestFunnel(): Promise<{ stage: string; count: number }[]> {
    const result = await query<{ stage: string; count: string }>(`
      SELECT
        'Total Members' as stage,
        COUNT(*) as count
      FROM cnx_jemaat_clean
      UNION ALL
      SELECT
        'Interested in CGF' as stage,
        COUNT(*) as count
      FROM cnx_jemaat_clean
      WHERE ketertarikan_cgf IS NOT NULL AND ketertarikan_cgf != ''
      UNION ALL
      SELECT
        'Assigned to CGF' as stage,
        COUNT(*) as count
      FROM cnx_jemaat_clean
      WHERE nama_cgf IS NOT NULL AND nama_cgf != ''
      UNION ALL
      SELECT
        'Active CGF Attendance' as stage,
        COUNT(DISTINCT no_jemaat) as count
      FROM cgf_attendance
      WHERE keterangan = 'hadir'
    `);

    return result.rows.map((r) => ({
      stage: r.stage,
      count: parseInt(r.count, 10),
    }));
  },

  async getKuliahKerjaRatio(): Promise<DistributionItem[]> {
    const result = await query<{ kuliah_kerja: string; count: string }>(`
      SELECT COALESCE(kuliah_kerja, 'Unknown') as kuliah_kerja, COUNT(*) as count
      FROM cnx_jemaat_clean
      GROUP BY kuliah_kerja
      ORDER BY count DESC
    `);

    const total = result.rows.reduce((sum, r) => sum + parseInt(r.count, 10), 0);

    return result.rows.map((r) => ({
      label: r.kuliah_kerja,
      value: parseInt(r.count, 10),
      percentage: total > 0 ? Math.round((parseInt(r.count, 10) / total) * 100 * 10) / 10 : 0,
    }));
  },

  async getBirthdayMembers(month: number): Promise<BirthdayMember[]> {
    const result = await query<{
      no_jemaat: number;
      nama_jemaat: string;
      tanggal_lahir: string;
    }>(`
      SELECT no_jemaat, nama_jemaat, tanggal_lahir
      FROM cnx_jemaat_clean
      WHERE EXTRACT(MONTH FROM tanggal_lahir::date) = $1
      ORDER BY EXTRACT(DAY FROM tanggal_lahir::date) ASC
    `, [month]);

    const currentYear = new Date().getFullYear();

    return result.rows.map((r) => {
      const birthDate = new Date(r.tanggal_lahir);
      const upcomingBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
      if (upcomingBirthday < new Date()) {
        upcomingBirthday.setFullYear(currentYear + 1);
      }
      const ageTurning = upcomingBirthday.getFullYear() - birthDate.getFullYear();

      return {
        no_jemaat: r.no_jemaat,
        nama_jemaat: r.nama_jemaat,
        tanggal_lahir: r.tanggal_lahir,
        upcoming_birthday: upcomingBirthday.toISOString().split('T')[0],
        age_turning: ageTurning,
      };
    });
  },

  async getStatusDistribution(): Promise<StatusDistributionItem[]> {
    const result = await query<{ status_aktif: string; count: string }>(`
      SELECT status_aktif, COUNT(*) as count
      FROM cnx_jemaat_clean
      GROUP BY status_aktif
      ORDER BY count DESC
    `);

    return result.rows.map((r) => ({
      status_aktif: r.status_aktif,
      count: parseInt(r.count, 10),
    }));
  },

  async getMinistryParticipation(): Promise<MinistryParticipationItem[]> {
    const roles = [
      'is_wl', 'is_singer', 'is_pianis', 'is_saxophone', 'is_filler',
      'is_bass_gitar', 'is_drum', 'is_mulmed', 'is_sound', 'is_caringteam',
      'is_connexion_crew', 'is_supporting_crew', 'is_cforce', 'is_cg_leader', 'is_community_pic',
      'is_others'
    ];

    const caseClauses = roles.map((role) => `COUNT(*) FILTER (WHERE ${role}) as ${role}`);
    const result = await query<Record<string, string>>(`
      SELECT ${caseClauses.join(', ')}
      FROM pelayan
    `);

    const row = result.rows[0];
    return roles.map((role) => ({
      role: role.replace('is_', '').replace(/_/g, ' '),
      count: parseInt(row[role] || '0', 10),
    })).filter((r) => r.count > 0).sort((a, b) => b.count - a.count);
  },

  async getAtRiskMembers(): Promise<AtRiskMember[]> {
    const result = await query<{
      no_jemaat: number;
      nama_jemaat: string;
      last_attendance: string | null;
      days_since_attendance: number;
      current_status: string;
    }>(`
      SELECT
        m.no_jemaat,
        m.nama_jemaat,
        MAX(a.tanggal)::text as last_attendance,
        COALESCE(EXTRACT(DAY FROM CURRENT_DATE - MAX(a.tanggal::date)), 9999) as days_since_attendance,
        COALESCE(
          (SELECT status FROM cnx_jemaat_status_history
           WHERE no_jemaat = m.no_jemaat
           ORDER BY changed_at DESC LIMIT 1),
          'Unknown'
        ) as current_status
      FROM cnx_jemaat_clean m
      LEFT JOIN cgf_attendance a ON m.no_jemaat = a.no_jemaat AND a.keterangan = 'hadir'
      GROUP BY m.no_jemaat, m.nama_jemaat
      HAVING MAX(a.tanggal) IS NULL OR MAX(a.tanggal::date) < CURRENT_DATE - INTERVAL '30 days'
      ORDER BY days_since_attendance DESC
      LIMIT 50
    `);

    return result.rows.map((r) => ({
      no_jemaat: r.no_jemaat,
      nama_jemaat: r.nama_jemaat,
      last_attendance: r.last_attendance,
      days_since_attendance: parseInt(String(r.days_since_attendance), 10),
      current_status: r.current_status,
    }));
  },

  async getUpcomingEvents(limit: number = 10): Promise<UpcomingEvent[]> {
    const result = await query<UpcomingEvent>(`
      SELECT event_id, event_name, event_date, category, location
      FROM event_history
      WHERE event_date >= CURRENT_DATE
      ORDER BY event_date ASC
      LIMIT $1
    `, [limit]);

    return result.rows;
  },

  async getEventAttendanceTrends(): Promise<Record<string, unknown>[]> {
    const result = await query<{
      month: string;
      category: string;
      count: string;
    }>(`
      SELECT
        TO_CHAR(eh.event_date, 'Mon YYYY') as month,
        eh.category,
        COUNT(ep.id) as count
      FROM event_history eh
      LEFT JOIN event_participation ep ON eh.event_id = ep.event_id
      WHERE eh.event_date >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY month, eh.category
      ORDER BY MIN(eh.event_date) ASC, eh.category
    `);

    const trendMap = new Map<string, Record<string, unknown>>();
    
    result.rows.forEach((r) => {
      const month = r.month;
      const category = r.category;
      const count = parseInt(r.count, 10);
      
      if (!trendMap.has(month)) {
        trendMap.set(month, {
          month,
          Camp: 0,
          Retreat: 0,
          Quarterly: 0,
          Monthly: 0,
          Special: 0,
          Workshop: 0,
        });
      }
      
      const monthData = trendMap.get(month)!;
      monthData[category] = count;
    });

    return Array.from(trendMap.values());
  },

  async getCGHealthData(): Promise<CGHealthItem[]> {
    const result = await query<{
      nama_cgf: string;
      total_members: string;
      attendance_rate: string;
      last_activity: string | null;
    }>(`
      SELECT
        ci.nama_cgf,
        COALESCE(
          (SELECT COUNT(*) FROM cgf_members WHERE nama_cgf = ci.nama_cgf),
          0
        ) as total_members,
        COALESCE(
          (SELECT ROUND(
            COUNT(*) FILTER (WHERE a.keterangan = 'hadir') * 100.0 / NULLIF(COUNT(*), 0), 1
          )
          FROM cgf_attendance a
          WHERE a.cg_id = ci.id
            AND a.tanggal >= CURRENT_DATE - INTERVAL '3 months'),
          0
        ) as attendance_rate,
        (SELECT MAX(tanggal) FROM cgf_attendance WHERE cg_id = ci.id)::text as last_activity
      FROM cgf_info ci
      ORDER BY ci.nama_cgf ASC
    `);

    return result.rows.map((r) => ({
      nama_cgf: r.nama_cgf,
      total_members: parseInt(r.total_members, 10),
      attendance_rate: parseFloat(String(r.attendance_rate)),
      last_activity: r.last_activity,
    }));
  },
};
