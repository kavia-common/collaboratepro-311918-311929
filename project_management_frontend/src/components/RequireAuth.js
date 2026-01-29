import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loading } from './common';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function RequireAuth({ children }) {
  /** Protects routes by requiring a token + loaded user. */
  const { token, user, bootLoading } = useAuth();
  const location = useLocation();

  if (bootLoading) return <Loading label="Loading session…" />;
  if (!token || !user) return <Navigate to="/auth" replace state={{ from: location }} />;

  return children;
}
