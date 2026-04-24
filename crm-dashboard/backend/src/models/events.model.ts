import { query } from '../config/database';

export interface Event {
  event_id: number;
  event_name: string;
  event_date: string;
  category: 'Camp' | 'Retreat' | 'Quarterly' | 'Monthly' | 'Special' | 'Workshop';
  location: string | null;
  description: string | null;
  gcal_event_id: string | null;
  gcal_link: string | null;
  last_synced_at: string | null;
}

export interface EventCreateData {
  event_name: string;
  event_date: string;
  category: 'Camp' | 'Retreat' | 'Quarterly' | 'Monthly' | 'Special' | 'Workshop';
  location?: string;
  description?: string;
  gcal_event_id?: string | null;
  gcal_link?: string | null;
  last_synced_at?: string | null;
}

export interface EventUpdateData {
  event_name?: string;
  event_date?: string;
  category?: 'Camp' | 'Retreat' | 'Quarterly' | 'Monthly' | 'Special' | 'Workshop';
  location?: string;
  description?: string;
  gcal_event_id?: string | null;
  gcal_link?: string | null;
  last_synced_at?: string | null;
}

export interface EventFilters {
  category?: 'Camp' | 'Retreat' | 'Quarterly' | 'Monthly' | 'Special' | 'Workshop';
  start_date?: string;
  end_date?: string;
}

export interface EventParticipation {
  id: number;
  event_id: number;
  no_jemaat: number;
  role: 'Peserta' | 'Panitia' | 'Volunteer';
  registered_at: string;
  nama_jemaat: string | null;
  nama_cgf: string | null;
}

export interface EventParticipationCreateData {
  event_id: number;
  no_jemaat: number;
  role: 'Peserta' | 'Panitia' | 'Volunteer';
  registered_at?: string;
}

export interface EventParticipationUpdateData {
  role?: 'Peserta' | 'Panitia' | 'Volunteer';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const EventsModel = {
  normalizeEventDate<T extends { event_date: string | Date }>(row: T): T & { event_date: string } {
    const d = new Date(row.event_date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate() + 1).padStart(2, '0');
    return { ...row, event_date: `${year}-${month}-${day}` };
  },

  async getAll(page: number = 1, limit: number = 20, filters: EventFilters = {}): Promise<PaginatedResult<Event>> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (filters.category) {
      conditions.push(`category = $${paramIndex++}`);
      params.push(filters.category);
    }
    if (filters.start_date) {
      conditions.push(`event_date >= $${paramIndex++}`);
      params.push(filters.start_date);
    }
    if (filters.end_date) {
      conditions.push(`event_date <= $${paramIndex++}`);
      params.push(filters.end_date);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM event_history ${whereClause}`,
      params,
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await query<Event>(
      `SELECT * FROM event_history ${whereClause} ORDER BY event_date DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...params, limit, offset],
    );

    return {
      data: dataResult.rows.map(r => this.normalizeEventDate(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getById(eventId: number): Promise<Event | null> {
    const result = await query<Event>(
      'SELECT * FROM event_history WHERE event_id = $1',
      [eventId],
    );
    const row = result.rows[0];
    return row ? this.normalizeEventDate(row) : null;
  },

  async create(data: EventCreateData): Promise<Event> {
    const result = await query<Event>(
      `INSERT INTO event_history (event_name, event_date, category, location, description, gcal_event_id, gcal_link, last_synced_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.event_name,
        data.event_date,
        data.category,
        data.location || null,
        data.description || null,
        data.gcal_event_id || null,
        data.gcal_link || null,
        data.last_synced_at || null,
      ],
    );
    return this.normalizeEventDate(result.rows[0]);
  },

  async update(eventId: number, data: EventUpdateData): Promise<Event | null> {
    const columns = Object.keys(data);
    if (columns.length === 0) {
      return this.getById(eventId);
    }

    const values = Object.values(data);
    const setClauses = columns.map((col, i) => `${col} = $${i + 1}`);

    const result = await query<Event>(
      `UPDATE event_history SET ${setClauses.join(', ')} WHERE event_id = $${columns.length + 1} RETURNING *`,
      [...values, eventId],
    );
    const row = result.rows[0];
    return row ? this.normalizeEventDate(row) : null;
  },

  async delete(eventId: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM event_history WHERE event_id = $1',
      [eventId],
    );
    return (result.rowCount ?? 0) > 0;
  },

  async getParticipants(eventId: number): Promise<EventParticipation[]> {
    const result = await query<EventParticipation>(
      `SELECT ep.id, ep.event_id, ep.no_jemaat, ep.role,
              to_char(ep.registered_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') AS registered_at,
              j.nama_jemaat, j.nama_cgf
       FROM event_participation ep
       LEFT JOIN cnx_jemaat_clean j ON ep.no_jemaat = j.no_jemaat
       WHERE ep.event_id = $1
       ORDER BY ep.role ASC, ep.no_jemaat ASC`,
      [eventId],
    );
    return result.rows;
  },

  async addParticipant(data: EventParticipationCreateData): Promise<EventParticipation> {
    const registeredAt = data.registered_at || null;
    const result = await query<EventParticipation>(
      registeredAt
        ? `INSERT INTO event_participation (event_id, no_jemaat, role, registered_at)
           VALUES ($1, $2, $3, $4)
           RETURNING *`
        : `INSERT INTO event_participation (event_id, no_jemaat, role)
           VALUES ($1, $2, $3)
           RETURNING *`,
      registeredAt
        ? [data.event_id, data.no_jemaat, data.role, registeredAt]
        : [data.event_id, data.no_jemaat, data.role],
    );
    const inserted = result.rows[0];
    const enriched = await query<EventParticipation>(
      `SELECT ep.id, ep.event_id, ep.no_jemaat, ep.role,
              to_char(ep.registered_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') AS registered_at,
              j.nama_jemaat, j.nama_cgf
       FROM event_participation ep
       LEFT JOIN cnx_jemaat_clean j ON ep.no_jemaat = j.no_jemaat
       WHERE ep.id = $1`,
      [inserted.id],
    );
    return enriched.rows[0];
  },

  async addParticipantsBulk(eventId: number, participants: { no_jemaat: number; role: string; registered_at?: string }[]): Promise<EventParticipation[]> {
    if (participants.length === 0) return [];

    const values: (string | number)[] = [];
    const placeholders: string[] = [];

    participants.forEach((p, i) => {
      const offset = i * 4;
      placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`);
      values.push(eventId, p.no_jemaat, p.role, p.registered_at || new Date().toISOString().replace('T', ' ').slice(0, 19));
    });

    await query(
      `INSERT INTO event_participation (event_id, no_jemaat, role, registered_at)
       VALUES ${placeholders.join(', ')}`,
      values,
    );

    const result = await query<EventParticipation>(
      `SELECT ep.id, ep.event_id, ep.no_jemaat, ep.role,
              to_char(ep.registered_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') AS registered_at,
              j.nama_jemaat, j.nama_cgf
       FROM event_participation ep
       LEFT JOIN cnx_jemaat_clean j ON ep.no_jemaat = j.no_jemaat
       WHERE ep.event_id = $1
       ORDER BY ep.role ASC, ep.no_jemaat ASC`,
      [eventId],
    );

    return result.rows;
  },

  async updateParticipant(id: number, data: EventParticipationUpdateData): Promise<EventParticipation | null> {
    const columns = Object.keys(data);
    if (columns.length === 0) {
      const result = await query<EventParticipation>(
        `SELECT ep.id, ep.event_id, ep.no_jemaat, ep.role,
                to_char(ep.registered_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') AS registered_at,
                j.nama_jemaat, j.nama_cgf
         FROM event_participation ep
         LEFT JOIN cnx_jemaat_clean j ON ep.no_jemaat = j.no_jemaat
         WHERE ep.id = $1`,
        [id],
      );
      return result.rows[0] || null;
    }

    const values = Object.values(data);
    const setClauses = columns.map((col, i) => `${col} = $${i + 1}`);

    await query(
      `UPDATE event_participation SET ${setClauses.join(', ')} WHERE id = $${columns.length + 1}`,
      [...values, id],
    );

    const result = await query<EventParticipation>(
      `SELECT ep.id, ep.event_id, ep.no_jemaat, ep.role,
              to_char(ep.registered_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') AS registered_at,
              j.nama_jemaat, j.nama_cgf
       FROM event_participation ep
       LEFT JOIN cnx_jemaat_clean j ON ep.no_jemaat = j.no_jemaat
       WHERE ep.id = $1`,
      [id],
    );
    return result.rows[0] || null;
  },

  async removeParticipant(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM event_participation WHERE id = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  },

  async getMemberEvents(noJemaat: number): Promise<Event[]> {
    const result = await query<Event>(
      `SELECT eh.* FROM event_history eh
       INNER JOIN event_participation ep ON eh.event_id = ep.event_id
       WHERE ep.no_jemaat = $1
       ORDER BY eh.event_date DESC`,
      [noJemaat],
    );
    return result.rows.map(r => this.normalizeEventDate(r));
  },

  async getParticipantAnalytics(eventId: number): Promise<{
    roles: { role: string; count: number }[];
    age: { label: string; value: number; percentage: number }[];
    gender: { label: string; value: number; percentage: number }[];
    kuliah_kerja: { label: string; value: number; percentage: number }[];
    ketertarikan_cgf: { label: string; value: number; percentage: number }[];
    kategori_domisili: { label: string; value: number; percentage: number }[];
  }> {
    const participants = await query<{
      role: string;
      jenis_kelamin: string | null;
      tanggal_lahir: string | null;
      kuliah_kerja: string | null;
      ketertarikan_cgf: string | null;
      kategori_domisili: string | null;
    }>(
      `SELECT ep.role,
              j.jenis_kelamin,
              j.tanggal_lahir,
              j.kuliah_kerja,
              j.ketertarikan_cgf,
              j.kategori_domisili
       FROM event_participation ep
       LEFT JOIN cnx_jemaat_clean j ON ep.no_jemaat = j.no_jemaat
       WHERE ep.event_id = $1`,
      [eventId],
    );

    const rows = participants.rows;
    const total = rows.length;

    function countBy<T extends string | null>(items: T[], fallback = 'Unknown'): { label: string; value: number; percentage: number }[] {
      const map = new Map<string, number>();
      items.forEach(v => {
        const key = v || fallback;
        map.set(key, (map.get(key) || 0) + 1);
      });
      return Array.from(map.entries())
        .map(([label, value]) => ({
          label,
          value,
          percentage: total > 0 ? Math.round((value / total) * 100 * 10) / 10 : 0,
        }))
        .sort((a, b) => b.value - a.value);
    }

    const roleMap = new Map<string, number>();
    rows.forEach(r => {
      roleMap.set(r.role, (roleMap.get(r.role) || 0) + 1);
    });
    const roles = Array.from(roleMap.entries())
      .map(([role, count]) => ({ role, count }))
      .sort((a, b) => b.count - a.count);

    const ageMap = new Map<string, number>();
    rows.forEach(r => {
      if (!r.tanggal_lahir) {
        ageMap.set('Unknown', (ageMap.get('Unknown') || 0) + 1);
        return;
      }
      const birth = new Date(r.tanggal_lahir);
      const age = new Date().getFullYear() - birth.getFullYear();
      const label = age > 30 ? '30+' : String(age);
      ageMap.set(label, (ageMap.get(label) || 0) + 1);
    });
    const age = Array.from(ageMap.entries())
      .map(([label, value]) => ({
        label,
        value,
        percentage: total > 0 ? Math.round((value / total) * 100 * 10) / 10 : 0,
      }))
      .sort((a, b) => {
        if (a.label === 'Unknown') return 1;
        if (b.label === 'Unknown') return -1;
        return parseInt(a.label) - parseInt(b.label);
      });

    return {
      roles,
      age,
      gender: countBy(rows.map(r => r.jenis_kelamin)),
      kuliah_kerja: countBy(rows.map(r => r.kuliah_kerja)),
      ketertarikan_cgf: countBy(rows.map(r => r.ketertarikan_cgf)),
      kategori_domisili: countBy(rows.map(r => r.kategori_domisili)),
    };
  },
};
