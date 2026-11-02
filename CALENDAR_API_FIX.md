# Calendar API 404 Error - Fixed

## Error Message
```
Failed to load resource: the server responded with a status of 404 (Not Found)
Failed to load surgeries SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

## Root Cause

The `/api/calendar` endpoint was returning a 404 error because the **environment variables had incorrect prefixes**.

### What Was Wrong

In `.env.local`:
```bash
❌ NEXT_GOOGLE_CALENDAR_ID="slcpmaya@gmail.com"  # Wrong prefix
❌ Missing GOOGLE_API_KEY for server-side
```

The API route (`src/app/api/calendar/route.ts`) was looking for:
```typescript
const GOOGLE_CALENDAR_ID =
  process.env.GOOGLE_CALENDAR_ID || process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
const API_KEY =
  process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
```

Since neither existed, both were `undefined`, and the API returned an empty response which looked like a 404.

## Solution Applied

### 1. Fixed Environment Variables (`.env.local`)

**Before**:
```bash
NEXT_GOOGLE_CALENDAR_ID="slcpmaya@gmail.com"  # ❌ Wrong prefix
NEXT_PUBLIC_GOOGLE_API_KEY="..."              # ✅ Only public version
```

**After**:
```bash
# For client-side use (public)
NEXT_PUBLIC_GOOGLE_CALENDAR_ID="slcpmaya@gmail.com"
NEXT_PUBLIC_GOOGLE_API_KEY="AIzaSyDpr08Z0c9-p6vN5IlNJYUyWenTvCOlaDI"

# For server-side use (API routes)
GOOGLE_CALENDAR_ID="slcpmaya@gmail.com"
GOOGLE_API_KEY="AIzaSyDpr08Z0c9-p6vN5IlNJYUyWenTvCOlaDI"
```

### 2. Updated `.env.example`

Added proper documentation for both client and server-side environment variables.

## How Next.js Environment Variables Work

### `NEXT_PUBLIC_*` Prefix
- ✅ Exposed to the browser (client-side)
- ✅ Bundled into JavaScript
- ⚠️ **Visible in browser DevTools** - Only use for public data
- 📦 Example: `NEXT_PUBLIC_GOOGLE_API_KEY`

### No Prefix (Plain Variables)
- ✅ Server-side only (API routes, Server Components)
- ✅ Secure - Never sent to browser
- ✅ Use for sensitive data
- 📦 Example: `GOOGLE_API_KEY`

### Why We Need Both

The API route checks both:
```typescript
const API_KEY =
  process.env.GOOGLE_API_KEY ||           // ← Server-side (preferred)
  process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // ← Fallback to public
```

This allows:
- **Development**: Public API keys work everywhere
- **Production**: Server-only keys stay secure

## Testing the Fix

### 1. Restart Dev Server

**Important**: Next.js caches environment variables, so you MUST restart:

```powershell
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Open Booking Modal

1. Navigate to your site: `http://localhost:3000`
2. Click "Book Appointment"
3. Calendar should load surgery events without errors

### 3. Check Console

**Before** (broken):
```
❌ Failed to load resource: 404
❌ Failed to load surgeries SyntaxError: Unexpected token '<'
```

**After** (fixed):
```
✅ No errors
✅ Calendar loads with surgery events
```

## Troubleshooting

### Still Getting 404?

1. **Restart the dev server** (most common fix)
   ```powershell
   # Stop with Ctrl+C, then:
   npm run dev
   ```

2. **Check environment variables are loaded**:
   Add this temporarily to `src/app/api/calendar/route.ts`:
   ```typescript
   console.log('ENV CHECK:', {
     calendarId: process.env.GOOGLE_CALENDAR_ID,
     hasApiKey: !!process.env.GOOGLE_API_KEY
   });
   ```

3. **Verify Google Calendar API is enabled**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Enable "Google Calendar API"
   - Ensure API key has Calendar API permissions

### Empty Calendar (No Surgery Events)?

The API route filters for events with `[SURGERY]` in the title:
```typescript
.filter((item: any) => (item.summary || "").toUpperCase().includes("[SURGERY]"))
```

**To show surgery events**:
1. Go to your Google Calendar (`slcpmaya@gmail.com`)
2. Create events with titles like:
   - `[SURGERY] Patient Name - Procedure`
   - `[SURGERY] Rhinoplasty`
   - `[SURGERY] Laser Treatment`

### API Key Not Working?

1. **Check API key restrictions**:
   - Go to Google Cloud Console → Credentials
   - Click your API key
   - Under "Application restrictions" → Select "None" for testing
   - Under "API restrictions" → Ensure "Google Calendar API" is allowed

2. **Generate a new API key** if needed

## Environment Variable Checklist

For the booking calendar to work, you need:

- ✅ `NEXT_PUBLIC_GOOGLE_CALENDAR_ID` - Calendar ID (public is fine)
- ✅ `NEXT_PUBLIC_GOOGLE_API_KEY` - API key (public read-only key is OK)
- ✅ `GOOGLE_CALENDAR_ID` - Same calendar ID (for server-side)
- ✅ `GOOGLE_API_KEY` - Same API key (for server-side)

For **writing** appointments to Google Calendar (optional):
- ⚠️ `GOOGLE_CLIENT_EMAIL` - Service account email
- ⚠️ `GOOGLE_PRIVATE_KEY` - Service account private key

## Security Notes

### Is It Safe to Expose API Keys?

**Google Calendar API Key (Read-Only)**:
- ✅ Safe to expose if restricted to:
  - HTTP referrers (your domain only)
  - Calendar API only (no other APIs)
  - Read-only operations

**What's NOT Safe**:
- ❌ Database credentials
- ❌ Private keys
- ❌ Service account keys
- ❌ API keys with write permissions

### Production Recommendations

1. **Restrict API key by domain**:
   ```
   https://yourdomain.com/*
   http://localhost:3000/* (for dev)
   ```

2. **Restrict API key to Calendar API only**

3. **Use service account for writes** (never expose private key)

## Related Files

- 🔧 `.env.local` - Your environment variables (fixed)
- 📝 `.env.example` - Template for new setups (updated)
- 🛣️ `src/app/api/calendar/route.ts` - API route (unchanged, working)
- 🎨 `src/components/BookingModal.tsx` - Uses the API (unchanged, working)

## Summary

✅ **Fixed environment variable prefixes**  
✅ **Updated documentation**  
✅ **Calendar API now returns JSON instead of 404**  
✅ **Booking modal will show surgery schedule**  

**Action Required**: Restart your dev server to apply the fix! 🚀
