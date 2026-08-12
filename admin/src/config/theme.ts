/**
 * @fileoverview Chakra UI theme for the admin panel.
 *
 * Palette and control sizes live in designTokens.ts — keep this file as the
 * Chakra wiring layer only.
 */

import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { palette } from './designTokens';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    cofb: {
      blue: palette.brand,
      green: palette.green,
      purple: palette.purple,
      orange: palette.orange,
      coral: palette.coral,
    },
    brand: {
      50: '#E6F3F5',
      100: '#C2E1E6',
      200: '#9DCFD7',
      300: '#79BDC8',
      400: '#55ABB9',
      500: palette.brand,
      600: '#236270',
      700: '#1B4A54',
      800: '#123138',
      900: '#09191C',
    },
    accent: {
      green: {
        50: '#F2F6EF',
        100: '#E5ECDF',
        200: '#C5D7B8',
        300: palette.green,
        400: palette.greenDark,
        500: palette.greenDeep,
      },
      purple: {
        50: '#F9F2F6',
        100: '#F3E5EC',
        200: '#E1C2D3',
        300: palette.purple,
        400: '#A46889',
        500: '#925677',
      },
      orange: {
        50: '#FEF8F3',
        100: '#FDEEE3',
        200: '#F9D5BB',
        300: palette.orange,
        400: '#E28B4A',
        500: '#D07433',
      },
      coral: {
        50: '#FDF5F3',
        100: '#FAE8E4',
        200: '#F3C7BE',
        300: palette.coral,
        400: '#D45839',
        500: '#C14121',
      },
    },
    admin: {
      primary: palette.primary,
      primaryHover: palette.primaryHover,
      primaryActive: palette.primaryActive,
      success: palette.success,
      warning: palette.warning,
      error: palette.error,
      info: palette.info,
      bg: palette.pageBg,
      text: palette.text,
      shipped: palette.shipped,
      muted: palette.muted,
    },
  },

  fonts: {
    heading: 'Open Sans, system-ui, sans-serif',
    body: 'Open Sans, system-ui, sans-serif',
  },

  space: {
    pageX: { base: 3, md: 6 },
    section: { base: 4, md: 6 },
  },

  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
      sizes: {
        sm: {
          h: '32px',
          minH: '32px',
          fontSize: 'sm',
          px: 3,
        },
        md: {
          h: '40px',
          minH: '40px',
          fontSize: 'md',
          px: 4,
        },
        lg: {
          h: { base: '44px', md: '48px' },
          minH: '44px',
          fontSize: 'md',
          px: 5,
        },
      },
      variants: {
        primary: {
          bg: 'admin.primary',
          color: 'white',
          fontWeight: 600,
          borderRadius: 'lg',
          _hover: { bg: 'admin.primaryHover' },
          _active: { bg: 'admin.primaryActive' },
          _disabled: { bg: 'admin.primary', opacity: 0.4, cursor: 'not-allowed' },
        },
      },
    },
    Input: {
      defaultProps: {
        size: 'md',
      },
      sizes: {
        md: {
          field: {
            h: '40px',
            fontSize: 'md',
          },
        },
        lg: {
          field: {
            h: { base: '44px', md: '48px' },
            fontSize: 'md',
          },
        },
      },
      variants: {
        outline: {
          field: {
            borderRadius: 'md',
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            },
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        color: 'admin.primary',
        fontFamily: 'heading',
      },
    },
  },

  styles: {
    global: {
      'html, body': {
        color: 'admin.text',
        backgroundColor: 'admin.bg',
        minHeight: '100vh',
      },
      '::-webkit-scrollbar': { width: '8px', height: '8px' },
      '::-webkit-scrollbar-track': { background: 'transparent' },
      '::-webkit-scrollbar-thumb': {
        background: 'rgba(0,0,0,0.18)',
        borderRadius: '8px',
        '&:hover': { background: 'rgba(0,0,0,0.28)' },
      },
      '@media (prefers-reduced-motion: reduce)': {
        '*': {
          animationDuration: '0.01ms !important',
          animationIterationCount: '1 !important',
          transitionDuration: '0.01ms !important',
        },
      },
    },
  },
});

export default theme;
