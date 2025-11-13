# Portal Access Guide

## Employee Portal (Secure)

**URL:** `/admin`

The employee portal is now completely separate with proper authentication:

### Employee Login
- **Email:** employee@asianlogistics.com  
- **Password:** employee123

Or use any email containing "admin" or "employee" with the password "employee123"

### Features:
- 📊 Dashboard with analytics
- 📦 Manage all customer shipments
- ➕ Add new shipments
- 🔍 Track shipments
- ✉️ **Customer Quotes Management** (NEW!)
  - View quote requests from customers
  - Respond to customer inquiries
  - Send quote documents
  - Track email status (New/Pending/Responded)
- 📄 Documents management
- ⚙️ Settings

---

## Customer Portal

**URL:** `/portal`

The customer portal is for regular users after they log in through `/auth/login`:

### Features:
- 📊 Dashboard - View your shipment statistics
- 📦 My Shipments - View your own shipments
- 🔍 Track Shipment - Track your packages

---

## Security

- **Separate Authentication:** Employee and customer logins are completely separate
- **Role-Based Access:** Users with `role: 'employee'` can only access `/admin/portal`
- **Auto-Redirect:** Employees logging into customer portal are redirected to employee portal
- **Protected Routes:** Both portals redirect to their respective login pages if not authenticated

---

## Email/Quote System

The employee portal now includes a comprehensive email management system for handling customer quote requests:

- View all incoming quote requests in a table
- Filter by status (New, Pending, Responded)
- Quick reply functionality
- Attach quote documents (PDF, Excel, etc.)
- Track customer information (name, email, service type, routes)
- See request dates and response status
