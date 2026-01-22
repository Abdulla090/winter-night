// Modern Sleek Theme System - Professional & Native Feel
import { Platform } from 'react-native';

// --- ULTIMATE MODERN SAAS PALETTE (OBSIDIAN & VIOLA) ---
const PALETTE = {
  obsidian: {
    base: '#000000',      // Pure black for OLED depth
    subtle: '#09090b',    // Zinc 950
    surface: '#121214',   // Zinc 900
    overlay: '#18181b',   // Zinc 800
    border: '#27272a',    // Zinc 700
  },
  viola: {
    primary: '#7c3aed',   // Violet 600
    glowing: '#8b5cf6',   // Violet 500
    subtle: '#4c1d95',    // Violet 900
  },
  text: {
    primary: '#ffffff',
    secondary: '#a1a1aa', // Zinc 400 - The perfect secondary text
    muted: '#52525b',     // Zinc 600
  }
};

export const THEMES = {
  dark: {
    background: {
      main: PALETTE.obsidian.base,
      card: PALETTE.obsidian.surface,
      modal: PALETTE.obsidian.overlay,
      input: PALETTE.obsidian.subtle,
      border: PALETTE.obsidian.border,
    },
    text: {
      primary: PALETTE.text.primary,
      secondary: PALETTE.text.secondary,
      muted: PALETTE.text.muted,
      inverse: '#000000',
    },
    colors: {
      primary: PALETTE.viola.glowing,
      success: '#10b981', // Emerald 500
      warning: '#f59e0b', // Amber 500
      danger: '#ef4444',  // Red 500
      info: '#06b6d4',    // Cyan 500
    }
  },
  // We force dark mode design principles even in "light" mode for consistency in this specific "Dark SaaS" aesthetic,
  // but if you want a true light mode, we can add the "Polar" palette later.
  light: {
    background: {
      main: '#ffffff',
      card: '#f4f4f5',    // Zinc 100
      modal: '#ffffff',
      input: '#f4f4f5',
      border: '#e4e4e7',  // Zinc 200
    },
    text: {
      primary: '#09090b',
      secondary: '#71717a',
      muted: '#a1a1aa',
      inverse: '#ffffff',
    },
    colors: {
      primary: '#7c3aed',
      success: '#059669',
      warning: '#d97706',
      danger: '#dc2626',
      info: '#0891b2',
    }
  }
};

export const COLORS = {
  // Keeping backward compatibility but mapping to new palette
  background: {
    dark: PALETTE.obsidian.base,
    primary: PALETTE.obsidian.subtle,
    secondary: PALETTE.obsidian.surface,
    card: PALETTE.obsidian.surface,
    border: PALETTE.obsidian.border,
  },
  accent: {
    primary: PALETTE.viola.glowing,
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
    purple: '#8b5cf6',
  },
  games: {
    // Elegant, slightly desaturated gradients for game cards
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
    primary: '#FFFFFF',
    secondary: '#a1a1aa',
    muted: '#52525b',
    inverse: '#000000',
  },
};

export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 };

export const BORDER_RADIUS = {
  sm: 6,
  md: 10,   // Slightly more rounded
  lg: 16,   // Modern standard
  xl: 24,   // Super rounded for cards
  round: 999
};

export const FONTS = {
  regular: { fontSize: 16, fontWeight: '400', letterSpacing: 0 },
  medium: { fontSize: 16, fontWeight: '500', letterSpacing: 0 },
  semibold: { fontSize: 16, fontWeight: '600', letterSpacing: -0.2 },
  bold: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  large: { fontSize: 36, fontWeight: '800', letterSpacing: -1 }, // Tighter tracking for large text
};

export const KURDISH_FONTS = {
  regular: { fontFamily: 'Rabar', fontSize: 16 },
  medium: { fontFamily: 'Rabar-Medium', fontSize: 16 },
  semibold: { fontFamily: 'Rabar-SemiBold', fontSize: 16 },
  bold: { fontFamily: 'Rabar-Bold', fontSize: 16 },
  title: { fontFamily: 'Rabar-Bold', fontSize: 30 },
  large: { fontFamily: 'Rabar-Bold', fontSize: 38 },
};

// Modern Glass Helper
export const GLASS = {
  default: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  heavy: {
    backgroundColor: 'rgba(20, 20, 23, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
  }
};

const createShadow = (offset, radius, opacity, elevation, color = '#000') => ({
  ...Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offset },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation: elevation,
      shadowColor: color,
    },
    web: {
      boxShadow: `0 ${offset}px ${radius}px rgba(0, 0, 0, ${opacity})`,
    },
  }),
});

export const SHADOWS = {
  small: createShadow(2, 4, 0.1, 2),
  medium: createShadow(4, 12, 0.12, 5),
  glow: createShadow(0, 20, 0.3, 10, PALETTE.viola.glowing), // Neon glow
};
