'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TrackingPage() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    // Navigate to tracking detail page
    router.push(`/tracking/${trackingId.trim()}`);
  };

  const sampleIds = ['TRK123456789', 'AIR987654321', 'SEA456789123'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Track Your Shipment
          </h1>
          <p className="text-xl text-gray-600">
            Enter your tracking number to see real-time shipment status
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleTrack} className="space-y-6">
            <div>
              <label htmlFor="tracking-id" className="block text-lg font-medium text-gray-700 mb-3">
                Tracking Number
              </label>
              <input
                id="tracking-id"
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                placeholder="Enter your tracking ID (e.g., TRK123456789)"
              />
              {error && (
                <p className="mt-2 text-red-600 text-sm">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-red-700 transition shadow-lg hover:shadow-xl"
            >
              Track Shipment
            </button>
          </form>

          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-600 mb-3">Try sample tracking numbers:</p>
            <div className="flex flex-wrap gap-2">
              {sampleIds.map(id => (
                <button
                  key={id}
                  onClick={() => setTrackingId(id)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-mono transition"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="font-semibold text-gray-800 mb-2">Global Coverage</h3>
            <p className="text-sm text-gray-600">Track shipments worldwide in real-time</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-800 mb-2">Mobile Friendly</h3>
            <p className="text-sm text-gray-600">Track on any device, anywhere</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-3">🔔</div>
            <h3 className="font-semibold text-gray-800 mb-2">Live Updates</h3>
            <p className="text-sm text-gray-600">Get notified of status changes</p>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-600 mb-4">
            Need help tracking your shipment?
          </p>
          <Link
            href="/contact"
            className="inline-block text-red-600 hover:text-red-700 font-semibold"
          >
            Contact Support →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
