# Security Guidelines

## 🚨 Important: API Key Rotation Required

**IMMEDIATE ACTION NEEDED:** The Google API key that was previously exposed in the codebase has been moved to environment variables. However, you should:

1. **Rotate the Google API Key immediately** at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Delete the exposed key: `AIzaSyCsC6rg0coi9lPpflFHXaZOy_PPL6L7Kvg`
   - Generate a new key
   - Update your `.env.local` file with the new key

2. **Review Calendar Permissions**
   - Ensure the calendar API key has proper restrictions (HTTP referrers, API restrictions)
   - Consider making the calendar public read-only if appropriate

## Environment Variables Setup

This application uses environment variables to store sensitive information. Follow these steps:

### 1. Copy the example file
```bash
cp .env.example .env.local
```

### 2. Fill in your actual values in `.env.local`:

```env
# Cal.com API Key (get from Cal.com dashboard)
CAL_API_KEY="your_actual_cal_api_key"

# Google Sheets CSV URL
NEXT_PUBLIC_GOOGLE_SHEET_PROMOS_CSV_URL="your_google_sheet_csv_url"

# Google Calendar Integration
NEXT_PUBLIC_GOOGLE_CALENDAR_ID="your_calendar_id@gmail.com"
NEXT_PUBLIC_GOOGLE_API_KEY="your_new_google_api_key"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Best Practices

### ✅ DO:
- Keep `.env.local` in `.gitignore` (already configured)
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Use API key restrictions (IP allowlists, HTTP referrers)
- Use separate keys for development and production

### ❌ DON'T:
- Never commit `.env.local` or any file with actual secrets
- Never hardcode API keys, passwords, or tokens in source code
- Never share your `.env.local` file publicly
- Never reuse exposed keys - always rotate them

## For Production Deployment

When deploying to Vercel, Netlify, or other platforms:

1. Add all environment variables through the platform's dashboard
2. Use separate keys for production (not the same as development)
3. Enable key restrictions specific to your production domain

## Security Incident Response

If you accidentally commit secrets:

1. **Immediately rotate the exposed credentials**
2. Delete the commit from Git history (if possible)
3. Review access logs for unauthorized usage
4. Update all deployment environments with new keys

## Questions?

For security concerns, contact the repository maintainer immediately.
