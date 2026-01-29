import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InlineError } from '../components/common';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function AuthPage() {
  /** Login/register screen. */
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'register') {
        await register({ name, email, password });
        // After register, prompt user to login (some backends auto-login; ours doesn't)
        setMode('login');
      } else {
        await login({ email, password });
        navigate('/organizations');
      }
    } catch (err) {
      setError(err?.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 16, textAlign: 'left' }}>
      <h2 style={{ marginTop: 0 }}>{mode === 'login' ? 'Login' : 'Register'}</h2>

      <p style={{ color: 'var(--text-primary)' }}>
        API Base URL: <code>{process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'}</code>
      </p>

      <InlineError error={error} />

      <form onSubmit={onSubmit}>
        {mode === 'register' && (
          <label style={{ display: 'block', marginBottom: 12 }}>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: 10, marginTop: 6 }}
              placeholder="Your name"
              required
              disabled={loading}
            />
          </label>
        )}

        <label style={{ display: 'block', marginBottom: 12 }}>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 10, marginTop: 6 }}
            placeholder="you@example.com"
            type="email"
            required
            disabled={loading}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 10, marginTop: 6 }}
            type="password"
            required
            disabled={loading}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid var(--border-color)',
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
        </button>

        <button
          type="button"
          onClick={() => setMode((m) => (m === 'login' ? 'register' : 'login'))}
          disabled={loading}
          style={{
            marginLeft: 10,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid var(--border-color)',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
        </button>
      </form>
    </div>
  );
}
