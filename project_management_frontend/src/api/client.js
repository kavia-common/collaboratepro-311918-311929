/**
 * Minimal API client for the Express backend.
 * - Configurable base URL via REACT_APP_API_BASE_URL (defaults to http://localhost:3001)
 * - Automatically attaches Bearer token (if provided)
 * - Provides consistent error handling with readable messages
 */

const DEFAULT_BASE_URL = 'http://localhost:3001';

function getApiBaseUrl() {
  // CRA only exposes env vars prefixed with REACT_APP_
  return (process.env.REACT_APP_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');
}

// PUBLIC_INTERFACE
export class ApiError extends Error {
  /** Error thrown for non-2xx API responses. */
  constructor(message, { status, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function parseJsonSafely(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = 'GET', token, body, query, headers } = {}) {
  /** Perform an API request against the backend. */
  const baseUrl = getApiBaseUrl();
  const url = new URL(`${baseUrl}${path.startsWith('/') ? path : `/${path}`}`);

  if (query && typeof query === 'object') {
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      url.searchParams.set(k, String(v));
    });
  }

  const reqHeaders = {
    Accept: 'application/json',
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(headers || {}),
  };

  if (token) {
    reqHeaders.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url.toString(), {
      method,
      headers: reqHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new ApiError('Network error: unable to reach API server.', {
      status: 0,
      details: err?.message,
    });
  }

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      `Request failed with status ${response.status} ${response.statusText}`;
    throw new ApiError(msg, { status: response.status, details: data });
  }

  return data;
}
