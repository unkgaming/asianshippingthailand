## Getting Started with Vercel (First-Time User)

### What is Vercel?
Vercel is a hosting platform for Next.js apps. It automatically builds and deploys your code when you push to GitHub. Think of it like "Heroku for Next.js" but simpler.

### Step-by-Step First Deployment

#### 1. Create Accounts (5 minutes)

**Vercel Account:**
1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub

**Neon Account (for database):**
1. Go to https://neon.tech
2. Click "Sign up"
3. Sign in with GitHub (easiest)

#### 2. Set Up Database (5 minutes)

In Neon dashboard:
1. Click "Create Project"
2. Name it: `asianshippingthai`
3. Select region closest to you (e.g., US East)
4. Copy the connection string - looks like:
   ```
   postgresql://username:password@ep-xxx-xxx.aws.neon.tech/neondb?sslmode=require
   ```
5. Save this in a text file - you'll need it twice

#### 3. Update Your Local Project

Open your `.env` file and replace the SQLite line with your Neon URL:

```env
DATABASE_URL="postgresql://your-neon-url-here?sslmode=require"
```

Then run:
```powershell
# Update Prisma to use Postgres
# (I'll do this for you in the next step)

# Push your database schema to Neon
npx prisma db push

# Test locally to make sure it works
npm run dev
```

Visit http://localhost:3000 and test creating a shipment in admin portal.

#### 4. Push Code to GitHub

If you haven't already:

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ready for Vercel"

# Create a new repo on GitHub (go to github.com/new)
# Then link it:
git remote add origin https://github.com/YOUR-USERNAME/asian-logistics.git
git branch -M main
git push -u origin main
```

#### 5. Deploy on Vercel (3 minutes)

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository (`asian-logistics`)
4. Vercel auto-detects Next.js - click "Deploy" BUT WAIT
5. Before deploying, click "Environment Variables"
6. Add:
   - Name: `DATABASE_URL`
   - Value: (paste your Neon connection string)
7. NOW click "Deploy"

Vercel will:
- Install dependencies
- Run Prisma generate
- Build your Next.js app
- Deploy to a URL like: `https://asian-logistics-abc123.vercel.app`

#### 6. Test Your Live Site

After deployment (takes 2-3 minutes), Vercel gives you a URL.

Test these pages:
- Home: `https://your-app.vercel.app`
- Contact: `https://your-app.vercel.app/contact`
- Admin: `https://your-app.vercel.app/admin`
- Login with demo credentials: employee@demo.com / any password
- Create a test shipment

#### 7. Future Updates

Every time you push to GitHub, Vercel auto-deploys:

```powershell
git add .
git commit -m "Updated homepage"
git push
```

Vercel deploys in ~2 minutes. You'll get a notification when it's live.

---

## Common Issues & Fixes

### "Build failed - DATABASE_URL not found"
**Fix:** Add DATABASE_URL in Vercel → Project Settings → Environment Variables

### "Can't connect to database"
**Fix:** Make sure your Neon URL includes `?sslmode=require` at the end

### "Prisma client not generated"
**Fix:** Already handled - we added `postinstall: prisma generate` to package.json

### "My changes aren't showing"
**Fix:** 
1. Hard refresh: Ctrl+Shift+R
2. Check deployment status at vercel.com/dashboard
3. Make sure you pushed to the correct branch (main)

---

## Viewing Your Database

Use Prisma Studio (runs locally but connects to Neon):

```powershell
npx prisma studio
```

This opens http://localhost:5555 where you can browse/edit your Postgres data.

---

## Custom Domain (Optional)

Once deployed, you can add your own domain:

1. In Vercel dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `asianshipping.com`)
3. Vercel gives you DNS records to add to your domain provider
4. Wait 5-30 minutes for DNS propagation

---

## Cost

**Free tier includes:**
- Neon: 0.5 GB database storage
- Vercel: 100 GB bandwidth/month, unlimited deployments
- Both are free forever for hobby projects

**When you might need to upgrade:**
- Heavy traffic (>100k visitors/month)
- Large database (>0.5 GB)
- Team collaboration features

---

## Next Steps After Deployment

1. ✅ Test all pages and forms
2. ✅ Create a few test shipments
3. ✅ Share the URL with team/stakeholders
4. 📧 Set up a custom domain (optional)
5. 📊 Enable Vercel Analytics (free)
6. 🔒 Add real authentication (replace mock login)

---

## Getting Help

- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Prisma Docs**: https://www.prisma.io/docs

If something breaks, check:
1. Vercel deployment logs (vercel.com → your project → Deployments → click latest)
2. Browser console (F12)
3. Neon dashboard (check if DB is active)
