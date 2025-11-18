# API Reference - Asian Shipping Thai

## Authentication

All authenticated endpoints require:
- Valid NextAuth session (JWT)
- Obtained via `/api/auth/signin` (Google OAuth or Email/Password)

Staff-only endpoints additionally require:
- User role: `employee`

---

## Public Endpoints

### Submit Quote Request
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "service": "air",
  "productType": "Electronics > Smartphones",
  "weight": 100,
  "weightUnit": "kg",
  "numberOfBoxes": 5,
  "numberOfCargo": 2,
  "itemsList": "Optional detailed list",
  "message": "Additional notes",
  "sendTo": ["sales@asianshippingthai.com"]
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Thank you! We'll be in touch soon."
}
```

**Rate Limit:** 5 requests/minute per IP

---

## Shipment Management

### List Shipments
```http
GET /api/shipments?customerEmail=user@example.com&status=In Transit&search=TRK-2025
```

**Query Parameters:**
- `customerEmail` - Filter by customer (customers auto-filtered to own email)
- `status` - Filter by status
- `paymentStatus` - Filter by payment status
- `search` - Search in code, name, email

**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": "...",
      "code": "TRK-2025-1234",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "origin": "Bangkok, Thailand",
      "destination": "Los Angeles, USA",
      "serviceType": "air",
      "status": "In Transit",
      "paymentStatus": "Paid",
      "price": 1500.00,
      "weight": 100,
      "packageType": "Cartons",
      "containerContents": "Electronics",
      "bookingDate": "2025-01-15T00:00:00Z",
      "estimatedDelivery": "2025-01-20T00:00:00Z",
      "version": 2,
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-16T14:30:00Z",
      "documents": []
    }
  ]
}
```

---

### Create Shipment
```http
POST /api/shipments
Content-Type: application/json
Authorization: Required

{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "origin": "Bangkok, Thailand",
  "destination": "Los Angeles, USA",
  "serviceType": "air",
  "status": "Pending",
  "paymentStatus": "Pending",
  "price": 1500.00,
  "weight": 100,
  "packageType": "Cartons",
  "containerContents": "Electronics",
  "bookingDate": "2025-01-15",
  "estimatedDelivery": "2025-01-20"
}
```

**Response:**
```json
{
  "ok": true,
  "data": { /* shipment object */ }
}
```

**Side Effects:**
- Creates audit log entry
- Auto-generates tracking code if not provided

---

### Update Shipment
```http
PUT /api/shipments
Content-Type: application/json
Authorization: Required

{
  "id": "shipment_id",
  "status": "In Transit",
  "version": 2
}
```

**Response:**
```json
{
  "ok": true,
  "data": { /* updated shipment */ }
}
```

**Possible Errors:**
- `409 Conflict` - Optimistic locking failed (shipment was modified)
- `429 Too Many Requests` - Rate limit exceeded (20 writes/minute)

**Side Effects:**
- Creates audit log entry
- Sends email notification if status changed
- Invalidates cache

---

### Delete Shipment (Staff Only)
```http
DELETE /api/shipments?id=shipment_id
Authorization: Required (Staff)
```

**Response:**
```json
{
  "ok": true
}
```

**Side Effects:**
- Creates audit log entry
- Cascades to delete documents

---

## Payment Integration

### Create Payment Checkout
```http
POST /api/payment
Content-Type: application/json
Authorization: Required

{
  "shipmentId": "shipment_id",
  "returnUrl": "https://yourdomain.com/portal"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

**Usage:**
1. Call endpoint to create checkout session
2. Redirect user to `url`
3. User completes payment on Stripe
4. Stripe redirects back to `returnUrl?session_id=...`
5. Verify payment with GET endpoint

---

### Verify Payment
```http
GET /api/payment?session_id=cs_test_...
```

**Response:**
```json
{
  "status": "paid",
  "amount": 150000,
  "currency": "usd"
}
```

---

### Payment Webhook (Internal)
```http
POST /api/payment/webhook
Stripe-Signature: required
```

**Events Handled:**
- `checkout.session.completed` - Updates shipment payment status
- `payment_intent.payment_failed` - Logs error

**Side Effects:**
- Updates shipment payment status to "Paid"
- Sends payment confirmation email

---

## Search & Export

### Advanced Search
```http
GET /api/search?q=electronics&status=In Transit&serviceType=air&dateFrom=2025-01-01&dateTo=2025-01-31&paymentStatus=Paid
```

**Query Parameters:**
- `q` - Text search (code, name, email, origin, destination)
- `status` - Filter by shipment status
- `serviceType` - Filter by service type
- `paymentStatus` - Filter by payment status
- `dateFrom` - Start date (YYYY-MM-DD)
- `dateTo` - End date (YYYY-MM-DD)

**Response:**
```json
{
  "ok": true,
  "data": [ /* shipments */ ],
  "count": 25
}
```

**Permissions:**
- Customers: Search only their shipments
- Staff: Search all shipments

---

### Export to CSV
```http
GET /api/export?type=shipments
GET /api/export?type=inquiries
```

**Response:**
- Content-Type: `text/csv`
- Content-Disposition: `attachment; filename="shipments-2025-01-17.csv"`

**CSV Columns (shipments):**
- code, customerName, customerEmail, origin, destination, serviceType, status, paymentStatus, price, weight, packageType, bookingDate, estimatedDelivery

**CSV Columns (inquiries):**
- name, email, phone, company, service, productType, weight, status, createdAt

**Permissions:**
- Shipments: Customers get their own, staff get all
- Inquiries: Staff only

---

## Analytics

### Get Analytics Data (Staff Only)
```http
GET /api/analytics?range=30
Authorization: Required (Staff)
```

**Query Parameters:**
- `range` - Number of days to analyze (default: 30)

**Response:**
```json
{
  "ok": true,
  "data": {
    "overview": {
      "totalShipments": 150,
      "totalRevenue": 45000,
      "pendingRevenue": 12000,
      "averageShipmentValue": 300,
      "totalInquiries": 75
    },
    "statusBreakdown": {
      "Pending": 20,
      "In Transit": 50,
      "Delivered": 80
    },
    "serviceBreakdown": {
      "air": 60,
      "sea-fcl": 50,
      "sea-lcl": 40
    },
    "revenueByDay": {
      "2025-01-15": 1500,
      "2025-01-16": 2000
    },
    "inquiryStatus": {
      "new": 20,
      "responded": 50,
      "converted": 5
    },
    "period": {
      "start": "2024-12-18T00:00:00Z",
      "end": "2025-01-17T00:00:00Z",
      "days": 30
    }
  },
  "cached": false
}
```

**Cache:** 5 minutes

---

## Audit Trail

### Get Audit Logs (Staff Only)
```http
GET /api/audit?entityType=Shipment&entityId=...&action=UPDATE&limit=50&offset=0
Authorization: Required (Staff)
```

**Query Parameters:**
- `entityType` - Filter by entity (Shipment, Inquiry, User, etc.)
- `entityId` - Filter by specific entity ID
- `action` - Filter by action (CREATE, UPDATE, DELETE, LOGIN, PAYMENT)
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)

**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": "...",
      "userId": "user_id",
      "userEmail": "admin@example.com",
      "action": "UPDATE",
      "entityType": "Shipment",
      "entityId": "shipment_id",
      "details": {
        "code": "TRK-2025-1234",
        "changes": { "status": "In Transit" },
        "oldStatus": "Pending",
        "newStatus": "In Transit"
      },
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-01-17T10:30:00Z"
    }
  ],
  "total": 250,
  "limit": 50,
  "offset": 0
}
```

---

## Inquiries

### List Inquiries (Staff Only)
```http
GET /api/inquiries
Authorization: Required (Staff)
```

**Response:**
```json
{
  "ok": true,
  "data": [ /* inquiry objects */ ],
  "cached": false
}
```

**Cache:** 30 seconds

---

## Health Check

### System Health Status
```http
GET /api/health
```

**Response:**
```json
{
  "ok": true,
  "status": "healthy",
  "database": {
    "connected": true,
    "latency": 25
  },
  "cache": {
    "size": 150,
    "max": 500,
    "usage": 30
  },
  "memory": {
    "used": 125829120,
    "free": 8192000000
  },
  "uptime": 3600
}
```

**Status Codes:**
- `200` - System healthy
- `503` - System unhealthy (database disconnected)

---

## Rate Limits

All endpoints are rate-limited to prevent abuse:

| Endpoint Type | Limit | Window |
|--------------|-------|---------|
| Contact form | 5 req | 1 minute |
| Read operations | 100 req | 1 minute |
| Write operations | 20 req | 1 minute |
| Authentication | 10 req | 1 minute |
| File uploads | 10 req | 1 hour |

**Response Headers:**
- `X-RateLimit-Limit` - Total allowed requests
- `X-RateLimit-Remaining` - Requests remaining
- `X-RateLimit-Reset` - Timestamp when limit resets

**Error Response (429):**
```json
{
  "ok": false,
  "error": "Too many requests"
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "ok": false,
  "error": "Error message here"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (optimistic locking failure)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Caching Strategy

### Cached Endpoints
- `GET /api/shipments` - 2 minutes
- `GET /api/inquiries` - 30 seconds
- `GET /api/analytics` - 5 minutes

### Cache Invalidation
- Automatic on UPDATE/DELETE operations
- Manual via cache service if needed

### Cache Headers
Responses include:
```json
{
  "ok": true,
  "data": [...],
  "cached": true  // Indicates data served from cache
}
```

---

## Testing

### Test Stripe Payment (Test Mode)
Use test card:
- Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### Local Webhook Testing
```powershell
stripe listen --forward-to localhost:3000/api/payment/webhook
```

### Rate Limit Testing
Make rapid requests to see rate limiting in action:
```javascript
for (let i = 0; i < 10; i++) {
  await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });
}
// 6th request will be rate limited
```

---

## Best Practices

1. **Always include version field** when updating shipments to prevent conflicts
2. **Handle 409 Conflict** responses by refetching data and retrying
3. **Cache API responses** on client side when appropriate
4. **Use pagination** for large result sets
5. **Implement exponential backoff** when hitting rate limits
6. **Verify webhook signatures** in production
7. **Use environment-specific Stripe keys** (test vs live)

---

For more details, see:
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Feature documentation
- [README.md](./README.md) - Setup guide
- [.env.example](./.env.example) - Environment configuration
