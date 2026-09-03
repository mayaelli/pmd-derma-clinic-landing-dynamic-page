# ⚠️ IMMEDIATE ACTION REQUIRED - Security Issue

## What Happened?
GitHub detected an exposed Google API key in your repository commit `d64f0397`. This key was hardcoded in `BookingModal.tsx` and is now publicly visible.

## What I Fixed
✅ Moved API key from hardcoded value to environment variable  
✅ Removed exposed key from `.env.local`  
✅ Created security documentation (`SECURITY.md`)  
✅ Created step-by-step rotation guide (`ROTATE_API_KEY.md`)  
✅ Verified `.gitignore` excludes `.env*.local`  

## What YOU Must Do Now (5 minutes)

### 🔴 CRITICAL - Rotate the API Key

The exposed key **must be deleted** from Google Cloud and replaced:

**Exposed Key (DELETE THIS):**  
`AIzaSyCsC6rg0coi9lPpflFHXaZOy_PPL6L7Kvg`

### Step-by-Step Instructions

1. **Open Google Cloud Console**  
   Go to: https://console.cloud.google.com/apis/credentials  
   (Sign in with `slcpmaya@gmail.com`)

2. **Delete the Exposed Key**  
   - Find key: `AIzaSyCsC6rg0coi9lPpflFHXaZOy_PPL6L7Kvg`
   - Click delete/trash icon
   - Confirm deletion

3. **Create New Key**  
   - Click "+ CREATE CREDENTIALS"
   - Select "API key"
   - Copy the new key immediately

4. **Add Restrictions (Important!)**  
   - Click the new key to edit
   - **Application restrictions**: Select "HTTP referrers"
     - Add: `http://localhost:3000/*`
     - Add: `https://yourdomain.com/*`
     - Add: `https://*.vercel.app/*` (if using Vercel)
   - **API restrictions**: Select "Restrict key"
     - Choose "Google Calendar API"
   - Click "SAVE"

5. **Update Your Project**  
   Open `.env.local` and replace:
   ```env
   NEXT_PUBLIC_GOOGLE_API_KEY="REPLACE_WITH_NEW_KEY_FROM_GOOGLE_CLOUD_CONSOLE"
   ```
   With your new key:
   ```env
   NEXT_PUBLIC_GOOGLE_API_KEY="your_new_key_here"
   ```

6. **Restart Development Server**
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

7. **Test It Works**
   - Open http://localhost:3000
   - Click "Book Slot" button
   - Verify calendar loads

8. **Mark GitHub Alert as Resolved**
   - Go to: https://github.com/mayaelli/pmd-derma-clinic-landing-dynamic-page/security
   - Find the alert for `BookingModal.tsx`
   - Click "Dismiss alert" → "Revoked"
   - Add note: "Key rotated and restricted"

## Why This Matters

Anyone who saw the exposed key can:
- Use your Google Calendar API quota
- Access your calendar data
- Potentially incur costs or rate limits

## Files Modified

- `src/components/BookingModal.tsx` - Now uses `process.env.NEXT_PUBLIC_GOOGLE_API_KEY`
- `.env.local` - Exposed key removed, placeholder added
- `.env.example` - Template created
- `SECURITY.md` - Security guidelines
- `ROTATE_API_KEY.md` - Detailed rotation instructions

## Need Help?

See `ROTATE_API_KEY.md` for detailed screenshots and troubleshooting.

---

**Status:** ⚠️ WAITING FOR USER ACTION  
**Time Required:** 5 minutes  
**Priority:** CRITICAL - Do this before your next commit
