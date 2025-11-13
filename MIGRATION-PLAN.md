# Migration Plan: asianshippingthai.com → Vercel

## Current Setup Analysis

**Domain:** asianshippingthai.com
**Current IP:** 150.95.29.30
**Status:** Domain is registered and active

Based on the IP address (150.95.29.0/24 range), this appears to be hosted on a traditional web hosting provider, likely in Thailand/Asia region.

## Migration Strategy

### Safe Zero-Downtime Migration

We'll use a **blue-green deployment** approach:

```
Phase 1: Deploy new site to Vercel (temporary URL)
Phase 2: Test thoroughly on Vercel
Phase 3: Switch DNS to Vercel
Phase 4: Old site remains as backup
```

---

## Step-by-Step Migration

### Phase 1: Deploy New Site to Vercel (30 minutes)

#### 1.1 Set Up Neon Database
1. Go to https://neon.tech
2. Create project: "asianshippingthai"
3. Region: **AWS Asia Pacific (Singapore)**
4. Copy connection string

#### 1.2 Configure Project
Once you have the Neon URL, I'll update:
- `prisma/schema.prisma` → Switch to PostgreSQL
- `.env` → Add Neon DATABASE_URL
- Push schema to Neon

#### 1.3 Deploy to Vercel
```powershell
# Option A: GitHub + Vercel Dashboard (Recommended)
git init
git add .
git commit -m "Initial deployment"
# Push to GitHub
# Import on Vercel dashboard

# Option B: Direct Deploy via CLI
npm install -g vercel
vercel login
vercel
# Add DATABASE_URL when prompted
vercel --prod
```

**Result:** Your new site will be at: `asian-logistics-xyz.vercel.app`

---

### Phase 2: Testing (1 hour)

Test everything on the Vercel preview URL:
- ✅ Home page loads
- ✅ All service pages work
- ✅ Contact form submits
- ✅ Admin login works
- ✅ Customer portal accessible
- ✅ API endpoints respond

---

### Phase 3: DNS Migration (15 minutes)

#### Where to Update DNS

You need to log into wherever you manage **asianshippingthai.com**. Common providers:
- **GoDaddy** → domains.godaddy.com
- **Namecheap** → namecheap.com
- **Google Domains** → domains.google.com
- **Thai registrar** (check your email for renewal notices)

#### DNS Records to Add/Update

In your DNS management panel:

**Step 1: Add Vercel to your domain**
Go to Vercel dashboard → Your project → Settings → Domains → Add Domain
Enter: `asianshippingthai.com`

**Step 2: Vercel will give you these records:**
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

**Step 3: Update Your DNS**
Replace the current A record (150.95.29.30) with Vercel's IP (76.76.21.21)

#### DNS Propagation
- Takes 5 minutes to 48 hours
- Usually works in 15-30 minutes
- Check status: https://dnschecker.org

---

### Phase 4: Verification & Cleanup

#### Immediate Check (after DNS update)
```powershell
# Check if DNS has propagated
nslookup asianshippingthai.com

# Should show: 76.76.21.21 (Vercel's IP)
```

#### Test Live Site
Visit https://asianshippingthai.com and verify:
- ✅ HTTPS works (auto-enabled by Vercel)
- ✅ All pages load
- ✅ Forms work
- ✅ Admin portal accessible

#### Keep Old Hosting Active
**Important:** Don't cancel old hosting immediately!

**Timeline:**
- **Week 1:** Monitor new site, keep old hosting as backup
- **Week 2:** If all good, can access old site via IP (150.95.29.30) if needed
- **Week 3-4:** If everything stable, cancel old hosting

**To access old site after DNS switch:**
- Visit: http://150.95.29.30 (direct IP access)
- Or add to hosts file for testing

---

## Rollback Plan (If Something Goes Wrong)

If the new site has issues, you can instantly rollback:

### Quick Rollback
In your DNS management, change A record back to:
```
Type: A
Name: @
Value: 150.95.29.30
```

This will point traffic back to old site within 5-15 minutes.

---

## Cost Comparison

### Current Hosting (estimate)
- Traditional hosting: $5-50/month
- Domain renewal: $10-20/year

### New Setup
- **Vercel:** FREE (hobby tier)
- **Neon Database:** FREE (0.5 GB)
- **Domain:** Keep existing registration
- **Total:** $0/month (until you exceed free limits)

---

## Timeline Summary

```
Day 1: Setup & Deploy
├── Create Neon database (5 min)
├── Configure project (10 min)
├── Deploy to Vercel (15 min)
└── Test preview URL (30 min)

Day 2: DNS Migration
├── Update DNS records (15 min)
├── Wait for propagation (15 min - 2 hours)
└── Verify live site (30 min)

Week 1-4: Monitoring
└── Keep old hosting active as backup
```

---

## What I Need From You

**Right now:**
1. Create Neon database and get connection string

**Before DNS migration:**
2. Log into your domain registrar (where asianshippingthai.com is registered)
3. Find "DNS Management" or "Nameservers"
4. Take screenshot or tell me which provider it is

---

## Next Steps

**Ready to start?** Here's what we'll do now:

1. **You:** Create Neon account and database (5 min)
2. **Me:** Update project to use Postgres
3. **Me:** Deploy to Vercel with you
4. **Test:** Verify everything works on preview URL
5. **You:** Update DNS when ready

No pressure - we can do this at your pace. The old site stays live until you're 100% confident!

**Let me know when you have the Neon connection string and we'll proceed.**
