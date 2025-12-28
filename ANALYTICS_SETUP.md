# Analytics Setup Guide

This guide explains how to set up visitor tracking and analytics for your Tweet Studio app deployed on Cloudflare.

## Overview

The app supports two analytics solutions:
1. **Cloudflare Web Analytics** - Privacy-focused, server-side tracking (recommended)
2. **Google Analytics 4 (GA4)** - Comprehensive analytics with custom event tracking

## Setup Instructions

### 1. Cloudflare Web Analytics

1. Log in to your Cloudflare dashboard
2. Go to **Analytics & Logs** → **Web Analytics**
3. Click **Add a site**
4. Enter your domain
5. Copy the **Beacon Token** (looks like: `abc123def456...`)

### 2. Google Analytics 4

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (or use existing)
3. Go to **Admin** → **Data Streams** → **Web**
4. Copy your **Measurement ID** (looks like: `G-XXXXXXXXXX`)

### 3. Environment Variables

Add these to your `.env` file (or Cloudflare Workers environment variables):

```bash
# Google Analytics 4 Measurement ID
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Cloudflare Web Analytics Beacon Token
VITE_CF_BEACON_TOKEN=your-beacon-token-here
```

**For Cloudflare Workers deployment:**
- Add these as environment variables in your `wrangler.toml` or Cloudflare dashboard
- Use `vars` in `wrangler.toml`:
```toml
[vars]
VITE_GA4_MEASUREMENT_ID = "G-XXXXXXXXXX"
VITE_CF_BEACON_TOKEN = "your-beacon-token-here"
```

## What's Being Tracked

### Automatic Tracking
- **Page views** - Tracked automatically by both analytics
- **Unique visitors** - Tracked by Cloudflare Web Analytics
- **Referrers** - Tracked by both analytics

### Custom Events (GA4 only)
- **`tweet_import`** - When a user imports a tweet from URL
  - Parameters: `success` (boolean), `error_message` (if failed)
- **`export`** - When a user exports PNG or GIF
  - Parameters: `format` (png/gif), `width`, `height`
- **`design_preset`** - When a user selects a design preset
  - Parameters: `preset_id`
- **`theme_change`** - When a user changes the UI theme
  - Parameters: `theme` (light/dark)
- **`background_change`** - When a user changes background type
  - Parameters: `background_type`

## Privacy & GDPR Compliance

- **Privacy Notice**: A cookie consent banner appears automatically when GA4 is enabled
- **Cloudflare Web Analytics**: Privacy-focused, no cookies required (GDPR compliant)
- **Google Analytics**: Requires user consent (handled by PrivacyNotice component)

Users can accept or decline analytics cookies. If declined, GA4 tracking is disabled.

## Viewing Analytics

### Cloudflare Web Analytics
- Dashboard: Cloudflare Dashboard → Analytics & Logs → Web Analytics
- Real-time data
- No setup required

### Google Analytics 4
- Dashboard: [analytics.google.com](https://analytics.google.com/)
- Go to your property → Reports
- View custom events in **Events** section
- Set up custom reports for product analytics

## Testing

1. **Development**: Analytics only work in production builds
2. **Test locally**: Set environment variables and run `npm run build && npm run preview`
3. **Verify tracking**: 
   - Check browser console for analytics events (in dev mode)
   - Use GA4 DebugView for real-time event verification
   - Check Cloudflare dashboard for page views

## Troubleshooting

### Analytics not working?
1. Check environment variables are set correctly
2. Verify scripts are loading (check browser Network tab)
3. Check browser console for errors
4. Ensure you're testing in production build, not dev mode

### GA4 events not showing?
1. Events may take 24-48 hours to appear in standard reports
2. Use GA4 DebugView for real-time verification
3. Check that `window.gtag` is defined in browser console

### Privacy notice not showing?
- Only appears when `VITE_GA4_MEASUREMENT_ID` is set
- Won't show if user already accepted/declined (stored in localStorage)

## Next Steps

1. Set up your analytics accounts
2. Add environment variables
3. Deploy and test
4. Set up custom dashboards in GA4 for product metrics
5. Monitor Cloudflare Web Analytics for basic traffic metrics

