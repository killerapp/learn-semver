# Cloudflare Pages Deployment Guide

✅ **Successfully Deployed**: This application is running in production at [semver.agenticinsights.com](https://semver.agenticinsights.com)

This guide explains how to deploy the Semantic Version Visualizer to Cloudflare Pages using static export.

## Prerequisites

- A Cloudflare account (free tier works)
- Git repository (GitHub, GitLab, or direct upload)
- Node.js 18+ installed locally

## Current Production Setup

### Configuration Used
- **Project Name**: `learn-semver`
- **Deployment Method**: Static export via `wrangler` CLI
- **Custom Domain**: `semver.agenticinsights.com`
- **Build Output**: `./out` directory
- **Next.js Config**: Static export mode (`output: 'export'`)

## Deployment Steps

### Option 1: CLI Deployment (Recommended for Static Sites)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Cloudflare Pages deployment"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to "Workers & Pages" → "Create application"
   - Select "Pages" → "Connect to Git"
   - Authorize GitHub and select your repository

3. **Configure Build Settings**
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (leave as default)
   - **Node.js version**: 18

4. **Environment Variables** (if needed)
   ```
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Save and Deploy"
   - Wait for the build to complete (typically 2-3 minutes)

### Option 2: Wrangler CLI Deployment (Used in Production)

1. **Install Dependencies & Build**
   ```bash
   npm install
   npm run build  # Creates static export in ./out
   ```

2. **Create Cloudflare Pages Project**
   ```bash
   npx wrangler pages project create learn-semver --production-branch main
   ```

3. **Deploy to Cloudflare Pages**
   ```bash
   npx wrangler pages deploy ./out --project-name=learn-semver
   ```

4. **Add Custom Domain (via API)**
   ```bash
   # Add domain to project
   curl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/pages/projects/learn-semver/domains" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"name": "semver.agenticinsights.com"}'
   
   # Create CNAME record in DNS
   curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{
       "type": "CNAME",
       "name": "semver",
       "content": "learn-semver.pages.dev",
       "proxied": true
     }'
   ```

## Custom Domain Setup

1. **Add Custom Domain**
   - In your Pages project settings
   - Go to "Custom domains"
   - Add `semver.agenticinsights.com`

2. **DNS Configuration**
   - Add CNAME record:
     ```
     Type: CNAME
     Name: semver
     Content: <your-project>.pages.dev
     ```

3. **SSL/TLS**
   - Cloudflare automatically provisions SSL certificates
   - Ensure SSL/TLS mode is set to "Full" or "Full (strict)"

## Build Configuration

### `package.json` scripts (Production Configuration)
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "preview": "wrangler pages dev ./out",
    "deploy": "npm run build && wrangler pages deploy ./out --project-name=learn-semver",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### `wrangler.toml` Configuration
```toml
name = "learn-semver"
compatibility_date = "2025-08-12"
pages_build_output_dir = "./out"
```

### `next.config.ts` for Static Export
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Enable static export
  // ... other config
};

export default nextConfig;
```

### Optimizations for Production

1. **Image Optimization**
   - Cloudflare Pages automatically serves images via their CDN
   - Consider using next/image for automatic optimization

2. **Caching Headers**
   Create `_headers` file in public directory:
   ```
   /*
     Cache-Control: public, max-age=3600
   
   /_next/static/*
     Cache-Control: public, max-age=31536000, immutable
   ```

3. **Redirects**
   Create `_redirects` file if needed:
   ```
   /old-path /new-path 301
   ```

## Monitoring

1. **Analytics**
   - Enable Web Analytics in Cloudflare Pages settings
   - Free tier includes basic metrics

2. **Real User Monitoring**
   - Available in Pages settings
   - Tracks Core Web Vitals

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (must be 18+)
   - Ensure all dependencies are in package.json
   - Check build logs for specific errors

2. **404 Errors**
   - For SPAs, configure catch-all routing
   - Ensure output directory is correct

3. **Environment Variables**
   - Add them in Cloudflare Pages settings
   - Rebuild after adding new variables

### Build Commands Reference

| Framework | Build Command | Output Directory |
|-----------|--------------|------------------|
| Next.js   | `npm run build` | `.next` or `out` (static) |
| React     | `npm run build` | `build` |
| Vue       | `npm run build` | `dist` |

## Production Deployment Checklist

- [✓] Code pushed to repository
- [✓] Build tested locally (`npm run build`)
- [✓] Static export configured (`output: 'export'`)
- [✓] Cloudflare Pages project created
- [✓] Deployed via wrangler CLI
- [✓] Custom domain added to project
- [✓] CNAME DNS record configured
- [✓] SSL certificate active (automatic)
- [✓] Site accessible at [semver.agenticinsights.com](https://semver.agenticinsights.com)

## Lessons Learned

### From Concept to Production

This deployment demonstrates the power of modern tooling:

1. **Rapid Prototyping**: Using AI assistance to quickly select and implement the right libraries (shadcn/ui, Magic UI, Framer Motion)
2. **Static Export Benefits**: Next.js static export provides instant global CDN distribution via Cloudflare
3. **CLI Automation**: Wrangler CLI enables scriptable deployments without manual dashboard configuration
4. **Custom Domain Setup**: API-driven domain configuration allows full automation

The entire process from idea to production deployment took less than a day, showcasing how AI-assisted development combined with modern deployment platforms enables rapid iteration on educational tools.

## Support

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
