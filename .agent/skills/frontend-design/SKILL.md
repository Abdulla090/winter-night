---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces using Tailwind CSS v4 and shadcn/ui. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code with the goated Tailwind v4 + shadcn stack.
---

This skill guides creation of distinctive, production-grade frontend interfaces using the **Tailwind CSS v4 + shadcn/ui** stack. Implement real working code with exceptional attention to aesthetic details and creative choices.

## 🚀 MANDATORY TECH STACK

**ALWAYS USE:**
- **Tailwind CSS v4** (latest version with new CSS-first configuration)
- **shadcn/ui** components (the goated component library)
- **Next.js 14+** or **Vite** for project setup
- **Lucide React** for icons
- **Framer Motion** or **Motion** for animations

## 📦 Project Setup

### Next.js + Tailwind v4 + shadcn/ui

```bash
# Create Next.js project
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install Tailwind v4
npm install tailwindcss@next @tailwindcss/vite@next

# Initialize shadcn/ui
npx shadcn@latest init
```

### Tailwind v4 Configuration (CSS-First)

Tailwind v4 uses CSS-first configuration. Create `app/globals.css`:

```css
@import "tailwindcss";

/* ============================================
   SHADCN/UI THEME CONFIGURATION
   ============================================ */

@theme {
  /* Typography - Premium Font Stack */
  --font-sans: "Geist", "Inter", system-ui, sans-serif;
  --font-mono: "Geist Mono", "JetBrains Mono", monospace;
  --font-display: "Cal Sans", "Plus Jakarta Sans", sans-serif;

  /* Radius Scale - Smooth, Modern Feel */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;

  /* Animation Durations */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;

  /* Custom Easings */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ============================================
   SHADCN/UI COLOR TOKENS (LIGHT MODE)
   ============================================ */

:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  
  --chart-1: 12 76% 61%;
  --chart-2: 173 58% 39%;
  --chart-3: 197 37% 24%;
  --chart-4: 43 74% 66%;
  --chart-5: 27 87% 67%;
  
  --radius: 0.75rem;
  --sidebar-background: 0 0% 98%;
  --sidebar-foreground: 240 5.3% 26.1%;
  --sidebar-primary: 240 5.9% 10%;
  --sidebar-primary-foreground: 0 0% 98%;
  --sidebar-accent: 240 4.8% 95.9%;
  --sidebar-accent-foreground: 240 5.9% 10%;
  --sidebar-border: 220 13% 91%;
  --sidebar-ring: 240 5.9% 10%;
}

/* ============================================
   DARK MODE COLORS
   ============================================ */

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
  
  --sidebar-background: 240 5.9% 10%;
  --sidebar-foreground: 240 4.8% 95.9%;
  --sidebar-primary: 224.3 76.3% 48%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 240 3.7% 15.9%;
  --sidebar-accent-foreground: 240 4.8% 95.9%;
  --sidebar-border: 240 3.7% 15.9%;
  --sidebar-ring: 240 4.9% 83.9%;
}

/* ============================================
   TAILWIND V4 BASE STYLES
   ============================================ */

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  /* Premium scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-muted/50;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-muted-foreground/20 rounded-full;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-muted-foreground/30;
  }
}
```

## 🎨 Design Philosophy

### The GOATED Principles

1. **shadcn/ui First** - Always use shadcn components as the foundation
2. **Tailwind v4 Native** - Leverage CSS-first configuration
3. **Minimal but Powerful** - Clean interfaces with hidden depth
4. **Motion Everything** - Subtle animations make interfaces feel alive
5. **Dark Mode Default** - Build for dark mode first, light as variant

### Typography Hierarchy

```tsx
// Heading styles using Tailwind v4
<h1 className="text-4xl font-bold tracking-tight text-foreground">
  Heading 1
</h1>
<h2 className="text-3xl font-semibold tracking-tight text-foreground">
  Heading 2
</h2>
<p className="text-base text-muted-foreground leading-relaxed">
  Body text with muted color
</p>
<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
  Micro-copy / Labels
</span>
```

## 🧩 shadcn/ui Component Patterns

### Installing Components

```bash
# Add components as needed
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add tabs
```

### Premium Button Variants

```tsx
import { Button } from "@/components/ui/button"

// Primary action
<Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200">
  Get Started
</Button>

// Ghost with glow effect
<Button variant="ghost" className="hover:bg-accent/50 hover:shadow-lg hover:shadow-primary/10 transition-all">
  Learn More
</Button>

// Gradient button (goated)
<Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300">
  ✨ Premium Action
</Button>
```

### Glassmorphism Card

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

<Card className="backdrop-blur-xl bg-card/80 border-border/50 shadow-xl shadow-black/5">
  <CardHeader>
    <CardTitle className="text-xl font-semibold tracking-tight">
      Feature Card
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">
      Premium glassmorphism card with blur effect.
    </p>
  </CardContent>
</Card>
```

## ⚡ Animation Patterns

### Framer Motion Integration

```tsx
import { motion } from "framer-motion"

// Staggered reveal container
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

<motion.div variants={container} initial="hidden" animate="show">
  {items.map((item) => (
    <motion.div key={item.id} variants={item}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Tailwind v4 Animations

```css
@theme {
  --animate-fade-in: fade-in 0.5s ease-out;
  --animate-slide-up: slide-up 0.5s ease-out;
  --animate-scale-in: scale-in 0.3s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

## 🌈 Premium Color Palettes

### Obsidian Dark (Default)
```css
--background: 240 10% 3.9%;  /* Near black */
--foreground: 0 0% 98%;       /* Off-white */
--accent: 217 91% 60%;        /* Electric blue */
```

### Midnight Purple
```css
--background: 263 50% 4%;     /* Deep purple */
--foreground: 270 20% 98%;    /* Lavender white */
--accent: 265 89% 60%;        /* Violet */
```

### Forest Green (Premium)
```css
--background: 150 30% 5%;     /* Deep forest */
--foreground: 150 10% 95%;    /* Mint white */
--accent: 155 80% 50%;        /* Emerald */
```

## ✅ Quality Checklist

Before delivering ANY design:

- [ ] Using Tailwind v4 with CSS-first configuration
- [ ] All UI built with shadcn/ui components
- [ ] Proper dark/light mode support
- [ ] Typography uses proper hierarchy (text-foreground, text-muted-foreground)
- [ ] Animations are smooth (using Framer Motion or Tailwind v4)
- [ ] No pure black (#000) or pure white (#FFF)
- [ ] Proper semantic color tokens (not hardcoded colors)
- [ ] Icons from Lucide React
- [ ] Accessible and keyboard-navigable
- [ ] Production-ready, not a prototype

---

## 🎯 CRITICAL RULES

1. **NEVER use raw HTML elements** - Always wrap with shadcn components
2. **NEVER use hardcoded colors** - Always use CSS variables
3. **ALWAYS install fonts** - Geist, Inter, or Plus Jakarta Sans
4. **ALWAYS add hover states** - Every interactive element needs feedback
5. **DARK MODE FIRST** - Build for dark, adapt for light

Remember: If it looks like generic Bootstrap or default HTML, you've failed. Every interface should feel like it belongs on a premium SaaS product like Linear, Vercel, or Stripe.
