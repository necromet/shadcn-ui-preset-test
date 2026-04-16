/**
 * Members API Service Layer
 * Provides CRUD operations for member management
 * Connects frontend to backend: /api/v1/members
 */

const API_BASE = import.meta.env.VITE_API_URL;

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Generic fetch wrapper with error handling
 */
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
    
    // Handle 204 No Content (used for DELETE)
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error?.message || `HTTP ${response.status}`,
        response.status,
        data.error?.details || null
      );
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
 * GET /members - Fetch all members with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 20)
 * @param {string} params.jenis_kelamin - Filter by gender
 * @param {string} params.kategori_domisili - Filter by domicile category
 * @param {string} params.nama_cgf - Filter by CGF name
 * @param {string} params.kuliah_kerja - Filter by Kuliah/Kerja
 * @param {number} params.bulan_lahir - Filter by birth month
 * @returns {Promise<{data: Array, meta: Object}>}
 */
export async function getMembers(params = {}) {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return apiRequest(`/members${query ? `?${query}` : ''}`);
}

/**
 * GET /members/:no_jemaat - Fetch single member by ID
 * @param {number} noJemaat - Member ID (no_jemaat)
 * @returns {Promise<{data: Object}|null>}
 */
export async function getMemberById(noJemaat) {
  const response = await apiRequest(`/members/${noJemaat}`);
  return response?.data ?? null;
}

/**
 * POST /members - Create a new member
 * @param {Object} memberData - Member data to create
 * @param {string} memberData.nama_jemaat - Member name (required, min 2 chars)
 * @param {string} memberData.jenis_kelamin - Gender: 'Laki-laki' or 'Perempuan' (required)
 * @param {string} memberData.tanggal_lahir - Birth date in YYYY-MM-DD format (required)
 * @param {number} [memberData.tahun_lahir] - Birth year
 * @param {number} [memberData.bulan_lahir] - Birth month (1-12)
 * @param {string} [memberData.kuliah_kerja] - Kuliah or Kerja
 * @param {string} [memberData.no_handphone] - Phone number
 * @param {string} [memberData.ketertarikan_cgf] - CGF interest status
 * @param {string} [memberData.nama_cgf] - CGF name
 * @param {string} [memberData.kategori_domisili] - Domicile category
 * @param {string} [memberData.alamat_domisili] - Domicile address
 * @param {string} [memberData.status_aktif] - Active status
 * @param {string} [memberData.status_keterangan] - Status note
 * @returns {Promise<{data: Object}>}
 */
export async function createMember(memberData) {
  // Auto-calculate tahun_lahir and bulan_lahir if not provided
  const data = { ...memberData };
  
  if (data.tanggal_lahir && !data.tahun_lahir) {
    data.tahun_lahir = Number(data.tanggal_lahir.slice(0, 4));
  }
  if (data.tanggal_lahir && !data.bulan_lahir) {
    data.bulan_lahir = Number(data.tanggal_lahir.slice(5, 7));
  }

  return apiRequest('/members', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PATCH /members/:no_jemaat - Partially update a member
 * @param {number} noJemaat - Member ID
 * @param {Object} memberData - Partial member data to update
 * @returns {Promise<{data: Object}>}
 */
export async function updateMember(noJemaat, memberData) {
  const data = { ...memberData };
  
  // Auto-calculate tahun_lahir and bulan_lahir from tanggal_lahir if changed
  if (data.tanggal_lahir) {
    if (!data.tahun_lahir) {
      data.tahun_lahir = Number(data.tanggal_lahir.slice(0, 4));
    }
    if (!data.bulan_lahir) {
      data.bulan_lahir = Number(data.tanggal_lahir.slice(5, 7));
    }
  }

  return apiRequest(`/members/${noJemaat}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * PUT /members/:no_jemaat - Fully update a member
 * @param {number} noJemaat - Member ID
 * @param {Object} memberData - Complete member data
 * @returns {Promise<{data: Object}>}
 */
export async function replaceMember(noJemaat, memberData) {
  const data = { ...memberData };
  
  if (data.tanggal_lahir) {
    data.tahun_lahir = Number(data.tanggal_lahir.slice(0, 4));
    data.bulan_lahir = Number(data.tanggal_lahir.slice(5, 7));
  }

  return apiRequest(`/members/${noJemaat}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE /members/:no_jemaat - Delete a member
 * @param {number} noJemaat - Member ID
 * @returns {Promise<void>}
 */
export async function deleteMember(noJemaat) {
  return apiRequest(`/members/${noJemaat}`, {
    method: 'DELETE',
  });
}

/**
 * GET /members/search - Search members by name, phone, or address
 * @param {string} query - Search query
 * @returns {Promise<Array>}
 */
export async function searchMembers(query) {
  const response = await apiRequest(`/members/search?q=${encodeURIComponent(query)}`);
  return response?.data ?? [];
}

// Export all functions
export default {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  replaceMember,
  deleteMember,
  searchMembers,
  ApiError,
};
