import { Platform } from 'react-native';

export const Typography = {
  fontFamily: {
    sans: Platform.select({
      ios: 'System',       // SF Pro on iOS
      default: 'System',
    }),
    mono: Platform.select({
      ios: 'Courier New',
      default: 'monospace',
    }),
  },

  // Font sizes (iOS HIG scale)
  size: {
    xs:   10,
    sm:   12,
    base: 14,
    md:   16,
    lg:   18,
    xl:   20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
  },

  // Font weights
  weight: {
    regular:   '400' as const,
    medium:    '500' as const,
    semibold:  '600' as const,
    bold:      '700' as const,
    extrabold: '800' as const,
    black:     '900' as const,
  },

  // Line heights
  lineHeight: {
    tight:  1.15,
    normal: 1.45,
    relaxed: 1.6,
  },
} as const;
