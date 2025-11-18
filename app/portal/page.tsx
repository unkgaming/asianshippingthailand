"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useSession } from 'next-auth/react';
import ErrorBoundary from '../../components/ErrorBoundary';
import { motion } from 'framer-motion';
import QuoteRequestForm from '@/components/QuoteRequestForm';

export default function PortalPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { status } = useSession();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [shipments, setShipments] = useState<any[]>([]);
  const [shipmentsLoading, setShipmentsLoading] = useState(true);
  const [editingShipment, setEditingShipment] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [supportForm, setSupportForm] = useState({
    subject: '',
    priority: 'Normal',
    trackingId: '',
    message: ''
  });
  const [callbackForm, setCallbackForm] = useState({
    phone: '',
    preferredTime: '',
    reason: ''
  });
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [notification, setNotification] = useState<{type: 'success'|'error', message: string} | null>(null);
  const [emailHistory, setEmailHistory] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [trackingSearchId, setTrackingSearchId] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [trackingUpdates, setTrackingUpdates] = useState<any[]>([]);
  
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[Portal] mounted');
    // Load shipments and email history for this customer
    if (user?.email) {
      // Load shipments
      setShipmentsLoading(true);
      fetch(`/api/shipments?customerEmail=${encodeURIComponent(user.email)}`)
        .then(r => r.json())
        .then(res => {
          if (res?.ok && res.data) {
            setShipments(res.data.map((s: any) => ({
              id: s.code, // Display tracking code
              dbId: s.id, // Keep database ID for tracking API
              customerName: s.customerName,
              customerEmail: s.customerEmail,
              origin: s.origin,
              destination: s.destination,
              serviceType: s.serviceType,
              status: s.status,
              paymentStatus: s.paymentStatus,
              price: s.price,
              weight: s.weight,
              packageType: s.packageType,
              containerContents: s.containerContents,
              bookingDate: new Date(s.bookingDate).toISOString().split('T')[0],
              estimatedDelivery: s.estimatedDelivery ? new Date(s.estimatedDelivery).toISOString().split('T')[0] : null,
              documents: s.documents || []
            })));
          }
        })
        .catch(() => {})
        .finally(() => setShipmentsLoading(false));

      // Load email history
      fetch(`/api/emails?limit=50`)
        .then(r => r.json())
        .then(res => {
          if (res?.data) {
            // Filter emails sent to or from this customer
            const customerEmails = res.data.filter((email: any) => 
              email.to?.includes(user.email) || email.from === user.email
            );
            setEmailHistory(customerEmails);
          }
        })
        .catch(() => {});
    }
    return () => {
      // eslint-disable-next-line no-console
      console.log('[Portal] unmounted');
    };
  }, [user]);

  // Redirect to sign-in if not authenticated (NextAuth session bridged via AuthContext)
  useEffect(() => {
    // Only redirect if BOTH loading is complete AND status shows unauthenticated
    if (!isLoading && status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [isLoading, status, router]);

  // Show loading while authentication state is being determined
  // Wait for BOTH isLoading and status to be ready
  if (isLoading || status === 'loading' || (status === 'authenticated' && !user)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!user) {
    return null;
  }

  const handleAddShipment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.get('customerName'),
          customerEmail: formData.get('customerEmail'),
          origin: formData.get('origin'),
          destination: formData.get('destination'),
          serviceType: formData.get('serviceType'),
          paymentStatus: formData.get('paymentStatus'),
          price: formData.get('price'),
          weight: formData.get('weight'),
          packageType: formData.get('packageType'),
          containerContents: formData.get('containerContents'),
          bookingDate: formData.get('bookingDate'),
          estimatedDelivery: formData.get('estimatedDelivery'),
        })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        // Reload shipments
        if (user?.email) {
          const reloadRes = await fetch(`/api/shipments?customerEmail=${encodeURIComponent(user.email)}`);
          const reloadData = await reloadRes.json();
          if (reloadData?.ok && reloadData.data) {
            setShipments(reloadData.data.map((s: any) => ({
              id: s.code,
              customerName: s.customerName,
              customerEmail: s.customerEmail,
              origin: s.origin,
              destination: s.destination,
              serviceType: s.serviceType,
              status: s.status,
              paymentStatus: s.paymentStatus,
              price: s.price,
              weight: s.weight,
              packageType: s.packageType,
              containerContents: s.containerContents,
              bookingDate: new Date(s.bookingDate).toISOString().split('T')[0],
              estimatedDelivery: s.estimatedDelivery ? new Date(s.estimatedDelivery).toISOString().split('T')[0] : null,
              documents: s.documents || []
            })));
          }
        }
        setShowAddForm(false);
        setActiveSection('shipments');
        setNotification({ type: 'success', message: '✅ Shipment created successfully!' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ type: 'error', message: `❌ ${data.error || 'Failed to create shipment'}` });
        setTimeout(() => setNotification(null), 5000);
      }
    } catch (err) {
      setNotification({ type: 'error', message: '❌ Connection error' });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleUpdateShipment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      // Find shipment in DB by code
      const shipment = shipments.find(s => s.id === editingShipment.id);
      if (!shipment) return;
      
      const dbShipment = await fetch(`/api/shipments`).then(r=>r.json()).then(d => d.data?.find((s:any)=>s.code===shipment.id));
      if (!dbShipment) return;

      const res = await fetch('/api/shipments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: dbShipment.id,
          status: formData.get('status'),
          paymentStatus: formData.get('paymentStatus'),
          price: formData.get('price'),
        })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        // Reload
        if (user?.email) {
          const reloadRes = await fetch(`/api/shipments?customerEmail=${encodeURIComponent(user.email)}`);
          const reloadData = await reloadRes.json();
          if (reloadData?.ok && reloadData.data) {
            setShipments(reloadData.data.map((s: any) => ({
              id: s.code,
              customerName: s.customerName,
              customerEmail: s.customerEmail,
              origin: s.origin,
              destination: s.destination,
              serviceType: s.serviceType,
              status: s.status,
              paymentStatus: s.paymentStatus,
              price: s.price,
              weight: s.weight,
              packageType: s.packageType,
              containerContents: s.containerContents,
              bookingDate: new Date(s.bookingDate).toISOString().split('T')[0],
              estimatedDelivery: s.estimatedDelivery ? new Date(s.estimatedDelivery).toISOString().split('T')[0] : null,
              documents: s.documents || []
            })));
          }
        }
        setEditingShipment(null);
        setNotification({ type: 'success', message: '✅ Shipment updated!' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ type: 'error', message: `❌ ${data.error || 'Failed to update'}` });
        setTimeout(() => setNotification(null), 5000);
      }
    } catch (err) {
      setNotification({ type: 'error', message: '❌ Connection error' });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleSendSupportMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyTo: user.email, // Reply goes to customer
          to: 'support@asianshippingthai.com', // This will use MAIL_TO from env
          subject: `[${supportForm.priority}] ${supportForm.subject}${supportForm.trackingId ? ` - ${supportForm.trackingId}` : ''}`,
          text: `From: ${user.name} (${user.email})\nPriority: ${supportForm.priority}\n${supportForm.trackingId ? `Tracking ID: ${supportForm.trackingId}\n` : ''}\n\nMessage:\n${supportForm.message}`
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setNotification({ type: 'success', message: '✅ Message sent successfully! Our team will respond within 24 hours.' });
        setSupportForm({ subject: '', priority: 'Normal', trackingId: '', message: '' });
        // Reload email history
        fetch(`/api/emails?limit=50`)
          .then(r => r.json())
          .then(res => {
            if (res?.data) {
              const customerEmails = res.data.filter((email: any) => 
                email.to?.includes(user.email) || email.from === user.email
              );
              setEmailHistory(customerEmails);
            }
          });
      } else {
        setNotification({ type: 'error', message: '❌ Failed to send message. Please try again or call us.' });
      }
      
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      setNotification({ type: 'error', message: '❌ Connection error. Please try again later.' });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleRequestCallback = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyTo: user.email, // Reply goes to customer
          to: 'support@asianshippingthai.com',
          subject: `[URGENT] Callback Request from ${user.name}`,
          text: `CALLBACK REQUEST\n\nCustomer: ${user.name}\nEmail: ${user.email}\nPhone: ${callbackForm.phone}\nPreferred Time: ${callbackForm.preferredTime}\nReason: ${callbackForm.reason}\n\nPlease call this customer as soon as possible.`
        })
      });

      if (response.ok) {
        setNotification({ type: 'success', message: '✅ Callback request submitted! We\'ll call you within 2 hours.' });
        setCallbackForm({ phone: '', preferredTime: '', reason: '' });
        setShowCallbackModal(false);
      } else {
        setNotification({ type: 'error', message: '❌ Failed to submit request. Please try again.' });
      }
      
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      setNotification({ type: 'error', message: '❌ Connection error. Please try again later.' });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleTrackShipment = async () => {
    if (!trackingSearchId.trim()) {
      setNotification({ type: 'error', message: '❌ Please enter a tracking ID' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      console.log('[Tracking] Searching for:', trackingSearchId);
      console.log('[Tracking] Available shipments:', shipments.map(s => ({ code: s.id, dbId: s.dbId })));
      
      // Find shipment by tracking code (case-insensitive)
      const shipment = shipments.find(s => 
        s.id && s.id.toLowerCase() === trackingSearchId.trim().toLowerCase()
      );
      
      if (!shipment) {
        setNotification({ type: 'error', message: `❌ Tracking ID "${trackingSearchId}" not found in your shipments` });
        setTimeout(() => setNotification(null), 3000);
        setTrackingResult(null);
        setTrackingUpdates([]);
        return;
      }

      console.log('[Tracking] Found shipment:', shipment);
      setTrackingResult(shipment);

      // Load tracking updates using the shipment's database ID
      if (shipment.dbId) {
        console.log('[Tracking] Loading updates for shipment dbId:', shipment.dbId);
        const res = await fetch(`/api/tracking?shipmentId=${shipment.dbId}`);
        const updates = await res.json();
        console.log('[Tracking] Updates received:', updates);
        setTrackingUpdates(updates);
        
        setNotification({ type: 'success', message: '✅ Shipment found!' });
      } else {
        console.error('[Tracking] No dbId found for shipment');
        setNotification({ type: 'error', message: '❌ Failed to load tracking info' });
      }
      
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error tracking shipment:', error);
      setNotification({ type: 'error', message: '❌ Failed to load tracking info' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl p-4">
        {/* Logo */}
        <div className="mb-6 pb-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-red-500">asianshippingthai</h1>
          <p className="text-xs text-gray-400">Customer Portal</p>
        </div>

        {/* User Info */}
        <div className="mb-6 pb-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full ring-2 ring-red-500" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-3 w-full text-sm text-gray-300 hover:text-white font-medium py-2 px-3 rounded bg-gray-800 hover:bg-gray-700 transition"
          >
            Sign Out
          </button>
        </div>
        
        <nav className="space-y-2">
          <button
            className={`flex items-center px-3 py-2 rounded-md w-full text-left transition ${
              activeSection === 'dashboard'
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveSection('dashboard')}
          >
            <span className="mr-3 text-lg">�</span> Dashboard
          </button>
          <button
            className={`flex items-center px-3 py-2 rounded-md w-full text-left transition ${
              activeSection === 'shipments'
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveSection('shipments')}
          >
            <span className="mr-3 text-lg">📦</span> My Shipments
          </button>
          <button
            className={`flex items-center px-3 py-2 rounded-md w-full text-left transition ${
              activeSection === 'tracking'
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveSection('tracking')}
          >
              <span className="mr-3 text-lg">🔍</span> Track Shipment
          </button>
          <button
            className={`flex items-center px-3 py-2 rounded-md w-full text-left transition ${
              activeSection === 'quote'
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveSection('quote')}
          >
              <span className="mr-3 text-lg">💬</span> Request Quote
          </button>
          <button
            className={`flex items-center px-3 py-2 rounded-md w-full text-left transition ${
              activeSection === 'documents'
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveSection('documents')}
          >
              <span className="mr-3 text-lg">📄</span> My Documents
          </button>
          <button
            className={`flex items-center px-3 py-2 rounded-md w-full text-left transition ${
              activeSection === 'support'
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveSection('support')}
          >
              <span className="mr-3 text-lg">💬</span> Customer Support
          </button>
          <button
            className={`flex items-center px-3 py-2 rounded-md w-full text-left transition ${
              activeSection === 'profile'
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveSection('profile')}
          >
              <span className="mr-3 text-lg">👤</span> My Profile
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Notification Banner */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
              'bg-red-100 border-l-4 border-red-500 text-red-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{notification.message}</span>
              <button 
                onClick={() => setNotification(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}

        {/* Dashboard */}
        {activeSection === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Shipments</p>
                    <p className="text-3xl font-bold text-gray-800">{shipments.length}</p>
                  </div>
                  <div className="text-4xl">📦</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">In Transit</p>
                    <p className="text-3xl font-bold text-orange-500">
                      {shipments.filter(s => s.status === 'In Transit').length}
                    </p>
                  </div>
                  <div className="text-4xl">🚚</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Pending Payment</p>
                    <p className="text-3xl font-bold text-red-500">
                      {shipments.filter(s => s.paymentStatus === 'Pending').length}
                    </p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-500">
                      ${shipments.reduce((sum, s) => sum + s.price, 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-4xl">💵</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <button
                onClick={() => setActiveSection('tracking')}
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:shadow-xl transition text-left"
              >
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-xl font-bold mb-2">Track Shipment</h3>
                <p className="text-blue-100 text-sm">Real-time tracking updates</p>
              </button>
              <button
                onClick={() => setActiveSection('quote')}
                className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-xl transition text-left"
              >
                <div className="text-4xl mb-3">💬</div>
                <h3 className="text-xl font-bold mb-2">Request Quote</h3>
                <p className="text-purple-100 text-sm">Get instant pricing</p>
              </button>
              <button
                onClick={() => setActiveSection('support')}
                className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 hover:shadow-xl transition text-left"
              >
                <div className="text-4xl mb-3">💬</div>
                <h3 className="text-xl font-bold mb-2">Customer Support</h3>
                <p className="text-green-100 text-sm">24/7 assistance available</p>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Shipments */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Recent Shipments</h3>
                  <button
                    onClick={() => setActiveSection('shipments')}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {shipments.slice(0, 4).map((shipment) => (
                    <div key={shipment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                      <div>
                        <p className="font-semibold">{shipment.id}</p>
                        <p className="text-sm text-gray-600">{shipment.origin} → {shipment.destination}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          shipment.status === 'In Transit' ? 'bg-orange-100 text-orange-600' :
                          shipment.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {shipment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications & Updates */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Recent Notifications</h3>
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No notifications at this time</p>
                  <p className="text-xs mt-1">You'll see updates about your shipments here</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Manage Shipments */}
        {activeSection === 'shipments' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800">My Shipments</h2>
              <p className="text-gray-600 mt-2">View and track all your shipments in one place</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shipments.map((shipment) => (
                      <tr key={shipment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{shipment.id}</div>
                          <div className="text-sm text-gray-500">{shipment.bookingDate}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{shipment.customerName}</div>
                          <div className="text-sm text-gray-500">{shipment.customerEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">{shipment.origin}</div>
                          <div className="text-sm text-gray-500">→ {shipment.destination}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{shipment.serviceType}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            shipment.status === 'In Transit' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {shipment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            shipment.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {shipment.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${shipment.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={async () => {
                              setEditingShipment(shipment);
                              // Load tracking updates
                              if (shipment.dbId) {
                                try {
                                  const res = await fetch(`/api/tracking?shipmentId=${shipment.dbId}`);
                                  const updates = await res.json();
                                  setTrackingUpdates(updates);
                                } catch (error) {
                                  console.error('Failed to load tracking:', error);
                                  setTrackingUpdates([]);
                                }
                              }
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Tracking
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tracking Modal */}
            {editingShipment && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold">Shipment Tracking</h3>
                      <p className="text-gray-600 mt-1">{editingShipment.id}</p>
                    </div>
                    <button
                      onClick={() => setEditingShipment(null)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Shipment Info Card */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-6 border border-red-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Current Status</p>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-1 ${
                          editingShipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          editingShipment.status === 'In Transit' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {editingShipment.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-1 ${
                          editingShipment.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {editingShipment.paymentStatus}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Route</p>
                        <p className="font-semibold">{editingShipment.origin} → {editingShipment.destination}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Service Type</p>
                        <p className="font-semibold">{editingShipment.serviceType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Booking Date</p>
                        <p className="font-semibold">{editingShipment.bookingDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-semibold">${editingShipment.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h4 className="text-xl font-bold mb-6">📍 Tracking Timeline</h4>
                    
                    {trackingUpdates.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No tracking updates available yet</p>
                        <p className="text-sm text-gray-400 mt-2">Your shipment tracking will appear here once it's been processed</p>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Vertical timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                        
                        {trackingUpdates.map((update, index) => (
                          <div key={update.id} className="relative pl-12 pb-8 last:pb-0">
                            {/* Timeline dot */}
                            <div className={`absolute left-2 top-0 w-4 h-4 rounded-full border-2 ${
                              update.isActive 
                                ? 'bg-green-500 border-green-600 animate-pulse' 
                                : 'bg-red-500 border-red-600'
                            }`}></div>
                            
                            {/* Update content */}
                            <div className={`bg-white border-2 rounded-lg p-4 shadow-sm ${
                              update.isActive 
                                ? 'border-green-500 shadow-green-100' 
                                : 'border-gray-200'
                            }`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h6 className="font-bold text-lg text-gray-900">{update.status}</h6>
                                    {update.isActive && (
                                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">
                                        CURRENT
                                      </span>
                                    )}
                                  </div>
                                  {update.location && (
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                      <span>📍</span> {update.location}
                                    </p>
                                  )}
                                  {update.description && (
                                    <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                                  )}
                                  <p className="text-xs text-gray-400 mt-2">
                                    {new Date(update.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setEditingShipment(null)}
                    className="mt-6 w-full bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Close
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* Add New Shipment */}
        {activeSection === 'add' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Add New Shipment</h2>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <form onSubmit={handleAddShipment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Customer Information</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Company or Person Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email *</label>
                    <input
                      type="email"
                      name="customerEmail"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>

                  {/* Shipment Details */}
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Shipment Details</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Origin *</label>
                    <input
                      type="text"
                      name="origin"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
                    <input
                      type="text"
                      name="destination"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                    <select
                      name="serviceType"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    >
                      <option value="">Select Service</option>
                      <option>Airfreight</option>
                      <option>Seafreight FCL</option>
                      <option>Seafreight LCL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Package Type *</label>
                    <select
                      name="packageType"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    >
                      <option value="">Select Type</option>
                      <option>Cartons</option>
                      <option>Pallets</option>
                      <option>Crates</option>
                      <option>Drums</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg) *</label>
                    <input
                      type="number"
                      name="weight"
                      step="0.1"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Booking Date *</label>
                    <input
                      type="date"
                      name="bookingDate"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Delivery *</label>
                    <input
                      type="date"
                      name="estimatedDelivery"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status *</label>
                    <select
                      name="paymentStatus"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Container Contents *</label>
                    <textarea
                      name="containerContents"
                      required
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="Describe the contents of the shipment..."
                    ></textarea>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Create Shipment
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('shipments')}
                    className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Track Shipment */}
        {activeSection === 'tracking' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Track Shipment</h2>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Tracking ID</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={trackingSearchId}
                    onChange={(e) => setTrackingSearchId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTrackShipment()}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
                    placeholder="TRK-2025-XXX"
                  />
                  <button 
                    onClick={handleTrackShipment}
                    className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Tracking Results */}
              {!trackingResult ? (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-500">Enter a tracking ID to see shipment details</p>
                </div>
              ) : (
                <div className="mt-8">
                  {/* Shipment Info Card */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-6 border border-red-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Tracking ID</p>
                        <p className="text-xl font-bold text-gray-900">{trackingResult.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Current Status</p>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          trackingResult.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          trackingResult.status === 'In Transit' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {trackingResult.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Route</p>
                        <p className="font-semibold">{trackingResult.origin} → {trackingResult.destination}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Service Type</p>
                        <p className="font-semibold">{trackingResult.serviceType}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-xl font-bold mb-6">📍 Tracking Timeline</h3>
                    
                    {trackingUpdates.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No tracking updates available yet</p>
                    ) : (
                      <div className="relative">
                        {/* Vertical timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                        
                        {trackingUpdates.map((update, index) => (
                          <div key={update.id} className="relative pl-12 pb-8 last:pb-0">
                            {/* Timeline dot */}
                            <div className={`absolute left-2 top-0 w-4 h-4 rounded-full border-2 ${
                              update.isActive 
                                ? 'bg-green-500 border-green-600 animate-pulse' 
                                : 'bg-red-500 border-red-600'
                            }`}></div>
                            
                            {/* Update content */}
                            <div className={`bg-white border-2 rounded-lg p-4 shadow-sm ${
                              update.isActive 
                                ? 'border-green-500 shadow-green-100' 
                                : 'border-gray-200'
                            }`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h6 className="font-bold text-lg text-gray-900">{update.status}</h6>
                                    {update.isActive && (
                                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">
                                        CURRENT
                                      </span>
                                    )}
                                  </div>
                                  {update.location && (
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                      <span>📍</span> {update.location}
                                    </p>
                                  )}
                                  {update.description && (
                                    <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                                  )}
                                  <p className="text-xs text-gray-400 mt-2">
                                    {new Date(update.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Documents */}
        {activeSection === 'documents' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Documents & Files</h2>
            
            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h3 className="text-xl font-semibold mb-4">Upload Documents</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-red-500 transition">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg mb-2">Drag and drop files here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="cursor-pointer bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 inline-block">
                  Browse Files
                  <input type="file" multiple className="hidden" />
                </label>
              </div>
            </div>

            {/* Document List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Document Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Upload Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Size</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      <p>No documents uploaded yet</p>
                      <p className="text-xs mt-1">Upload your shipping documents above</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Request Quote */}
        {activeSection === 'quote' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Request a Quote</h2>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <p className="text-gray-600 mb-6">Fill out the form below to request a shipping quote. Our team will respond within 24 hours.</p>
              <QuoteRequestForm 
                user={user}
                onSuccess={() => setActiveSection('dashboard')}
              />
            </div>
          </motion.div>
        )}

        {/* Customer Support */}
        {activeSection === 'support' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Customer Support</h2>
            
            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-3">📞</div>
                <h3 className="text-xl font-bold mb-2">Request Callback</h3>
                <p className="text-blue-100 mb-3">We'll call you back within 2 hours</p>
                <button 
                  onClick={() => setShowCallbackModal(true)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Request Call
                </button>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-3">📧</div>
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-green-100 mb-3">Response within 2 hours</p>
                <a href="mailto:support@asianshippingthai.com" className="text-lg font-semibold">support@asianshippingthai.com</a>
              </div>
            </div>

            {/* Callback Request Modal */}
            {showCallbackModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                   onClick={() => setShowCallbackModal(false)}>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Request a Callback</h2>
                    <button
                      onClick={() => setShowCallbackModal(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleRequestCallback} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={callbackForm.phone}
                        onChange={(e) => setCallbackForm({...callbackForm, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        placeholder="+66 2 249 3889"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time *</label>
                      <select
                        required
                        value={callbackForm.preferredTime}
                        onChange={(e) => setCallbackForm({...callbackForm, preferredTime: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                      >
                        <option value="">Select time</option>
                        <option>ASAP</option>
                        <option>Morning (9AM - 12PM)</option>
                        <option>Afternoon (12PM - 5PM)</option>
                        <option>Evening (5PM - 8PM)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Call *</label>
                      <textarea
                        required
                        rows={3}
                        value={callbackForm.reason}
                        onChange={(e) => setCallbackForm({...callbackForm, reason: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        placeholder="Brief description of what you need help with..."
                      ></textarea>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Request Callback
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCallbackModal(false)}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form onSubmit={handleSendSupportMessage} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <select 
                      value={supportForm.subject}
                      onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    >
                      <option value="">Select Subject</option>
                      <option>Shipment Inquiry</option>
                      <option>Billing Question</option>
                      <option>Technical Support</option>
                      <option>General Question</option>
                      <option>Complaint</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select 
                      value={supportForm.priority}
                      onChange={(e) => setSupportForm({...supportForm, priority: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    >
                      <option>Normal</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tracking ID (Optional)</label>
                  <input 
                    type="text" 
                    value={supportForm.trackingId}
                    onChange={(e) => setSupportForm({...supportForm, trackingId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3" 
                    placeholder="TRK-2025-XXX" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea 
                    rows={6} 
                    value={supportForm.message}
                    onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3" 
                    placeholder="Describe your issue or question in detail..."
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-red-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-red-700 transition">
                  Send Message
                </button>
              </form>
            </div>

            {/* Email History */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold mb-6">Your Email History</h3>
              {emailHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No email correspondence yet</p>
              ) : (
                <div className="space-y-3">
                  {emailHistory.map((email, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedEmail(email);
                        setShowEmailModal(true);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{email.subject}</p>
                          <p className="text-sm text-gray-600">
                            {email.direction === 'outgoing' ? `To: ${email.to}` : `From: ${email.from}`}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          email.status === 'sent' ? 'bg-green-100 text-green-700' :
                          email.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {email.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(email.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-600 mt-2">Click to view full email</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <details className="border border-gray-200 rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">How can I track my shipment?</summary>
                  <p className="mt-3 text-gray-600">Go to the "Track Shipment" section and enter your tracking ID. You'll see real-time updates on your shipment's location and status.</p>
                </details>
                <details className="border border-gray-200 rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">What documents do I need for international shipping?</summary>
                  <p className="mt-3 text-gray-600">Typically you'll need a commercial invoice, packing list, and bill of lading. Additional documents may be required depending on the cargo type and destination.</p>
                </details>
                <details className="border border-gray-200 rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">How long does delivery take?</summary>
                  <p className="mt-3 text-gray-600">Airfreight: 3-7 days, Seafreight FCL: 15-30 days, Seafreight LCL: 20-35 days. Times vary by route and customs clearance.</p>
                </details>
                <details className="border border-gray-200 rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">Can I change my delivery address?</summary>
                  <p className="mt-3 text-gray-600">Yes, contact our support team as soon as possible. Changes may incur additional fees depending on the shipment status.</p>
                </details>
              </div>
            </div>
          </motion.div>
        )}

        {/* My Profile */}
        {activeSection === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{user.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{user.email}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600 mb-4">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Active Account
                  </div>
                  <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                    Upload Photo
                  </button>
                </div>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input type="text" defaultValue={user.name} className="w-full border border-gray-300 rounded-lg px-4 py-3" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input type="email" defaultValue={user.email} className="w-full border border-gray-300 rounded-lg px-4 py-3" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" placeholder="+66 2 249 3889" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <input type="text" placeholder="Your Company" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="Street address"></textarea>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="w-5 h-5 text-red-600 rounded" />
                          <span>Email notifications for shipment updates</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="w-5 h-5 text-red-600 rounded" />
                          <span>SMS notifications for delivery</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="w-5 h-5 text-red-600 rounded" />
                          <span>Marketing and promotional emails</span>
                        </label>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                      <div className="space-y-4 max-w-md">
                        <input type="password" placeholder="Current Password" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
                        <input type="password" placeholder="New Password" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
                        <input type="password" placeholder="Confirm New Password" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button type="submit" className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                        Save Changes
                      </button>
                      <button type="button" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings */}
        {activeSection === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Settings</h2>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Profile Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue="Employee Name"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="employee@asianshippingthai.com"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                      <span>Email notifications for new shipments</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                      <span>Shipment status updates</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5" />
                      <span>Weekly summary reports</span>
                    </label>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Email Detail Modal */}
      {showEmailModal && selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowEmailModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedEmail.subject}</h2>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedEmail.status === 'sent' ? 'bg-green-100 text-green-700' :
                    selectedEmail.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedEmail.status}
                  </span>
                  <span>{selectedEmail.direction === 'outgoing' ? '📤 Outgoing' : '📥 Incoming'}</span>
                  <span>{new Date(selectedEmail.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600 ml-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  <span className="font-semibold text-gray-700">From:</span>
                  <span className="col-span-3 text-gray-900">{selectedEmail.from}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <span className="font-semibold text-gray-700">To:</span>
                  <span className="col-span-3 text-gray-900">{selectedEmail.to}</span>
                </div>
                {selectedEmail.sentAt && (
                  <div className="grid grid-cols-4 gap-2">
                    <span className="font-semibold text-gray-700">Sent:</span>
                    <span className="col-span-3 text-gray-900">{new Date(selectedEmail.sentAt).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Message:</h3>
                {selectedEmail.html ? (
                  <div 
                    className="prose max-w-none bg-white p-4 rounded-lg border"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                  />
                ) : (
                  <div className="bg-white p-4 rounded-lg border whitespace-pre-wrap">
                    {selectedEmail.text || 'No message content'}
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-end">
              <button
                onClick={() => setShowEmailModal(false)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </ErrorBoundary>
  );
}
