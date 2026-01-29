import React, { useEffect, useState } from 'react';
import { listActivityLogs } from '../api/resources';
import { InlineError, Loading } from '../components/common';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function ActivityLogsPage() {
  /** Display recent activity logs. */
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const resp = await listActivityLogs(token);
      const list = resp?.activityLogs || resp?.logs || resp?.data || resp || [];
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

  return (
    <div style={{ padding: 16, textAlign: 'left' }}>
      <h2 style={{ marginTop: 0 }}>Activity Logs</h2>
      <InlineError error={error} />

      {loading ? (
        <Loading label="Loading activity logs…" />
      ) : items.length === 0 ? (
        <div>No activity yet.</div>
      ) : (
        <ul style={{ paddingLeft: 18 }}>
          {items.map((log, idx) => {
            const id = log.id || log._id || `${idx}-${log.action || 'log'}`;
            const action = log.action || log.type || 'activity';
            const message = log.message || log.description || '';
            const createdAt = log.createdAt || log.timestamp || log.created_at;

            return (
              <li key={id} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 600 }}>{action}</div>
                {message ? <div style={{ opacity: 0.9 }}>{message}</div> : null}
                {createdAt ? (
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    {new Date(createdAt).toLocaleString()}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
