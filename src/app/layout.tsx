import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "VectorProAI - Free Image to SVG Converter | High-Quality Vectorization",
    template: "%s | VectorProAI"
  },
  description: "Transform any image into perfect SVG vectors with VectorProAI. Free online image to SVG converter with superior quality, supporting PNG, JPG, WEBP. Professional vectorization without watermarks or signup.",
  keywords: [
    "image to SVG converter",
    "PNG to SVG",
    "JPG to SVG",
    "raster to vector",
    "vectorize image online",
    "free SVG converter",
    "vector tracing",
    "scalable vector graphics",
    "SVG optimization",
    "bitmap to vector",
    "logo vectorization",
    "vector graphics editor",
    "path simplification",
    "edge detection",
    "SVG file compression",
    "vector art creation"
  ],
  authors: [{ name: "VectorProAI Team" }],
  creator: "VectorProAI",
  publisher: "VectorProAI",
  metadataBase: new URL('https://vectorpro.ai'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'es-ES': '/es',
      'fr-FR': '/fr',
      'de-DE': '/de',
      'pt-BR': '/pt',
      'ja-JP': '/ja',
      'ko-KR': '/ko',
      'zh-CN': '/zh',
      'ar-SA': '/ar',
      'hi-IN': '/hi',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vectorpro.ai",
    title: "VectorProAI - Free Image to SVG Converter",
    description: "Transform any image into perfect SVG vectors with our advanced converter. Free, unlimited, no watermarks.",
    siteName: "VectorProAI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VectorProAI - Image to SVG Converter"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "VectorProAI - Free Image to SVG Converter",
    description: "Transform any image into perfect SVG vectors. Free, unlimited, no watermarks.",
    images: ["/og-image.png"],
    creator: "@vectorproai"
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png"
  },
  manifest: "/site.webmanifest"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://vectorpro.ai" />
        <meta name="theme-color" content="#10b981" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "VectorProAI",
              "applicationCategory": "DesignApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Free online image to SVG converter with advanced vectorization. Transform PNG, JPG, WEBP images into scalable vector graphics.",
              "featureList": [
                "Image to SVG conversion",
                "Multiple quality presets",
                "Color mode options (full color, grayscale, black & white)",
                "Advanced vectorization controls",
                "SVG optimization",
                "No file size limits for processing",
                "No watermarks",
                "No signup required",
                "Multi-language support"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250",
                "bestRating": "5",
                "worstRating": "1"
              },
              "inLanguage": ["en", "es", "fr", "de", "pt", "ja", "ko", "zh", "ar", "hi"]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "VectorProAI - Free Image to SVG Converter",
              "description": "Transform any image into perfect SVG vectors with VectorProAI. Free online image to SVG converter with superior quality.",
              "url": "https://vectorpro.ai",
              "inLanguage": ["en", "es", "fr", "de", "pt", "ja", "ko", "zh", "ar", "hi"],
              "mainEntity": {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is image vectorization?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Image vectorization is the process of converting raster images (made of pixels) into vector graphics (made of mathematical paths). This allows the image to be scaled to any size without losing quality, making it perfect for logos, icons, and print materials."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What file formats can I convert?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "VectorProAI supports all common image formats including PNG, JPG/JPEG, WEBP, BMP, and GIF. Simply upload your image and we'll convert it to high-quality SVG format."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is VectorProAI really free?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! VectorProAI is completely free to use with no hidden fees, no signup required, and no watermarks on your downloads. We believe professional-quality vectorization should be accessible to everyone."
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased bg-white dark:bg-slate-950`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
