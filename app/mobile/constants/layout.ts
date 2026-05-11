export const Layout = {
  // Spacing scale
  spacing: {
    xs:  4,
    sm:  8,
    md:  12,
    base: 16,
    lg:  20,
    xl:  24,
    '2xl': 32,
    '3xl': 40,
  },

  // Border radius
  radius: {
    sm:   8,
    md:   12,
    lg:   16,
    xl:   18,
    '2xl': 22,
    full: 9999,
  },

  // Tab bar
  tabBarHeight: 83,       // 49px bar + 34px home indicator area
  tabBarPaddingBottom: 34, // home indicator safe area

  // Common heights
  headerHeight: 56,
  inputHeight: 50,
  buttonHeight: 54,
  cardMinHeight: 60,
} as const;
