/**
 * SCH Campus AI — Design Tokens
 * Converted from prototype-web/design-system.js to typed constants
 */

export const Colors = {
  // ── Brand ──────────────────────────────────────────────
  blue:       '#26539C',  // SCH Main Blue
  blueDeep:   '#1A3F7A',
  blueSky:    '#1C9AD6',  // SCH Sky Blue
  blueLight:  '#72C6EF',  // SCH Light Blue
  purple:     '#4D207A',  // SCH Purple
  gold:       '#9D7E3F',
  silver:     '#A6A8AB',

  // ── Surface ────────────────────────────────────────────
  bg:         '#F4F5F8',
  bgWarm:     '#FAFAFC',
  card:       '#FFFFFF',
  cardSubtle: '#F0F2F7',
  overlay:    'rgba(13, 28, 55, 0.55)',

  // ── Ink ────────────────────────────────────────────────
  ink:        '#0F1A2E',
  ink2:       '#3A465C',
  ink3:       '#6B7587',
  ink4:       '#A2A9B8',
  line:       '#E4E7EE',
  lineSoft:   '#EEF0F4',

  // ── Semantic ───────────────────────────────────────────
  success:    '#1F8A5B',
  warn:       '#C7861E',
  danger:     '#C2384A',
} as const;

export type ColorKey = keyof typeof Colors;

/** Tag tone → color mapping */
export const TagTones = {
  neutral: { bg: Colors.cardSubtle,              fg: Colors.ink2 },
  blue:    { bg: 'rgba(38,83,156,0.08)',          fg: Colors.blue },
  sky:     { bg: 'rgba(28,154,214,0.10)',         fg: '#0E6FA8' },
  purple:  { bg: 'rgba(77,32,122,0.08)',          fg: Colors.purple },
  gold:    { bg: 'rgba(157,126,63,0.10)',         fg: Colors.gold },
  success: { bg: 'rgba(31,138,91,0.10)',          fg: Colors.success },
  warn:    { bg: 'rgba(199,134,30,0.12)',         fg: Colors.warn },
} as const;

export type TagTone = keyof typeof TagTones;
