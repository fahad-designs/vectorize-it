export const locales = ['en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh', 'ar', 'hi'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
  ar: 'العربية',
  hi: 'हिन्दी'
}

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  pt: '🇧🇷',
  ja: '🇯🇵',
  ko: '🇰🇷',
  zh: '🇨🇳',
  ar: '🇸🇦',
  hi: '🇮🇳'
}

export const localeURLs: Record<Locale, string> = {
  en: 'https://vectorpro.ai',
  es: 'https://vectorpro.ai/es',
  fr: 'https://vectorpro.ai/fr',
  de: 'https://vectorpro.ai/de',
  pt: 'https://vectorpro.ai/pt',
  ja: 'https://vectorpro.ai/ja',
  ko: 'https://vectorpro.ai/ko',
  zh: 'https://vectorpro.ai/zh',
  ar: 'https://vectorpro.ai/ar',
  hi: 'https://vectorpro.ai/hi'
}
