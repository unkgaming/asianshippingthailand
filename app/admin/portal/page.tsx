"use client";
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmployeePortalPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { status } = useSession();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [shipments, setShipments] = useState<any[]>([]);
  const [shipmentsLoading, setShipmentsLoading] = useState(true);
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
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [notification, setNotification] = useState<{type: 'success'|'error', message: string} | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [replyingToInquiryId, setReplyingToInquiryId] = useState<string | null>(null);
  const [createShipmentFromInquiry, setCreateShipmentFromInquiry] = useState<any>(null);
  const [trackingUpdates, setTrackingUpdates] = useState<any[]>([]);
  const [newTrackingStatus, setNewTrackingStatus] = useState('');
  const [newTrackingLocation, setNewTrackingLocation] = useState('');
  const [newTrackingDescription, setNewTrackingDescription] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  const [databasePassword, setDatabasePassword] = useState('');
  const [databaseUnlocked, setDatabaseUnlocked] = useState(false);
  const [databaseView, setDatabaseView] = useState<'shipments'|'inquiries'|'emails'|'staffDirectory'|'users'>('shipments');
  const [databaseData, setDatabaseData] = useState<any[]>([]);
  const [databaseLoading, setDatabaseLoading] = useState(false);
  const [selectedDbRecord, setSelectedDbRecord] = useState<any>(null);
  // Email Accounts state
  const [staffDirectory, setStaffDirectory] = useState<any[]>([]);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [accAddress, setAccAddress] = useState('');
  const [accUsername, setAccUsername] = useState('');
  const [accPassword, setAccPassword] = useState('');
  const [accType, setAccType] = useState<'customer'|'staff'>('customer');
  const [editingAccount, setEditingAccount] = useState<any>(null);
  // Add Email modal (database)
  const [showAddEmailModal, setShowAddEmailModal] = useState(false);
  const [dbEmailFrom, setDbEmailFrom] = useState('info@asianshippingthai.com');
  const [dbEmailTo, setDbEmailTo] = useState('');
  const [dbEmailSubject, setDbEmailSubject] = useState('');
  const [dbEmailText, setDbEmailText] = useState('');
  // Account sync state
  const [syncingAccountId, setSyncingAccountId] = useState<string | null>(null);
  const [accountRoles, setAccountRoles] = useState<Record<string, string>>({});
  
  // News state
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsExcerpt, setNewsExcerpt] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [newsPublished, setNewsPublished] = useState(false);
  const [showDbRecordModal, setShowDbRecordModal] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[Portal] mounted');
    // Load shipments from DB
    setShipmentsLoading(true);
    fetch('/api/shipments')
      .then(r => r.json())
      .then(res => {
        if (res?.ok && res.data) {
          setShipments(res.data.map((s: any) => ({
            id: s.code,
            dbId: s.id,
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
    // load inquiries from database (including replied ones)
    fetch('/api/inquiries?limit=50&includeReplied=true').then(r=>r.json()).then(res=>{
      console.log('[Admin Portal] Inquiries response:', res);
      if(res?.inquiries) {
        console.log('[Admin Portal] Setting inquiries:', res.inquiries.length);
        setInquiries(res.inquiries);
      } else {
        console.warn('[Admin Portal] No inquiries in response');
      }
    }).catch((err)=>{
      console.error('[Admin Portal] Failed to load inquiries:', err);
    });
    // Load email accounts for labeling and management
    fetch('/api/email-accounts').then(r=>r.json()).then(res=>{
      if (res?.ok && res.data) {
        setStaffDirectory(res.data);
        // Fetch user roles for each account
        res.data.forEach((acc: any) => {
          fetch(`/api/users?email=${encodeURIComponent(acc.address)}`)
            .then(r2=>r2.json())
            .then(u=>{
              if (u?.user?.role) {
                setAccountRoles(prev => ({...prev, [acc.id]: u.user.role}));
              }
            })
            .catch(()=>{});
        });
      }
    }).catch(()=>{});
    return () => {
      // eslint-disable-next-line no-console
      console.log('[Portal] unmounted');
    };
  }, []);

  // Lightweight polling for new inquiries with toast/badge updates
  useEffect(() => {
    let timer: any;
    const knownIdsRef = { current: new Set<string>() } as { current: Set<string> };
    // seed with current inquiries to avoid false-positive on first tick
    inquiries.forEach(i => knownIdsRef.current.add(i.id));

    const poll = async () => {
      try {
        const res = await fetch(`/api/inquiries?limit=50&includeReplied=true&t=${Date.now()}`);
        const data = await res.json();
        if (data?.inquiries && Array.isArray(data.inquiries)) {
          const incoming = data.inquiries as any[];
          // Find truly new inquiries by id not present locally
          const currentIds = new Set(inquiries.map(i => i.id));
          const newOnes = incoming.filter(i => !currentIds.has(i.id));
          if (newOnes.length > 0) {
            setInquiries(incoming);
            const newCountNewStatus = newOnes.filter(i => (i.status === 'new' || !i.status)).length;
            const countToShow = newCountNewStatus > 0 ? newCountNewStatus : newOnes.length;
            setNotification({ type: 'success', message: `📥 ${countToShow} new quote request${countToShow>1?'s':''} received` });
            setTimeout(() => setNotification(null), 4000);
          }
        }
      } catch (err) {
        // silent fail for lightweight poll
      }
    };

    // start polling every 30s
    timer = setInterval(poll, 30000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [inquiries]);

  // Redirect if unauthenticated; if logged in but not employee, send to customer portal
  useEffect(() => {
    console.log('[Portal Auth Check]', { 
      isLoading, 
      status, 
      user, 
      userRole: user?.role,
      hasUser: !!user 
    });
    
    // Only act when BOTH isLoading is false AND we have a status
    if (!isLoading && status !== 'loading') {
      // If authenticated but no user object yet, wait
      if (status === 'authenticated' && !user) {
        console.log('[Portal] Authenticated but user object not ready, waiting...');
        return;
      }
      
      if (!user || status === 'unauthenticated') {
        console.log('[Portal] No user - redirecting to signin');
        router.push('/signin');
      } else if (user.role && user.role !== 'employee') {
        console.log('[Portal] Not employee, role:', user.role, '- redirecting to customer portal');
        router.push('/portal');
      } else {
        console.log('[Portal] Access granted for employee:', user.email);
      }
    }
  }, [user, isLoading, status, router]);

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

  // Fetch news articles when news section is active
  useEffect(() => {
    if (activeSection === 'news') {
      setNewsLoading(true);
      fetch('/api/news')
        .then(r => r.json())
        .then(data => {
          if (data.ok) setNewsArticles(data.data);
          setNewsLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch news:', err);
          setNewsLoading(false);
        });
    }
  }, [activeSection]);

  if (isLoading || status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

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
        const reloadRes = await fetch('/api/shipments');
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
        setShowAddForm(false);
        setActiveSection('shipments');
        setNotification({ type: 'success', message: '✅ Shipment created successfully!' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ type: 'error', message: `❌ ${data.error || 'Failed to create'}` });
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
      const shipment = shipments.find(s => s.id === editingShipment.id);
      if (!shipment) return;
      const dbShipment = await fetch('/api/shipments').then(r=>r.json()).then(d => d.data?.find((s:any)=>s.code===shipment.id));
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
        const reloadRes = await fetch('/api/shipments');
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

  const handleDeleteShipment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shipment?')) return;
    try {
      const shipment = shipments.find(s => s.id === id);
      if (!shipment) return;
      const dbShipment = await fetch('/api/shipments').then(r=>r.json()).then(d => d.data?.find((s:any)=>s.code===shipment.id));
      if (!dbShipment) return;

      const res = await fetch(`/api/shipments?id=${dbShipment.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.ok) {
        setShipments(shipments.filter(s => s.id !== id));
        setNotification({ type: 'success', message: '✅ Shipment deleted!' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ type: 'error', message: `❌ ${data.error || 'Failed to delete'}` });
        setTimeout(() => setNotification(null), 5000);
      }
    } catch (err) {
      setNotification({ type: 'error', message: '❌ Connection error' });
      setTimeout(() => setNotification(null), 5000);
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
      body: JSON.stringify({ 
        from: emailFrom, 
        to: emailTo, 
        subject: emailSubject, 
        text: emailMessage,
        inquiryId: replyingToInquiryId 
      })
    });
    const data = await res.json();
    if(res.ok){
      setNotification({ type: 'success', message: '✅ Email sent successfully!' });
      setEmailTo(''); setEmailSubject(''); setEmailMessage('');
      setReplyingToInquiryId(null); // Clear inquiry ID after sending
      fetch('/api/emails?limit=20').then(r=>r.json()).then(r=> setOutbox(r?.data||[]));
      // Refresh inquiries list to update status (add cache-busting param)
      fetch(`/api/inquiries?limit=50&includeReplied=true&t=${Date.now()}`).then(r=>r.json()).then(res=>{
        if(res?.inquiries) setInquiries(res.inquiries);
      });
      setTimeout(() => setNotification(null), 5000);
    }else{
      setNotification({ type: 'error', message: '❌ Failed to send: '+(data?.error||'unknown') });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleTrackShipment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const shipment = shipments.find(s => s.id === trackingId.trim());
    if (shipment) {
      setTrackingResult(shipment);
      // Load tracking updates for this shipment
      try {
        const res = await fetch(`/api/tracking?shipmentId=${shipment.dbId}&t=${Date.now()}`);
        const data = await res.json();
        if (data.ok && data.updates) {
          setTrackingUpdates(data.updates);
        }
      } catch (err) {
        console.error('Failed to load tracking updates:', err);
        setTrackingUpdates([]);
      }
    } else {
      setTrackingResult(null);
      setTrackingUpdates([]);
      alert('Shipment not found. Please check the tracking ID.');
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!confirm('Are you sure you want to remove this quote request from the list?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/inquiries?id=${inquiryId}&action=hide`, {
        method: 'PATCH',
      });
      const data = await res.json();
      
      if (data.ok) {
        // Remove from local state
        setInquiries(inquiries.filter(i => i.id !== inquiryId));
        setNotification({ type: 'success', message: 'Quote request removed from list' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ type: 'error', message: 'Failed to remove quote request' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error('Error removing inquiry:', err);
      setNotification({ type: 'error', message: 'Failed to remove quote request' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeleteEmail = async (emailId: string) => {
    if (!confirm('Are you sure you want to remove this email from the list?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/emails?id=${emailId}&action=hide`, {
        method: 'PATCH',
      });
      const data = await res.json();
      
      if (data.ok) {
        // Remove from local state and close modal
        setOutbox(outbox.filter(e => e.id !== emailId));
        setShowEmailModal(false);
        setSelectedEmail(null);
        setNotification({ type: 'success', message: 'Email removed from list' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ type: 'error', message: 'Failed to remove email' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error('Error removing email:', err);
      setNotification({ type: 'error', message: 'Failed to remove email' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleBulkDeleteInquiries = async () => {
    if (selectedInquiries.length === 0) return;
    if (!confirm(`Are you sure you want to remove ${selectedInquiries.length} quote request(s) from the list?`)) {
      return;
    }

    try {
      const promises = selectedInquiries.map(id => 
        fetch(`/api/inquiries?id=${id}&action=hide`, { method: 'PATCH' })
      );
      const results = await Promise.all(promises);
      const successful = results.filter(r => r.ok).length;

      if (successful > 0) {
        setInquiries(inquiries.filter(i => !selectedInquiries.includes(i.id)));
        setSelectedInquiries([]);
        setNotification({ type: 'success', message: `${successful} quote request(s) removed from list` });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ type: 'error', message: 'Failed to remove quote requests' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error('Error removing inquiries:', err);
      setNotification({ type: 'error', message: 'Failed to remove quote requests' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleBulkDeleteEmails = async () => {
    if (selectedEmails.length === 0) return;
    if (!confirm(`Are you sure you want to remove ${selectedEmails.length} email(s) from the list?`)) {
      return;
    }

    try {
      const promises = selectedEmails.map(id => 
        fetch(`/api/emails?id=${id}&action=hide`, { method: 'PATCH' })
      );
      const results = await Promise.all(promises);
      const successful = results.filter(r => r.ok).length;

      if (successful > 0) {
        setOutbox(outbox.filter(e => !selectedEmails.includes(e.id)));
        setSelectedEmails([]);
        setNotification({ type: 'success', message: `${successful} email(s) removed from list` });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ type: 'error', message: 'Failed to remove emails' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error('Error removing emails:', err);
      setNotification({ type: 'error', message: 'Failed to remove emails' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const toggleInquirySelection = (id: string) => {
    setSelectedInquiries(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAllInquiries = () => {
    if (selectedInquiries.length === inquiries.length) {
      setSelectedInquiries([]);
    } else {
      setSelectedInquiries(inquiries.map(i => i.id));
    }
  };

  const toggleEmailSelection = (id: string) => {
    setSelectedEmails(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleAllEmails = () => {
    if (selectedEmails.length === outbox.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(outbox.map(e => e.id));
    }
  };

  const handleDatabaseAccess = () => {
    if (databasePassword === 'Asian@567') {
      setDatabaseUnlocked(true);
      loadDatabaseData('shipments');
      setDatabasePassword('');
    } else {
      alert('Incorrect password');
      setDatabasePassword('');
    }
  };

  const loadDatabaseData = async (table: 'shipments'|'inquiries'|'emails'|'staffDirectory'|'users') => {
    setDatabaseLoading(true);
    setDatabaseView(table);
    try {
      let endpoint = '';
      switch(table) {
        case 'shipments':
          endpoint = '/api/shipments';
          break;
        case 'inquiries':
          endpoint = '/api/database/inquiries';
          break;
        case 'emails':
          endpoint = '/api/database/emails';
          break;
        case 'staffDirectory':
          endpoint = '/api/email-accounts';
          break;
        case 'users':
          endpoint = '/api/users';
          break;
      }
      const res = await fetch(endpoint);
      const data = await res.json();
      if (table === 'inquiries') {
        setDatabaseData(data.inquiries || []);
      } else if (table === 'emails') {
        setDatabaseData(data.data || []);
      } else if (table === 'staffDirectory') {
        setDatabaseData(data.data || []);
      } else if (table === 'shipments') {
        setDatabaseData(data.data || []);
      } else {
        setDatabaseData(data.users || []);
      }
    } catch (err) {
      console.error('Failed to load database data:', err);
      setDatabaseData([]);
    }
    setDatabaseLoading(false);
  };

  const handleEnableStaffLogin = async (account: any) => {
    setSyncingAccountId(account.id);
    try {
      // Call single-account sync
      const res = await fetch(`/api/email-accounts?id=${account.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountType: account.accountType,
          password: account.password, // Re-submit to trigger sync
        }),
      });
      const data = await res.json();
      if (data.ok) {
        // Fetch updated role
        const userRes = await fetch(`/api/users?email=${encodeURIComponent(account.address)}`);
        const userData = await userRes.json();
        if (userData?.user?.role) {
          setAccountRoles(prev => ({...prev, [account.id]: userData.user.role}));
        }
        setNotification({ type: 'success', message: '✅ Login synced! Sign out and back in to use this account.' });
        setTimeout(() => setNotification(null), 4000);
      } else {
        throw new Error(data.error || 'Sync failed');
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: `❌ Sync failed: ${err.message}` });
      setTimeout(() => setNotification(null), 4000);
    }
    setSyncingAccountId(null);
  };

  const handlePermanentDelete = async (record: any) => {
    const confirmText = `⚠️ PERMANENT DELETE WARNING!\n\nThis will PERMANENTLY DELETE this record from the database.\nThis action CANNOT be undone!\n\nAre you absolutely sure?`;
    
    if (!confirm(confirmText)) {
      return;
    }

    try {
      let endpoint = '';
      switch(databaseView) {
        case 'shipments':
          endpoint = `/api/shipments?id=${record.id}`;
          break;
        case 'inquiries':
          endpoint = `/api/database/inquiries?id=${record.id}`;
          break;
        case 'emails':
          endpoint = `/api/database/emails?id=${record.id}`;
          break;
        case 'staffDirectory':
          endpoint = `/api/email-accounts?id=${record.id}`;
          break;
        case 'users':
          alert('Cannot delete users from this interface');
          return;
      }

      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json();

      if (data.ok) {
        setNotification({ type: 'success', message: 'Record permanently deleted from database' });
        setTimeout(() => setNotification(null), 3000);
        setShowDbRecordModal(false);
        setSelectedDbRecord(null);
        // Reload the table data
        loadDatabaseData(databaseView);
      } else {
        setNotification({ type: 'error', message: 'Failed to delete record' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error('Error deleting record:', err);
      setNotification({ type: 'error', message: 'Failed to delete record' });
      setTimeout(() => setNotification(null), 3000);
    }
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

  const handleViewQuote = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setShowInquiryModal(true);
  };

  const openMailClientForQuote = (inquiry: any) => {
    const customerName = inquiry.name || '';
    const details = [
      inquiry.company ? `Company: ${inquiry.company}` : null,
      inquiry.service ? `Service: ${String(inquiry.service).toUpperCase()}` : null,
      inquiry.productType ? `Product: ${inquiry.productType}` : null,
      inquiry.weight ? `Weight: ${inquiry.weight} ${inquiry.weightUnit || 'kg'}` : null,
      inquiry.phone ? `Phone: ${inquiry.phone}` : null,
      `Email: ${inquiry.email}`,
    ].filter(Boolean).join('\n');
    const subject = `RE: Quote Request - ${customerName}`;
    const body = `Dear ${customerName},\n\nThank you for your quote request. Below is a summary of your inquiry:\n\n${details}\n\nWe will prepare the best possible rate and transit details for you. If anything above needs correction, please reply to this email.\n\nBest regards,\nAsian Shipping Thai Team`;
    const mailtoUrl = `mailto:${encodeURIComponent(inquiry.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const markInquiryResponded = async (inquiryId: string) => {
    try {
      const res = await fetch(`/api/inquiries?id=${inquiryId}&action=status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'responded' })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setInquiries(prev => prev.map(i => i.id === inquiryId ? { ...i, status: 'responded' } : i));
        setNotification({ type: 'success', message: '✅ Marked as responded' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        throw new Error(data?.error || 'Failed to update status');
      }
    } catch (err) {
      setNotification({ type: 'error', message: '❌ Could not mark as responded' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleReplyToQuote = async (inquiry: any) => {
    openMailClientForQuote(inquiry);
    // Optional quick prompt to mark responded
    setTimeout(async () => {
      // Give the mail app a moment to open first
      if (confirm('Mark this inquiry as responded?')) {
        await markInquiryResponded(inquiry.id);
      }
    }, 400);
  };

  const handleCreateEmailFromCell = (inquiry: any) => {
    handleReplyToQuote(inquiry);
  };

  const handleCreateShipmentFromInquiry = (inquiry: any) => {
    setCreateShipmentFromInquiry(inquiry);
    setActiveSection('add');
    setTimeout(() => {
      // Pre-fill form fields
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) {
        (form.querySelector('[name="customerName"]') as HTMLInputElement).value = inquiry.name || '';
        (form.querySelector('[name="customerEmail"]') as HTMLInputElement).value = inquiry.email || '';
        if (inquiry.service === 'airfreight') {
          (form.querySelector('[name="serviceType"]') as HTMLSelectElement).value = 'Airfreight';
        } else if (inquiry.service === 'fcl') {
          (form.querySelector('[name="serviceType"]') as HTMLSelectElement).value = 'Seafreight FCL';
        } else if (inquiry.service === 'lcl') {
          (form.querySelector('[name="serviceType"]') as HTMLSelectElement).value = 'Seafreight LCL';
        }
        if (inquiry.weight) {
          (form.querySelector('[name="weight"]') as HTMLInputElement).value = String(inquiry.weight);
        }
        if (inquiry.productType) {
          (form.querySelector('[name="containerContents"]') as HTMLInputElement).value = inquiry.productType;
        }
        setNotification({ type: 'success', message: `📦 Shipment form pre-filled for ${inquiry.name}` });
        setTimeout(() => setNotification(null), 3000);
      }
    }, 200);
  };

  const handleComposeEmail = () => {
    setEmailTo('');
    setEmailSubject('');
    setEmailMessage('');
    setReplyingToInquiryId(null); // Clear inquiry ID for new email
    setActiveSection('emails');
    setTimeout(() => {
      const emailForm = document.getElementById('email-compose-form');
      if (emailForm) {
        emailForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setNotification({ type: 'success', message: '📧 Ready to compose new email' });
        setTimeout(() => setNotification(null), 3000);
      }
    }, 100);
  };

  // Tracking functions
  const loadTrackingUpdates = async (shipmentId: string) => {
    try {
      const res = await fetch(`/api/tracking?shipmentId=${shipmentId}`);
      const data = await res.json();
      setTrackingUpdates(data);
    } catch (error) {
      console.error('Failed to load tracking updates:', error);
    }
  };

  const handleAddTrackingUpdate = async (shipmentId: string) => {
    if (!newTrackingStatus.trim()) {
      alert('Please enter a status');
      return;
    }

    try {
      const res = await fetch('/api/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipmentId,
          status: newTrackingStatus,
          location: newTrackingLocation || null,
          description: newTrackingDescription || null,
        }),
      });

      if (res.ok) {
        await loadTrackingUpdates(shipmentId);
        setNewTrackingStatus('');
        setNewTrackingLocation('');
        setNewTrackingDescription('');
        setNotification({ type: 'success', message: '✅ Tracking update added' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        throw new Error('Failed to add tracking update');
      }
    } catch (error) {
      console.error('Error adding tracking update:', error);
      setNotification({ type: 'error', message: '❌ Failed to add tracking update' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeleteTrackingUpdate = async (updateId: string, shipmentId: string) => {
    if (!confirm('Delete this tracking update?')) return;

    try {
      const res = await fetch(`/api/tracking?id=${updateId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await loadTrackingUpdates(shipmentId);
        setNotification({ type: 'success', message: '✅ Tracking update deleted' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        throw new Error('Failed to delete tracking update');
      }
    } catch (error) {
      console.error('Error deleting tracking update:', error);
      setNotification({ type: 'error', message: '❌ Failed to delete tracking update' });
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
            className={`flex items-center px-3 py-2 rounded-md w-full text-left transition ${
              activeSection === 'news'
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveSection('news')}
          >
              <span className="mr-3 text-lg">📰</span> Manage News
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
              {inquiries.length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{inquiries.length}</span>
              )}
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
            className="flex items-center px-3 py-2 rounded-md w-full text-left transition text-gray-300 hover:bg-gray-800"
            onClick={() => setShowDatabaseModal(true)}
          >
              <span className="mr-3 text-lg">🗄️</span> Database
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
        {/* Notification Banner */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
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
        </AnimatePresence>

        {/* Inquiry Detail Modal */}
        <AnimatePresence>
          {showInquiryModal && selectedInquiry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowInquiryModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Inquiry Details</h2>
                    <button
                      onClick={() => setShowInquiryModal(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Customer Name</label>
                        <p className="text-lg text-gray-800">{selectedInquiry.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Email</label>
                        <p className="text-lg text-gray-800">{selectedInquiry.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Phone</label>
                        <p className="text-lg text-gray-800">{selectedInquiry.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Company</label>
                        <p className="text-lg text-gray-800">{selectedInquiry.company || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Service Type</label>
                        <p className="text-lg text-gray-800 capitalize">{selectedInquiry.service}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Product Type</label>
                        <p className="text-lg text-gray-800">{selectedInquiry.productType || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Weight</label>
                        <p className="text-lg text-gray-800">
                          {selectedInquiry.weight ? `${selectedInquiry.weight} ${selectedInquiry.weightUnit || 'kg'}` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Date Submitted</label>
                        <p className="text-lg text-gray-800">
                          {new Date(selectedInquiry.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-gray-500">Message</label>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-800 whitespace-pre-wrap">{selectedInquiry.message}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={() => {
                        setShowInquiryModal(false);
                        handleReplyToQuote(selectedInquiry);
                      }}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      Reply to Customer
                    </button>
                    <button
                      onClick={() => setShowInquiryModal(false)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                <p className="text-purple-100 text-sm">{inquiries.length} {inquiries.length === 1 ? 'request' : 'requests'}</p>
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
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No recent activity</p>
                  <p className="text-xs mt-1">Activity will appear here as you work</p>
                </div>
              </div>

              {/* Quick Stats & Alerts */}
              <div className="space-y-6">
                {/* Pending Actions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Pending Actions</h3>
                  <div className="space-y-3">
                    {inquiries.filter(i => i.status === 'new' || !i.status).length > 0 && (
                      <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                        <p className="font-semibold text-sm text-orange-700">Follow-up</p>
                        <p className="text-xs text-gray-600 mt-1">{inquiries.filter(i => i.status === 'new' || !i.status).length} quote requests to respond</p>
                      </div>
                    )}
                    {shipments.filter(s => s.paymentStatus === 'Pending').length > 0 && (
                      <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                        <p className="font-semibold text-sm text-yellow-700">Review</p>
                        <p className="text-xs text-gray-600 mt-1">{shipments.filter(s => s.paymentStatus === 'Pending').length} pending payments</p>
                      </div>
                    )}
                    {inquiries.filter(i => i.status === 'new' || !i.status).length === 0 && shipments.filter(s => s.paymentStatus === 'Pending').length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No pending actions</p>
                    )}
                  </div>
                </div>

                {/* Performance This Month */}
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold mb-4">This Month</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Shipments</span>
                        <span className="font-bold">{shipments.length}</span>
                      </div>
                      <div className="bg-white/20 rounded-full h-2">
                        <div className="bg-white rounded-full h-2" style={{width: `${Math.min(100, (shipments.length / 30) * 100)}%`}}></div>
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
                            onClick={() => {
                              setEditingShipment(shipment);
                              if (shipment.dbId) {
                                loadTrackingUpdates(shipment.dbId);
                              }
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit & Track
                          </button>
                          <button 
                            onClick={() => window.open(`/tracking/${shipment.id}`, '_blank')}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            View
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
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                >
                  <h3 className="text-2xl font-bold mb-6">Edit Shipment: {editingShipment.id}</h3>
                  
                  {/* Shipment Details Form */}
                  <form onSubmit={handleUpdateShipment} className="space-y-4 mb-8">
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

                  {/* Tracking Timeline Section */}
                  <div className="border-t pt-8">
                    <h4 className="text-xl font-bold mb-4">Tracking Timeline</h4>
                    
                    {/* Add New Tracking Update */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h5 className="font-semibold mb-3">Add Tracking Update</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                          <input
                            type="text"
                            value={newTrackingStatus}
                            onChange={(e) => setNewTrackingStatus(e.target.value)}
                            placeholder="e.g., Package Picked Up, In Transit, Customs Clearance"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                              type="text"
                              value={newTrackingLocation}
                              onChange={(e) => setNewTrackingLocation(e.target.value)}
                              placeholder="e.g., Bangkok, Thailand"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                              type="text"
                              value={newTrackingDescription}
                              onChange={(e) => setNewTrackingDescription(e.target.value)}
                              placeholder="Additional details"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddTrackingUpdate(editingShipment.dbId || editingShipment.id)}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                          + Add Tracking Update
                        </button>
                      </div>
                    </div>

                    {/* Tracking Timeline Display */}
                    <div className="space-y-4">
                      {trackingUpdates.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No tracking updates yet</p>
                      ) : (
                        <div className="relative">
                          {/* Vertical timeline line */}
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                          
                          {trackingUpdates.map((update, index) => (
                            <div key={update.id} className="relative pl-12 pb-6">
                              {/* Timeline dot */}
                              <div className={`absolute left-2 top-0 w-4 h-4 rounded-full border-2 ${
                                update.isActive 
                                  ? 'bg-green-500 border-green-600' 
                                  : 'bg-red-500 border-red-600'
                              }`}></div>
                              
                              {/* Update content */}
                              <div className={`bg-white border-2 rounded-lg p-4 ${
                                update.isActive 
                                  ? 'border-green-500' 
                                  : 'border-red-300'
                              }`}>
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h6 className="font-bold text-lg">{update.status}</h6>
                                      {update.isActive && (
                                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">
                                          CURRENT
                                        </span>
                                      )}
                                    </div>
                                    {update.location && (
                                      <p className="text-sm text-gray-600">📍 {update.location}</p>
                                    )}
                                    {update.description && (
                                      <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-2">
                                      {new Date(update.createdAt).toLocaleString()}
                                      {update.createdBy && ` • by ${update.createdBy}`}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteTrackingUpdate(update.id, editingShipment.dbId || editingShipment.id)}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
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

              {/* Tracking Results */}
              {trackingResult ? (
                <div className="mt-8">
                  {/* Shipment Info Card */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-6 border border-red-200">
                    <h3 className="text-xl font-bold mb-4">Shipment Details: {trackingResult.id}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Customer</p>
                        <p className="font-semibold">{trackingResult.customerName}</p>
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
                        <p className="text-sm text-gray-600">Service Type</p>
                        <p className="font-semibold">{trackingResult.serviceType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Route</p>
                        <p className="font-semibold">{trackingResult.origin} → {trackingResult.destination}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Weight</p>
                        <p className="font-semibold">{trackingResult.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Booking Date</p>
                        <p className="font-semibold">{trackingResult.bookingDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h4 className="text-xl font-bold mb-6">📍 Tracking Timeline</h4>
                    
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
                                    {update.createdBy && ` • by ${update.createdBy}`}
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
              ) : (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-500">Enter a tracking ID to see shipment details</p>
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

        {/* News Management Section */}
        {activeSection === 'news' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Manage News</h2>
              <button
                onClick={() => {
                  setShowNewsForm(true);
                  setEditingNews(null);
                  setNewsTitle('');
                  setNewsExcerpt('');
                  setNewsContent('');
                  setNewsImageUrl('');
                  setNewsPublished(false);
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
              >
                <span>➕</span> Create News Article
              </button>
            </div>

            {/* News Form Modal */}
            {showNewsForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                      {editingNews ? 'Edit Article' : 'Create New Article'}
                    </h3>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const url = '/api/news';
                          const method = editingNews ? 'PUT' : 'POST';
                          const body = editingNews
                            ? { id: editingNews.id, title: newsTitle, excerpt: newsExcerpt, content: newsContent, imageUrl: newsImageUrl, published: newsPublished }
                            : { title: newsTitle, excerpt: newsExcerpt, content: newsContent, imageUrl: newsImageUrl, published: newsPublished };

                          const res = await fetch(url, {
                            method,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(body),
                          });

                          const data = await res.json();
                          if (res.ok && data.ok) {
                            setNotification({ type: 'success', message: editingNews ? '✅ Article updated!' : '✅ Article created!' });
                            setShowNewsForm(false);
                            // Refresh news list
                            const newsRes = await fetch('/api/news');
                            const newsData = await newsRes.json();
                            if (newsData.ok) setNewsArticles(newsData.data);
                          } else {
                            setNotification({ type: 'error', message: `❌ ${data.error || 'Failed to save article'}` });
                          }
                          setTimeout(() => setNotification(null), 3000);
                        } catch (error) {
                          setNotification({ type: 'error', message: '❌ Failed to save article' });
                          setTimeout(() => setNotification(null), 3000);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                        <input
                          type="text"
                          value={newsTitle}
                          onChange={(e) => setNewsTitle(e.target.value)}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                          placeholder="Article title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                        <textarea
                          value={newsExcerpt}
                          onChange={(e) => setNewsExcerpt(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                          rows={2}
                          placeholder="Short preview text (optional)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                        <textarea
                          value={newsContent}
                          onChange={(e) => setNewsContent(e.target.value)}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                          rows={10}
                          placeholder="Full article content"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <input
                          type="url"
                          value={newsImageUrl}
                          onChange={(e) => setNewsImageUrl(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                          placeholder="https://example.com/image.jpg (optional)"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="newsPublished"
                          checked={newsPublished}
                          onChange={(e) => setNewsPublished(e.target.checked)}
                          className="w-5 h-5"
                        />
                        <label htmlFor="newsPublished" className="text-sm font-medium text-gray-700">
                          Publish immediately
                        </label>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                          {editingNews ? 'Update Article' : 'Create Article'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewsForm(false)}
                          className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>
            )}

            {/* News List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Author</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newsArticles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No news articles yet. Create your first article!
                      </td>
                    </tr>
                  ) : (
                    newsArticles.map((article) => (
                      <tr key={article.id} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">{article.title}</div>
                          {article.excerpt && (
                            <div className="text-sm text-gray-500 mt-1 line-clamp-1">{article.excerpt}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            article.published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {article.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{article.author}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              setEditingNews(article);
                              setNewsTitle(article.title);
                              setNewsExcerpt(article.excerpt || '');
                              setNewsContent(article.content);
                              setNewsImageUrl(article.imageUrl || '');
                              setNewsPublished(article.published);
                              setShowNewsForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Edit
                          </button>
                          <a
                            href={`/news/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 mr-3"
                          >
                            View
                          </a>
                          <button
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this article?')) {
                                try {
                                  const res = await fetch(`/api/news?id=${article.id}`, { method: 'DELETE' });
                                  const data = await res.json();
                                  if (res.ok && data.ok) {
                                    setNotification({ type: 'success', message: '✅ Article deleted!' });
                                    // Refresh news list
                                    const newsRes = await fetch('/api/news');
                                    const newsData = await newsRes.json();
                                    if (newsData.ok) setNewsArticles(newsData.data);
                                  } else {
                                    setNotification({ type: 'error', message: '❌ Failed to delete article' });
                                  }
                                  setTimeout(() => setNotification(null), 3000);
                                } catch (error) {
                                  setNotification({ type: 'error', message: '❌ Failed to delete article' });
                                  setTimeout(() => setNotification(null), 3000);
                                }
                              }
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
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
                    <p className="text-3xl font-bold text-blue-600">
                      {inquiries.filter(i => i.status === 'new' || !i.status).length}
                    </p>
                  </div>
                  <div className="text-4xl">✉️</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Responded</p>
                    <p className="text-3xl font-bold text-green-600">
                      {inquiries.filter(i => i.status === 'responded').length}
                    </p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Pending</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {inquiries.filter(i => i.status === 'pending').length}
                    </p>
                  </div>
                  <div className="text-4xl">⏱️</div>
                </div>
              </div>
            </div>

            {/* Quote Requests Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-6 border-b flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold">Quote Requests ({inquiries.length})</h3>
                  {selectedInquiries.length > 0 && (
                    <button
                      onClick={handleBulkDeleteInquiries}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition text-sm"
                    >
                      Remove Selected ({selectedInquiries.length})
                    </button>
                  )}
                </div>
                <div className="text-sm text-gray-500">Emails open in your default mail client.</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedInquiries.length === inquiries.length && inquiries.length > 0}
                          onChange={toggleAllInquiries}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Service Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product/Weight</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                          No inquiries yet. Contact form submissions will appear here.
                        </td>
                      </tr>
                    ) : (
                      inquiries.map((inquiry) => (
                        <tr key={inquiry.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedInquiries.includes(inquiry.id)}
                              onChange={() => toggleInquirySelection(inquiry.id)}
                              className="w-4 h-4 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {new Date(inquiry.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </td>
                          <td className="px-6 py-4 font-medium">
                            {inquiry.name}
                            {inquiry.company && <div className="text-xs text-gray-500">{inquiry.company}</div>}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {inquiry.email}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              inquiry.service === 'airfreight' ? 'bg-blue-100 text-blue-700' :
                              inquiry.service === 'fcl' ? 'bg-purple-100 text-purple-700' :
                              inquiry.service === 'lcl' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {inquiry.service === 'airfreight' ? 'Airfreight' :
                               inquiry.service === 'fcl' ? 'FCL' :
                               inquiry.service === 'lcl' ? 'LCL' :
                               inquiry.service}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {inquiry.productType && <div className="text-gray-700">{inquiry.productType}</div>}
                            {inquiry.weight && (
                              <div className="text-xs text-gray-500">
                                {inquiry.weight} {inquiry.weightUnit || 'kg'}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              inquiry.status === 'responded' ? 'bg-green-100 text-green-700' :
                              inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {inquiry.status === 'responded' ? 'Responded' :
                               inquiry.status === 'pending' ? 'Pending' : 'New'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex gap-2 justify-center">
                              {inquiry.status === 'replied' ? (
                                <>
                                  <button
                                    onClick={() => handleCreateShipmentFromInquiry(inquiry)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                                  >
                                    Create Shipment
                                  </button>
                                  <button
                                    onClick={() => handleDeleteInquiry(inquiry.id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                                  >
                                    Remove
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button 
                                    onClick={() => handleViewQuote(inquiry)}
                                    className="text-blue-600 hover:text-blue-800 mr-3 text-sm"
                                  >
                                    View
                                  </button>
                                  <button 
                                    onClick={() => handleReplyToQuote(inquiry)}
                                    className="text-green-600 hover:text-green-800 text-sm"
                                  >
                                    Open in Email Client
                                  </button>
                                  <button
                                    onClick={() => markInquiryResponded(inquiry.id)}
                                    className="text-gray-600 hover:text-gray-800 text-sm ml-3"
                                  >
                                    Mark Responded
                                  </button>
                                  <button
                                    onClick={() => handleDeleteInquiry(inquiry.id)}
                                    className="text-red-600 hover:text-red-800 ml-3 text-sm"
                                  >
                                    Remove
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Email sending moved to external client */}
            <div id="email-compose-form" className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-2">Email Responses</h3>
              <p className="text-gray-600 text-sm">In-app sending has been removed. Use your email client via the “Open in Email Client” buttons. You can log emails in the Database → Emails tab with “Add Email”.</p>
            </div>

            {/* Outbox */}
            <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Recent Emails</h3>
                {selectedEmails.length > 0 && (
                  <button
                    onClick={handleBulkDeleteEmails}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition text-sm"
                  >
                    Remove Selected ({selectedEmails.length})
                  </button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedEmails.length === outbox.length && outbox.length > 0}
                          onChange={toggleAllEmails}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">From</th>
                      <th className="px-4 py-2 text-left">To</th>
                      <th className="px-4 py-2 text-left">Subject</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outbox.map((m)=> (
                      <tr 
                        key={m.id} 
                        className="border-t hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedEmails.includes(m.id)}
                            onChange={() => toggleEmailSelection(m.id)}
                            className="w-4 h-4 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td 
                          className="px-4 py-2 cursor-pointer"
                          onClick={() => {
                            setSelectedEmail(m);
                            setShowEmailModal(true);
                          }}
                        >
                          {new Date(m.createdAt).toLocaleString()}
                        </td>
                        <td 
                          className="px-4 py-2 cursor-pointer"
                          onClick={() => {
                            setSelectedEmail(m);
                            setShowEmailModal(true);
                          }}
                        >
                          {m.from}
                        </td>
                        <td 
                          className="px-4 py-2 cursor-pointer"
                          onClick={() => {
                            setSelectedEmail(m);
                            setShowEmailModal(true);
                          }}
                        >
                          {m.to}
                        </td>
                        <td 
                          className="px-4 py-2 truncate max-w-[300px] cursor-pointer"
                          onClick={() => {
                            setSelectedEmail(m);
                            setShowEmailModal(true);
                          }}
                        >
                          {m.subject}
                        </td>
                        <td 
                          className="px-4 py-2 cursor-pointer"
                          onClick={() => {
                            setSelectedEmail(m);
                            setShowEmailModal(true);
                          }}
                        >
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
                    Need help? Contact support at <a href="mailto:info@asianshippingthai.com" className="text-red-600 hover:underline">info@asianshippingthai.com</a>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                  <span className="col-span-3 text-gray-900">
                    {selectedEmail.from}
                    {(() => {
                      const acc = staffDirectory.find(a => a.address?.toLowerCase() === String(selectedEmail.from || '').toLowerCase());
                      return acc ? (
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${acc.accountType==='staff'?'bg-purple-100 text-purple-700':'bg-blue-100 text-blue-700'}`}>{acc.accountType}</span>
                      ) : null;
                    })()}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <span className="font-semibold text-gray-700">To:</span>
                  <span className="col-span-3 text-gray-900">
                    {selectedEmail.to}
                    {(() => {
                      const acc = staffDirectory.find(a => a.address?.toLowerCase() === String(selectedEmail.to || '').toLowerCase());
                      return acc ? (
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${acc.accountType==='staff'?'bg-purple-100 text-purple-700':'bg-blue-100 text-blue-700'}`}>{acc.accountType}</span>
                      ) : null;
                    })()}
                  </span>
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

            <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-between items-center">
              <div className="flex gap-3">
                {selectedEmail.direction === 'outgoing' && selectedEmail.subject?.includes('RE: Quote Request') && (
                  (() => {
                    // Find the inquiry associated with this email
                    const inquiry = inquiries.find(inq => 
                      inq.email === selectedEmail.to && inq.status === 'replied'
                    );
                    return inquiry ? (
                      <button
                        onClick={() => {
                          setShowEmailModal(false);
                          handleCreateShipmentFromInquiry(inquiry);
                        }}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        📦 Create Shipment
                      </button>
                    ) : null;
                  })()
                )}
                <button
                  onClick={() => handleDeleteEmail(selectedEmail.id)}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition"
                >
                  Remove
                </button>
              </div>
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

      {/* Database Viewer Modal */}
      {showDatabaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => {
          setShowDatabaseModal(false);
          setDatabaseUnlocked(false);
          setDatabasePassword('');
        }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">🗄️ Database Viewer</h2>
              <button
                onClick={() => {
                  setShowDatabaseModal(false);
                  setDatabaseUnlocked(false);
                  setDatabasePassword('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!databaseUnlocked ? (
              <div className="p-12">
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🔒</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Password Required</h3>
                    <p className="text-gray-600">Enter the database access password to continue</p>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); handleDatabaseAccess(); }} className="space-y-4">
                    <input
                      type="password"
                      value={databasePassword}
                      onChange={(e) => setDatabasePassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-lg"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                      Unlock Database
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="p-6">
                {/* Table Selector */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                  <button
                    onClick={() => loadDatabaseData('shipments')}
                    className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                      databaseView === 'shipments' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    📦 Shipments ({databaseView === 'shipments' ? databaseData.length : '...'})
                  </button>
                  <button
                    onClick={() => loadDatabaseData('inquiries')}
                    className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                      databaseView === 'inquiries' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    ✉️ Inquiries ({databaseView === 'inquiries' ? databaseData.length : '...'})
                  </button>
                  <button
                    onClick={() => loadDatabaseData('emails')}
                    className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                      databaseView === 'emails' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    📧 Emails ({databaseView === 'emails' ? databaseData.length : '...'})
                  </button>
                  <button
                    onClick={() => loadDatabaseData('staffDirectory')}
                    className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                      databaseView === 'staffDirectory' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    👔 Staff Directory ({databaseView === 'staffDirectory' ? databaseData.length : '...'})
                  </button>
                  <button
                    onClick={() => loadDatabaseData('users')}
                    className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                      databaseView === 'users' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    👥 Users ({databaseView === 'users' ? databaseData.length : '...'})
                  </button>
                </div>

                {/* Data Display */}
                {databaseLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    <p className="mt-4 text-gray-600">Loading data...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {databaseView === 'emails' && (
                      <div className="mb-3 flex justify-end">
                        <button
                          onClick={() => setShowAddEmailModal(true)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                        >
                          + Add Email
                        </button>
                      </div>
                    )}
                    {databaseView === 'staffDirectory' && (
                      <div className="mb-3 flex justify-end">
                        <button
                          onClick={() => { setEditingAccount(null); setAccAddress(''); setAccUsername(''); setAccPassword(''); setAccType('customer'); setShowAddAccountModal(true); }}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                        >
                          + Add Staff Contact
                        </button>
                      </div>
                    )}
                    <div className="mb-4 text-sm text-gray-600">
                      Total Records: <span className="font-bold">{databaseData.length}</span>
                      {databaseView === 'inquiries' && (
                        <span className="ml-4">
                          Hidden: <span className="font-bold text-orange-600">{databaseData.filter((d: any) => d.hidden).length}</span>
                        </span>
                      )}
                      {databaseView === 'emails' && (
                        <span className="ml-4">
                          Hidden: <span className="font-bold text-orange-600">{databaseData.filter((d: any) => d.hidden).length}</span>
                        </span>
                      )}
                    </div>
                    <table className="w-full text-sm border">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          {databaseView === 'shipments' && (
                            <>
                              <th className="px-3 py-2 text-left border">Code</th>
                              <th className="px-3 py-2 text-left border">Customer</th>
                              <th className="px-3 py-2 text-left border">Email</th>
                              <th className="px-3 py-2 text-left border">Origin → Dest</th>
                              <th className="px-3 py-2 text-left border">Service</th>
                              <th className="px-3 py-2 text-left border">Status</th>
                              <th className="px-3 py-2 text-left border">Weight</th>
                              <th className="px-3 py-2 text-left border">Price</th>
                              <th className="px-3 py-2 text-left border">Created</th>
                            </>
                          )}
                          {databaseView === 'inquiries' && (
                            <>
                              <th className="px-3 py-2 text-left border">Name</th>
                              <th className="px-3 py-2 text-left border">Email</th>
                              <th className="px-3 py-2 text-left border">Phone</th>
                              <th className="px-3 py-2 text-left border">Company</th>
                              <th className="px-3 py-2 text-left border">Service</th>
                              <th className="px-3 py-2 text-left border">Product</th>
                              <th className="px-3 py-2 text-left border">Weight</th>
                              <th className="px-3 py-2 text-left border">Status</th>
                              <th className="px-3 py-2 text-left border">Hidden</th>
                              <th className="px-3 py-2 text-left border">Created</th>
                            </>
                          )}
                          {databaseView === 'emails' && (
                            <>
                              <th className="px-3 py-2 text-left border">From</th>
                              <th className="px-3 py-2 text-left border">To</th>
                              <th className="px-3 py-2 text-left border">Subject</th>
                              <th className="px-3 py-2 text-left border">Status</th>
                              <th className="px-3 py-2 text-left border">Hidden</th>
                              <th className="px-3 py-2 text-left border">Created</th>
                              <th className="px-3 py-2 text-left border">Sent</th>
                            </>
                          )}
                          {databaseView === 'staffDirectory' && (
                            <>
                              <th className="px-3 py-2 text-left border">Email Address</th>
                              <th className="px-3 py-2 text-left border">Name</th>
                              <th className="px-3 py-2 text-left border">Type</th>
                              <th className="px-3 py-2 text-left border">Active</th>
                              <th className="px-3 py-2 text-left border">Created</th>
                              <th className="px-3 py-2 text-left border">Login Status</th>
                            </>
                          )}
                          {databaseView === 'users' && (
                            <>
                              <th className="px-3 py-2 text-left border">Name</th>
                              <th className="px-3 py-2 text-left border">Email</th>
                              <th className="px-3 py-2 text-left border">Role</th>
                              <th className="px-3 py-2 text-left border">Provider</th>
                              <th className="px-3 py-2 text-left border">Created</th>
                              <th className="px-3 py-2 text-center border">Actions</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {databaseData.map((row: any) => (
                          <tr 
                            key={row.id} 
                            className={`border-t hover:bg-blue-50 cursor-pointer transition-colors ${row.hidden ? 'bg-orange-50' : ''}`}
                            onClick={() => {
                              setSelectedDbRecord(row);
                              setShowDbRecordModal(true);
                            }}
                          >
                            {databaseView === 'shipments' && (
                              <>
                                <td className="px-3 py-2 border font-mono text-xs">{row.code}</td>
                                <td className="px-3 py-2 border">{row.customerName}</td>
                                <td className="px-3 py-2 border text-xs">{row.customerEmail}</td>
                                <td className="px-3 py-2 border text-xs">{row.origin} → {row.destination}</td>
                                <td className="px-3 py-2 border">{row.serviceType}</td>
                                <td className="px-3 py-2 border">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    row.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                    row.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>{row.status}</span>
                                </td>
                                <td className="px-3 py-2 border">{row.weight} kg</td>
                                <td className="px-3 py-2 border">${row.price}</td>
                                <td className="px-3 py-2 border text-xs">{new Date(row.createdAt).toLocaleDateString()}</td>
                              </>
                            )}
                            {databaseView === 'inquiries' && (
                              <>
                                <td className="px-3 py-2 border">{row.name}</td>
                                <td className="px-3 py-2 border text-xs">{row.email}</td>
                                <td className="px-3 py-2 border text-xs">{row.phone || '-'}</td>
                                <td className="px-3 py-2 border text-xs">{row.company || '-'}</td>
                                <td className="px-3 py-2 border">{row.service}</td>
                                <td className="px-3 py-2 border text-xs">{row.productType || '-'}</td>
                                <td className="px-3 py-2 border">{row.weight ? `${row.weight} ${row.weightUnit || 'kg'}` : '-'}</td>
                                <td className="px-3 py-2 border">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    row.status === 'responded' ? 'bg-green-100 text-green-700' :
                                    row.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-orange-100 text-orange-700'
                                  }`}>{row.status}</span>
                                </td>
                                <td className="px-3 py-2 border text-center">
                                  {row.hidden ? <span className="text-orange-600 font-bold">✓</span> : '-'}
                                </td>
                                <td className="px-3 py-2 border text-xs">{new Date(row.createdAt).toLocaleDateString()}</td>
                              </>
                            )}
                            {databaseView === 'emails' && (
                              <>
                                <td className="px-3 py-2 border text-xs">{row.from}</td>
                                <td className="px-3 py-2 border text-xs">{row.to}</td>
                                <td className="px-3 py-2 border">{row.subject}</td>
                                <td className="px-3 py-2 border">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    row.status === 'sent' ? 'bg-green-100 text-green-700' :
                                    row.status === 'failed' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>{row.status}</span>
                                </td>
                                <td className="px-3 py-2 border text-center">
                                  {row.hidden ? <span className="text-orange-600 font-bold">✓</span> : '-'}
                                </td>
                                <td className="px-3 py-2 border text-xs">{new Date(row.createdAt).toLocaleDateString()}</td>
                                <td className="px-3 py-2 border text-xs">{row.sentAt ? new Date(row.sentAt).toLocaleDateString() : '-'}</td>
                              </>
                            )}
                            {databaseView === 'users' && (
                              <>
                                <td className="px-3 py-2 border">{row.name || '-'}</td>
                                <td className="px-3 py-2 border text-xs">{row.email}</td>
                                <td className="px-3 py-2 border">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    row.role === 'employee' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {row.role === 'employee' ? '👔 Staff' : '👤 Customer'}
                                  </span>
                                </td>
                                <td className="px-3 py-2 border">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    row.provider === 'google' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {row.provider === 'google' ? '🔴 Google' : '🔑 Email'}
                                  </span>
                                </td>
                                <td className="px-3 py-2 border text-xs">{new Date(row.createdAt).toLocaleDateString()}</td>
                                <td className="px-3 py-2 border text-center" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={async () => {
                                      if (!confirm(`Are you sure you want to permanently delete user "${row.email}"? This action cannot be undone.`)) return;
                                      try {
                                        const res = await fetch(`/api/users/${row.id}`, { method: 'DELETE' });
                                        const data = await res.json();
                                        if (data.ok) {
                                          alert('User deleted successfully');
                                          loadDatabaseData('users');
                                        } else {
                                          alert(data.error || 'Failed to delete user');
                                        }
                                      } catch (err) {
                                        alert('Failed to delete user');
                                      }
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                  >
                                    🗑️ Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {databaseView === 'staffDirectory' && (
                              <>
                                <td className="px-3 py-2 border text-xs">{row.address}</td>
                                <td className="px-3 py-2 border text-xs">{row.username}</td>
                                <td className="px-3 py-2 border"><span className={`px-2 py-1 rounded-full text-xs ${row.accountType==='staff'?'bg-purple-100 text-purple-700':'bg-blue-100 text-blue-700'}`}>{row.accountType}</span></td>
                                <td className="px-3 py-2 border">{row.active ? '✓' : '—'}</td>
                                <td className="px-3 py-2 border text-xs">{new Date(row.createdAt).toLocaleDateString()}</td>
                                <td className="px-3 py-2 border text-xs" onClick={(e)=>e.stopPropagation()}>
                                  {accountRoles[row.id] ? (
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                      accountRoles[row.id]==='employee'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-700'
                                    }`}>
                                      {accountRoles[row.id]==='employee'?'🔓 Staff':'👤 Customer'}
                                    </span>
                                  ) : (
                                    <button
                                      onClick={()=>handleEnableStaffLogin(row)}
                                      disabled={syncingAccountId===row.id}
                                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                                    >
                                      {syncingAccountId===row.id?'Syncing...':'Enable Login'}
                                    </button>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {databaseData.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        No data found in this table
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Database Record Detail Modal */}
      {showDbRecordModal && selectedDbRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4" onClick={() => setShowDbRecordModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {databaseView === 'shipments' && `📦 Shipment: ${selectedDbRecord.code}`}
                {databaseView === 'inquiries' && `✉️ Inquiry: ${selectedDbRecord.name}`}
                {databaseView === 'emails' && `📧 Email: ${selectedDbRecord.subject}`}
                {databaseView === 'staffDirectory' && `👔 Staff Contact: ${selectedDbRecord.address}`}
              </h2>
              <button
                onClick={() => setShowDbRecordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {selectedDbRecord.hidden && (
                <div className="mb-4 p-3 bg-orange-100 border border-orange-300 rounded-lg text-orange-800 font-semibold">
                  ⚠️ This record is hidden from the main view
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedDbRecord).map(([key, value]) => {
                  // Skip certain fields or format them nicely
                  if (key === 'id' || key === 'version') return null;
                  
                  let displayValue: any = value;
                  let displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  
                  // Format dates
                  if (key.includes('At') || key.includes('Date')) {
                    try {
                      displayValue = value ? new Date(value as string).toLocaleString() : '-';
                    } catch {
                      displayValue = value || '-';
                    }
                  }
                  
                  // Format booleans
                  if (typeof value === 'boolean') {
                    displayValue = value ? '✓ Yes' : '✗ No';
                  }
                  
                  // Format nulls
                  if (value === null || value === undefined || value === '') {
                    displayValue = '-';
                  }

                  // Special handling for long text fields
                  const isLongText = key === 'message' || key === 'text' || key === 'html' || key === 'description' || key === 'containerContents';
                  
                  return (
                    <div key={key} className={isLongText ? 'col-span-2' : ''}>
                      <div className={`${isLongText ? 'bg-gray-50' : 'bg-white'} border rounded-lg p-4`}>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">{displayKey}</p>
                        {key === 'html' && value ? (
                          <div 
                            className="prose max-w-none text-sm"
                            dangerouslySetInnerHTML={{ __html: value as string }}
                          />
                        ) : (
                          <p className={`text-gray-900 ${isLongText ? 'whitespace-pre-wrap text-sm' : 'font-medium'}`}>
                            {String(displayValue)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Raw JSON View (collapsible) */}
              <details className="mt-6">
                <summary className="cursor-pointer text-sm font-semibold text-gray-600 hover:text-gray-800 p-3 bg-gray-100 rounded-lg">
                  🔍 View Raw JSON Data
                </summary>
                <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-xs font-mono">
                  {JSON.stringify(selectedDbRecord, null, 2)}
                </pre>
              </details>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-between items-center">
              <button
                onClick={() => handlePermanentDelete(selectedDbRecord)}
                className="bg-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-800 transition flex items-center gap-2"
                disabled={databaseView === 'users'}
              >
                🗑️ Permanent Delete
              </button>
              {databaseView === 'staffDirectory' && (
                <button
                  onClick={() => {
                    setEditingAccount(selectedDbRecord);
                    setAccAddress(selectedDbRecord.address || '');
                    setAccUsername(selectedDbRecord.username || '');
                    setAccPassword(selectedDbRecord.password || '');
                    setAccType(selectedDbRecord.accountType === 'staff' ? 'staff' : 'customer');
                    setShowAddAccountModal(true);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => setShowDbRecordModal(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Email Modal */}
      {showAddEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4" onClick={() => setShowAddEmailModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Add Email Record</h3>
              <button onClick={() => setShowAddEmailModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input type="email" value={dbEmailFrom} onChange={(e)=>setDbEmailFrom(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To *</label>
                <input type="email" value={dbEmailTo} onChange={(e)=>setDbEmailTo(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input type="text" value={dbEmailSubject} onChange={(e)=>setDbEmailSubject(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Text)</label>
                <textarea rows={5} value={dbEmailText} onChange={(e)=>setDbEmailText(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => setShowAddEmailModal(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button
                onClick={async () => {
                  if (!dbEmailTo || !dbEmailSubject) {
                    alert('Please provide To and Subject');
                    return;
                  }
                  try {
                    const res = await fetch('/api/database/emails', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ from: dbEmailFrom, to: dbEmailTo, subject: dbEmailSubject, text: dbEmailText, status: 'sent', direction: 'outgoing' })
                    });
                    const data = await res.json();
                    if (res.ok && data.ok) {
                      setNotification({ type: 'success', message: '✅ Email record added' });
                      setTimeout(() => setNotification(null), 3000);
                      setShowAddEmailModal(false);
                      setDbEmailTo(''); setDbEmailSubject(''); setDbEmailText('');
                      if (databaseView === 'emails') {
                        loadDatabaseData('emails');
                      }
                    } else {
                      throw new Error(data?.error || 'Failed to add email');
                    }
                  } catch (err) {
                    setNotification({ type: 'error', message: '❌ Could not add email record' });
                    setTimeout(() => setNotification(null), 3000);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add/Edit Email Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4" onClick={() => { setShowAddAccountModal(false); setEditingAccount(null); }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingAccount ? 'Edit Staff Contact' : 'Add Staff Contact'}</h3>
              <button onClick={() => { setShowAddAccountModal(false); setEditingAccount(null); }} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input type="email" value={accAddress} onChange={(e)=>setAccAddress(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                  <input type="text" value={accUsername} onChange={(e)=>setAccUsername(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input type="text" value={accPassword} onChange={(e)=>setAccPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select value={accType} onChange={(e)=>setAccType(e.target.value as any)} className="w-full border border-gray-300 rounded-lg px-4 py-2">
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => { setShowAddAccountModal(false); setEditingAccount(null); }} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button
                onClick={async () => {
                  if (!accAddress || !accUsername || !accPassword) { alert('Fill required fields'); return; }
                  try {
                    if (editingAccount) {
                      const res = await fetch(`/api/email-accounts?id=${editingAccount.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ address: accAddress, username: accUsername, password: accPassword, accountType: accType })
                      });
                      const data = await res.json();
                      if (!res.ok || !data.ok) throw new Error(data?.error || 'Failed');
                    } else {
                      const res = await fetch('/api/email-accounts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ address: accAddress, username: accUsername, password: accPassword, accountType: accType })
                      });
                      const data = await res.json();
                      if (!res.ok || !data.ok) throw new Error(data?.error || 'Failed');
                    }
                    setNotification({ type: 'success', message: editingAccount ? '✅ Contact updated' : '✅ Contact added' });
                    setTimeout(() => setNotification(null), 3000);
                    setShowAddAccountModal(false); setEditingAccount(null);
                    loadDatabaseData('staffDirectory');
                    // refresh staff directory cache
                    fetch('/api/email-accounts').then(r=>r.json()).then(res=>{ if(res?.ok) setStaffDirectory(res.data); });
                  } catch (err) {
                    setNotification({ type: 'error', message: '❌ Could not save account' });
                    setTimeout(() => setNotification(null), 3000);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ErrorBoundary>
  );
}
