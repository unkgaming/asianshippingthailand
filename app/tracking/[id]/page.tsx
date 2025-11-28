'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface TrackingEvent {
  date: string;
  time: string;
  location: string;
  status: string;
  description: string;
}

interface ShipmentData {
  id: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  currentStatus: string;
  service: string;
  weight: string;
  events: TrackingEvent[];
}

export default function TrackingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const trackingId = params?.id ? String(params.id) : "";
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        // Fetch shipment by tracking code
        const shipmentRes = await fetch(`/api/shipments`);
        const shipmentData = await shipmentRes.json();
        
        if (!shipmentData?.ok || !shipmentData.data) {
          setShipment(null);
          setLoading(false);
          return;
        }

        // Find shipment with matching tracking code
        const foundShipment = shipmentData.data.find((s: any) => s.code === trackingId);
        
        if (!foundShipment) {
          setShipment(null);
          setLoading(false);
          return;
        }

        // Fetch tracking updates
        const trackingRes = await fetch(`/api/tracking?shipmentId=${foundShipment.id}`);
        const trackingUpdates = await trackingRes.json();

        // Convert to expected format
        const events: TrackingEvent[] = trackingUpdates.map((update: any) => {
          const date = new Date(update.createdAt);
          return {
            date: date.toISOString().split('T')[0],
            time: date.toTimeString().split(' ')[0].substring(0, 5),
            location: update.location || 'Unknown',
            status: update.status,
            description: update.description || update.status
          };
        }).reverse(); // Reverse to show oldest first

        const shipmentInfo: ShipmentData = {
          id: foundShipment.code,
          origin: foundShipment.origin,
          destination: foundShipment.destination,
          estimatedDelivery: foundShipment.estimatedDelivery 
            ? new Date(foundShipment.estimatedDelivery).toISOString().split('T')[0]
            : 'TBD',
          currentStatus: foundShipment.status,
          service: foundShipment.serviceType,
          weight: `${foundShipment.weight} kg`,
          events: events
        };

        setShipment(shipmentInfo);
      } catch (error) {
        console.error('Error fetching tracking data:', error);
        setShipment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [trackingId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in transit':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'departed':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'arrived':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'picked up':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-red-600 text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tracking Not Found</h2>
          <p className="text-gray-600 mb-6">
            No shipment found with tracking ID: <strong>{trackingId}</strong>
          </p>
          <Link
            href="/"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/" className="text-red-600 hover:text-red-700 font-medium mb-4 inline-flex items-center">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">Shipment Tracking</h1>
          <p className="text-gray-600">Tracking ID: <span className="font-mono font-semibold">{shipment.id}</span></p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(shipment.currentStatus)}`}>
                {shipment.currentStatus}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Service Type</p>
              <p className="font-semibold text-gray-800">{shipment.service}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Weight</p>
              <p className="font-semibold text-gray-800">{shipment.weight}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Est. Delivery</p>
              <p className="font-semibold text-gray-800">{new Date(shipment.estimatedDelivery).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Origin</p>
              <p className="font-semibold text-gray-800 flex items-center">
                <span className="text-2xl mr-2">📍</span>
                {shipment.origin}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Destination</p>
              <p className="font-semibold text-gray-800 flex items-center">
                <span className="text-2xl mr-2">🎯</span>
                {shipment.destination}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Shipment Timeline</h2>

          <div className="space-y-6">
            {shipment.events.map((event, index) => (
              <motion.div
                key={index}
                className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-0 last:pb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 ${
                  index === 0 ? 'bg-red-600 border-red-600' : 'bg-white border-gray-300'
                }`}></div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {event.date} at {event.time}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-800 mb-1">{event.location}</p>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="mt-6 flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button className="bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition shadow">
            Download PDF Report
          </button>
          <Link
            href="/contact"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition shadow"
          >
            Contact Support
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
