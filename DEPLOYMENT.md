# Postloom - Cloudflare Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables

Set these in your Cloudflare Workers dashboard or `wrangler.toml`:

```bash
# Analytics (Optional but recommended)
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_CF_BEACON_TOKEN=your-cloudflare-beacon-token

# Database (if using Neon)
DATABASE_URL=your-neon-database-url
```

### 2. Update Wrangler Configuration

The `wrangler.jsonc` is already configured with:
- Name: `postloom`
- Compatibility date: `2025-09-02`
- Node.js compatibility enabled

### 3. Build and Deploy

```bash
# Install dependencies
bun install

# Build the application
bun run build

# Deploy to Cloudflare
bun run deploy
```

Or use the single command:
```bash
bun run deploy
```

## Deployment Steps

### Step 1: Authenticate with Cloudflare

```bash
npx wrangler login
```

### Step 2: Configure Your Project

1. Update `wrangler.jsonc` if needed:
   - Change `name` to your preferred Cloudflare Workers name
   - Add `account_id` if you have multiple accounts

### Step 3: Set Environment Variables

**Option A: Using Wrangler CLI**
```bash
npx wrangler secret put VITE_GA4_MEASUREMENT_ID
npx wrangler secret put VITE_CF_BEACON_TOKEN
```

**Option B: Using Cloudflare Dashboard**
1. Go to Workers & Pages → Your Worker
2. Settings → Variables
3. Add environment variables

**Option C: Using wrangler.toml** (for non-sensitive vars)
Create `wrangler.toml`:
```toml
name = "postloom"
compatibility_date = "2025-09-02"
compatibility_flags = ["nodejs_compat"]

[vars]
VITE_GA4_MEASUREMENT_ID = "G-XXXXXXXXXX"
VITE_CF_BEACON_TOKEN = "your-token"
```

### Step 4: Deploy

```bash
bun run deploy
```

## Post-Deployment

### 1. Set Up Custom Domain (Optional)

1. Go to Cloudflare Dashboard → Workers & Pages
2. Select your `postloom` worker
3. Go to Settings → Domains
4. Add your custom domain

### 2. Enable Cloudflare Web Analytics

1. Go to Analytics & Logs → Web Analytics
2. Add your domain
3. Copy the beacon token
4. Add it as `VITE_CF_BEACON_TOKEN` environment variable
5. Redeploy

### 3. Verify Analytics

- Check Cloudflare Web Analytics dashboard
- Verify GA4 events in Google Analytics dashboard
- Test the privacy notice appears (if GA4 is enabled)

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `bun install`
- Check Node.js version compatibility
- Verify TypeScript compilation: `bun run build`

### Deployment Errors
- Check Cloudflare authentication: `npx wrangler whoami`
- Verify account has Workers access
- Check compatibility flags in `wrangler.jsonc`

### Runtime Errors
- Check Cloudflare Workers logs in dashboard
- Verify environment variables are set correctly
- Check browser console for client-side errors

## Production Checklist

- [ ] Environment variables configured
- [ ] Analytics tokens added (optional)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Cloudflare)
- [ ] Analytics tracking verified
- [ ] Privacy notice working (if GA4 enabled)
- [ ] All features tested in production

## Brand Updates Completed

✅ All "Tweet Studio" references updated to "Postloom"
✅ Wrangler configuration updated
✅ Manifest.json updated
✅ Page titles and metadata updated
✅ Legal disclaimers updated
✅ Landing page content updated

Your app is now branded as **Postloom** and ready for Cloudflare deployment!

