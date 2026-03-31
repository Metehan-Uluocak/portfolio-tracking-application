import { DarkTheme, Theme } from '@react-navigation/native';

export const colors = {
  background: '#0B1220',
  surface: '#111C33',
  card: '#1A2745',
  textPrimary: '#F1F5F9',
  textSecondary: '#AFC0DE',
  positive: '#22C55E',
  negative: '#EF4444',
  accent: '#38BDF8',
  border: '#2B3D63',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  body: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  caption: {
    fontSize: 13,
    color: colors.textSecondary,
  },
};

export const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.negative,
  },
};
