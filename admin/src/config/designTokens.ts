/**
 * @fileoverview Single source of truth for admin design values.
 *
 * Chakra theme keys map to these tokens. Chart libraries that need raw hex
 * should import from here — never hardcode palette values in components.
 */

export const palette = {
  primary: '#25385D',
  primaryHover: '#1e2d47',
  primaryActive: '#1a2538',
  brand: '#2B7B8C',
  /** RGB channels for rgba(…) overlays (matches brand). */
  brandRgb: '43, 123, 140',
  green: '#8CAB6D',
  greenDark: '#7A9A5B',
  greenDeep: '#68894A',
  orange: '#F4A261',
  coral: '#E76F51',
  coralRgb: '231, 111, 81',
  purple: '#B67A9B',
  shipped: '#805AD5',
  success: '#48BB78',
  warning: '#ED8936',
  amber: '#F59E0B',
  error: '#F56565',
  info: '#4299E1',
  text: '#1f2937',
  muted: '#718096',
  pageBg: '#f7f8fb',
  surface: '#ffffff',
} as const;

/** Raw hex for Recharts / canvas / SVG fills (same values as theme). */
export const chartColors = {
  primary: palette.primary,
  brand: palette.brand,
  completed: palette.green,
  pending: palette.brand,
  noShow: palette.coral,
  late: palette.orange,
  shipped: palette.shipped,
  cancelled: palette.muted,
  now: palette.coral,
  tooltipBrand: palette.brand,
  tooltipCoral: palette.coral,
  tooltipGreen: palette.greenDeep,
} as const;

/** Responsive layout / control sizes. */
export const sizes = {
  buttonSm: { h: '32px', minH: '32px', fontSize: 'sm', px: 3 },
  buttonMd: { h: { base: '40px', md: '40px' }, minH: '40px', fontSize: 'md', px: 4 },
  buttonLg: { h: { base: '44px', md: '48px' }, minH: '44px', fontSize: 'md', px: 5 },
  inputMd: { h: '40px', fontSize: 'md' },
  inputLg: { h: { base: '44px', md: '48px' }, fontSize: 'md' },
  sidebarWidth: '260px',
  contentMax: { base: '100%', lg: '1200px' },
  cardRadius: 'xl',
} as const;
