"use client";

import React from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Unhandled error:", error);

  return (
    <html>
      <body>
        <div style={{ padding: 40, fontFamily: 'inter, system-ui, sans-serif' }}>
          <h1 style={{ fontSize: 28, color: '#b91c1c' }}>Something went wrong</h1>
          <p style={{ marginTop: 12, color: '#374151' }}>{error?.message ?? 'An unexpected error occurred.'}</p>
          <div style={{ marginTop: 18 }}>
            <button
              onClick={() => reset?.()}
              style={{ background: '#ff6b00', color: 'white', padding: '8px 14px', borderRadius: 8, border: 'none' }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
