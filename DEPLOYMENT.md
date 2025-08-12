# Cloudflare Pages Deployment Guide

This guide explains how to deploy the Semantic Version Visualizer to Cloudflare Pages.

## Prerequisites

- A Cloudflare account (free tier works)
- Git repository (GitHub, GitLab, or direct upload)
- Node.js 18+ installed locally

## Deployment Steps

### Option 1: GitHub Integration (Recommended)

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

### Option 2: Direct Upload

1. **Build Locally**
   ```bash
   npm install
   npm run build
   ```

2. **Create Static Export** (for Next.js)
   
   Update `next.config.js`:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
   }
   module.exports = nextConfig
   ```
   
   Then build:
   ```bash
   npm run build
   ```

3. **Upload to Cloudflare Pages**
   - Go to Cloudflare Dashboard → Workers & Pages
   - Click "Create application" → "Pages"
   - Upload your `out` directory
   - Deploy

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

### `package.json` scripts
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
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

## Deployment Checklist

- [ ] Code pushed to repository
- [ ] Build tested locally
- [ ] Environment variables configured
- [ ] Custom domain DNS configured
- [ ] SSL certificate active
- [ ] Analytics enabled
- [ ] Test deployment URL works
- [ ] Custom domain works

## Support

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Agentic Insights Support](https://agenticinsights.com/support)