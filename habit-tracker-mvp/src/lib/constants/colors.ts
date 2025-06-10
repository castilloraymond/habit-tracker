// Color constants for UI consistency

// Primary brand colors
export const COLORS = {
  // Primary palette
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Secondary palette
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Success colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Warning colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Error colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
} as const

// Habit category colors
export const HABIT_COLORS = {
  health: '#22c55e',      // Green
  fitness: '#f59e0b',     // Orange
  productivity: '#3b82f6', // Blue
  learning: '#8b5cf6',    // Purple
  social: '#ec4899',      // Pink
  mindfulness: '#06b6d4', // Cyan
  creativity: '#f97316',  // Orange-red
  other: '#6b7280',       // Gray
} as const

// Default habit colors for selection
export const DEFAULT_HABIT_COLORS = [
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#f59e0b', // Orange
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange-red
  '#84cc16', // Lime
  '#6366f1', // Indigo
  '#f43f5e', // Rose
  '#14b8a6', // Teal
] as const

// Status colors
export const STATUS_COLORS = {
  completed: COLORS.success[500],
  pending: COLORS.warning[500],
  missed: COLORS.error[500],
  inactive: COLORS.neutral[400],
} as const

// Background colors
export const BACKGROUND_COLORS = {
  primary: '#ffffff',
  secondary: '#f8fafc',
  tertiary: '#f1f5f9',
  dark: '#0f172a',
  darkSecondary: '#1e293b',
} as const

// Text colors
export const TEXT_COLORS = {
  primary: '#0f172a',
  secondary: '#475569',
  tertiary: '#64748b',
  inverse: '#ffffff',
  muted: '#94a3b8',
} as const

// Border colors
export const BORDER_COLORS = {
  light: '#e2e8f0',
  medium: '#cbd5e1',
  dark: '#94a3b8',
} as const

// Utility functions for color manipulation
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1]!, 16),
    g: parseInt(result[2]!, 16),
    b: parseInt(result[3]!, 16)
  } : null
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return TEXT_COLORS.primary
  
  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  
  // Return white for dark colors, dark for light colors
  return luminance > 0.5 ? TEXT_COLORS.primary : TEXT_COLORS.inverse
}

export function addOpacity(hexColor: string, opacity: number): string {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return hexColor
  
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
}

// Color scheme for different themes
export const COLOR_SCHEMES = {
  light: {
    background: BACKGROUND_COLORS.primary,
    surface: BACKGROUND_COLORS.secondary,
    text: TEXT_COLORS.primary,
    textSecondary: TEXT_COLORS.secondary,
    border: BORDER_COLORS.light,
  },
  dark: {
    background: BACKGROUND_COLORS.dark,
    surface: BACKGROUND_COLORS.darkSecondary,
    text: TEXT_COLORS.inverse,
    textSecondary: COLORS.neutral[300],
    border: COLORS.neutral[700],
  },
} as const

export type ColorScheme = keyof typeof COLOR_SCHEMES
export type HabitColor = keyof typeof HABIT_COLORS 