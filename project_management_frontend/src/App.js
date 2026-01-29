import React, { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

import { useAuth } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';

import AuthPage from './pages/AuthPage';
import OrganizationsPage from './pages/OrganizationsPage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import ActivityLogsPage from './pages/ActivityLogsPage';

function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to="/organizations">Organizations</Link>
        <Link to="/activity">Activity</Link>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ fontSize: 14, opacity: 0.85 }}>
              {user.name || user.email || 'Signed in'}
            </span>
            <button
              onClick={() => {
                logout();
                navigate('/auth');
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth">Login</Link>
        )}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Main application component with basic routing + theme toggle. */
  const [theme, setTheme] = useState('light');
  const { token } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>

      <TopNav />

      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Navigate to={token ? '/organizations' : '/auth'} replace />} />
          <Route path="/auth" element={<AuthPage />} />

          <Route
            path="/organizations"
            element={
              <RequireAuth>
                <OrganizationsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/organizations/:orgId/projects"
            element={
              <RequireAuth>
                <ProjectsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/projects/:projectId/tasks"
            element={
              <RequireAuth>
                <TasksPage />
              </RequireAuth>
            }
          />
          <Route
            path="/activity"
            element={
              <RequireAuth>
                <ActivityLogsPage />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
