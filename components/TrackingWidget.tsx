'use client';
import { useState } from 'react';

export default function TrackingWidget() {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  async function track() {
    if (!q) {
      setRes({ error: 'Please enter a tracking number' });
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(`/api/track?number=${encodeURIComponent(q)}`);
      const data = await r.json();
      setRes(data);
    } catch (e) {
      setRes({ error: 'Network error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-soft">
      <h3 className="text-lg font-semibold">Track your shipment</h3>
      <div className="mt-4 flex gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Enter tracking number, order or phone"
          className="flex-1 border rounded p-3"
        />
        <button onClick={track} className="bg-accent text-white px-4 py-2 rounded">
          {loading ? 'Checking...' : 'Track'}
        </button>
      </div>

      {res && (
        <div className="mt-4 text-sm">
          {res.error ? (
            <div className="text-red-600">{res.error}</div>
          ) : (
            <div>
              <div className="font-medium">#{res.number} — {res.status}</div>
              <div className="text-xs text-gray-500 mt-1">ETA: {res.eta}</div>
              <ol className="mt-2 pl-4 list-decimal text-gray-700">
                {res.events?.map((ev: any, i: number) => (
                  <li key={i} className="mt-1">
                    <div className="text-xs text-gray-500">{ev.time} — {ev.location}</div>
                    <div>{ev.desc}</div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
