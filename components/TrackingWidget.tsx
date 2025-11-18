'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackingWidget() {
  const router = useRouter();
  const [q, setQ] = useState('');

  function track() {
    if (!q.trim()) {
      alert('Please enter a tracking number');
      return;
    }
    // Redirect to tracking page
    router.push(`/tracking/${q.trim()}`);
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-soft">
      <h3 className="text-lg font-semibold">Track your shipment</h3>
      <div className="mt-4 flex gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && track()}
          placeholder="Enter tracking number (e.g., TRK-2025-001)"
          className="flex-1 border rounded p-3"
        />
        <button onClick={track} className="bg-accent text-white px-4 py-2 rounded hover:bg-red-700 transition">
          Track
        </button>
      </div>
    </div>
  );
}
