# Fix Email Sender Issue - Quick Guide

## Problem
Gmail SMTP forces all emails to show as "joon135791357911@gmail.com" regardless of what you set as the sender. This is a Gmail security restriction.

## Solution: Use Resend (5 minutes setup)

### Step 1: Sign up for Resend (FREE)
1. Go to https://resend.com
2. Sign up with your email
3. Verify your email

### Step 2: Get API Key
1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Copy the key (starts with `re_...`)

### Step 3: Update your .env file
```env
# Add this line (keep your existing Gmail settings for backup)
RESEND_API_KEY="re_your_key_here"

# Optional: Set your company email
MAIL_FROM="info@asianshippingthai.com"
MAIL_TO="joon135791357911@gmail.com"
```

### Step 4: Restart your server
```powershell
npm run dev
```

## How It Works Now

**With Resend:**
- Customer submits quote → Email shows as: `"Customer Name" <customer@gmail.com>`
- You receive email at: `joon135791357911@gmail.com`
- You click Reply → Goes to: `customer@gmail.com` ✅

**With Gmail (current - limited):**
- Customer submits quote → Email shows as: `joon135791357911@gmail.com`
- Reply goes to: `joon135791357911@gmail.com` ❌

## Free Tier Limits
- Resend: 3,000 emails/month FREE
- Gmail: 500 emails/day (but wrong sender address)

## Alternative: SendGrid
If you prefer SendGrid:
1. Sign up at https://sendgrid.com
2. Get API key
3. Update .env:
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your_sendgrid_api_key"
```

## Why This Matters
When customers submit quotes, you want to see their email address as the sender so you can:
- Quickly identify who sent it
- Reply directly by clicking "Reply"
- Have proper email threading/conversations
- Look professional

Gmail SMTP cannot do this - it's a security feature they enforce.
