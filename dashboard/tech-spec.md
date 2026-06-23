# Mal Pelayanan Publik Digital — Technical Specification

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | DOM renderer |
| vite | ^6.3.0 | Build tool |
| typescript | ^5.8.0 | Type system |
| tailwindcss | ^4.0.0 | Utility CSS |
| @tailwindcss/vite | ^4.0.0 | Tailwind Vite plugin |
| lucide-react | ^0.460.0 | Icons |
| framer-motion | ^12.0.0 | Animations, scroll reveals, hero slider |

---

## Component Inventory

### Layout

| Component | Source | Reuse | Notes |
|-----------|--------|-------|-------|
| Header | Custom | Single | Fixed navbar with glassmorphism, mobile hamburger drawer |
| Footer | Custom | Single | 4-column grid footer |

### Sections

| Component | Source | Notes |
|-----------|--------|-------|
| HeroSection | Custom | Full-viewport, 3-slide crossfade slider, parallax-ready |
| ServicesSection | Custom | 16-card grid with stagger reveal |
| SmartServiceSection | Custom | 3 white cards on light background |
| NewsSection | Custom | Vertical news list with divider lines |

### Reusable Components

| Component | Source | Used By | Notes |
|-----------|--------|---------|-------|
| ServiceCard | Custom | ServicesSection (×16) | Dark card with icon container |
| SmartCard | Custom | SmartServiceSection (×3) | White card with icon, link |
| NewsItem | Custom | NewsSection (×6) | Flex row with timestamp + content |
| SliderDots | Custom | HeroSection | 3-dot indicator, active state |
| SliderArrow | Custom | HeroSection | 48px circle button |

### Hooks

| Hook | Purpose |
|------|---------|
| useScrollReveal | IntersectionObserver-based scroll trigger for entrance animations |
| useSlider | Auto-advance, manual nav, crossfade transition logic |

---

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Hero BG fade + scale | framer-motion | motion.div with initial/animate, opacity + scale | Low |
| Hero text stagger | framer-motion | motion.div + staggerChildren variant | Low |
| Portrait slide-in | framer-motion | motion.div translateX | Low |
| Hero slider crossfade | framer-motion | AnimatePresence + motion.div opacity transition | Medium |
| Scroll reveal (sections) | framer-motion | useInView + motion.div whileInView | Low |
| Service card stagger | framer-motion | useInView + staggerChildren on parent | Low |
| News item stagger | framer-motion | useInView + staggerChildren on list | Low |
| Nav underline hover | CSS | scaleX transform on ::after pseudo-element | Low |
| Card hover lift | CSS | translateY + shadow transition | Low |
| Mobile menu drawer | framer-motion | motion.div slide from right with AnimatePresence | Low |

---

## State & Logic Plan

### useSlider Hook

Manages the hero carousel with three responsibilities:
- **Auto-advance**: `setInterval` with 6s delay, paused on hover, reset on manual interaction
- **Crossfade transition**: Current slide opacity 1 → 0, next slide opacity 0 → 1 via AnimatePresence
- **Manual navigation**: Left/right arrows increment/decrement index; dot clicks jump to index

No URL sync needed — this is a decorative slider, not route-based.

### useScrollReveal Hook

Thin wrapper around framer-motion's `useInView`:
- threshold: 0.15
- once: true (animations fire once only)
- Returns ref + inView boolean for motion components

---

## Other Key Decisions

- **No shadcn/ui components needed**: This is a fully custom landing page with unique card designs. All components are custom-built.
- **Images**: 4 total — hero background (opaque JPG), 2 pejabat cutouts (transparent PNG), 1 logo (transparent PNG).
- **No routing**: Single-page landing site. All nav links scroll to sections (anchor-based).
- **News data**: Static mock data array. No API integration.
