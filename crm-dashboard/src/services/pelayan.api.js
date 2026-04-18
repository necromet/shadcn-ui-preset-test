/**
 * Pelayan API Service Layer
 * Provides CRUD operations for ministry/pelayan management
 * Connects frontend to backend: /api/v1/ministry/pelayan
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

// --- Pelayan CRUD (backward compatible) ---

/**
 * GET /ministry/pelayan - Fetch all pelayan with pagination
 */
export async function getPelayanList(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return apiRequest(`/ministry/pelayan${query ? `?${query}` : ''}`);
}

/**
 * GET /ministry/pelayan/:no_jemaat - Fetch single pelayan by no_jemaat
 */
export async function getPelayanById(noJemaat) {
  const response = await apiRequest(`/ministry/pelayan/${noJemaat}`);
  return response?.data ?? null;
}

const PELAYAN_FIELDS = [
  'no_jemaat', 'nama_jemaat',
  'is_wl', 'is_singer', 'is_pianis', 'is_saxophone', 'is_filler',
  'is_bass_gitar', 'is_drum', 'is_mulmed', 'is_sound', 'is_caringteam',
  'is_connexion_crew', 'is_supporting_crew', 'is_cforce', 'is_cg_leader', 'is_community_pic',
  'is_others'
];

function pickPelayanFields(obj) {
  const result = {};
  for (const key of PELAYAN_FIELDS) {
    if (key in obj && obj[key] !== undefined && obj[key] !== null) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * POST /ministry/pelayan - Create a new pelayan (dual-writes to junction table)
 */
export async function createPelayan(pelayanData, allMembers = []) {
  let data = pickPelayanFields(pelayanData);
  data.no_jemaat = Number(data.no_jemaat);

  if (!data.nama_jemaat && data.no_jemaat && allMembers.length > 0) {
    const member = allMembers.find(m => m.no_jemaat === data.no_jemaat);
    if (member) {
      data.nama_jemaat = member.nama_jemaat;
    }
  }

  return apiRequest('/ministry/pelayan', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT /ministry/pelayan/:no_jemaat - Update a pelayan (dual-writes to junction table)
 */
export async function updatePelayan(noJemaat, pelayanData, allMembers = []) {
  let data = pickPelayanFields(pelayanData);
  data.no_jemaat = Number(noJemaat);

  if (!data.nama_jemaat || data.nama_jemaat.trim() === '') {
    if (allMembers.length > 0) {
      const member = allMembers.find(m => m.no_jemaat === data.no_jemaat);
      if (member) {
        data.nama_jemaat = member.nama_jemaat;
      }
    } else {
      const pelayanResponse = await getPelayanById(noJemaat);
      if (pelayanResponse) {
        data.nama_jemaat = pelayanResponse.nama_jemaat;
      }
    }
  }

  return apiRequest(`/ministry/pelayan/${noJemaat}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * PATCH /ministry/pelayan/:no_jemaat - Partially update a pelayan
 */
export async function patchPelayan(noJemaat, pelayanData) {
  const data = pickPelayanFields(pelayanData);

  return apiRequest(`/ministry/pelayan/${noJemaat}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE /ministry/pelayan/:no_jemaat - Delete a pelayan
 */
export async function deletePelayan(noJemaat) {
  return apiRequest(`/ministry/pelayan/${noJemaat}`, {
    method: 'DELETE',
  });
}

// --- Junction Table Endpoints ---

/**
 * GET /ministry/pelayan/:no_jemaat/pelayanan - Get all pelayanan for a pelayan
 * Returns full list of ministry types with is_active status
 */
export async function getPelayananForPelayan(noJemaat) {
  const response = await apiRequest(`/ministry/pelayan/${noJemaat}/pelayanan`);
  return response?.data ?? [];
}

/**
 * POST /ministry/pelayan/:no_jemaat/pelayanan - Assign pelayanan to pelayan
 * @param {number} noJemaat - Member ID
 * @param {string} pelayananId - Pelayanan ID to assign
 */
export async function assignPelayanan(noJemaat, pelayananId) {
  const response = await apiRequest(`/ministry/pelayan/${noJemaat}/pelayanan`, {
    method: 'POST',
    body: JSON.stringify({ pelayanan_id: pelayananId }),
  });
  return response?.data ?? null;
}

/**
 * DELETE /ministry/pelayan/:no_jemaat/pelayanan/:pelayananId - Remove pelayanan from pelayan
 */
export async function removePelayanan(noJemaat, pelayananId) {
  return apiRequest(`/ministry/pelayan/${noJemaat}/pelayanan/${pelayananId}`, {
    method: 'DELETE',
  });
}

/**
 * PATCH /ministry/pelayan/:no_jemaat/pelayanan - Bulk update pelayanan assignments
 * @param {number} noJemaat - Member ID
 * @param {string[]} assign - Array of pelayanan IDs to assign
 * @param {string[]} remove - Array of pelayanan IDs to remove
 */
export async function bulkUpdatePelayanan(noJemaat, { assign = [], remove: removeIds = [] } = {}) {
  const response = await apiRequest(`/ministry/pelayan/${noJemaat}/pelayanan`, {
    method: 'PATCH',
    body: JSON.stringify({ assign, remove: removeIds }),
  });
  return response?.data ?? null;
}

/**
 * GET /ministry/pelayanan/stats - Get pelayanan assignment counts
 */
export async function getPelayananStats() {
  const response = await apiRequest('/ministry/pelayanan/stats');
  return response?.data ?? [];
}

/**
 * GET /ministry/pelayanan/:pelayananId/pelayan - Get all pelayan for a pelayanan
 */
export async function getPelayanForPelayanan(pelayananId, params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  const response = await apiRequest(`/ministry/pelayanan/${pelayananId}/pelayan${query ? `?${query}` : ''}`);
  return response?.data ?? { data: [], meta: {} };
}

export default {
  // CRUD
  getPelayanList,
  getPelayanById,
  createPelayan,
  updatePelayan,
  patchPelayan,
  deletePelayan,
  // Junction table
  getPelayananForPelayan,
  assignPelayanan,
  removePelayanan,
  bulkUpdatePelayanan,
  getPelayananStats,
  getPelayanForPelayanan,
  ApiError,
};
