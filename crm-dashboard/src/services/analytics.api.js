const API_BASE = import.meta.env.VITE_API_URL;

async function apiRequest(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url);
  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.error?.message || `API request failed: ${endpoint}`);
  }

  return json.data;
}

export async function getAgeDistribution() {
  return apiRequest('/analytics/members/distribution?type=age');
}

export async function getDomisiliDistribution() {
  return apiRequest('/analytics/members/distribution?type=domisili');
}

export async function getCGFSizes() {
  return apiRequest('/analytics/cgf/sizes');
}

export async function getAttendanceTrend() {
  const startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
  const endDate = new Date().toISOString().split('T')[0];
  return apiRequest(`/analytics/members/trends?start_date=${startDate}&end_date=${endDate}`);
}

export async function getCGFInterestFunnel() {
  return apiRequest('/analytics/members/distribution?type=funnel');
}

export async function getKuliahKerjaRatio() {
  return apiRequest('/analytics/members/distribution?type=kuliah_kerja');
}
