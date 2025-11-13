import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <html>
      <body>
        <div style={{ padding: 48, fontFamily: 'inter, system-ui, sans-serif', textAlign: 'center' }}>
          <h1 style={{ fontSize: 48, color: '#111827' }}>404</h1>
          <p style={{ fontSize: 18, color: '#6b7280', marginTop: 8 }}>Page not found</p>
          <div style={{ marginTop: 20 }}>
            <Link href="/" style={{ color: '#ff6b00', fontWeight: 600 }}>Go back home</Link>
          </div>
        </div>
      </body>
    </html>
  );
}
