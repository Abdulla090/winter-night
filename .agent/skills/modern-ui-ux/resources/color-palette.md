# 🎨 Premium Color Palettes for Tailwind v4 + shadcn/ui

These palettes use HSL format for shadcn/ui CSS variables. Copy directly into your `globals.css`.

---

## 1. "Obsidian Night" (Default Dark SaaS)
The Linear/Vercel aesthetic. Deep, professional, electric accents.

```css
:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 5%;
  --card-foreground: 0 0% 98%;
  --primary: 262 83% 58%;        /* Electric Violet */
  --primary-foreground: 0 0% 100%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 217 91% 60%;         /* Electric Blue accent */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 262 83% 58%;
}
```

---

## 2. "Polar Clean" (Premium Light Mode)
Clean, medical-grade white. Perfect for dashboards and admin panels.

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;     /* Slate 900 */
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --primary: 221 83% 53%;        /* Vibrant Blue */
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222 47% 11%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215 16% 47%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222 47% 11%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 100%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 221 83% 53%;
}
```

---

## 3. "Midnight Purple" (Luxury/Premium)
Deep purple tones for luxury brands and premium products.

```css
:root {
  --background: 263 50% 4%;      /* Deep purple-black */
  --foreground: 270 20% 98%;     /* Lavender white */
  --card: 263 40% 7%;
  --card-foreground: 270 20% 98%;
  --primary: 265 89% 60%;        /* Bright Violet */
  --primary-foreground: 0 0% 100%;
  --secondary: 263 30% 15%;
  --secondary-foreground: 270 20% 98%;
  --muted: 263 30% 12%;
  --muted-foreground: 270 10% 60%;
  --accent: 280 100% 70%;        /* Magenta accent */
  --accent-foreground: 0 0% 100%;
  --destructive: 350 89% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 263 30% 18%;
  --input: 263 30% 18%;
  --ring: 265 89% 60%;
}
```

---

## 4. "Forest Premium" (Organic/Sustainable)
Deep forest greens for eco-friendly and wellness brands.

```css
:root {
  --background: 150 30% 5%;      /* Deep forest */
  --foreground: 150 10% 95%;     /* Mint white */
  --card: 150 25% 8%;
  --card-foreground: 150 10% 95%;
  --primary: 155 80% 50%;        /* Emerald */
  --primary-foreground: 150 30% 5%;
  --secondary: 150 20% 15%;
  --secondary-foreground: 150 10% 95%;
  --muted: 150 15% 12%;
  --muted-foreground: 150 10% 55%;
  --accent: 45 93% 58%;          /* Gold accent */
  --accent-foreground: 150 30% 5%;
  --destructive: 0 74% 42%;
  --destructive-foreground: 0 0% 100%;
  --border: 150 15% 18%;
  --input: 150 15% 18%;
  --ring: 155 80% 50%;
}
```

---

## 5. "Warm Neutral" (Consumer/E-commerce)
Warm, inviting tones for consumer apps and marketplaces.

```css
:root {
  --background: 30 20% 8%;       /* Warm charcoal */
  --foreground: 40 20% 95%;      /* Cream white */
  --card: 30 15% 12%;
  --card-foreground: 40 20% 95%;
  --primary: 38 92% 50%;         /* Amber Gold */
  --primary-foreground: 30 20% 8%;
  --secondary: 30 15% 18%;
  --secondary-foreground: 40 20% 95%;
  --muted: 30 10% 15%;
  --muted-foreground: 30 10% 55%;
  --accent: 14 89% 55%;          /* Coral */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 30 10% 22%;
  --input: 30 10% 22%;
  --ring: 38 92% 50%;
}
```

---

## 6. "Ocean Depths" (Professional Services)
Deep blue tones for finance, legal, and professional services.

```css
:root {
  --background: 220 45% 6%;      /* Deep navy */
  --foreground: 210 30% 96%;     /* Cool white */
  --card: 220 40% 10%;
  --card-foreground: 210 30% 96%;
  --primary: 200 100% 55%;       /* Cyan Blue */
  --primary-foreground: 220 45% 6%;
  --secondary: 220 35% 18%;
  --secondary-foreground: 210 30% 96%;
  --muted: 220 30% 14%;
  --muted-foreground: 210 20% 55%;
  --accent: 45 100% 60%;         /* Golden accent */
  --accent-foreground: 220 45% 6%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 100%;
  --border: 220 30% 20%;
  --input: 220 30% 20%;
  --ring: 200 100% 55%;
}
```

---

## Usage with Tailwind v4 + shadcn/ui

```tsx
// All colors automatically work with shadcn components
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Uses --primary automatically
<Button>Primary Action</Button>

// Uses --card, --card-foreground, --border automatically
<Card>Content</Card>

// Custom accent with shadcn tokens
<div className="bg-accent text-accent-foreground">Accent Block</div>

// Gradient using tokens
<div className="bg-gradient-to-r from-primary to-accent">Gradient</div>
```

---

## Pro Tips

1. **Never use hardcoded colors** - Always reference `hsl(var(--token))`
2. **Test in both modes** - Every palette should have light/dark variants
3. **Use colored shadows** - `shadow-primary/20` looks premium
4. **Muted text is key** - Secondary content uses `text-muted-foreground`
5. **Accent sparingly** - Accent colors are for highlights, not backgrounds
