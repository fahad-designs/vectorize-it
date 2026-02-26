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
  en: 'https://vectorize-it.vercel.app',
  es: 'https://vectorize-it.vercel.app/es',
  fr: 'https://vectorize-it.vercel.app/fr',
  de: 'https://vectorize-it.vercel.app/de',
  pt: 'https://vectorize-it.vercel.app/pt',
  ja: 'https://vectorize-it.vercel.app/ja',
  ko: 'https://vectorize-it.vercel.app/ko',
  zh: 'https://vectorize-it.vercel.app/zh',
  ar: 'https://vectorize-it.vercel.app/ar',
  hi: 'https://vectorize-it.vercel.app/hi'
}
