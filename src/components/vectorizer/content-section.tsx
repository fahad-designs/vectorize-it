'use client'

import { motion } from 'framer-motion'
import { BookOpen, Code, Layers, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

export function ContentSection(): React.ReactElement {
  const t = useTranslations('content')
  
  const sections = [
    {
      icon: BookOpen,
      title: t('section1Title'),
      paragraphs: [
        t('section1Para1'),
        t('section1Para2'),
      ],
      listTitle: t('section1ListTitle'),
      listItems: [
        t('section1Item1'),
        t('section1Item2'),
        t('section1Item3'),
        t('section1Item4'),
        t('section1Item5'),
      ]
    },
    {
      icon: Code,
      title: t('section2Title'),
      paragraphs: [
        t('section2Para1'),
      ],
      listTitle: t('section2ListTitle'),
      listItems: [
        t('section2Item1'),
        t('section2Item2'),
        t('section2Item3'),
        t('section2Item4'),
        t('section2Item5'),
      ],
      conclusion: t('section2Conclusion')
    },
    {
      icon: Layers,
      title: t('section3Title'),
      intro: t('section3Intro'),
    },
    {
      icon: Zap,
      title: t('section4Title'),
      intro: t('section4Intro'),
      tips: [
        { title: t('section4Tip1Title'), desc: t('section4Tip1Desc') },
        { title: t('section4Tip2Title'), desc: t('section4Tip2Desc') },
        { title: t('section4Tip3Title'), desc: t('section4Tip3Desc') },
        { title: t('section4Tip4Title'), desc: t('section4Tip4Desc') },
      ],
      conclusion: t('section4Conclusion')
    }
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

      <div className="grid gap-8 lg:grid-cols-2">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full border-2">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <section.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {section.title}
                </h3>
                
                {/* Section 1 & 2 style */}
                {'paragraphs' in section && section.paragraphs && (
                  <div className="space-y-4">
                    {section.paragraphs.map((p, i) => (
                      <p key={i} className="mb-4 text-slate-600 dark:text-slate-400">{p}</p>
                    ))}
                    {section.listTitle && (
                      <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-900 dark:text-slate-100">{section.listTitle}</h3>
                    )}
                    {section.listItems && (
                      <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
                        {section.listItems.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {'conclusion' in section && section.conclusion && (
                      <p className="mt-4 text-slate-600 dark:text-slate-400">{section.conclusion}</p>
                    )}
                  </div>
                )}
                
                {/* Section 3 style - comparison table */}
                {'intro' in section && section.intro && !('tips' in section) && (
                  <div className="space-y-4">
                    <p className="mb-4 text-slate-600 dark:text-slate-400">{section.intro}</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-slate-50 dark:bg-slate-900/50">
                            <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">{t('tableAspect')}</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">{t('tableVector')}</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">{t('tableRaster')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { aspect: t('tableScalability'), vector: t('tableScalabilityV'), raster: t('tableScalabilityR') },
                            { aspect: t('tableFileSize'), vector: t('tableFileSizeV'), raster: t('tableFileSizeR') },
                            { aspect: t('tableEditability'), vector: t('tableEditabilityV'), raster: t('tableEditabilityR') },
                            { aspect: t('tableBestFor'), vector: t('tableBestForV'), raster: t('tableBestForR') },
                            { aspect: t('tableWebPerf'), vector: t('tableWebPerfV'), raster: t('tableWebPerfR') },
                          ].map((row, i) => (
                            <tr key={i} className="border-b">
                              <td className="px-4 py-3 font-medium">{row.aspect}</td>
                              <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">{row.vector}</td>
                              <td className="px-4 py-3 text-amber-600 dark:text-amber-400">{row.raster}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-4"><strong>{t('section3ProTip')}</strong></p>
                  </div>
                )}
                
                {/* Section 4 style - tips */}
                {'tips' in section && section.tips && (
                  <div className="space-y-4">
                    <p className="mb-4 text-slate-600 dark:text-slate-400">{section.intro}</p>
                    {section.tips.map((tip, i) => (
                      <div key={i}>
                        <h3 className="text-lg font-semibold mt-4 mb-2 text-slate-900 dark:text-slate-100">{i + 1}. {tip.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400">{tip.desc}</p>
                      </div>
                    ))}
                    {'conclusion' in section && section.conclusion && (
                      <p className="mt-4 text-slate-600 dark:text-slate-400">{section.conclusion}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  )
}
