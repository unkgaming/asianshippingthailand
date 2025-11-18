# Portal Diagnostic Guide

I've added comprehensive logging and diagnostic tools to help identify and fix the portal issues.

## Changes Made

### 1. Added Logging to Contact API (`app/api/contact/route.ts`)
- Logs every submission with name/email/service
- Logs when inquiry is created in database
- Logs when email message is recorded
- Logs any errors that occur

### 2. Added Logging to Admin Portal (`app/admin/portal/page.tsx`)
- Logs inquiry API response
- Logs number of inquiries loaded
- Logs any loading errors

### 3. Created Diagnostic Endpoint (`/api/diagnostic`)
- Tests creating inquiries
- Tests creating email messages
- Tests querying data
- Tests staff user role

## How to Test

### Step 1: Open Dev Tools
1. Open your browser
2. Press F12 to open Developer Tools
3. Go to the **Console** tab

### Step 2: Test Contact Form
1. Navigate to http://localhost:3000/contact
2. Fill out the form completely:
   - Name
   - Email
   - Phone (optional)
   - Company (optional)
   - Service Type (select one)
   - Product Type (required)
   - Weight (required, must be > 0)
   - Message
3. Click "Request Quote"
4. **Check the browser console** for any errors
5. **Check the server console** (PowerShell running `npm run dev`) for logs like:
   ```
   [Contact API] Received submission: { name: '...', email: '...', service: '...' }
   [Contact API] Inquiry created: ...
   [Contact API] Email message logged: ...
   [Contact API] Success! Inquiry and email logged.
   ```

### Step 3: Check Admin Portal
1. Log in with your staff account (`67011602@kmitl.ac.th`)
2. Navigate to http://localhost:3000/admin/portal
3. Go to the "Customer Quotes" section
4. **Check browser console** for logs like:
   ```
   [Admin Portal] Inquiries response: { ok: true, inquiries: [...] }
   [Admin Portal] Setting inquiries: 2
   ```
5. **Check if inquiries appear in the table**

### Step 4: Run Diagnostic Test
Open a new PowerShell window and run:
```powershell
curl.exe -X POST http://localhost:3000/api/diagnostic | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

This will:
- Create test inquiry and email
- Query all data
- Check your staff user role
- Return detailed results

## Expected Results

✅ **If everything works:**
- Contact form shows success message
- Server logs show inquiry and email created
- Admin portal shows inquiries in the table
- Browser console shows inquiries loaded
- Diagnostic test returns all SUCCESS statuses

❌ **If there are issues:**
- Look for error messages in browser console
- Look for error messages in server console
- Check diagnostic test results for failures
- Share the error messages with me

## Common Issues

### "Redirect to Login"
- Make sure you're testing the contact form while **logged out** or in an incognito window
- The contact form doesn't require login
- Only /portal and /admin/portal require login

### "Inquiries Don't Show"
- Check if inquiries exist: Visit http://localhost:3000/api/inquiries?limit=50
- Check browser console for loading errors
- Verify your account has role='employee'

### "Email Not Showing"
- Visit http://localhost:3000/api/emails?limit=20
- Check if direction='incoming' emails exist
- Check browser console in admin portal

## Next Steps

After testing, share with me:
1. Any error messages from browser console
2. Any error messages from server console  
3. Results from the diagnostic endpoint
4. Screenshots of what you're seeing

I'll use this info to fix the exact issues!
