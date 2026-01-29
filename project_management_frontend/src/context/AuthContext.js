import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, login as apiLogin, register as apiRegister, getStoredToken, setStoredToken } from '../api/auth';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides auth state/actions (token, user, login, register, logout). */
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [bootLoading, setBootLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const refreshMe = useCallback(
    async (tkn) => {
      const effectiveToken = tkn || token;
      if (!effectiveToken) {
        setUser(null);
        return null;
      }
      const me = await getMe(effectiveToken);
      // backend may return { user: ... } or just user; handle both
      const resolvedUser = me?.user || me;
      setUser(resolvedUser);
      return resolvedUser;
    },
    [token]
  );

  const login = useCallback(async ({ email, password }) => {
    setError(null);
    const resp = await apiLogin({ email, password });
    const newToken = resp?.token;
    if (!newToken) throw new Error('Login succeeded but no token was returned.');
    setStoredToken(newToken);
    setToken(newToken);
    await refreshMe(newToken);
    return resp;
  }, [refreshMe]);

  const register = useCallback(async ({ name, email, password }) => {
    setError(null);
    return apiRegister({ name, email, password });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!token) {
        setBootLoading(false);
        return;
      }
      setBootLoading(true);
      try {
        await refreshMe(token);
      } catch (e) {
        if (!cancelled) {
          // Token could be invalid/expired. Clear it to force re-login.
          logout();
          setError(e?.message || 'Failed to load current user.');
        }
      } finally {
        if (!cancelled) setBootLoading(false);
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [token, refreshMe, logout]);

  const value = useMemo(
    () => ({
      token,
      user,
      bootLoading,
      error,
      setError,
      login,
      register,
      logout,
      refreshMe,
    }),
    [token, user, bootLoading, error, login, register, logout, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider.');
  return ctx;
}
