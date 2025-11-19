# Email DNS Configuration for asianshippingthai.com

## DNS Records to Add

Add these records to your domain registrar (e.g., Namecheap, GoDaddy, Cloudflare):

### 1. DKIM Record (Email Authentication - Resend)
**Type:** TXT  
**Name/Host:** `resend._domainkey`  
**Value:** `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDfEOoeic4kkDRZ4iCW/5OhdmzQUwh0MIBuP+5spzMyB1xCoVF5fFfiGkUh7KApt6ukYW/S0TnsyiSc3RqwWimgK/0vwbYj04DR72rwTNMzSLrHdqFYI/M6HtEap3W0b49+/+K5dOVlZlVSX29IK/AvxYRJRZt3E3VVF0LKNkq8IwIDAQAB`  
**TTL:** 3600 (or Auto)

### 2. Amazon SES SMTP Endpoint (Feedback)
**Type:** CNAME  
**Name/Host:** `send`  
**Value:** `feedback-smtp.ap-northeast-1.amazonses.com`  
**TTL:** 3600 (or Auto)

### 3. SPF Record (Sender Policy Framework - Amazon SES)
**Type:** TXT  
**Name/Host:** `send`  
**Value:** `v=spf1 include:amazonses.com ~all`  
**TTL:** 3600 (or Auto)

### 4. DMARC Record (Email Security Policy)
**Type:** TXT  
**Name/Host:** `_dmarc`  
**Value:** `v=DMARC1; p=none;`  
**TTL:** 3600 (or Auto)

### 5. MX Record (Inbound Email - Amazon SES)
**Type:** MX  
**Name/Host:** `@` (or leave blank for root domain)  
**Value:** `inbound-smtp.ap-northeast-1.amazonaws.com`  
**Priority:** 10  
**TTL:** 3600 (or Auto)

---

## Verification Steps

1. **Add all DNS records** above to your domain registrar
2. **Wait 5-30 minutes** for DNS propagation
3. **Verify Resend domain** at: https://resend.com/domains
4. **Verify Amazon SES domain** at: https://console.aws.amazon.com/ses/ (ap-northeast-1 region)
5. **Test email** from admin portal once verified

---

## Current Status

- ✅ Resend API key configured in `.env.local`
- ✅ Amazon SES endpoints configured
- ⏳ Domain verification pending (add DNS records above)
- ✅ Gmail SMTP fallback active until domain verified

---

## Email Service Setup

**Resend (Primary):**
- Used for transactional emails
- Clean From headers: `asian@asianshippingthai.com`
- Requires DKIM verification (record #1)

**Amazon SES (Configured):**
- SMTP endpoint via `send.asianshippingthai.com` subdomain
- Inbound email receiving at root domain
- SPF and DMARC protection

---

## Expected Result

Once verified:
- **From:** asian@asianshippingthai.com ✅
- **Reply-To:** (whatever you type in admin form)
- **No "via Gmail"** warnings
- Professional email headers
- Inbound emails delivered to Amazon SES

---

## Troubleshooting

**If verification fails:**
- Check DNS records are exact (no extra spaces)
- Wait 30-60 minutes for full DNS propagation
- Use https://mxtoolbox.com/SuperTool.aspx to verify DNS records are live
- Ensure TXT record for DKIM starts with `p=` exactly as shown above

**If emails still show Gmail sender:**
- Domain not verified yet - Resend rejects, falls back to Gmail SMTP
- Check Resend dashboard for verification status
- Test with: `dig TXT resend._domainkey.asianshippingthai.com`

**To verify Amazon SES setup:**
- `dig CNAME send.asianshippingthai.com` (should return feedback-smtp.ap-northeast-1.amazonses.com)
- `dig MX asianshippingthai.com` (should return inbound-smtp.ap-northeast-1.amazonaws.com)
