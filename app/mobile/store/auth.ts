/**
 * Auth Store — JWT 토큰 + 유저 정보 관리
 * expo-secure-store로 토큰을 기기에 안전하게 저장합니다.
 * 앱 재시작 시 저장된 토큰을 복원해 자동 로그인을 지원합니다.
 */
import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/lib/api/client';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  department: string;
  department_display: string;
  gpa: string;
  ai_tone: 'formal' | 'casual';
  initials: string;
  is_email_verified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;       // 초기 토큰 복원 중
  isAuthenticated: boolean;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

interface RegisterResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

// ── Secure store keys ─────────────────────────────────────────────────────────

const KEYS = {
  ACCESS:  'sch_access_token',
  REFRESH: 'sch_refresh_token',
  USER:    'sch_user',
} as const;

// ── Module-level singleton ────────────────────────────────────────────────────

let _state: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
};

const _listeners = new Set<() => void>();

function setState(partial: Partial<AuthState>) {
  _state = { ..._state, ...partial };
  _listeners.forEach((fn) => fn());
}

// ── Persistence helpers ───────────────────────────────────────────────────────

async function saveTokens(access: string, refresh: string, user: AuthUser) {
  await Promise.all([
    SecureStore.setItemAsync(KEYS.ACCESS,  access),
    SecureStore.setItemAsync(KEYS.REFRESH, refresh),
    SecureStore.setItemAsync(KEYS.USER,    JSON.stringify(user)),
  ]);
}

async function clearTokens() {
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.ACCESS),
    SecureStore.deleteItemAsync(KEYS.REFRESH),
    SecureStore.deleteItemAsync(KEYS.USER),
  ]);
}

// ── Bootstrap — 앱 시작 시 저장된 토큰 복원 ──────────────────────────────────

let _bootstrapped = false;

async function bootstrap() {
  if (_bootstrapped) return;
  _bootstrapped = true;

  try {
    const [access, refresh, userJson] = await Promise.all([
      SecureStore.getItemAsync(KEYS.ACCESS),
      SecureStore.getItemAsync(KEYS.REFRESH),
      SecureStore.getItemAsync(KEYS.USER),
    ]);

    if (access && refresh && userJson) {
      const user: AuthUser = JSON.parse(userJson);
      setState({
        accessToken: access,
        refreshToken: refresh,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState({ isLoading: false });
    }
  } catch {
    setState({ isLoading: false });
  }
}

// 앱 시작 시 즉시 실행
bootstrap();

// ── Auth actions ──────────────────────────────────────────────────────────────

export async function login(username: string, password: string): Promise<LoginResult> {
  const { data, error } = await api.post<{
    access: string;
    refresh: string;
    user: AuthUser;
  }>('/api/v1/auth/token/', { username, password });

  if (!data) {
    return { success: false, error: error ?? '로그인에 실패했습니다.' };
  }

  await saveTokens(data.access, data.refresh, data.user);
  setState({
    accessToken: data.access,
    refreshToken: data.refresh,
    user: data.user,
    isAuthenticated: true,
  });

  return { success: true };
}

export async function register(payload: {
  name: string;
  username: string;
  department: string;
  email: string;
  password: string;
}): Promise<RegisterResult> {
  const { data, error, status } = await api.post<AuthUser>(
    '/api/v1/auth/register/',
    payload,
  );

  if (!data) {
    // DRF 필드 에러 파싱
    if (status === 400 && error) {
      try {
        const parsed = JSON.parse(error);
        if (typeof parsed === 'object') {
          return { success: false, fieldErrors: parsed };
        }
      } catch {}
    }
    return { success: false, error: error ?? '회원가입에 실패했습니다.' };
  }

  return { success: true };
}

export async function logout() {
  await clearTokens();
  setState({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  });
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuthStore() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const handler = () => forceUpdate((n) => n + 1);
    _listeners.add(handler);
    return () => { _listeners.delete(handler); };
  }, []);

  return {
    ..._state,
    login,
    register,
    logout,
  };
}
