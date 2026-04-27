# IANCREDIBLE - Portfolio Website

## Status: ✅ Production Ready

This is a modern, free-tier portfolio website built with Next.js 14, deployed on Vercel at $0/month cost.

## Quick Links

- **Live Demo**: Coming soon (Vercel deployment)
- **GitHub**: https://github.com/truckstandai/iancredible
- **Tech Stack**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion

## What's Included

### 7 Static Pages
1. **Home** (`/`) - Landing page with hero section
2. **Audio** (`/audio`) - Audio showcase and player
3. **Decoded** (`/decoded`) - Information and content page
4. **Hardware** (`/hardware`) - Hardware expertise showcase
5. **Tech** (`/tech`) - Technology stack documentation
6. **Community** (`/community`) - Community highlights
7. **Record Label** (`/record-label`) - Music track showcase

### Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark theme with matrix animation background
- ✅ Smooth animations (Framer Motion)
- ✅ SEO optimized
- ✅ Image optimization
- ✅ Global CDN distribution
- ✅ Zero external API dependencies
- ✅ Zero monthly cost

## Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

1. **Push code to GitHub** (required)
2. **Go to** https://vercel.com/new
3. **Import** your GitHub repository
4. **Click Deploy**

That's it! Your site will be live in 1-3 minutes.

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Main entry point with routing
├── globals.css             # Global styles & animations
├── components/
│   ├── Navigation.tsx      # Top navigation bar
│   └── landing/
│       ├── MatrixHub.tsx          # Interactive hub/landing page
│       ├── TechVisionary.tsx      # Diesel GO portfolio
│       ├── SonicArchitect.tsx     # IAMIAN music section
│       └── HardwareExpert.tsx     # Hardware expertise section
├── types/                  # TypeScript type definitions
├── lib/                    # Utility functions
└── hooks/                  # Custom React hooks

public/                    # Static assets
tailwind.config.ts         # Tailwind CSS configuration
tsconfig.json              # TypeScript configuration
next.config.js             # Next.js configuration
postcss.config.js          # PostCSS configuration
package.json               # Dependencies & scripts
```

## 🎯 Key Sections

### 1. Matrix Hub Landing Page
- Three interactive path cards: Code, Sound, Hardware
- Animated background with mouse tracking
- Neon glow effects
- Smooth transitions between sections

### 2. Tech Visionary (Diesel GO)
- Tabbed interface for different aspects
- Case study details
- Tech stack overview
- Key metrics & achievements
- Business impact analysis
- CTA to full documentation

### 3. Sonic Architect (IAMIAN)
- Live audio visualizer
- Genre selector (Hardstyle / Goa Trance)
- Track cards with Spotify/YouTube integration
- Professional media highlights
- Responsive layout

### 4. Hardware Expert
- Category-based expertise showcase
- Project cards with detailed specs
- Gaming hardware (PS5 restoration)
- Drone operations (DJI Mavic 2)
- Audio systems engineering
- Capabilities overview

## 🔌 Technologies

- **Frontend Framework**: React 18 + Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom CSS
- **Animations**: Framer Motion
- **Type Animation**: React Type Animation
- **Audio Visualization**: React Audio Visualizers
- **Spotify Integration**: spotify-web-api-js
- **Package Manager**: npm

## 🎨 Customization

### Font Configuration
Update in `app/layout.tsx`:
```typescript
fonts: ['var(--font-display)', 'var(--font-mono)']
```

### Colors
Customize in `tailwind.config.ts`:
```typescript
colors: {
  neon: {
    cyan: '#00D9FF',
    purple: '#D100FF',
    // ... more colors
  }
}
```

### Animations
Add custom animations in `tailwind.config.ts`:
```typescript
animation: {
  'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
}
```

## 📊 Content Management

### Diesel GO Section
- Update case study data in `TechVisionary.tsx`
- Link to actual documentation files
- Update metrics and statistics

### IAMIAN Section
- Add real Spotify/YouTube links
- Upload track artwork
- Integrate with Spotify Web API for live data

### Hardware Section
- Add project photos and specifications
- Update expertise categories
- Include real case studies

## 🔌 API Integration

### Spotify API
Configure your Spotify Developer credentials:
```typescript
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
});
```

### YouTube Integration
Add YouTube video embeds in track cards or Sonic Architect section.

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t iancredible-portfolio .
docker run -p 3000:3000 iancredible-portfolio
```

### Traditional Hosting
```bash
npm run build
npm start
```

## 🛠️ Development

### Code Style
- ESLint configuration included
- TypeScript strict mode enabled
- Prettier recommended

```bash
npm run lint
```

### Hot Reload
Development server automatically reloads on file changes.

## 📈 Performance Optimization

- Image optimization with Next.js Image component
- Code splitting & lazy loading
- CSS-in-JS with Tailwind (minimal bundle)
- Framer Motion for GPU-accelerated animations
- Static generation where possible

## 🔐 Authentication & Security

- No server-side secrets in client code
- Environment variables properly configured
- TypeScript for type safety
- Next.js security best practices

## 📱 Responsive Design

- Mobile-first approach
- Tailwind responsive utilities
- Tested on common breakpoints:
  - SM: 640px
  - MD: 768px
  - LG: 1024px
  - XL: 1280px

## 🎯 Future Enhancements

- [ ] Dark/Light mode toggle
- [ ] Blog section
- [ ] Contact form with email integration
- [ ] CMS integration (Contentful/Sanity)
- [ ] Real Spotify/YouTube API integration
- [ ] Analytics dashboard
- [ ] Newsletter signup
- [ ] Dynamic project loading
- [ ] Multi-language support
- [ ] PWA capabilities

## 📝 License

This project is the personal portfolio of Ian Morrison (IAMIAN).

## 🤝 Contact

- **Email**: [Your Email]
- **LinkedIn**: [Your LinkedIn]
- **GitHub**: [Your GitHub]
- **Spotify**: [Your Spotify]

---

**Last Updated**: March 2026
**Version**: 1.0.0
# iancredible
