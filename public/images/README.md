# Image Assets for IANCREDIBLE Wappsite

## Required Images

Please place the following images in this directory (`public/images/`):

### 1. **iamian-logo.png**
- Location: EvolutionHero section header
- Usage: Animated neon logo that serves as the visual identity
- Format: PNG with transparency recommended
- Dimensions: ~300x100px optimal

### 2. **street-art-portrait.png**
- Location: GratitudeGrid section background accent
- Usage: Decorative background element (positioned top-right, low opacity)
- Format: PNG with transparency or JPG
- Dimensions: ~400x400px for circular crop

### 3. **intellimix-ai.png**
- Location: SonicMixerDemo > Production Mastery section
- Usage: Display IntelliMix AI mixing software interface
- Format: PNG or JPG
- Dimensions: ~400x300px

### 4. **heat-gear-landscape-1.png**
- Location: HardwareShowreel > Video Operations category
- Usage: Professional video production field operations setup
- Format: PNG or JPG
- Dimensions: ~600x400px

### 5. **heat-gear-landscape-2.png**
- Location: HardwareShowreel > Video Operations category
- Usage: Action sports/extreme environments cinematography
- Format: PNG or JPG
- Dimensions: ~600x400px

### 6. **ian-morrison-headshot.png** (Optional - for future integration)
- Suggested Location: Navigation avatar or About section
- Usage: Professional portrait as personal branding
- Format: PNG with transparency or JPG
- Dimensions: ~200x200px for circular avatar

### 7. **cyberpunk-neon-portrait.png** (Optional - for future integration)
- Suggested Location: Hero section banner or GlobalMesh accent
- Usage: Cyberpunk-themed visual accent
- Format: PNG or JPG
- Dimensions: ~800x600px

## Installation Instructions

1. Download or place your images in this directory
2. Ensure filenames match exactly as referenced above
3. Restart the dev server if images don't appear: `npm run dev`
4. Check browser console for any image loading errors

## Image Optimization Tips

- Compress images before adding (use ImageOptim, TinyPNG, or similar)
- Use WebP format for better performance (tools will auto-convert)
- Ensure images are minimum 1MB uncompressed for quality
- Use Next.js Image component for automatic optimization (already imported in components)

---

**Current Status:** Component structure is ready. Images referenced in code but files are not yet in place.
All components will gracefully handle missing images with fallback styling.
