# Frontend Integration Guide

How to connect a frontend application to the CRM Dashboard backend API.

## API Base URL Configuration

All API requests are served under the `/api/v1` prefix.

| Environment | Base URL |
|-------------|----------|
| Development | `http://localhost:3000/api/v1` |
| Production  | `https://api.your-domain.com/api/v1` |

Create an API client configuration:

```typescript
// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const api = {
  baseUrl: API_BASE_URL,
};
```

## Frontend Environment Variables

Create a `.env` file in the frontend project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=10000
```

## Authentication Setup

The API uses JWT Bearer tokens. Include the token in the `Authorization` header.

### Login Flow

```typescript
// src/lib/auth.ts

interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: { id: number; name: string };
  };
}

async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

// Store the token
function storeToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

// Retrieve the token
function getToken(): string | null {
  return localStorage.getItem('auth_token');
}
```

### Authenticated Requests (fetch)

```typescript
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Token expired or invalid — redirect to login
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return res.json();
}
```

## Example API Calls

### Using fetch

```typescript
// Get all members (paginated)
const members = await fetchWithAuth('/members?page=1&limit=20');

// Get a single member
const member = await fetchWithAuth('/members/1');

// Create a member
const newMember = await fetchWithAuth('/members', {
  method: 'POST',
  body: JSON.stringify({
    nama_jemaat: 'Jane Doe',
    jenis_kelamin: 'Perempuan',
    tanggal_lahir: '1995-03-15',
  }),
});

// Update a member
const updated = await fetchWithAuth('/members/1', {
  method: 'PUT',
  body: JSON.stringify({ nama_jemaat: 'Jane Smith' }),
});

// Delete a member
await fetchWithAuth('/members/1', { method: 'DELETE' });
```

### Using axios

```bash
npm install axios
```

```typescript
// src/lib/axios.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
```

```typescript
// Usage
import apiClient from './axios';

// GET members
const { data } = await apiClient.get('/members', { params: { page: 1, limit: 20 } });

// POST member
await apiClient.post('/members', { nama_jemaat: 'Jane Doe', jenis_kelamin: 'Perempuan' });

// GET analytics
const dashboard = await apiClient.get('/analytics/dashboard');
```

### Paginated Requests

All list endpoints return paginated responses:

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

```typescript
async function getMembers(page = 1, limit = 20, filters?: Record<string, string>) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => params.append(key, value));
  }
  return fetchWithAuth(`/members?${params.toString()}`);
}
```

## CORS Configuration

The backend allows requests from:

| Origin | Environment |
|--------|-------------|
| `http://localhost:5173` | Vite dev server |
| `http://localhost:3000` | Production / alternate dev |

Allowed methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`

Allowed headers: `Content-Type`, `Authorization`

Credentials (cookies) are enabled.

To add a new origin, update `corsOptions` in `src/middleware/index.ts`:

```typescript
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
```

## Migrating from Mock Data to API

If your frontend currently uses hardcoded mock data, follow these steps:

### 1. Create an API Service Layer

```typescript
// src/services/members.ts
import { fetchWithAuth } from '../lib/auth';

export async function getMembers(page = 1, limit = 20) {
  const response = await fetchWithAuth(`/members?page=${page}&limit=${limit}`);
  if (!response.success) throw new Error('Failed to fetch members');
  return response.data;
}

export async function getMember(no_jemaat: number) {
  const response = await fetchWithAuth(`/members/${no_jemaat}`);
  if (!response.success) throw new Error('Failed to fetch member');
  return response.data;
}
```

### 2. Replace Mock Imports

```typescript
// Before
// import { mockMembers } from '../data/mock';

// After
import { getMembers } from '../services/members';

function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMembers(1, 20)
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return <MembersTable data={members} />;
}
```

### 3. Handle Loading and Error States

Wrap API calls with proper state management:

```typescript
function useApi<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetcher()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Usage
const { data: members, loading, error } = useApi(() => getMembers(1, 20));
```

### 4. Migrate One Module at a Time

Suggested order:
1. **Members** — core entity, most endpoints
2. **CGF Groups** — depends on members
3. **Attendance** — depends on groups and members
4. **Events** — independent module
5. **Analytics** — aggregate data, can be done last
