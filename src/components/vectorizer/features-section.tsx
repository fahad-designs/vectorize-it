'use client'

import { motion } from 'framer-motion'
import { Zap, Palette, Download, Shield, Settings, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

const featureIcons = [Zap, Palette, Download, Shield, Settings, Globe]

export function FeaturesSection() {
  const t = useTranslations('features')
  
  const features = [
    { icon: Zap, title: t('feature1Title'), description: t('feature1Desc') },
    { icon: Palette, title: t('feature2Title'), description: t('feature2Desc') },
    { icon: Download, title: t('feature3Title'), description: t('feature3Desc') },
    { icon: Shield, title: t('feature4Title'), description: t('feature4Desc') },
    { icon: Settings, title: t('feature5Title'), description: t('feature5Desc') },
    { icon: Globe, title: t('feature6Title'), description: t('feature6Desc') }
  ]

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
          {t('title')}
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          {t('subtitle')}
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
