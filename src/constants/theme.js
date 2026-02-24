// Migrated legacy constants to use the new Theme system values where possible
// This file ensures backward compatibility for components we haven't refactored yet.
// ⚠️ IMPORTANT: These map to DARK mode colors since the app defaults to dark mode
// and all game screens render on the dark gradient background.

import { colors as newColors } from '../theme/colors';
import { layout } from '../theme/layout';

export const COLORS = {
  background: {
    dark: newColors.dark.background,
    primary: newColors.dark.surface,
    secondary: newColors.dark.surfaceHighlight,
    card: newColors.dark.surface,
    border: newColors.dark.border,
  },
  accent: {
    primary: newColors.brand.crimson,
    success: '#10b981',
    warning: newColors.brand.gold,
    danger: '#ef4444',
    info: '#06b6d4',
    purple: '#8b5cf6',
  },
  // Game gradients (kept for identity)
  games: {
    whoAmI: ['#3b82f6', '#1d4ed8'],
    imposter: ['#ef4444', '#b91c1c'],
    spyfall: ['#10b981', '#047857'],
    truthOrDare: ['#8b5cf6', '#6d28d9'],
    neverHaveIEver: ['#f59e0b', '#b45309'],
    wouldYouRather: ['#06b6d4', '#0e7490'],
    quiz: ['#10b981', '#059669'],
    drawGuess: ['#06b6d4', '#0891b2'],
    pyramid: ['#eab308', '#a16207'],
    wheel: ['#ec4899', '#be185d'],
  },
  text: {
    primary: newColors.dark.text.primary,       // #FFFFFF - white text
    secondary: newColors.dark.text.secondary,   // #E8E0F0 - bright white-lavender
    muted: newColors.dark.text.muted,           // #C0B8D0 - light silver-purple
    inverse: newColors.dark.text.inverse,       // #0F0518 - dark
  },
};

export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 };

export const BORDER_RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  round: 999
};

export const SHADOWS = layout.shadows;

export const FONTS = {
  regular: { fontSize: 16, fontWeight: '400' },
  medium: { fontSize: 16, fontWeight: '500' },
  semibold: { fontSize: 16, fontWeight: '600' },
  bold: { fontSize: 16, fontWeight: '700' },
  title: { fontSize: 28, fontWeight: '700' },
};

export const KURDISH_FONTS = {
  regular: { fontFamily: 'Rabar', fontSize: 16 },
  medium: { fontFamily: 'Rabar-Medium', fontSize: 16 },
  semibold: { fontFamily: 'Rabar-SemiBold', fontSize: 16 },
  bold: { fontFamily: 'Rabar-Bold', fontSize: 16 },
  title: { fontFamily: 'Rabar-Bold', fontSize: 30 },
};

export const GLASS = {
  default: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Dark mode glass
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
  },
};
