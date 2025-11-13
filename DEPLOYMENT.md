# Deployment Guide: Next.js + Prisma + Vercel + Neon

## Prerequisites
- GitHub account
- Vercel account (sign up with GitHub at vercel.com)
- Neon account (sign up at neon.tech)

## Step 1: Create Neon Postgres Database

1. Go to https://neon.tech and sign up (free tier)
2. Create a new project (e.g., "asianshippingthai")
3. Copy your connection string - it looks like:
   ```
   postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Save this - you'll need it in Step 3

## Step 2: Update Prisma for Postgres

Open `prisma/schema.prisma` and change the datasource:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

## Step 3: Update Environment Variables

Update your `.env` file with the Neon connection string:

```env
DATABASE_URL="postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

## Step 4: Run Database Migration

In PowerShell, run:

```powershell
# Push schema to Postgres and generate client
npx prisma migrate dev --name postgres-init

# Or if you just want to push without creating migration files:
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## Step 5: Test Locally with Postgres

```powershell
npm run dev
```

Visit http://localhost:3000 and test:
- Contact form submission
- Admin portal (create/view shipments)

## Step 6: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. Push your code to GitHub:
   ```powershell
   git init
   git add .
   git commit -m "Ready for deployment"
   git branch -M main
   git remote add origin https://github.com/yourusername/asian-logistics.git
   git push -u origin main
   ```

2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. **Add Environment Variable:**
   - Key: `DATABASE_URL`
   - Value: Your Neon Postgres connection string
6. Click "Deploy"

### Option B: Via Vercel CLI

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login (opens browser)
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? asian-logistics
# - Directory? ./
# - Override settings? No

# Add environment variable
vercel env add DATABASE_URL production
# Paste your Neon connection string when prompted

# Redeploy to pick up env vars
vercel --prod
```

## Step 7: Verify Production

After deployment, Vercel gives you a URL like: `https://your-app.vercel.app`

Test these endpoints:
- Home: https://your-app.vercel.app
- Contact: https://your-app.vercel.app/contact
- Admin: https://your-app.vercel.app/admin
- API: https://your-app.vercel.app/api/shipments

## Post-Deployment

### View Database
```powershell
# Open Prisma Studio to browse your Postgres data
npx prisma studio
```

### Update Your App
```powershell
git add .
git commit -m "Your changes"
git push

# Vercel auto-deploys on push to main branch
```

### Environment Variables in Vercel

Go to your project → Settings → Environment Variables to add:
- `DATABASE_URL` - Your Neon Postgres URL
- Add any other secrets (API keys, etc.)

## Troubleshooting

### Build fails with "Can't reach database"
- Check DATABASE_URL is set in Vercel Environment Variables
- Make sure it includes `?sslmode=require`

### Prisma Client not generated
Add to `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Database tables missing
Run migrations as part of build:
```json
"scripts": {
  "build": "prisma migrate deploy && next build"
}
```

## Free Tier Limits

**Neon (Postgres):**
- 0.5 GB storage
- 100 hours compute/month
- Great for dev/small projects

**Vercel:**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

## Custom Domain (Optional)

In Vercel dashboard:
1. Go to your project → Settings → Domains
2. Add your domain (e.g., asianshipping.com)
3. Follow DNS instructions from your domain provider

---

## Quick Commands Reference

```powershell
# Local dev
npm run dev

# Database operations
npx prisma studio              # Browse DB
npx prisma migrate dev         # Create & apply migration
npx prisma migrate deploy      # Apply migrations (production)
npx prisma db push             # Push schema without migration
npx prisma generate            # Regenerate client

# Vercel
vercel                         # Deploy preview
vercel --prod                  # Deploy production
vercel logs                    # View logs
vercel env ls                  # List environment variables
```
