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

/**
 * GET /ministry/pelayan - Fetch all pelayan with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 1000)
 * @returns {Promise<{data: Array, meta: Object}>}
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
 * @param {number} noJemaat - Member ID
 * @returns {Promise<Object|null>}
 */
export async function getPelayanById(noJemaat) {
  const response = await apiRequest(`/ministry/pelayan/${noJemaat}`);
  return response?.data ?? null;
}

/**
 * POST /ministry/pelayan - Create a new pelayan
 * @param {Object} pelayanData - Pelayan data to create
 * @param {number} pelayanData.no_jemaat - Member ID (required)
 * @param {string} pelayanData.nama_jemaat - Member name (required)
 * @param {boolean} pelayanData.is_wl - Worship Leader
 * @param {boolean} pelayanData.is_singer - Singer
 * @param {boolean} pelayanData.is_pianis - Pianist
 * @param {boolean} pelayanData.is_saxophone - Saxophone
 * @param {boolean} pelayanData.is_filler - Filler Musician
 * @param {boolean} pelayanData.is_bass_gitar - Bass Guitarist
 * @param {boolean} pelayanData.is_drum - Drummer
 * @param {boolean} pelayanData.is_mulmed - Multimedia
 * @param {boolean} pelayanData.is_sound - Sound Engineer
 * @param {boolean} pelayanData.is_caringteam - Caring Team
 * @param {boolean} pelayanData.is_connexion_crew - Connexion Crew
 * @param {boolean} pelayanData.is_supporting_crew - Supporting Crew
 * @param {boolean} pelayanData.is_cforce - CForce
 * @param {boolean} pelayanData.is_cg_leader - CG Leader
 * @param {boolean} pelayanData.is_community_pic - Community PIC
 * @param {boolean} pelayanData.is_others - Others
 * @param {Array} allMembers - All members array to lookup nama_jemaat
 * @returns {Promise<{data: Object}>}
 */
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

export async function createPelayan(pelayanData, allMembers = []) {
  let data = pickPelayanFields(pelayanData);
  data.no_jemaat = Number(data.no_jemaat);

  if (!data.nama_jemaat && data.no_jemaat && allMembers.length > 0) {
    const member = allMembers.find(m => m.no_jemaat === data.no_jemaat);
    if (member) {
      data.nama_jemaat = member.nama_jemaat;
    }
  }

  console.log('createPelayan - sending data:', data);
  return apiRequest('/ministry/pelayan', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePelayan(noJemaat, pelayanData, allMembers = []) {
  let data = pickPelayanFields(pelayanData);
  data.no_jemaat = Number(noJemaat);

  // Ensure nama_jemaat is always present for PUT validation
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

  console.log('updatePelayan - sending data:', data);
  return apiRequest(`/ministry/pelayan/${noJemaat}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * PATCH /ministry/pelayan/:no_jemaat - Partially update a pelayan
 * @param {number} noJemaat - Member ID
 * @param {Object} pelayanData - Partial pelayan data
 * @returns {Promise<{data: Object}>}
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
 * @param {number} noJemaat - Member ID
 * @returns {Promise<void>}
 */
export async function deletePelayan(noJemaat) {
  return apiRequest(`/ministry/pelayan/${noJemaat}`, {
    method: 'DELETE',
  });
}

export default {
  getPelayanList,
  getPelayanById,
  createPelayan,
  updatePelayan,
  patchPelayan,
  deletePelayan,
  ApiError,
};
