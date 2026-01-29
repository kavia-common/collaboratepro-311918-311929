import { apiRequest } from './client';

const TOKEN_STORAGE_KEY = 'pm_token';

// PUBLIC_INTERFACE
export function getStoredToken() {
  /** Returns the persisted auth token from localStorage (or null). */
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function setStoredToken(token) {
  /** Persists the auth token to localStorage. */
  try {
    if (!token) localStorage.removeItem(TOKEN_STORAGE_KEY);
    else localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // Ignore storage errors (private mode, blocked storage, etc.)
  }
}

// PUBLIC_INTERFACE
export async function register({ name, email, password }) {
  /** Register a user. */
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });
}

// PUBLIC_INTERFACE
export async function login({ email, password }) {
  /** Login and get token. Backend returns placeholder token format. */
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

// PUBLIC_INTERFACE
export async function getMe(token) {
  /** Fetch current user (requires Bearer token). */
  return apiRequest('/api/auth/me', { token });
}
