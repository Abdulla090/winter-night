# ✅ Tailwind v4 + shadcn/ui Quality Assurance Checklist

**Run this before declaring ANY design task "Complete".**

---

## 🛠️ Stack Verification

- [ ] **Tailwind v4**: Using CSS-first config (`@theme` blocks, not `tailwind.config.js`)
- [ ] **shadcn/ui**: All UI components are shadcn, not raw HTML
- [ ] **Lucide React**: Icons are from Lucide, not emojis or font icons
- [ ] **Framer Motion**: Animations use Framer Motion or Motion library

---

## 🎨 Color & Theming

- [ ] **No Hardcoded Colors**: Using `hsl(var(--primary))`, not `#3B82F6`
- [ ] **Semantic Tokens**: Using `bg-primary`, `text-foreground`, `border-border`
- [ ] **No Pure Black/White**: Never `#000000` or `#FFFFFF` - use `--background`/`--foreground`
- [ ] **Dark Mode Works**: Toggle to dark mode and verify everything looks correct
- [ ] **Colored Shadows**: Using `shadow-primary/20` instead of black shadows

---

## 📝 Typography

- [ ] **Premium Font**: Using Geist, Inter, or Plus Jakarta Sans (not Arial/system)
- [ ] **Hierarchy Clear**: Can scan the page in 3 seconds and understand structure
- [ ] **Muted Secondary**: Secondary text uses `text-muted-foreground`
- [ ] **Tight Headlines**: Headings have `tracking-tight` or `tracking-tighter`
- [ ] **Relaxed Body**: Body text has good `leading-relaxed` or `leading-7`

---

## 🧩 Components (shadcn/ui)

- [ ] **Using shadcn**: All buttons, cards, inputs are shadcn components
- [ ] **Proper Variants**: Using correct variant props (`variant="ghost"`, etc.)
- [ ] **Consistent Radius**: All elements use `--radius` token
- [ ] **Proper Spacing**: Using Tailwind spacing scale (`p-4`, `gap-6`)

---

## ⚡ Interactions & Motion

- [ ] **Hover States**: Every button/link has hover feedback
- [ ] **Active States**: Buttons have `active:scale-[0.98]` or similar
- [ ] **Focus Visible**: Keyboard focus is visible (`focus-visible:ring-2`)
- [ ] **Page Animations**: Content animates in on load (Framer Motion)
- [ ] **Transitions**: All transitions use `transition-all duration-200` or similar

---

## 📐 Layout & Spacing

- [ ] **Generous Whitespace**: Sections have `py-16` or more
- [ ] **Consistent Gaps**: Using Tailwind gap scale (`gap-4`, `gap-8`)
- [ ] **Max Width**: Content has `max-w-7xl mx-auto` or similar
- [ ] **No Overflow**: Nothing causes horizontal scroll
- [ ] **Alignment**: Items are pixel-perfectly aligned

---

## 📱 Responsive

- [ ] **Mobile First**: Looks good on 320px width
- [ ] **Tap Targets**: Buttons are 44px minimum height on mobile
- [ ] **Stack Correctly**: Grids collapse to single column on mobile
- [ ] **Text Readable**: Font sizes are readable on all screens
- [ ] **No Overlap**: Nothing overlaps at any breakpoint

---

## ♿ Accessibility

- [ ] **Keyboard Navigation**: Can tab through entire interface
- [ ] **Focus Indicators**: Focus rings are visible
- [ ] **Contrast Ratio**: Meets WCAG AA (4.5:1 for text)
- [ ] **ARIA Labels**: Interactive elements have proper labels
- [ ] **Semantic HTML**: Using proper elements (`<button>`, `<nav>`, etc.)

---

## 🔍 Final Visual Audit

- [ ] **Looks Premium**: Could this be on Linear, Vercel, or Stripe?
- [ ] **Not Generic**: Does NOT look like Bootstrap or default AI output
- [ ] **Consistent**: All elements follow the same design language
- [ ] **Polished**: No rough edges, everything feels considered
- [ ] **Memorable**: What's the one thing users will remember?

---

## 🚀 Performance

- [ ] **No Layout Shift**: Content doesn't jump on load
- [ ] **Images Optimized**: Using Next.js `<Image>` or optimized formats
- [ ] **Fonts Loaded**: Custom fonts load without FOUT
- [ ] **No Unused Code**: Not importing unused components

---

## ⚠️ Red Flags (Immediate Fix Required)

If ANY of these exist, the design is NOT ready:

- ❌ Raw `<button>` or `<input>` instead of shadcn
- ❌ Hardcoded colors like `bg-blue-500` or `#3B82F6`
- ❌ Emojis used as icons
- ❌ System fonts (Arial, Times New Roman)
- ❌ No dark mode support
- ❌ No hover states on interactive elements
- ❌ Pure black (`#000`) or pure white (`#FFF`)
- ❌ Generic "Bootstrap" aesthetic
- ❌ Tailwind v3 config file instead of v4 CSS-first

---

**Remember:** If it looks like it was made by an AI with default settings, it's not ready. Every interface should feel like a team of senior designers labored over it for weeks.
