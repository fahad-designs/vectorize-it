'use client'

import { motion } from 'framer-motion'
import { Zap, Palette, Download, Shield, Settings, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Convert images to SVG in under 10 seconds with our optimized vectorization engine.'
  },
  {
    icon: Palette,
    title: 'Full Color Support',
    description: 'Preserve all colors from your original image with intelligent color quantization.'
  },
  {
    icon: Download,
    title: 'One-Click Download',
    description: 'Download your vectorized SVG instantly or copy the code to clipboard.'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your images are processed securely and never stored on our servers.'
  },
  {
    icon: Settings,
    title: 'Advanced Controls',
    description: 'Fine-tune detail level, smoothing, and optimization for perfect results.'
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description: 'Use on any device - desktop, tablet, or mobile. No installation needed.'
  }
]

export function FeaturesSection() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Why Choose VectorPro AI?
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Professional-grade vectorization with features that rival paid tools
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-2 transition-all hover:border-emerald-300 dark:hover:border-emerald-700">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <feature.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
    </>
  )
}
