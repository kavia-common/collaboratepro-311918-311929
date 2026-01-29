import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createOrganization, listOrganizations } from '../api/resources';
import { InlineError, Loading } from '../components/common';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function OrganizationsPage() {
  /** List/create organizations. */
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const resp = await listOrganizations(token);
      const list = resp?.organizations || resp?.data || resp || [];
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function onCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await createOrganization(token, { name: name.trim() });
      setName('');
      await load();
    } catch (e2) {
      setError(e2);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div style={{ padding: 16, textAlign: 'left' }}>
      <h2 style={{ marginTop: 0 }}>Organizations</h2>

      <InlineError error={error} />

      <form onSubmit={onCreate} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New organization name"
          disabled={creating}
          style={{ flex: 1, padding: 10 }}
        />
        <button
          type="submit"
          disabled={creating}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid var(--border-color)',
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
            cursor: 'pointer',
          }}
        >
          {creating ? 'Creating…' : 'Create'}
        </button>
      </form>

      {loading ? (
        <Loading label="Loading organizations…" />
      ) : items.length === 0 ? (
        <div>No organizations yet. Create one above.</div>
      ) : (
        <ul style={{ paddingLeft: 18 }}>
          {items.map((org) => {
            const id = org.id || org.orgId || org._id;
            const label = org.name || `Organization ${id}`;
            return (
              <li key={id || label} style={{ marginBottom: 8 }}>
                <Link to={`/organizations/${encodeURIComponent(id)}/projects`}>{label}</Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
