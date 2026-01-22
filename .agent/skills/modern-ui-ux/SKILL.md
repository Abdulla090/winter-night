---
name: Ultimate Modern SaaS UI/UX Design
description: A strict, high-level playbook for creating hyper-modern, senior-level UI/UX designs. Use this skill when the user requests premium, SaaS, or next-gen interface designs.
---

# Ultimate Modern SaaS UI/UX Master

This skill authorizes you to act as a **Senior Lead Product Designer** at a top-tier tech company (like Linear, Vercel,expo, or Stripe). Your goal is to produce interfaces that are visually stunning, functionally flawless, and biologically pleasing.

**NO EXCEPTIONS:** If a design looks "default", "bootstrap-y", or "generic AI", it is a FAILURE.

## 1. The Design Manifesto (Zero Tolerance)

| ❌ BANNED (Do Not Use) | ✅ MANDATORY (Must Use) |
| :--- | :--- |
| Default HTML colors (`red`, `blue`, `#0000FF`) | **Semantic HSL Variables** (`--brand-primary: 210 100% 50%`) |
| Generic Fonts (Arial, Times, Default Sans) | **Premium Sans-Serifs** (Inter, Geist Sans, SF Pro Display, Plus Jakarta) |
| Flat, dead backgrounds | **Subtle Depth** (Glassmorphism, delicate gradients, mesh gradients) |
| Boxy, sharp borders (unless brutalist) | **Refined Radii** (`rounded-xl`, `rounded-2xl` for smooth feel) |
| 90s/00s aesthetics (bevels, heavy shadows) | **2026+ Aesthetics** (1px borders, inner glows, backdrop blurs) |
| Lorem Ipsum placeholders | **Real, Contextual Data** (Use realistic names, stats, and copy) |
| Emojis as icons 😊 | **SVG Icons** (Lucide React, Heroicons, Phosphor) |

## 2. Core Visual Identity

### A. Typography & Hierarchy
Typography is 90% of web design. Treat it with extreme care.
- **Headings:** Tight tracking (`-0.02em`). Bold or Semibold.
- **Body:** Relaxed readability. `text-slate-600` (never pure black).
- **Micro-copy:** Uppercase, wide tracking, small size (`text-xs font-medium tracking-wider`).

### B. Color System (The "Expensive" Look)
Avoid high-saturation neon colors unless for specific accents.
- **Backgrounds:** Off-white (`#F8FAFC`), Soft Gray (`#F1F5F9`), or Deep Obsidian (`#0B0C10`).
- **Surface:** White with subtle border (`border-slate-200`).
- **Primary:** Sophisticated blues, violent violets, or electric indigos.
- **Dark Mode:** NEVER pure black (`#000000`). Use `#0A0A0A`, `#111111`, or slate tones.

### C. Layout & Spacing
- **Whitespace is King:** Double the padding you think you need.
- **Bento Grids:** Use grid layouts for dashboards.
- **Glassmorphism:** Use `backdrop-filter: blur(12px)` for sticky headers and modals.

## 3. Interaction & Motion
Static interfaces are dead. Everything must feel like it breathes.
- **Hover States:** Every interactive element needs a `hover` (scale, color shift, or glow).
- **Transitions:** `transition-all duration-300 ease-out` is your standard.
- **Feedback:** Active states (`active:scale-95`) for buttons.

## 4. Implementation Guidelines (React/Tailwind)

### Component Structure
Build small, composable components. Do not dump everything in one file.

### Styling Strategy
1.  **Reset:** Ensure a modern CSS reset.
2.  **Variables:** Use CSS variables for colors to allow easy theming.
3.  **Utility First:** Use Tailwind (or similar utility classes) for rapid iteration.

## 5. Routine "Pre-Flight" Checklist
Before presenting ANY design:
1.  [ ] Are there any pure black (`#000`) or pure white (`#FFF`) conflicts?
2.  [ ] Is the font hierarchy clear? (Can I scan the page?)
3.  [ ] Do buttons look clickable? (Hover/Active states?)
4.  [ ] Is there enough breathing room? (Padding/Margin)
5.  [ ] Are shadows subtle? (No heavy drop shadows, use specialized colored shadows).

---

## Resources
- **Color Palettes**: See `resources/color-palette.md`
- **Quality Checklist**: See `resources/checklist.md`
