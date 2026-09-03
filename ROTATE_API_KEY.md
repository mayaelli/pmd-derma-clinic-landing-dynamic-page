# 🔐 How to Rotate Your Google API Key (Step-by-Step)

## The Problem
Your Google API key was exposed in the GitHub repository. Anyone who saw it can use your Google Calendar API quota.

## The Solution (5 minutes)

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com/apis/credentials
2. Sign in with the Google account that owns the calendar (`slcpmaya@gmail.com`)

### Step 2: Find and Delete the Exposed Key
1. Look for the API key: `AIzaSyCsC6rg0coi9lPpflFHXaZOy_PPL6L7Kvg`
2. Click the trash/delete icon next to it
3. Confirm deletion

### Step 3: Create a New API Key
1. Click **"+ CREATE CREDENTIALS"** at the top
2. Select **"API key"**
3. A new key will be generated - **copy it immediately**

### Step 4: Add Restrictions (Important!)
1. Click on the newly created key to edit it
2. Under **"Application restrictions"**:
   - Select **"HTTP referrers (web sites)"**
   - Add your domains:
     - `http://localhost:3000/*` (for development)
     - `https://yourdomain.com/*` (for production)
     - `https://*.vercel.app/*` (if using Vercel)

3. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Choose **"Google Calendar API"**

4. Click **"SAVE"**

### Step 5: Update Your Project
1. Open your `.env.local` file
2. Replace the old key with your new key:
   ```env
   NEXT_PUBLIC_GOOGLE_API_KEY="your_new_key_here"
   ```
3. Save the file

### Step 6: Restart Your Dev Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 7: Verify It Works
1. Open your site: http://localhost:3000
2. Click the "Book Slot" button
3. Verify the calendar loads correctly

### Step 8: Mark GitHub Alert as Resolved
1. Go to: https://github.com/mayaelli/pmd-derma-clinic-landing-dynamic-page/security
2. Find the secret scanning alert
3. Click **"Dismiss alert"** → **"Revoked"**
4. Add note: "Key rotated and restricted"

## ✅ You're Done!

The old key is deleted and can't be used anymore. Your new key is protected with restrictions.

## Need Help?

If you get stuck:
1. Check that you're signed into the correct Google account
2. Make sure the Google Calendar API is enabled in your project
3. Verify the calendar `slcpmaya@gmail.com` exists and is accessible

---

**Time Required:** 5 minutes  
**Cost:** Free  
**Security Impact:** Critical - Do this now!
