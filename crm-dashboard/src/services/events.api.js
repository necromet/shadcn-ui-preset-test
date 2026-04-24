/**
 * Events API Service Layer
 * Provides CRUD operations for events and event participation management
 * Connects frontend to backend: /api/v1/events
 */

const API_BASE = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      const message = data.error?.message || data.error?.code || `HTTP ${response.status}`;
      const details = data.error?.details || null;
      throw new ApiError(message, response.status, details);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network error', 0);
  }
}

// ─── Events CRUD ──────────────────────────────────────────────────

/**
 * GET /events - Fetch all events with optional filters
 */
export async function fetchEvents(filters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', filters.page);
  if (filters.limit) params.set('limit', filters.limit);
  if (filters.category) params.set('category', filters.category);
  if (filters.start_date) params.set('start_date', filters.start_date);
  if (filters.end_date) params.set('end_date', filters.end_date);

  const query = params.toString();
  return apiRequest(`/events${query ? `?${query}` : ''}`);
}

/**
 * GET /events/:eventId - Fetch single event by ID
 */
export async function fetchEventById(eventId) {
  const response = await apiRequest(`/events/${eventId}`);
  return response?.data ?? null;
}

/**
 * POST /events - Create a new event
 */
export async function createEvent(data) {
  return apiRequest('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT /events/:eventId - Update an existing event
 */
export async function updateEvent(eventId, data) {
  return apiRequest(`/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE /events/:eventId - Delete an event
 */
export async function deleteEvent(eventId) {
  return apiRequest(`/events/${eventId}`, {
    method: 'DELETE',
  });
}

// ─── Event Participation ──────────────────────────────────────────

/**
 * GET /events/:eventId/participants - Fetch all participants of an event
 */
export async function fetchEventParticipants(eventId) {
  const response = await apiRequest(`/events/${eventId}/participants`);
  return response?.data ?? [];
}

/**
 * POST /events/:eventId/participants - Register a member to an event
 */
export async function addEventParticipant(eventId, data) {
  return apiRequest(`/events/${eventId}/participants`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT /events/:eventId/participants/:id - Update participant role
 */
export async function updateEventParticipant(eventId, participantId, data) {
  return apiRequest(`/events/${eventId}/participants/${participantId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE /events/:eventId/participants/:id - Remove participant from event
 */
export async function removeEventParticipant(eventId, participantId) {
  return apiRequest(`/events/${eventId}/participants/${participantId}`, {
    method: 'DELETE',
  });
}

// ─── Member Events ────────────────────────────────────────────────

/**
 * GET /members/:no_jemaat/events - Fetch all events a member participated in
 */
export async function fetchMemberEvents(no_jemaat) {
  const response = await apiRequest(`/members/${no_jemaat}/events`);
  return response?.data ?? [];
}
