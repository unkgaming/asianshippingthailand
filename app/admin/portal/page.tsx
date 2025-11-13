"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmployeePortalPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showShortcuts, setShowShortcuts] = useState(false);
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [emailFrom, setEmailFrom] = useState('');
  const [fromOptions, setFromOptions] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const [outbox, setOutbox] = useState<any[]>([]);
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Commercial_Invoice_001.pdf',
      type: 'Invoice',
      date: 'Nov 1, 2025',
      size: '245 KB'
    },
    {
      id: 2,
      name: 'Packing_List.pdf',
      type: 'Packing',
      date: 'Nov 1, 2025',
      size: '180 KB'
    },
    {
      id: 3,
      name: 'Bill_of_Lading.pdf',
      type: 'BOL',
      date: 'Nov 3, 2025',
      size: '320 KB'
    }
  ]);
  
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[Portal] mounted');
    // load email config + recent outbox
    fetch('/api/emails?options=1').then(r=>r.json()).then(res=>{
      if(res?.fromOptions?.length){
        setFromOptions(res.fromOptions);
        setEmailFrom(res.fromOptions[0]);
      }
    }).catch(()=>{});
    fetch('/api/emails?limit=20').then(r=>r.json()).then(res=>{
      if(res?.data) setOutbox(res.data);
    }).catch(()=>{});
    return () => {
      // eslint-disable-next-line no-console
      console.log('[Portal] unmounted');
    };
  }, []);

  // Redirect to employee login if not authenticated or not employee
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'employee')) {
      router.push('/admin');
    }
  }, [user, isLoading, router]);

  // Keyboard shortcuts effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch(e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            setActiveSection('dashboard');
            break;
          case 's':
            e.preventDefault();
            setActiveSection('shipments');
            break;
          case 'n':
            e.preventDefault();
            setActiveSection('add');
            break;
          case 'e':
            e.preventDefault();
            setActiveSection('emails');
            break;
          case 'k':
            e.preventDefault();
            setShowShortcuts(true);
            break;
        }
      } else if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const handleDeleteShipment = (id: string) => {
    if (confirm('Are you sure you want to delete this shipment?')) {
      setShipments(shipments.filter(s => s.id !== id));
    }
  };

  const handleExportCSV = () => {
    const filteredShipments = getFilteredShipments();
    const headers = ['ID', 'Customer', 'Email', 'Origin', 'Destination', 'Service', 'Status', 'Payment', 'Price', 'Weight', 'Package Type', 'Contents', 'Booking Date', 'Delivery Date'];
    const csvContent = [
      headers.join(','),
      ...filteredShipments.map(s => [
        s.id,
        `"${s.customerName}"`,
        s.customerEmail,
        `"${s.origin}"`,
        `"${s.destination}"`,
        s.serviceType,
        s.status,
        s.paymentStatus,
        s.price,
        s.weight,
        `"${s.packageType}"`,
        `"${s.containerContents}"`,
        s.bookingDate,
        s.estimatedDelivery
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shipments-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const filteredShipments = getFilteredShipments();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Shipments Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #dc2626; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #dc2626; color: white; }
              tr:nth-child(even) { background-color: #f9fafb; }
            </style>
          </head>
          <body>
            <h1>asianshippingthai - Shipments Report</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${filteredShipments.map(s => `
                  <tr>
                    <td>${s.id}</td>
                    <td>${s.customerName}</td>
                    <td>${s.origin} → ${s.destination}</td>
                    <td>${s.status}</td>
                    <td>${s.paymentStatus}</td>
                    <td>$${s.price.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setPaymentFilter('');
  };

  const getFilteredShipments = () => {
    return shipments.filter(s => {
      const matchesSearch = searchQuery === '' || 
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === '' || s.status === statusFilter;
      const matchesPayment = paymentFilter === '' || s.paymentStatus === paymentFilter;
      
      return matchesSearch && matchesStatus && matchesPayment;
    });
  };

  const handleSendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/emails',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ from: emailFrom, to: emailTo, subject: emailSubject, text: emailMessage })
    });
    const data = await res.json();
    if(res.ok){
      alert('Email queued/sent');
      setEmailTo(''); setEmailSubject(''); setEmailMessage('');
      fetch('/api/emails?limit=20').then(r=>r.json()).then(r=> setOutbox(r?.data||[]));
    }else{
      alert('Failed to send: '+(data?.error||'unknown'));
    }
  };

  const handleTrackShipment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const shipment = shipments.find(s => s.id === trackingId);
    if (shipment) {
      alert(`Shipment Found!\n\nID: ${shipment.id}\nCustomer: ${shipment.customerName}\nStatus: ${shipment.status}\nRoute: ${shipment.origin} → ${shipment.destination}`);
    } else {
      alert('Shipment not found. Please check the tracking ID.');
    }
    setTrackingId('');
  };

  const handleDeleteDocument = (id: number) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

  const handleViewDocument = (name: string) => {
    alert(`Opening document: ${name}\n\nIn a real application, this would open or download the document.`);
  };

  const handleUploadDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newDoc = {
          id: documents.length + 1,
          name: file.name,
          type: 'Document',
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          size: `${(file.size / 1024).toFixed(0)} KB`
        };
        setDocuments([...documents, newDoc]);
      });
      alert(`${files.length} document(s) uploaded successfully!`);
    }
  };

  const handleViewQuote = (customerName: string, email: string) => {
    alert(`Viewing quote request from:\n\nCustomer: ${customerName}\nEmail: ${email}\n\nIn a real application, this would open the full quote details.`);
  };

  const handleReplyToQuote = (customerName: string, email: string) => {
    setEmailTo(email);
    setEmailSubject(`RE: Quote Request - ${customerName}`);
  setEmailMessage(`Dear ${customerName},\n\nThank you for your quote request. We are pleased to provide you with a competitive quote for your logistics needs.\n\nBest regards,\nasianshippingthai Team`);
    alert(`Email form pre-filled for ${customerName}. Scroll down to the email form to compose your response.`);
  };

  const handleComposeEmail = () => {
    setEmailTo('');
    setEmailSubject('');
    setEmailMessage('');
    alert('Email form cleared. Scroll down to compose a new email.');
  };

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl p-4">
        {/* Logo */}
        <div className="mb-6 pb-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-red-500">asianshippingthai</h1>
          <p className="text-xs text-gray-400">Employee Portal</p>
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
            <span className="mr-3 text-lg">�</span> Manage Shipments
          </button>
          <button
            className={`flex items-center px-3 py-2 rounded-md w-full text-left transition ${
              activeSection === 'add'
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveSection('add')}
          >
              <span className="mr-3 text-lg">➕</span> Add Shipment
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
            className={`flex items-center justify-between px-3 py-2 rounded-md w-full text-left transition ${
              activeSection === 'emails'
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveSection('emails')}
          >
              <div className="flex items-center">
                <span className="mr-3 text-lg">✉️</span> Customer Quotes
              </div>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">5</span>
          </button>
          <button
            className={`flex items-center px-3 py-2 rounded-md w-full text-left transition ${
              activeSection === 'documents'
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveSection('documents')}
          >
              <span className="mr-3 text-lg">📄</span> Documents
          </button>
          <button
            className={`flex items-center px-3 py-2 rounded-md w-full text-left transition ${
              activeSection === 'settings'
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveSection('settings')}
          >
              <span className="mr-3 text-lg">⚙️</span> Settings
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <button
                onClick={() => setActiveSection('add')}
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:shadow-xl transition text-left group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition">➕</div>
                <h3 className="text-xl font-bold mb-2">Add Shipment</h3>
                <p className="text-blue-100 text-sm">Create new booking</p>
              </button>
              <button
                onClick={() => setActiveSection('emails')}
                className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-xl transition text-left group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition">✉️</div>
                <h3 className="text-xl font-bold mb-2">Quotes</h3>
                <p className="text-purple-100 text-sm">5 new requests</p>
              </button>
              <button
                onClick={() => setActiveSection('tracking')}
                className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 hover:shadow-xl transition text-left group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition">🔍</div>
                <h3 className="text-xl font-bold mb-2">Track</h3>
                <p className="text-orange-100 text-sm">Real-time updates</p>
              </button>
              <button
                onClick={() => setActiveSection('documents')}
                className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 hover:shadow-xl transition text-left group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition">📄</div>
                <h3 className="text-xl font-bold mb-2">Documents</h3>
                <p className="text-green-100 text-sm">Manage files</p>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Recent Activity Timeline */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Recent Activity</h3>
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                        ✓
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-semibold">Shipment Delivered</p>
                      <p className="text-sm text-gray-600">TRK-2025-001 delivered to customer</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        +
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-semibold">New Shipment Created</p>
                      <p className="text-sm text-gray-600">TRK-2025-003 - Fashion Imports Co</p>
                      <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                        💬
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-semibold">Quote Request Received</p>
                      <p className="text-sm text-gray-600">Tech Solutions Inc - Airfreight</p>
                      <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                        💰
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Payment Received</p>
                      <p className="text-sm text-gray-600">$2,450.00 from ABC Electronics</p>
                      <p className="text-xs text-gray-400 mt-1">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats & Alerts */}
              <div className="space-y-6">
                {/* Pending Actions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Pending Actions</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                      <p className="font-semibold text-sm text-red-700">Urgent</p>
                      <p className="text-xs text-gray-600 mt-1">1 shipment needs customs docs</p>
                    </div>
                    <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                      <p className="font-semibold text-sm text-orange-700">Follow-up</p>
                      <p className="text-xs text-gray-600 mt-1">5 quote requests to respond</p>
                    </div>
                    <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                      <p className="font-semibold text-sm text-yellow-700">Review</p>
                      <p className="text-xs text-gray-600 mt-1">2 pending payments</p>
                    </div>
                  </div>
                </div>

                {/* Performance This Month */}
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold mb-4">This Month</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Shipments</span>
                        <span className="font-bold">24</span>
                      </div>
                      <div className="bg-white/20 rounded-full h-2">
                        <div className="bg-white rounded-full h-2 w-4/5"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Revenue</span>
                        <span className="font-bold">$48.2K</span>
                      </div>
                      <div className="bg-white/20 rounded-full h-2">
                        <div className="bg-white rounded-full h-2 w-3/5"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>On-time Rate</span>
                        <span className="font-bold">96%</span>
                      </div>
                      <div className="bg-white/20 rounded-full h-2">
                        <div className="bg-white rounded-full h-2 w-[96%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Shipments Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-bold">Recent Shipments</h3>
                <button
                  onClick={() => setActiveSection('shipments')}
                  className="text-red-600 hover:text-red-700 font-semibold text-sm"
                >
                  View All →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tracking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {shipments.slice(0, 5).map((shipment) => (
                      <tr key={shipment.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setActiveSection('shipments')}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{shipment.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{shipment.customerName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="block text-xs">{shipment.origin}</span>
                          <span className="block text-xs text-gray-400">→ {shipment.destination}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            shipment.status === 'In Transit' ? 'bg-orange-100 text-orange-600' :
                            shipment.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {shipment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            shipment.paymentStatus === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {shipment.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-right">${shipment.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Manage Shipments */}
        {activeSection === 'shipments' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h2 className="text-3xl font-bold text-gray-800">Manage Shipments</h2>
              <button
                onClick={() => setActiveSection('add')}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                + Add New Shipment
              </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by tracking ID, customer, or email..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Status</option>
                  <option>In Transit</option>
                  <option>Pending Pickup</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
                <select 
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Payment</option>
                  <option>Paid</option>
                  <option>Pending</option>
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                >
                  Export CSV
                </button>
                <button 
                  onClick={handlePrint}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                >
                  Print
                </button>
                <button 
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
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
                    {getFilteredShipments().map((shipment) => (
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
                          <button 
                            onClick={() => handleDeleteShipment(shipment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
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
                      <optgroup label="Standard Packaging">
                        <option>Cartons</option>
                        <option>Boxes</option>
                        <option>Pallets</option>
                        <option>Crates</option>
                        <option>Bags</option>
                        <option>Sacks</option>
                      </optgroup>
                      <optgroup label="Industrial & Heavy">
                        <option>Drums (Metal)</option>
                        <option>Drums (Plastic)</option>
                        <option>Barrels</option>
                        <option>Cylinders</option>
                        <option>IBC Containers</option>
                        <option>Steel Cases</option>
                      </optgroup>
                      <optgroup label="Specialized">
                        <option>Refrigerated Containers</option>
                        <option>Insulated Boxes</option>
                        <option>Hazmat Packaging</option>
                        <option>Temperature Controlled</option>
                        <option>Fragile Item Cases</option>
                        <option>Anti-Static Packaging</option>
                      </optgroup>
                      <optgroup label="Bulk & Loose">
                        <option>Loose Cargo</option>
                        <option>Bulk Bags (FIBC)</option>
                        <option>Roll Cages</option>
                        <option>Shrink Wrapped</option>
                        <option>Banded Items</option>
                      </optgroup>
                      <optgroup label="Furniture & Oversized">
                        <option>Furniture Boxes</option>
                        <option>Flat Packs</option>
                        <option>Oversized Items</option>
                        <option>Machinery Crates</option>
                        <option>Vehicle Parts</option>
                      </optgroup>
                      <optgroup label="Electronics & Fragile">
                        <option>Electronics Boxes</option>
                        <option>Glass Packaging</option>
                        <option>Foam Padded Cases</option>
                        <option>Anti-Shock Packaging</option>
                        <option>Computer Equipment Cases</option>
                      </optgroup>
                      <optgroup label="Food & Perishables">
                        <option>Food Grade Containers</option>
                        <option>Insulated Food Boxes</option>
                        <option>Produce Crates</option>
                        <option>Beverage Cases</option>
                        <option>Frozen Food Packaging</option>
                      </optgroup>
                      <optgroup label="Textiles & Garments">
                        <option>Garment Boxes</option>
                        <option>Hanging Garment Bags</option>
                        <option>Textile Rolls</option>
                        <option>Fabric Bales</option>
                      </optgroup>
                      <optgroup label="Documents & Media">
                        <option>Document Boxes</option>
                        <option>Archive Boxes</option>
                        <option>Envelope Packs</option>
                        <option>Media Cases</option>
                      </optgroup>
                      <optgroup label="Medical & Pharmaceutical">
                        <option>Medical Supply Boxes</option>
                        <option>Pharmaceutical Containers</option>
                        <option>Bio-Safe Packaging</option>
                        <option>Sample Transport Cases</option>
                      </optgroup>
                      <optgroup label="Automotive">
                        <option>Auto Parts Boxes</option>
                        <option>Tire Packaging</option>
                        <option>Battery Containers</option>
                        <option>Engine Crates</option>
                      </optgroup>
                      <optgroup label="Other">
                        <option>Mixed Packaging</option>
                        <option>Custom Packaging</option>
                        <option>Other</option>
                      </optgroup>
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
              <form onSubmit={handleTrackShipment} className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Tracking ID</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
                    placeholder="TRK-2025-XXX"
                    required
                  />
                  <button 
                    type="submit"
                    className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Search
                  </button>
                </div>
              </form>

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
                  <input type="file" multiple className="hidden" onChange={handleUploadDocument} />
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
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">{doc.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          doc.type === 'Invoice' ? 'bg-blue-100 text-blue-700' :
                          doc.type === 'Packing' ? 'bg-green-100 text-green-700' :
                          doc.type === 'BOL' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {doc.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">{doc.date}</td>
                      <td className="px-6 py-4">{doc.size}</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleViewDocument(doc.name)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Settings Section */}
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

        {/* Customer Quotes/Emails */}
        {activeSection === 'emails' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Customer Quote Requests</h2>
            
            {/* Email Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">New Requests</p>
                    <p className="text-3xl font-bold text-blue-600">5</p>
                  </div>
                  <div className="text-4xl">✉️</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Responded</p>
                    <p className="text-3xl font-bold text-green-600">12</p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Pending</p>
                    <p className="text-3xl font-bold text-orange-600">3</p>
                  </div>
                  <div className="text-4xl">⏱️</div>
                </div>
              </div>
            </div>

            {/* Quote Requests Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">Quote Requests</h3>
                <button 
                  onClick={handleComposeEmail}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Compose Email
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Service Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Route</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">Nov 12, 2025</td>
                      <td className="px-6 py-4 font-medium">Tech Solutions Inc</td>
                      <td className="px-6 py-4">contact@techsolutions.com</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Airfreight</span>
                      </td>
                      <td className="px-6 py-4">Tokyo, Japan → Seattle, USA</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">New</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleViewQuote('Tech Solutions Inc', 'contact@techsolutions.com')}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleReplyToQuote('Tech Solutions Inc', 'contact@techsolutions.com')}
                          className="text-green-600 hover:text-green-800"
                        >
                          Reply
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">Nov 11, 2025</td>
                      <td className="px-6 py-4 font-medium">Global Traders Ltd</td>
                      <td className="px-6 py-4">info@globaltraders.com</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Seafreight FCL</span>
                      </td>
                      <td className="px-6 py-4">Hamburg, Germany → New York, USA</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Responded</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleViewQuote('Global Traders Ltd', 'info@globaltraders.com')}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          View
                        </button>
                        <button className="text-gray-400" disabled>Reply</button>
                      </td>
                    </tr>
                    <tr className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">Nov 10, 2025</td>
                      <td className="px-6 py-4 font-medium">Fashion Imports Co</td>
                      <td className="px-6 py-4">orders@fashionimports.com</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Seafreight LCL</span>
                      </td>
                      <td className="px-6 py-4">Mumbai, India → Los Angeles, USA</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Responded</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleViewQuote('Fashion Imports Co', 'orders@fashionimports.com')}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          View
                        </button>
                        <button className="text-gray-400" disabled>Reply</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Email Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-6">Send Quote Response</h3>
              <form onSubmit={handleSendEmail} className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                    <select value={emailFrom} onChange={e=>setEmailFrom(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2">
                      {fromOptions.map(opt=> <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="customer@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="RE: Quote Request"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={8}
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="Dear Customer,&#10;&#10;Thank you for your quote request...&#10;&#10;Best regards,&#10;asianshippingthai Team"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attach Quote Document</label>
                  <input
                    type="file"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Send Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailTo('');
                      setEmailSubject('');
                      setEmailMessage('');
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            {/* Outbox */}
            <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
              <h3 className="text-xl font-bold mb-4">Recent Emails</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">From</th>
                      <th className="px-4 py-2 text-left">To</th>
                      <th className="px-4 py-2 text-left">Subject</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outbox.map((m)=> (
                      <tr key={m.id} className="border-t">
                        <td className="px-4 py-2">{new Date(m.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-2">{m.from}</td>
                        <td className="px-4 py-2">{m.to}</td>
                        <td className="px-4 py-2 truncate max-w-[300px]">{m.subject}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${m.status==='sent'?'bg-green-100 text-green-700': m.status==='failed'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}`}>{m.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Floating Help Button */}
      <motion.button
        onClick={() => setShowShortcuts(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-red-700 text-white w-14 h-14 rounded-full shadow-2xl hover:shadow-red-500/50 flex items-center justify-center text-2xl font-bold z-40 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        ?
        <span className="absolute bottom-full mb-2 right-0 bg-gray-900 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          Keyboard Shortcuts
        </span>
      </motion.button>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowShortcuts(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 z-50 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Keyboard Shortcuts</h3>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Navigation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Dashboard</span>
                      <kbd className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Ctrl + D</kbd>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Manage Shipments</span>
                      <kbd className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Ctrl + S</kbd>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Add New Shipment</span>
                      <kbd className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Ctrl + N</kbd>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Customer Quotes</span>
                      <kbd className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Ctrl + E</kbd>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Open Shortcuts</span>
                      <kbd className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Ctrl + K</kbd>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Show Help</span>
                      <kbd className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-mono">?</kbd>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Pro Tips</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-900 font-medium">Use filters to quickly find shipments by status or payment</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-900 font-medium">Export data to CSV for offline analysis and reporting</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-900 font-medium">Track multiple shipments by searching with customer email</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-900 font-medium">Respond to quotes quickly using the email form templates</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Need help? Contact support at <a href="mailto:support@asianlogistics.com" className="text-red-600 hover:underline">support@asianlogistics.com</a>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
    </ErrorBoundary>
  );
}
