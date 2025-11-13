"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import ErrorBoundary from '../../components/ErrorBoundary';
import { motion } from 'framer-motion';

export default function PortalPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [shipments, setShipments] = useState([
    {
      id: 'TRK-2025-001',
      customerName: 'ABC Electronics Ltd',
      customerEmail: 'contact@abcelectronics.com',
      origin: 'Shanghai, China',
      destination: 'Los Angeles, USA',
      serviceType: 'Airfreight',
      status: 'In Transit',
      paymentStatus: 'Paid',
      price: 2450.00,
      weight: 125.5,
      packageType: 'Cartons',
      containerContents: 'Electronic Components',
      bookingDate: '2025-11-01',
      estimatedDelivery: '2025-11-15',
      documents: ['Commercial Invoice', 'Packing List', 'Bill of Lading']
    },
    {
      id: 'TRK-2025-002',
      customerName: 'Fashion Imports Co',
      customerEmail: 'orders@fashionimports.com',
      origin: 'Mumbai, India',
      destination: 'New York, USA',
      serviceType: 'Seafreight LCL',
      status: 'Pending Pickup',
      paymentStatus: 'Pending',
      price: 1850.00,
      weight: 450.0,
      packageType: 'Pallets',
      containerContents: 'Textile Products',
      bookingDate: '2025-11-08',
      estimatedDelivery: '2025-12-10',
      documents: ['Commercial Invoice']
    }
  ]);
  const [editingShipment, setEditingShipment] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[Portal] mounted');
    return () => {
      // eslint-disable-next-line no-console
      console.log('[Portal] unmounted');
    };
  }, []);

  // Redirect to login if not authenticated, or to employee portal if employee
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    } else if (!isLoading && user && user.role === 'employee') {
      router.push('/admin/portal');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const handleAddShipment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newShipment = {
      id: `TRK-2025-${String(shipments.length + 1).padStart(3, '0')}`,
      customerName: formData.get('customerName') as string,
      customerEmail: formData.get('customerEmail') as string,
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      serviceType: formData.get('serviceType') as string,
      status: 'Pending Pickup',
      paymentStatus: formData.get('paymentStatus') as string,
      price: parseFloat(formData.get('price') as string),
      weight: parseFloat(formData.get('weight') as string),
      packageType: formData.get('packageType') as string,
      containerContents: formData.get('containerContents') as string,
      bookingDate: formData.get('bookingDate') as string,
      estimatedDelivery: formData.get('estimatedDelivery') as string,
      documents: []
    };
    setShipments([...shipments, newShipment]);
    setShowAddForm(false);
    setActiveSection('shipments');
  };

  const handleUpdateShipment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedShipments = shipments.map(s => 
      s.id === editingShipment.id ? {
        ...s,
        status: formData.get('status') as string,
        paymentStatus: formData.get('paymentStatus') as string,
        price: parseFloat(formData.get('price') as string),
      } : s
    );
    setShipments(updatedShipments);
    setEditingShipment(null);
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
                <div className="space-y-3">
                  <div className="flex gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="text-2xl">📦</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Shipment Update</p>
                      <p className="text-sm text-gray-600">TRK-2025-001 is now in transit</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="text-2xl">✅</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Payment Confirmed</p>
                      <p className="text-sm text-gray-600">Payment received for TRK-2025-002</p>
                      <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <div className="text-2xl">⚠️</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Action Required</p>
                      <p className="text-sm text-gray-600">Complete customs documentation</p>
                      <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                    </div>
                  </div>
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
                            onClick={() => setEditingShipment(shipment)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edit Modal */}
            {editingShipment && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                >
                  <h3 className="text-2xl font-bold mb-6">Edit Shipment: {editingShipment.id}</h3>
                  <form onSubmit={handleUpdateShipment} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          name="status"
                          defaultValue={editingShipment.status}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        >
                          <option>Pending Pickup</option>
                          <option>Picked Up</option>
                          <option>In Transit</option>
                          <option>Out for Delivery</option>
                          <option>Delivered</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                        <select
                          name="paymentStatus"
                          defaultValue={editingShipment.paymentStatus}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        >
                          <option>Pending</option>
                          <option>Paid</option>
                          <option>Refunded</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input
                          type="number"
                          name="price"
                          step="0.01"
                          defaultValue={editingShipment.price}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        type="submit"
                        className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                      >
                        Update Shipment
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingShipment(null)}
                        className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
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
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
                    placeholder="TRK-2025-XXX"
                  />
                  <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                    Search
                  </button>
                </div>
              </div>

              {/* Sample Tracking Result */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Shipment Details: TRK-2025-001</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-semibold">ABC Electronics Ltd</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold text-orange-600">In Transit</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Origin</p>
                    <p className="font-semibold">Shanghai, China</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Destination</p>
                    <p className="font-semibold">Los Angeles, USA</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-semibold">125.5 kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estimated Delivery</p>
                    <p className="font-semibold">Nov 15, 2025</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Tracking History</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                      <div>
                        <p className="font-semibold">Package Picked Up</p>
                        <p className="text-sm text-gray-500">Nov 1, 2025 - Shanghai</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                      <div>
                        <p className="font-semibold">In Transit to Port</p>
                        <p className="text-sm text-gray-500">Nov 3, 2025 - Shanghai Port</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mt-1"></div>
                      <div>
                        <p className="font-semibold">In Transit (Sea)</p>
                        <p className="text-sm text-gray-500">Nov 5, 2025 - Pacific Ocean</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                  <tr className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">Commercial_Invoice_001.pdf</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Invoice</span>
                    </td>
                    <td className="px-6 py-4">Nov 1, 2025</td>
                    <td className="px-6 py-4">245 KB</td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">Packing_List.pdf</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Packing</span>
                    </td>
                    <td className="px-6 py-4">Nov 1, 2025</td>
                    <td className="px-6 py-4">180 KB</td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">Bill_of_Lading.pdf</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">BOL</span>
                    </td>
                    <td className="px-6 py-4">Nov 3, 2025</td>
                    <td className="px-6 py-4">320 KB</td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
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
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500">
                      <option>Select Service</option>
                      <option>Airfreight</option>
                      <option>Seafreight FCL</option>
                      <option>Seafreight LCL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cargo Type *</label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500">
                      <option>Select Type</option>
                      <option>General Cargo</option>
                      <option>Refrigerated</option>
                      <option>Hazardous</option>
                      <option>Oversized</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Origin Port/Airport *</label>
                    <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="e.g., Shanghai, China" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination Port/Airport *</label>
                    <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="e.g., Los Angeles, USA" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg) *</label>
                    <input type="number" className="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (L x W x H cm)</label>
                    <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="e.g., 100 x 80 x 60" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cargo Description *</label>
                    <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="Describe your cargo..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Shipping Date</label>
                    <input type="date" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input type="tel" className="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="+1 234 567 8900" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                    Submit Quote Request
                  </button>
                  <button type="reset" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    Clear Form
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Customer Support */}
        {activeSection === 'support' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Customer Support</h2>
            
            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-3">📞</div>
                <h3 className="text-xl font-bold mb-2">Call Us</h3>
                <p className="text-blue-100 mb-3">24/7 Support Hotline</p>
                <a href="tel:+12345678900" className="text-lg font-semibold">+1 234 567 8900</a>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-3">📧</div>
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-green-100 mb-3">Response within 2 hours</p>
                <a href="mailto:support@asianlogistics.com" className="text-lg font-semibold">support@asianlogistics.com</a>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-3">💬</div>
                <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                <p className="text-purple-100 mb-3">Instant assistance</p>
                <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition">
                  Start Chat
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-3">
                      <option>Select Subject</option>
                      <option>Shipment Inquiry</option>
                      <option>Billing Question</option>
                      <option>Technical Support</option>
                      <option>General Question</option>
                      <option>Complaint</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-3">
                      <option>Normal</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tracking ID (Optional)</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="TRK-2025-XXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea rows={6} className="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="Describe your issue or question in detail..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attach Files (Optional)</label>
                  <input type="file" multiple className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
                </div>
                <button type="submit" className="w-full bg-red-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-red-700 transition">
                  Send Message
                </button>
              </form>
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
                        <input type="tel" placeholder="+1 234 567 8900" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
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
                        defaultValue="employee@asianlogistics.com"
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
      </div>
    </ErrorBoundary>
  );
}
