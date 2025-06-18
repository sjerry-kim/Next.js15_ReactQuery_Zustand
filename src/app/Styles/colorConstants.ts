export const COLORS = {
  primary: {
    DEFAULT: '#6366F1',
    light: '#A5B4FC',
    dark: '#4F46E5',
  },
  secondary: {
    DEFAULT: '#E9DCC3',
    light: '#F4EBD6',
    dark: '#D4C79E',
  },
  background: {
    DEFAULT: '#FFFFFF',
    light: '#FFFFFF',
    dark: '#E5E7EB',
  },
  surface: {
    DEFAULT: '#FFFFFF',
    light: '#F3F4F6',
    dark: '#D1D5DB',
  },
  neutral: {
    100: '#FFFFFF',
    150: '#F5F5F5', // td-hover
    200: '#E0E0E0', // dashed-border
    250: '#D0D4DA', // common border
    300: '#C2C2C2',
    400: '#9E9E9E',
    500: '#7E7E7E',
    600: '#626262',
    700: '#4B4B4B',
    800: '#333333',
    900: '#1A1A1A',
  },
  info: {
    DEFAULT: '#2D9CDB',
    bg: '#E3F2FA',
    text: '#1F6F99',
    dark: '#238AC7', // hover용으로 dark 추가
  },
  danger: {
    DEFAULT: '#EB5757',
    bg: '#F9E3E3',
    text: '#9B3D3D',
    dark: '#D94C4C', // hover용으로 dark 추가
  },
  warn: {
    DEFAULT: '#F2994A',
    bg: '#FDE9D6',
    text: '#9B5E13',
    dark: '#E08A3B', // hover용으로 dark 추가
  },
  success: {
    DEFAULT: '#27AE60',
    bg: '#E3F7E8',
    text: '#1B6F3F',
    dark: '#219D54', // hover용으로 dark 추가
  },
} as const;
