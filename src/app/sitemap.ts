import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vectorpro.ai'
  const locales = ['en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh', 'ar', 'hi']

  const urls: MetadataRoute.Sitemap = []

  // Add locale-specific URLs for the homepage
  locales.forEach(locale => {
    urls.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: locale === 'en' ? 'daily' : 'weekly',
      priority: locale === 'en' ? 1 : 0.8,
    })
  })

  return urls
}
