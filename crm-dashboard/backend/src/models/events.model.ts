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
}

export interface EventParticipationCreateData {
  event_id: number;
  no_jemaat: number;
  role: 'Peserta' | 'Panitia' | 'Volunteer';
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
      data: dataResult.rows,
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
    return result.rows[0] || null;
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
    return result.rows[0];
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
    return result.rows[0] || null;
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
      `SELECT * FROM event_participation
       WHERE event_id = $1
       ORDER BY role ASC, no_jemaat ASC`,
      [eventId],
    );
    return result.rows;
  },

  async addParticipant(data: EventParticipationCreateData): Promise<EventParticipation> {
    const result = await query<EventParticipation>(
      `INSERT INTO event_participation (event_id, no_jemaat, role)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.event_id, data.no_jemaat, data.role],
    );
    return result.rows[0];
  },

  async updateParticipant(id: number, data: EventParticipationUpdateData): Promise<EventParticipation | null> {
    const columns = Object.keys(data);
    if (columns.length === 0) {
      const result = await query<EventParticipation>(
        'SELECT * FROM event_participation WHERE id = $1',
        [id],
      );
      return result.rows[0] || null;
    }

    const values = Object.values(data);
    const setClauses = columns.map((col, i) => `${col} = $${i + 1}`);

    const result = await query<EventParticipation>(
      `UPDATE event_participation SET ${setClauses.join(', ')} WHERE id = $${columns.length + 1} RETURNING *`,
      [...values, id],
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
    return result.rows;
  },
};
