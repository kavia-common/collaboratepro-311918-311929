import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createProjectForOrg, listProjectsForOrg } from '../api/resources';
import { InlineError, Loading } from '../components/common';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function ProjectsPage() {
  /** List/create projects for a given organization. */
  const { orgId } = useParams();
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const resp = await listProjectsForOrg(token, orgId);
      const list = resp?.projects || resp?.data || resp || [];
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
  }, [token, orgId]);

  async function onCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await createProjectForOrg(token, orgId, { name: name.trim(), description: description.trim() || undefined });
      setName('');
      setDescription('');
      await load();
    } catch (e2) {
      setError(e2);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div style={{ padding: 16, textAlign: 'left' }}>
      <h2 style={{ marginTop: 0 }}>Projects</h2>
      <div style={{ marginBottom: 12, color: 'var(--text-primary)' }}>
        Organization: <code>{orgId}</code>
      </div>

      <InlineError error={error} />

      <form onSubmit={onCreate} style={{ display: 'grid', gap: 10, marginBottom: 16, maxWidth: 720 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          disabled={creating}
          style={{ padding: 10 }}
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          disabled={creating}
          style={{ padding: 10 }}
        />
        <div>
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
            {creating ? 'Creating…' : 'Create Project'}
          </button>
        </div>
      </form>

      {loading ? (
        <Loading label="Loading projects…" />
      ) : items.length === 0 ? (
        <div>No projects yet. Create one above.</div>
      ) : (
        <ul style={{ paddingLeft: 18 }}>
          {items.map((p) => {
            const id = p.id || p.projectId || p._id;
            const label = p.name || `Project ${id}`;
            return (
              <li key={id || label} style={{ marginBottom: 8 }}>
                <Link to={`/projects/${encodeURIComponent(id)}/tasks`}>{label}</Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
