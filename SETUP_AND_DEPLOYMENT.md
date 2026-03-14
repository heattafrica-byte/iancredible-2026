# IANCREDIBLE Portfolio - Setup & Deployment Guide

## 🚀 Quick Start

### 1. Local Development

```bash
# Clone or extract the project
cd "New iancredible site 2026"

# Install dependencies
npm install

# Create .env.local from the example
cp .env.example .env.local

# Edit .env.local with your API keys (see sections below)

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the site in action.

---

## 🔐 API Configuration

### Spotify Integration

1. **Create Spotify Developer Account**
   - Go to https://developer.spotify.com/
   - Create an account (free or paid)
   - Go to Dashboard > Create an App

2. **Get Credentials**
   - Copy your Client ID
   - Copy your Client Secret
   - Add to `.env.local`:
     ```
     NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
     NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_client_secret_here
     ```

3. **Setup Redirect URI** (optional, for full Web API)
   - In Spotify Dashboard: Edit Settings > Redirect URIs
   - Add: `http://localhost:3000/api/auth/callback/spotify`
   - Add: `https://your-domain.com/api/auth/callback/spotify`

### YouTube Integration

1. **Create Google Cloud Project**
   - Go to https://console.cloud.google.com/
   - Create new project: "IANCREDIBLE Portfolio"

2. **Enable YouTube Data API v3**
   - Search "YouTube Data API v3"
   - Click Enable
   - Create OAuth 2.0 credentials (Web application)

3. **Get API Key**
   - In Credentials: Create API Key
   - Add to `.env.local`:
     ```
     NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
     ```

### Google Analytics (Optional)

1. **Create Google Analytics Account**
   - Go to https://analytics.google.com/
   - Set up new property for your domain

2. **Get Tracking ID**
   - In Admin > Property Settings
   - Copy Tracking ID (G-XXXXXXXXXX)
   - Add to `.env.local`:
     ```
     NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
     ```

---

## 📧 Email Configuration (For Contact Forms)

### Option 1: SendGrid

```bash
npm install @sendgrid/mail
```

Add to `.env.local`:
```
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@iancredible.com
```

### Option 2: Mailgun

```bash
npm install mailgun.js
```

Add to `.env.local`:
```
MAILGUN_API_KEY=your_mailgun_key
MAILGUN_DOMAIN=your_domain
```

### Option 3: Nodemailer + Gmail

Add to `.env.local`:
```
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_app_password
```

---

## 🏗️ Build & Deployment

### Build for Production

```bash
# Create optimized build
npm run build

# Test production build locally
npm start
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Configure netlify.toml in root:
cat > netlify.toml << EOF
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF

# Deploy
netlify deploy
```

### Deploy to Docker

```bash
# Create Dockerfile
cat > Dockerfile << EOF
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
EOF

# Build image
docker build -t iancredible-portfolio .

# Run container
docker run -p 3000:3000 -e NODE_ENV=production iancredible-portfolio
```

### Deploy to Traditional Hosting

```bash
# Build the project
npm run build

# Upload to your hosting provider:
# 1. .next/ directory
# 2. public/ directory
# 3. node_modules/ (or run npm install on server)
# 4. package.json
# 5. .env.local (with production values)
# 6. next.config.js

# On your server:
npm install --production
npm run build
npm start
```

---

## 🌐 Domain & SSL Setup

### Point Domain to Vercel

1. **Buy Domain** (Namecheap, GoDaddy, Cloudflare, etc.)

2. **In Vercel Dashboard**
   - Project Settings > Domains
   - Add domain: `iancredible.com`
   - Follow DNS configuration instructions

3. **DNS Configuration** (example for Cloudflare)
   - Type: CNAME
   - Name: `@`
   - Value: `cname.vercel-dns.com`
   - TTL: Auto

### SSL Certificate

- **Vercel**: Automatic (included)
- **Netlify**: Automatic (included)
- **Self-hosted**: Use Let's Encrypt + Certbot

---

## 📊 Environment Variables Summary

```env
# API Keys
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_value
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_value
NEXT_PUBLIC_YOUTUBE_API_KEY=your_value
NEXT_PUBLIC_GA_ID=your_value

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://iancredible.com
NEXT_PUBLIC_SITE_NAME=IANCREDIBLE

# Email Services
SENDGRID_API_KEY=your_value
MAILGUN_API_KEY=your_value
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_app_password

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## ✅ Pre-Launch Checklist

- [ ] All environment variables configured
- [ ] DNS records pointing to hosting
- [ ] SSL certificate active
- [ ] Spotify/YouTube playlists linked
- [ ] Contact form tested
- [ ] Analytics tracking verified
- [ ] Mobile responsive tested
- [ ] Performance optimized (Next.js Image component)
- [ ] 404 page customized
- [ ] Meta tags & SEO optimized
- [ ] Google Search Console verified
- [ ] Robots.txt created
- [ ] Sitemap.xml generated

---

## 🔧 Development Tips

### Hot Reload
The dev server automatically reloads on file changes.

### TypeScript Errors
```bash
npm run type-check
```

### Lint Code
```bash
npm run lint
```

### Format Code
```bash
npx prettier --write .
```

### Debug Mode
```bash
NODE_DEBUG=* npm run dev
```

---

## 📈 Performance Optimization

### Image Optimization
- Use Next.js `<Image>` component
- Optimize assets in `/public`
- Use WebP where possible

### Code Splitting
- Automatic with Next.js
- Use dynamic imports for large components:
  ```typescript
  import dynamic from 'next/dynamic'
  const Component = dynamic(() => import('@/components/Heavy'))
  ```

### Caching
- Static export queries automatically cached
- Use SWR for real-time data:
  ```typescript
  import useSWR from 'swr'
  const { data } = useSWR('/api/data', fetcher)
  ```

### Analytics
Monitor with:
- Vercel Analytics
- Google Analytics
- Core Web Vitals

---

## 🆘 Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001
# or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Build fails
```bash
npm run build -- --debug
```

### Environment variables not loading
- Restart dev server after updating `.env.local`
- Check variable naming (must use NEXT_PUBLIC_ prefix for client)
- Verify no trailing whitespace

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [YouTube Data API](https://developers.google.com/youtube/v3)

---

**Last Updated**: March 2026
**Version**: 1.0.0
