/**
 * SCH Campus AI — API Client
 * Base URL은 개발 환경에서 로컬 Django 서버를 가리킵니다.
 * 실기기 테스트 시 Mac의 실제 IP로 변경하세요 (예: http://192.168.x.x:8001)
 */

// Expo Go + 시뮬레이터는 localhost로 Mac에 접근 가능
export const API_BASE_URL = 'http://127.0.0.1:8001';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number | null;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    // options.headers를 먼저, Content-Type을 나중에 → 항상 application/json 보장
    const { headers: extraHeaders, ...restOptions } = options;
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...restOptions,
      headers: {
        ...(extraHeaders as Record<string, string>),
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errMsg = data?.detail ?? data?.non_field_errors?.[0] ?? `HTTP ${res.status}`;
      return { data: null, error: errMsg, status: res.status };
    }

    return { data, error: null, status: res.status };
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류';
    return { data: null, error: message, status: null };
  }
}

// ── Public helpers ────────────────────────────────────────────────────────────

export const api = {
  get:    <T>(path: string, token?: string) =>
    request<T>(path, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  post:   <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  patch:  <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  delete: <T>(path: string, token?: string) =>
    request<T>(path, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
};

// ── Ping ──────────────────────────────────────────────────────────────────────

export interface PingResponse {
  status: string;
  message: string;
  server: string;
  version: string;
}

export const ping = () => api.get<PingResponse>('/api/ping/');

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthTokenResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    student_id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    department: string;
    year: number;
    gpa: string;
    ai_tone: string;
    initials: string;
  };
}

export const authApi = {
  login: (studentId: string, password: string) =>
    api.post<AuthTokenResponse>('/api/auth/token/', {
      student_id: studentId,
      password,
    }),

  register: (payload: {
    name: string;
    student_id: string;
    department: string;
    email: string;
    password: string;
  }) => api.post('/api/auth/register/', payload),

  me: (token: string) => api.get('/api/auth/me/', token),
};
