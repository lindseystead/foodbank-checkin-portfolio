/**
 * @fileoverview Chakra UI theme for the kiosk/client app.
 *
 * Palette and CTA sizes live in designTokens.ts — keep this file as the
 * Chakra wiring layer only.
 */

import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { controlSizes, palette } from './designTokens';

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
    client: {
      primary: palette.primary,
      success: palette.success,
      warning: palette.warning,
      error: palette.error,
      info: palette.info,
      bg: palette.pageBg,
      border: palette.border,
      borderHover: palette.borderHover,
    },
  },
  fonts: {
    heading: 'Open Sans, system-ui, sans-serif',
    body: 'Open Sans, system-ui, sans-serif',
  },
  components: {
    Container: {
      baseStyle: {
        maxW: 'container.xl',
        px: { base: 4, md: 8 },
        py: { base: 4, md: 6 },
      },
    },
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'md',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        minH: '44px',
        minW: '44px',
        _focus: {
          boxShadow: '0 0 0 3px rgba(43, 123, 140, 0.45)',
          outline: 'none',
        },
        _focusVisible: {
          boxShadow: '0 0 0 3px rgba(43, 123, 140, 0.45)',
          outline: 'none',
        },
      },
      variants: {
        solid: {
          bg: 'client.primary',
          color: 'white',
          _hover: {
            bg: 'client.primary',
            opacity: 0.9,
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
            _disabled: {
              bg: 'client.primary',
              opacity: 0.4,
              transform: 'none',
              boxShadow: 'none',
            },
          },
          _active: {
            bg: 'client.primary',
            opacity: 0.8,
            transform: 'translateY(0)',
          },
          _disabled: {
            bg: 'client.primary',
            opacity: 0.4,
            cursor: 'not-allowed',
          },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
            transform: 'translateY(-2px)',
            boxShadow: 'md',
          },
          _active: {
            bg: 'brand.100',
            transform: 'translateY(0)',
            boxShadow: 'sm',
          },
        },
        primary: {
          bg: 'client.primary',
          color: 'white',
          height: controlSizes.height,
          fontSize: controlSizes.fontSize,
          fontWeight: '500',
          borderRadius: controlSizes.borderRadius,
          width: controlSizes.width,
          minW: controlSizes.minWidth,
          px: { base: 4, md: 6 },
          _hover: {
            bg: 'client.primary',
            opacity: 0.9,
            transform: 'translateY(-2px)',
            boxShadow: 'md',
          },
          _active: {
            bg: 'client.primary',
            opacity: 0.8,
            transform: 'translateY(0)',
          },
          _disabled: {
            bg: 'client.primary',
            opacity: 0.6,
            cursor: 'not-allowed',
            _hover: {
              bg: 'client.primary',
              opacity: 0.6,
              transform: 'none',
              boxShadow: 'none',
            },
          },
        },
        language: {
          width: controlSizes.width,
          height: controlSizes.height,
          borderRadius: controlSizes.borderRadius,
          minW: controlSizes.minWidth,
          fontSize: controlSizes.fontSize,
          borderColor: 'gray.300',
          color: 'gray.700',
          bg: 'white',
          _hover: {
            bg: 'gray.50',
            borderColor: 'gray.400',
            transform: 'translateY(-2px)',
            boxShadow: 'md',
          },
          _focus: {
            boxShadow: '0 0 0 3px rgba(43, 123, 140, 0.45)',
            outline: 'none',
          },
          _active: {
            bg: 'gray.100',
            transform: 'translateY(0)',
            boxShadow: 'sm',
          },
        },
        assistance: {
          height: controlSizes.height,
          borderRadius: controlSizes.borderRadius,
          borderColor: 'client.border',
          color: 'client.primary',
          fontSize: controlSizes.fontSize,
          fontWeight: '500',
          width: controlSizes.width,
          minW: controlSizes.minWidth,
          px: { base: 4, md: 6 },
          bg: 'white',
          _hover: {
            bg: 'gray.50',
            borderColor: 'client.borderHover',
            transform: 'translateY(-2px)',
            boxShadow: 'md',
          },
          _focus: {
            boxShadow: '0 0 0 3px rgba(43, 123, 140, 0.45)',
            outline: 'none',
          },
          _active: {
            bg: 'gray.100',
            borderColor: 'client.borderHover',
            transform: 'translateY(0)',
            boxShadow: 'sm',
          },
        },
      },
      defaultProps: {
        variant: 'solid',
        size: 'md',
      },
      sizes: {
        sm: {
          h: '40px',
          minH: '40px',
          fontSize: 'sm',
          px: 3,
        },
        md: {
          h: '48px',
          minH: '48px',
          fontSize: 'md',
          px: 4,
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
            height: '48px',
            fontSize: 'md',
          },
        },
      },
      baseStyle: {
        field: {
          borderRadius: 'lg',
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
    },
    Select: {
      defaultProps: {
        size: 'md',
      },
      sizes: {
        md: {
          field: {
            height: '48px',
            fontSize: 'md',
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        color: 'client.primary',
        fontWeight: '600',
        fontFamily: 'heading',
        lineHeight: '110%',
        letterSpacing: '-1%',
      },
    },
    Text: {
      baseStyle: {
        color: 'gray.700',
        fontSize: 'lg',
        lineHeight: '1.8',
      },
    },
    Link: {
      baseStyle: {
        color: 'brand.500',
        _hover: {
          textDecoration: 'none',
          color: 'brand.600',
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'white',
          borderRadius: 'xl',
          boxShadow: 'md',
          p: { base: 2, sm: 3, md: 4 },
        },
      },
    },
  },
  styles: {
    global: {
      'html, body': {
        color: 'gray.800',
        bg: 'client.bg',
      },
      '.chakra-container': {
        maxWidth: '100% !important',
        paddingLeft: '1rem !important',
        paddingRight: '1rem !important',
        '@media (min-width: 48em)': {
          maxWidth: 'var(--chakra-sizes-container-xl) !important',
          paddingLeft: '2rem !important',
          paddingRight: '2rem !important',
        },
      },
      '.chakra-form__required-indicator': {
        lineHeight: 1,
      },
      '::-webkit-scrollbar': {
        width: '4px',
        height: '4px',
      },
      '::-webkit-scrollbar-track': {
        width: '6px',
        bg: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '24px',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '24px',
        '&:hover': {
          background: 'rgba(0, 0, 0, 0.3)',
        },
      },
      '*': {
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)',
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
  layerStyles: {
    card: {
      bg: 'white',
      borderRadius: 'xl',
      boxShadow: 'md',
      p: { base: 2, sm: 3, md: 4 },
    },
    selected: {
      bg: 'brand.50',
      borderColor: 'brand.500',
      color: 'brand.500',
    },
  },
  textStyles: {
    h1: {
      fontSize: ['2xl', '3xl', '4xl'],
      fontWeight: 'bold',
      lineHeight: '110%',
      letterSpacing: '-2%',
    },
    h2: {
      fontSize: ['xl', '2xl', '3xl'],
      fontWeight: 'semibold',
      lineHeight: '110%',
      letterSpacing: '-1%',
    },
    subtitle: {
      fontSize: ['md', 'lg', 'xl'],
      fontWeight: 'normal',
      lineHeight: '140%',
    },
  },
});

export default theme;
