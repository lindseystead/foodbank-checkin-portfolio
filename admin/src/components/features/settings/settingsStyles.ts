/**
 * Shared Settings surface + callout styles.
 * Uses Chakra theme keys wired to designTokens (brand / accent / admin).
 */

export const surfaceCardProps = {
  bg: 'white',
  border: '1px solid',
  borderColor: 'gray.200',
  borderRadius: 'lg',
  boxShadow: 'sm',
} as const;

/** Icon chip behind section headers */
export const iconChipProps = {
  p: 2,
  bg: 'brand.50',
  borderRadius: 'lg',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
} as const;

export const calloutBrand = {
  bg: 'brand.50',
  border: '1px solid',
  borderColor: 'brand.200',
  borderRadius: 'md',
} as const;

export const calloutSuccess = {
  bg: 'accent.green.50',
  border: '1px solid',
  borderColor: 'accent.green.200',
  borderRadius: 'md',
} as const;

export const calloutWarning = {
  bg: 'accent.orange.50',
  border: '1px solid',
  borderColor: 'accent.orange.200',
  borderRadius: 'md',
} as const;

export const calloutNeutral = {
  bg: 'gray.50',
  border: '1px solid',
  borderColor: 'gray.200',
  borderRadius: 'md',
} as const;
