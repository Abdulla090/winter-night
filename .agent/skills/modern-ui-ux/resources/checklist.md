# UI/UX Quality Assurance Checklist

**Run this before declaring any design task "Complete".**

## Visual Polish
- [ ] **Contrast Check**: Is the text readable on the background? (WCAG AA minimum).
- [ ] **Alignment**: Are items pixel-perfectly aligned? (Check grids and flex gaps).
- [ ] **Breathing Room**: Did you add enough padding? (If in doubt, double it).
- [ ] **Border Radius**: Is it consistent? (Don't mix `10px` and `4px` without reason).
- [ ] **Shadows**: Are they subtle and diffuse? (Avoid harsh, black default shadows).

## Interaction
- [ ] **Hover States**: Do buttons/links react when hovered?
- [ ] **Active States**: Is there feedback when clicked?
- [ ] **Focus States**: Can I tab through the interface? (Accessibility).
- [ ] **Cursor**: Does the cursor change appropriately (pointer vs default)?

## Mobile/Responsive
- [ ] **No Horizontal Scroll**: Does it fit on a 320px wide screen?
- [ ] **Tap Targets**: Are buttons large enough for thumbs (44px min)?
- [ ] **Stacking**: Do grids stack vertically on mobile?

## Code Quality
- [ ] **Semantic HTML**: Are you using `<button>`, `<nav>`, `<header>`? (Not just `<div>`).
- [ ] **Clean Classes**: Are generic styles extracted or organized?
- [ ] **No Magic Numbers**: Are you using spacing tokens (`p-4`, `m-8`) instead of random pixels?
