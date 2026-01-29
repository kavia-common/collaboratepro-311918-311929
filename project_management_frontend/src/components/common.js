import React from 'react';

// PUBLIC_INTERFACE
export function InlineError({ error }) {
  /** Renders an error message inline. */
  if (!error) return null;
  const msg = typeof error === 'string' ? error : error?.message;
  if (!msg) return null;

  return (
    <div
      role="alert"
      style={{
        margin: '12px 0',
        padding: '10px 12px',
        border: '1px solid #ef4444',
        borderRadius: 8,
        color: '#991b1b',
        background: '#fef2f2',
        textAlign: 'left',
      }}
    >
      {msg}
    </div>
  );
}

// PUBLIC_INTERFACE
export function Loading({ label = 'Loading…' }) {
  /** Renders a basic loading indicator. */
  return (
    <div style={{ padding: 12, textAlign: 'left' }} aria-busy="true">
      {label}
    </div>
  );
}
