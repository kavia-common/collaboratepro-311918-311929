import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createTaskForProject, listTasksForProject } from '../api/resources';
import { InlineError, Loading } from '../components/common';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['todo', 'in_progress', 'done'];

// PUBLIC_INTERFACE
export default function TasksPage() {
  /** List/create tasks for a given project. */
  const { projectId } = useParams();
  const { token } = useAuth();

  const [items, setItems] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const statusOptions = useMemo(() => STATUS_OPTIONS, []);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const resp = await listTasksForProject(token, projectId);
      const list = resp?.tasks || resp?.data || resp || [];
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
  }, [token, projectId]);

  async function onCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setCreating(true);
    setError(null);
    try {
      await createTaskForProject(token, projectId, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
      });
      setTitle('');
      setDescription('');
      setStatus('todo');
      await load();
    } catch (e2) {
      setError(e2);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div style={{ padding: 16, textAlign: 'left' }}>
      <h2 style={{ marginTop: 0 }}>Tasks</h2>
      <div style={{ marginBottom: 12, color: 'var(--text-primary)' }}>
        Project: <code>{projectId}</code>
      </div>

      <InlineError error={error} />

      <form onSubmit={onCreate} style={{ display: 'grid', gap: 10, marginBottom: 16, maxWidth: 720 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
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
        <label style={{ display: 'grid', gap: 6, maxWidth: 240 }}>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={creating} style={{ padding: 10 }}>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

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
            {creating ? 'Creating…' : 'Create Task'}
          </button>
        </div>
      </form>

      {loading ? (
        <Loading label="Loading tasks…" />
      ) : items.length === 0 ? (
        <div>No tasks yet. Create one above.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', padding: '8px 6px' }}>
                Title
              </th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', padding: '8px 6px' }}>
                Status
              </th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', padding: '8px 6px' }}>
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => {
              const id = t.id || t.taskId || t._id || `${t.title}-${t.status}`;
              return (
                <tr key={id}>
                  <td style={{ borderBottom: '1px solid var(--border-color)', padding: '8px 6px' }}>
                    {t.title || t.name || 'Untitled'}
                  </td>
                  <td style={{ borderBottom: '1px solid var(--border-color)', padding: '8px 6px' }}>
                    {t.status || 'unknown'}
                  </td>
                  <td style={{ borderBottom: '1px solid var(--border-color)', padding: '8px 6px' }}>
                    {t.description || ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
