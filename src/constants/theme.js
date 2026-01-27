// Migrated legacy constants to use the new Theme system values where possible
// This file ensures backward compatibility for components we haven't refactored yet.

import { colors as newColors } from '../theme/colors';
import { layout } from '../theme/layout';

export const COLORS = {
  background: {
    dark: newColors.light.background, // Mapped to new light default
    primary: newColors.light.surface,
    secondary: newColors.light.surfaceHighlight,
    card: newColors.light.surface,
    border: newColors.light.border,
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
    primary: newColors.light.text.primary,
    secondary: newColors.light.text.secondary,
    muted: newColors.light.text.muted,
    inverse: newColors.light.text.inverse,
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Updated for light mode
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
  },
};
