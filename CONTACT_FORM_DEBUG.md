# Contact Form Redirect Issue - Diagnostic Steps

## What I Just Added

Added detailed console logging to the contact form (`app/contact/page.tsx`):
- Logs when form submission starts
- Logs validation errors
- Logs API call status and response
- Logs success or errors
- Logs when submission completes

## How to Test Now

### Step 1: Clear Browser Cache
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Click "Clear data"
4. Close all browser windows
5. Reopen browser

### Step 2: Test in Incognito Mode
1. Open an **Incognito/Private window** (Ctrl + Shift + N in Chrome)
2. Navigate to: http://localhost:3000/contact
3. Open DevTools (F12) → Console tab
4. Fill out the form:
   - Name: Test User
   - Email: test@example.com
   - Service: Any
   - **Product Type: Select one** (REQUIRED!)
   - **Weight: Enter a number > 0** (REQUIRED!)
   - Message: Test message
5. Click "Request Quote"

### Step 3: Watch BOTH Consoles

**Browser Console (F12):**
You should see:
```
[Contact Form] Submit started
[Contact Form] Sending to API...
[Contact Form] API response status: 200
[Contact Form] API response: {ok: true, id: "..."}
[Contact Form] Success!
[Contact Form] Submit completed
```

**Server Console (PowerShell running `npm run dev`):**
You should see:
```
[Contact API] Received submission: { name: 'Test User', email: 'test@example.com', service: 'airfreight' }
[Contact API] Inquiry created: cly...
[Contact API] Email message logged: clz...
[Contact API] Success! Inquiry and email logged.
```

### Step 4: If You See a Redirect

**Check browser console for:**
- Any errors before the redirect
- The last log message you see
- Any network requests that returned 401, 403, or 302

**Common Causes:**
1. **Missing Product Type or Weight** → Form validates, shows error, no redirect
2. **Browser extension** → Try incognito mode
3. **Cached redirect** → Clear cache
4. **Service worker** → Disable in DevTools → Application → Service Workers
5. **Another form submit handler** → Check for duplicate forms on page

## What Should Happen

✅ **Expected:**
1. Form validates
2. API call succeeds
3. Green success message appears
4. Form resets after 3 seconds
5. **NO REDIRECT**

❌ **If redirect happens:**
Share with me:
- Browser console logs (screenshot)
- Server console logs (screenshot)
- URL you get redirected to
- Any error messages

## Quick Test Without UI

Run this in browser console on the contact page:
```javascript
fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test',
    email: 'test@test.com',
    service: 'airfreight',
    productType: 'Electronics',
    weight: 10,
    weightUnit: 'kg',
    message: 'Test'
  })
}).then(r => r.json()).then(console.log).catch(console.error)
```

This bypasses the form entirely and tests the API directly.

## My Hypothesis

The redirect is likely caused by ONE of these:
1. Browser back/forward navigation after form submit (browser behavior)
2. Validation error (missing product type or weight)
3. Browser extension interfering
4. Cached 302 redirect response

The logs will tell us exactly which one!
