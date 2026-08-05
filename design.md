# AFSEC Architecture & Design Reference

This document serves as the master reference for the AFSEC platform's UI/UX, tech stack, and structural architecture.

## 1. Tech Stack
- **Framework:** React 18 with Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v3 (Custom configuration for brand colors)
- **Animations:** GSAP (GreenSock) + ScrollTrigger
- **Smooth Scrolling:** Lenis (`@studio-freight/lenis`)
- **Icons:** Lucide React

## 2. Design System & Theme
- **Global Theme:** Light/White dominant, utilizing high-contrast dark sections (`#050f1c`) strategically for anchors (Hero, Footer, Stats, CTAs).
- **Typography:** Inter or system sans-serif, using heavy weights (`font-black`) for main headings to evoke a bold, engineering aesthetic.
- **Brand Colors:**
  - Primary: `#1976ff` (Vibrant Blue)
  - Accent: `#22d3ee` (Cyan-400 for highlights and technical accents)
  - Dark Anchors: `#050f1c` (Deep Navy)

## 3. Animation Guidelines
The site employs premium, hardware-accelerated animations using GSAP and Lenis:
- **Global Smooth Scroll:** Wrapped in `<SmoothScroll>` (Lenis) to provide a fluid, premium scroll experience synchronized with GSAP's `ticker`.
- **Hero Parallax:** The background image in the Home Hero section uses GSAP to scale up (`scale: 1.2`) as the user scrolls, creating depth.
- **Horizontal Scroll on Vertical Scroll:** Both the `TechnologiesSlider` and `Featured Projects` utilize `ScrollTrigger` pinning (`pin: true`, `scrub: true`) to seamlessly convert vertical scrolling into horizontal translation without native scrollbars.
- **Section Reveals:** Core sections utilize `gsap-section` triggers to fade and slide up content organically as it enters the viewport.

## 4. Component Structure
- **Pages Layout:** Each page (`Home`, `About`, `Services`, `Projects`, `Contact`) operates independently to support direct navigation, wrapped in a global `Layout` that conditionally renders the Navbar and Footer.
- **Clean Content:** Removed all legacy numbered prefixes (e.g., `01 —`) to favor modern, clean typographic hierarchy.

## 5. Maintenance Notes
- **GSAP Contexts:** Always utilize the `@gsap/react` `useGSAP` hook when defining animations in components to prevent memory leaks and ensure proper cleanup.
- **Lenis Mobile:** Lenis is conditionally bypassed or optimized on mobile devices to preserve native touch-scroll feel when necessary.
