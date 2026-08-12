/**
 * @fileoverview Single source of truth for kiosk/client design values.
 *
 * Chakra theme keys map to these tokens. Prefer theme color keys in JSX
 * (`client.primary`, `brand.500`, …). Import hex from here only when a
 * non-Chakra API needs a raw color string.
 */

export const palette = {
  primary: '#25385D',
  brand: '#2B7B8C',
  green: '#8CAB6D',
  greenDark: '#7A9A5B',
  greenDeep: '#68894A',
  orange: '#F4A261',
  coral: '#E76F51',
  purple: '#B67A9B',
  success: '#48BB78',
  warning: '#ED8936',
  error: '#F56565',
  info: '#4299E1',
  pageBg: '#ffffff',
  border: '#E2E8F0',
  borderHover: '#CBD5E0',
} as const;

/** Standard kiosk CTA dimensions — used by Button variants in theme. */
export const controlSizes = {
  /** Touch-friendly control height on all breakpoints */
  height: { base: '48px', md: '48px' },
  /** Full-width on mobile, fixed min width on desktop */
  width: { base: '100%', md: '240px' },
  minWidth: { base: '100%', md: '240px' },
  fontSize: 'md',
  borderRadius: 'lg',
} as const;
