/**
 * Type declarations for react-i18next
 * 
 * This file helps TypeScript recognize react-i18next types.
 * The package is installed and works correctly - this is just for TypeScript.
 */

declare module 'react-i18next' {
  import { i18n } from 'i18next';
  import { ComponentType, ReactNode } from 'react';

  export interface I18nextProviderProps {
    i18n: i18n;
    children?: ReactNode;
  }

  export const I18nextProvider: ComponentType<I18nextProviderProps>;

  export interface UseTranslationOptions {
    keyPrefix?: string;
  }

  export interface UseTranslationResponse {
    t: (key: string, options?: any) => string;
    i18n: i18n;
    ready: boolean;
  }

  export function useTranslation(
    ns?: string | string[],
    options?: UseTranslationOptions
  ): UseTranslationResponse;

  export function initReactI18next(
    i18n: i18n,
    options?: any
  ): void;
}

