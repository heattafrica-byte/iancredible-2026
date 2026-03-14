# IANCREDIBLE Design System & Brand Guide

## 🎨 Visual Identity Overview

### Brand Name
**IANCREDIBLE** - The personal brand of Ian Morrison, a Creative Technologist

### Tagline
"Full-stack execution across code, sound, and hardware"

---

## 🌈 Color Palette

### Primary Colors (Neon Cyberpunk)

| Color | Hex Value | Usage | CSS Class |
|-------|-----------|-------|-----------|
| Cyan | `#00D9FF` | Primary accent, main UI elements | `.text-neon-cyan` |
| Magenta/Pink | `#FF00FF` | Secondary accent, music section | `.text-neon-pink` |
| Purple | `#D100FF` | Tertiary accent, hardware section | `.text-neon-purple` |
| Electric Blue | `#0066FF` | Supporting accent, tech section | `.text-neon-blue` |

### Neutral Colors

| Color | Hex Value | Usage |
|-------|-----------|-------|
| Dark Background | `#0A0E27` | Main page background |
| Dark Surface | `#1A1F3A` | Cards, panels, surfaces |
| Dark Border | `#2D3561` | Subtle borders, dividers |
| Text Primary | `#E0E0FF` | Main text |
| Text Secondary | `#A0A0C0` | Secondary text |
| Text Tertiary | `#707090` | Disabled, muted text |

### Gradient Combinations

```css
/* Cyan to Blue */
background: linear-gradient(to right, #00D9FF, #0066FF);

/* Pink to Purple */
background: linear-gradient(to right, #FF00FF, #D100FF);

/* Full Spectrum */
background: linear-gradient(135deg, #00D9FF, #D100FF, #FF00FF);
```

---

## ✨ Effects & Shadows

### Neon Glow Effects

#### Text Glow
```css
.neon-glow {
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.8),
               0 0 20px rgba(0, 217, 255, 0.6),
               0 0 40px rgba(0, 217, 255, 0.4);
}

.neon-glow-pink {
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.8),
               0 0 20px rgba(255, 0, 255, 0.6),
               0 0 40px rgba(255, 0, 255, 0.4);
}

.neon-glow-purple {
  text-shadow: 0 0 10px rgba(209, 0, 255, 0.8),
               0 0 20px rgba(209, 0, 255, 0.6),
               0 0 40px rgba(209, 0, 255, 0.4);
}
```

#### Box Shadows
```css
/* Cyan glow */
box-shadow: 0 0 20px rgba(0, 217, 255, 0.5);

/* Pink glow */
box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);

/* Purple glow */
box-shadow: 0 0 30px rgba(209, 0, 255, 0.6);
```

### Glass Morphism

```css
.glass {
  background: rgba(26, 31, 58, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 217, 255, 0.2);
}

.glass-hover {
  transition: all 0.3s ease;
}

.glass-hover:hover {
  background: rgba(26, 31, 58, 0.6);
  border-color: rgba(0, 217, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
}
```

---

## 🔤 Typography

### Font Stack

```css
/* Display Font (Headings) */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Monospace Font (Code, Technical) */
font-family: 'Monaco', 'Courier New', monospace;
```

### Font Sizes

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| H1 | 56px / 7xl | 900 | Main titles |
| H2 | 42px / 5xl | 900 | Section titles |
| H3 | 32px / 3xl | 700 | Subsections |
| H4 | 24px / 2xl | 700 | Card titles |
| Body | 16px | 400 | Main text |
| Small | 14px | 400 | Secondary text |
| Tiny | 12px | 400 | Metadata |

### Font Weights

```css
font-weight: 400; /* Regular - Body text */
font-weight: 600; /* Semibold - Emphasis */
font-weight: 700; /* Bold - Headings */
font-weight: 900; /* Black - Major titles */
```

---

## 🎬 Animations & Transitions

### Keyframe Animations

#### Glow Pulse
```css
@keyframes glow-pulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 40px rgba(0, 217, 255, 0.8);
  }
}

.animate-glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}
```

#### Matrix Rain
```css
@keyframes matrix-rain {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(100vh);
  }
}

.animate-matrix-rain {
  animation: matrix-rain 10s linear infinite;
}
```

### Framer Motion Variants

```typescript
// Entrance Animation
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
}

// Hover Animation
const hoverScale = {
  scale: 1.05,
  transition: { type: 'spring', stiffness: 300, damping: 30 }
}

// Exit Animation
const fadeOutDown = {
  opacity: 0,
  y: 20,
  transition: { duration: 0.3 }
}
```

### Transition Timings

```
Fast: 200ms - 300ms (micro-interactions)
Medium: 400ms - 600ms (page transitions)
Slow: 800ms - 1200ms (important state changes)
```

---

## 🧩 Component Styles

### Button Styles

#### Primary Button
```css
background: linear-gradient(to right, #00D9FF, #0066FF);
color: #0A0E27;
padding: 12px 32px;
border-radius: 8px;
font-weight: 600;
box-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
transition: all 0.3s ease;
```

#### Secondary Button
```css
background: transparent;
border: 2px solid #00D9FF;
color: #00D9FF;
padding: 10px 30px;
border-radius: 8px;
transition: all 0.3s ease;
```

#### Outline Button
```css
background: rgba(26, 31, 58, 0.4);
border: 1px solid rgba(0, 217, 255, 0.3);
color: #E0E0FF;
padding: 12px 32px;
border-radius: 8px;
```

### Card Styles

#### Glass Card
```css
background: rgba(26, 31, 58, 0.4);
backdrop-filter: blur(10px);
border: 1px solid rgba(0, 217, 255, 0.2);
border-radius: 12px;
padding: 24px;
transition: all 0.3s ease;
```

#### Hover State
```css
background: rgba(26, 31, 58, 0.6);
border-color: rgba(0, 217, 255, 0.5);
box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
```

---

## 📐 Spacing & Layout

### Spacing Scale
```css
Xs: 4px   (0.25rem)
Sm: 8px   (0.5rem)
Md: 16px  (1rem)
Lg: 24px  (1.5rem)
Xl: 32px  (2rem)
2xl: 48px (3rem)
3xl: 64px (4rem)
```

### Container Widths
```
SM: 640px
MD: 768px
LG: 1024px
XL: 1280px
2XL: 1536px
```

### Grid Gaps
```
Tight: 12px
Normal: 16px
Relaxed: 24px
Spacious: 32px
```

---

## 🎯 Section-Specific Styling

### Tech Visionary (Cyan)
- Primary Color: `#00D9FF`
- Shadow: `0 0 20px rgba(0, 217, 255, 0.5)`
- Use for: Code, technology, business content

### Sonic Architect (Pink/Magenta)
- Primary Color: `#FF00FF` / `#D100FF`
- Shadow: `0 0 20px rgba(255, 0, 255, 0.5)` or `0 0 30px rgba(209, 0, 255, 0.6)`
- Use for: Music, audio, creative content

### Hardware Expert (Purple)
- Primary Color: `#D100FF`
- Shadow: `0 0 30px rgba(209, 0, 255, 0.6)`
- Use for: Hardware, technical expertise

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px) { /* SM */ }
@media (min-width: 768px) { /* MD */ }
@media (min-width: 1024px) { /* LG */ }
@media (min-width: 1280px) { /* XL */ }
@media (min-width: 1536px) { /* 2XL */ }
```

### Mobile Adjustments
- Reduce font sizes by 10-15%
- Increase touch targets to 44x44px minimum
- Stack layouts vertically
- Simplify animations
- Reduce shadow intensity

---

## 🎨 Color Accessibility

### Contrast Ratios
- Level AA: 4.5:1 (text)
- Level AAA: 7:1 (enhanced)

All neon colors tested for:
- Light text on dark backgrounds ✓
- Colorblind accessibility ✓
- High contrast mode support ✓

---

## 📝 Implementation Notes

### Tailwind CSS Usage

All colors are configured in `tailwind.config.ts`:

```typescript
colors: {
  neon: {
    cyan: '#00D9FF',
    purple: '#D100FF',
    blue: '#0066FF',
    pink: '#FF00FF',
    green: '#00FF00',
  },
  dark: {
    bg: '#0A0E27',
    surface: '#1A1F3A',
    border: '#2D3561',
  },
}
```

### Custom CSS Classes

Pre-built classes in `app/globals.css`:
- `.neon-glow` - Cyan text glow
- `.neon-glow-pink` - Pink text glow
- `.neon-glow-purple` - Purple text glow
- `.glass` - Glass morphism container
- `.glass-hover` - Interactive glass card
- `.matrix-bg` - Animated background pattern

---

## 🎬 Animation Library

### Framer Motion Components
All major sections use Framer Motion for:
- Page transitions
- Scroll animations
- Hover effects
- Load animations
- Staggered children

### Physics-Based Animations
```typescript
transition={{
  type: 'spring',
  stiffness: 300,
  damping: 30,
}}
```

---

## 📚 Design Files

Location: `/Users/admin/Documents/AIAIAI/about me and collections of works capabilities/Ian Credible Bookings/Logo/`

- Logo/Full Logo/Ian Credible Logo on White.png (8.2 MB)
- Logo/Full Logo/Ian Credible Logo on Black.png (243 KB)
- Logo/Logo Text only/Ian Credible Logo text white.png (263 KB)
- Logo/Logo Text only/Ian Credible Logo text Black.png (269 KB)

---

## ✅ Design Quality Checklist

- [ ] All text has sufficient contrast
- [ ] All interactive elements are 44x44px minimum
- [ ] Animations perform at 60fps
- [ ] Colors follow brand guidelines
- [ ] Spacing follows design system
- [ ] Typography hierarchy is clear
- [ ] Responsive design tested
- [ ] Accessibility tested (a11y)
- [ ] Loading states visible
- [ ] Error states designed
- [ ] Success states designed
- [ ] Empty states designed

---

**Last Updated**: March 2026
**Version**: 1.0.0
