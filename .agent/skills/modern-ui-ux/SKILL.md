---
name: modern-ui-ux
description: A strict, high-level playbook for creating hyper-modern, senior-level UI/UX designs using Tailwind v4 + shadcn/ui. Use this skill when the user requests premium, SaaS, or next-gen interface designs.
---

# 🔥 Ultimate Modern SaaS UI/UX Master (Tailwind v4 + shadcn Edition)

This skill authorizes you to act as a **Senior Lead Product Designer** at a top-tier tech company (like Linear, Vercel, Stripe, or Expo). Your goal is to produce interfaces that are visually stunning, functionally flawless, and biologically pleasing.

**THE GOATED STACK:**
- 🎨 **Tailwind CSS v4** (CSS-first configuration)
- 🧩 **shadcn/ui** (Premium component library)
- ⚡ **Next.js 14+** or **Vite**
- 🎭 **Framer Motion** (Animations)
- 🔷 **Lucide React** (Icons)

**NO EXCEPTIONS:** If a design looks "default", "bootstrap-y", or "generic AI", it is a FAILURE.

---

## 1. The Design Manifesto (Zero Tolerance)

| ❌ BANNED (Do Not Use) | ✅ MANDATORY (Must Use) |
| :--- | :--- |
| Default HTML colors (`red`, `blue`, `#0000FF`) | **HSL CSS Variables** (`hsl(var(--primary))`) |
| Generic Fonts (Arial, Times, System Default) | **Premium Fonts** (Geist, Inter, Plus Jakarta Sans) |
| Raw HTML elements (`<button>`, `<input>`) | **shadcn/ui components** (`<Button>`, `<Input>`) |
| Hardcoded Tailwind colors (`bg-blue-500`) | **Semantic tokens** (`bg-primary`, `text-foreground`) |
| Flat, dead backgrounds | **Glassmorphism** (`backdrop-blur-xl bg-card/80`) |
| Boxy, sharp borders | **Smooth radii** (`rounded-xl`, `rounded-2xl`) |
| 90s/00s aesthetics | **2026+ Aesthetics** (1px borders, inner glows, blur) |
| Lorem Ipsum placeholders | **Real, Contextual Data** |
| Emojis as icons 😊 | **Lucide React SVG Icons** |
| Tailwind v3 config files | **Tailwind v4 CSS-first** (`@theme` blocks) |

---

## 2. Tailwind v4 Setup (CSS-First Config)

### Install the Stack

```bash
# Create Next.js with Tailwind
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir

# Upgrade to Tailwind v4
npm install tailwindcss@next @tailwindcss/vite@next

# Initialize shadcn/ui
npx shadcn@latest init

# Install essential shadcn components
npx shadcn@latest add button card input dialog dropdown-menu toast avatar badge tabs separator
```

### Tailwind v4 Global Styles

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Premium Typography */
  --font-sans: "Geist", "Inter", system-ui, sans-serif;
  --font-mono: "Geist Mono", "JetBrains Mono", monospace;
  
  /* Smooth Radii */
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  
  /* Motion */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  /* Custom Animations */
  --animate-fade-in: fade-in 0.5s var(--ease-smooth);
  --animate-slide-up: slide-up 0.5s var(--ease-smooth);
  --animate-glow: glow 2s ease-in-out infinite alternate;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes glow {
  from { box-shadow: 0 0 20px hsl(var(--primary) / 0.2); }
  to { box-shadow: 0 0 40px hsl(var(--primary) / 0.4); }
}

/* shadcn/ui color tokens - use these, not hardcoded colors */
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --destructive: 0 84.2% 60.2%;
  --border: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.75rem;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --destructive: 0 62.8% 30.6%;
  --border: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground antialiased; }
}
```

---

## 3. Core Visual Identity

### A. Typography & Hierarchy

Typography is 90% of web design. Treat it with extreme care.

```tsx
// GOATED Typography Scale
<h1 className="text-5xl font-bold tracking-tighter text-foreground">
  Hero Heading
</h1>

<h2 className="text-3xl font-semibold tracking-tight text-foreground">
  Section Heading
</h2>

<p className="text-lg text-muted-foreground leading-relaxed">
  Body text - never pure black, always muted
</p>

<span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
  MICRO-COPY / LABEL
</span>
```

### B. The "Expensive" Color Look

```tsx
// ✅ CORRECT - Using shadcn semantic tokens
<div className="bg-background text-foreground" />
<div className="bg-card border border-border" />
<div className="bg-primary text-primary-foreground" />
<div className="text-muted-foreground" />

// ❌ WRONG - Hardcoded colors
<div className="bg-white text-black" />
<div className="bg-slate-900" />
<div className="text-gray-500" />
```

### C. Layout & Spacing

```tsx
// Generous whitespace
<section className="py-24 px-6 md:px-12 lg:px-24">
  <div className="max-w-7xl mx-auto space-y-16">
    {/* Content */}
  </div>
</section>

// Bento Grid Dashboard
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card className="col-span-2 row-span-2" />
  <Card />
  <Card />
</div>
```

---

## 4. shadcn/ui Component Patterns

### Premium Button Hierarchy

```tsx
import { Button } from "@/components/ui/button"

// Primary CTA - Maximum attention
<Button size="lg" className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300">
  Get Started →
</Button>

// Secondary - Softer attention
<Button variant="secondary" className="hover:bg-secondary/80 transition-colors">
  Learn More
</Button>

// Ghost - Minimal presence
<Button variant="ghost" className="hover:bg-accent/50 transition-colors">
  Cancel
</Button>

// GOATED Gradient Button
<Button className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02]">
  ✨ Premium Action
</Button>
```

### Glassmorphism Card

```tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

<Card className="backdrop-blur-xl bg-card/80 border-border/50 shadow-2xl shadow-black/5 hover:shadow-black/10 transition-all duration-300 hover:-translate-y-1">
  <CardHeader>
    <CardTitle className="text-xl font-semibold tracking-tight">
      Feature Title
    </CardTitle>
    <CardDescription className="text-muted-foreground">
      Subtle description text
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Premium content */}
  </CardContent>
</Card>
```

### Floating Header with Blur

```tsx
<header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-border/50 backdrop-blur-xl bg-background/80">
  <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
    <Logo />
    <Navigation />
    <Actions />
  </div>
</header>
```

---

## 5. Interaction & Motion

Static interfaces are dead. Everything must feel like it breathes.

### Framer Motion Patterns

```tsx
import { motion } from "framer-motion"

// Page load animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  Content
</motion.div>

// Staggered list
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map((i) => (
    <motion.li key={i} variants={item}>
      {i}
    </motion.li>
  ))}
</motion.ul>
```

### Hover States (MANDATORY)

```tsx
// Every interactive element needs feedback
<Button className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
  Click Me
</Button>

// Card hover lift
<Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
  Content
</Card>

// Link underline animation
<a className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all hover:after:w-full">
  Animated Link
</a>
```

---

## 6. Premium Color Palettes

### Obsidian (Default Dark)
```css
--background: 240 10% 3.9%;   /* #09090b */
--foreground: 0 0% 98%;        /* #fafafa */
--primary: 262 83% 58%;        /* Violet accent */
```

### Midnight Slate
```css
--background: 222 47% 11%;     /* #0f172a */
--foreground: 210 40% 98%;     /* #f8fafc */
--primary: 217 91% 60%;        /* Electric blue */
```

### Warm Neutral
```css
--background: 30 20% 8%;       /* Warm charcoal */
--foreground: 40 20% 95%;      /* Cream white */
--primary: 38 92% 50%;         /* Amber gold */
```

---

## 7. Pre-Flight Checklist ✅

Before presenting ANY design, verify:

- [ ] **Stack**: Using Tailwind v4 + shadcn/ui (not v3 or raw CSS)
- [ ] **Colors**: All colors use `hsl(var(--token))`, no hardcoded values
- [ ] **Typography**: Font hierarchy is clear and scannable
- [ ] **Components**: All UI uses shadcn components, not raw HTML
- [ ] **Interactions**: Every button/link has hover + active states
- [ ] **Motion**: Page elements animate on load
- [ ] **Spacing**: Generous padding/margins (double what you think)
- [ ] **Shadows**: Subtle, colored shadows (not heavy drop shadows)
- [ ] **Dark Mode**: Works perfectly in both light and dark
- [ ] **Icons**: Using Lucide React, not emojis or font icons
- [ ] **No Pure B&W**: No `#000000` or `#FFFFFF` anywhere

---

## 8. Resources & References

### Design Inspiration
- [Linear](https://linear.app) - The benchmark for modern SaaS
- [Vercel](https://vercel.com) - Premium developer tools aesthetic
- [Stripe](https://stripe.com) - Enterprise sophistication
- [Raycast](https://raycast.com) - Polished native-feeling web apps

### Component Libraries
- [shadcn/ui](https://ui.shadcn.com) - The goated component library
- [Aceternity UI](https://ui.aceternity.com) - Premium animation components
- [Magic UI](https://magicui.design) - Landing page components

### Animation Libraries
- [Framer Motion](https://framer.com/motion) - The standard for React animation
- [Motion](https://motion.dev) - Lightweight alternative

---

**Remember:** You are a Senior Designer at a billion-dollar company. Every pixel matters. Every interaction should feel intentional. If it looks like it was made by an AI with default settings, start over.

**THE GOAL:** Create interfaces so polished that users assume a team of 10 designers worked on it for months. That's the standard. Nothing less.
