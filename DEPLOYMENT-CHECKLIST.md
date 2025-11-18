# Production Deployment Checklist

## Pre-Deployment

### 1. Environment Variables
- [ ] Copy `.env.example` to `.env`
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Generate and set `NEXTAUTH_SECRET` (use: `openssl rand -base64 32`)
- [ ] Configure `DATABASE_URL` (Neon pooler URL)
- [ ] Configure `DIRECT_URL` (Neon direct URL)
- [ ] Set up Google OAuth credentials
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
- [ ] Configure email settings
  - [ ] `MAIL_HOST`
  - [ ] `MAIL_PORT`
  - [ ] `MAIL_USER`
  - [ ] `MAIL_PASSWORD` (Gmail app password)
  - [ ] `MAIL_FROM`
- [ ] Configure Stripe (LIVE keys, not test)
  - [ ] `STRIPE_SECRET_KEY=sk_live_...`
  - [ ] `STRIPE_PUBLISHABLE_KEY=pk_live_...`
  - [ ] `STRIPE_WEBHOOK_SECRET` (set after webhook creation)

### 2. Database Setup
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Generate Prisma Client: `npx prisma generate`
- [ ] Verify connection: `npx prisma db pull`
- [ ] (Optional) Seed initial data

### 3. Stripe Configuration
- [ ] Switch to live mode in Stripe dashboard
- [ ] Create production webhook endpoint
  - URL: `https://yourdomain.com/api/payment/webhook`
  - Events to select:
    - [x] `checkout.session.completed`
    - [x] `payment_intent.payment_failed`
- [ ] Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`
- [ ] Test webhook delivery

### 4. Google OAuth Setup
- [ ] Add production domain to authorized origins
- [ ] Add callback URL: `https://yourdomain.com/api/auth/callback/google`
- [ ] Test OAuth flow

### 5. Email Configuration
- [ ] Set up Gmail app password (not regular password)
  1. Enable 2FA on Google account
  2. Go to: https://myaccount.google.com/apppasswords
  3. Generate app password
  4. Use in `MAIL_PASSWORD`
- [ ] Test email sending
- [ ] Whitelist domain (avoid spam folder)

### 6. Security Checks
- [ ] Strong `NEXTAUTH_SECRET` (min 32 characters)
- [ ] All API keys are production/live keys
- [ ] No sensitive data in version control
- [ ] `.env` file is gitignored
- [ ] CORS configured properly
- [ ] Rate limits are appropriate

### 7. Performance Optimization
- [ ] Database indices applied (already done via migrations)
- [ ] Caching enabled (LRU cache already configured)
- [ ] Connection pooling configured (Neon provides this)
- [ ] Static assets optimized

### 8. Code Quality
- [ ] Run TypeScript check: `npx tsc --noEmit`
- [ ] Run linter: `npm run lint`
- [ ] Fix all errors and warnings
- [ ] Build succeeds: `npm run build`

---

## Deployment

### Option A: Vercel (Recommended)

1. **Push to GitHub**
   ```powershell
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Import on Vercel**
   - [ ] Go to [vercel.com](https://vercel.com)
   - [ ] Click "Import Project"
   - [ ] Connect GitHub repository
   - [ ] Select framework: Next.js

3. **Configure Environment Variables**
   - [ ] Add all variables from `.env`
   - [ ] Ensure `NEXTAUTH_URL` matches deployment domain

4. **Deploy**
   - [ ] Click "Deploy"
   - [ ] Wait for build to complete
   - [ ] Verify deployment URL

### Option B: Railway

1. **Push to GitHub** (same as above)

2. **Deploy on Railway**
   - [ ] Go to [railway.app](https://railway.app)
   - [ ] New Project → Deploy from GitHub
   - [ ] Select repository

3. **Configure**
   - [ ] Add all environment variables
   - [ ] Generate domain
   - [ ] Deploy

### Option C: DigitalOcean App Platform

1. **Create App**
   - [ ] Go to DigitalOcean dashboard
   - [ ] Apps → Create App
   - [ ] Connect GitHub repository

2. **Configure Build**
   - Build Command: `npm run build`
   - Run Command: `npm start`

3. **Add Environment Variables**
   - [ ] Add all variables from `.env`

4. **Deploy**

---

## Post-Deployment

### 1. Verify Deployment
- [ ] Site loads: `https://yourdomain.com`
- [ ] No console errors
- [ ] All pages accessible
- [ ] SSL certificate active (HTTPS)

### 2. Test Authentication
- [ ] Google OAuth login works
- [ ] Email/password registration works
- [ ] Session persists on refresh
- [ ] Logout works

### 3. Test Core Features
- [ ] Submit quote request (public form)
- [ ] Create shipment (staff portal)
- [ ] Update shipment status
- [ ] Track shipment (customer portal)
- [ ] Email notifications sent

### 4. Test Payment Flow
- [ ] Create test shipment
- [ ] Initiate payment
- [ ] Complete Stripe checkout
- [ ] Verify payment status updates
- [ ] Check payment confirmation email
- [ ] Verify webhook received

### 5. Test Email System
- [ ] Quote request confirmation
- [ ] Status update notification
- [ ] Payment confirmation
- [ ] All emails render correctly
- [ ] Links work

### 6. Test Analytics (Staff)
- [ ] Analytics dashboard loads
- [ ] Data displays correctly
- [ ] Date range filters work
- [ ] No errors in console

### 7. Test Export
- [ ] Export shipments to CSV
- [ ] Export inquiries to CSV (staff)
- [ ] Files download correctly
- [ ] Data is accurate

### 8. Test Audit Trail (Staff)
- [ ] Audit logs display
- [ ] Filtering works
- [ ] Shows recent activity
- [ ] Records all CRUD operations

### 9. Performance Testing
- [ ] Check page load times
- [ ] Verify caching works (check headers)
- [ ] Test rate limiting
- [ ] Monitor memory usage

### 10. Security Verification
- [ ] All API endpoints require auth (where appropriate)
- [ ] Staff-only endpoints reject non-staff
- [ ] Customers can't see others' data
- [ ] Rate limiting blocks excessive requests
- [ ] No sensitive data in error messages

---

## Monitoring Setup

### 1. Error Tracking
- [ ] Set up Sentry (optional)
- [ ] Configure error logging
- [ ] Set up alerts

### 2. Performance Monitoring
- [ ] Monitor response times
- [ ] Track database query performance
- [ ] Monitor memory usage

### 3. Health Checks
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Monitor `/api/health` endpoint
- [ ] Configure alerts for downtime

### 4. Analytics
- [ ] Set up Google Analytics (optional)
- [ ] Track user behavior
- [ ] Monitor conversion rates

### 5. Database Monitoring
- [ ] Monitor Neon dashboard
- [ ] Check connection pool usage
- [ ] Set up backup schedule

---

## Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor system health
- [ ] Respond to support emails

### Weekly
- [ ] Review analytics
- [ ] Check payment reconciliation
- [ ] Review audit logs

### Monthly
- [ ] Database backup verification
- [ ] Security updates
- [ ] Performance optimization
- [ ] Review rate limit thresholds

---

## Rollback Plan

If deployment fails:

1. **Immediate Actions**
   - [ ] Revert to previous deployment
   - [ ] Check error logs
   - [ ] Notify users (if necessary)

2. **Investigation**
   - [ ] Identify root cause
   - [ ] Fix locally
   - [ ] Test thoroughly

3. **Re-deploy**
   - [ ] Deploy fix
   - [ ] Verify all systems operational
   - [ ] Monitor closely

---

## Support

### Documentation
- [README.md](./README.md) - Setup guide
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Feature details
- [API.md](./API.md) - API reference

### External Resources
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Stripe: https://stripe.com/docs
- NextAuth: https://next-auth.js.org/

### Troubleshooting
- Database issues: Check Neon dashboard
- Email issues: Verify Gmail app password
- Payment issues: Check Stripe dashboard
- Auth issues: Verify OAuth credentials

---

## Success Criteria

Deployment is successful when:
- ✅ All tests pass
- ✅ No critical errors in logs
- ✅ All core features working
- ✅ Payment flow operational
- ✅ Email notifications sending
- ✅ Performance is acceptable
- ✅ Security measures active
- ✅ Monitoring in place

---

## Emergency Contacts

**Technical Issues:**
- Platform Support (Vercel/Railway/DigitalOcean)
- Database Support (Neon)
- Payment Support (Stripe)

**Business Issues:**
- support@asianshippingthai.com

---

**Last Updated:** 2025-01-17
**Environment:** Production
**Status:** Ready for Deployment ✅
