import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always use locale prefix for non-default locales only
  // Default locale (en) has no prefix, others have prefix
  localePrefix: 'as-needed',

  // Disable automatic locale detection from browser headers
  // This ensures English is always the default
  localeDetection: false
});

export const config = {
  // Match all pathnames except for static files, api, etc.
  matcher: ['/', '/(en|de|es|fr|pt|ja|ko|zh|ar|hi)/:path*']
};
