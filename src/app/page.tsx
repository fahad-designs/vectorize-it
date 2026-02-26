'use client'
// Main application page with vectorization UI

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, RefreshCw, Download as DownloadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NavigationHeader } from '@/components/vectorizer/navigation-header'
import { HeroSection } from '@/components/vectorizer/hero-section'
import { UploadZone } from '@/components/vectorizer/upload-zone'
import { PreviewPanel } from '@/components/vectorizer/preview-panel'
import { ControlPanel, VectorizationSettings } from '@/components/vectorizer/control-panel'
import { FeaturesSection } from '@/components/vectorizer/features-section'
import { ComparisonTable } from '@/components/vectorizer/comparison-table'
import { FAQSection } from '@/components/vectorizer/faq-section'
import { ContentSection } from '@/components/vectorizer/content-section'
import { SiteFooter } from '@/components/vectorizer/site-footer'
import { toast } from 'sonner'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [vectorizedSvg, setVectorizedSvg] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [settings, setSettings] = useState<VectorizationSettings>({
    quality: 'high',
    colorMode: 'full-color',
    colorSimplification: 'balanced',
    detailLevel: 75,
    smoothing: 50,
    noiseReduction: true,
    cornerDetection: 70,
    optimizationLevel: 'high'
  })

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    setVectorizedSvg(null)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleClear = useCallback(() => {
    setSelectedFile(null)
    setOriginalImage(null)
    setVectorizedSvg(null)
  }, [])

  const handleVectorize = useCallback(async () => {
    if (!selectedFile || !originalImage) {
      toast.error('Please select an image first')
      return
    }

    setIsProcessing(true)
    setVectorizedSvg(null)

    try {
      // Create form data
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('settings', JSON.stringify(settings))

      // Call the vectorization API
      const response = await fetch('/api/vectorize?XTransformPort=3000', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Vectorization failed')
      }

      const data = await response.json()

      if (data.success && data.svg) {
        setVectorizedSvg(data.svg)
        toast.success('Image vectorized successfully!')
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (error) {
      console.error('Vectorization error:', error)
      toast.error('Failed to vectorize image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }, [selectedFile, originalImage, settings])

  const handleDownload = useCallback(() => {
    if (!vectorizedSvg || !selectedFile) return

    const blob = new Blob([vectorizedSvg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedFile.name.replace(/\.[^/.]+$/, '')}_vectorized.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('SVG downloaded successfully!')
  }, [vectorizedSvg, selectedFile])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      {/* Navigation Header */}
      <NavigationHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Vectorizer Tool */}
      <section id="upload-section" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Convert Your Images to SVG
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Upload any image and watch it transform into a beautiful, scalable vector graphic
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Upload + Controls */}
            <div className="space-y-6 lg:col-span-4">
              <UploadZone
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onClear={handleClear}
                isProcessing={isProcessing}
              />

              <ControlPanel
                settings={settings}
                onSettingsChange={setSettings}
                disabled={isProcessing || !selectedFile}
              />

              <Button
                onClick={handleVectorize}
                disabled={!selectedFile || isProcessing}
                size="lg"
                className="w-full shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 hover:shadow-emerald-500/40"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Convert to SVG
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Right Column: Preview */}
            <div className="lg:col-span-8">
              <PreviewPanel
                originalImage={originalImage}
                vectorizedSvg={vectorizedSvg}
                isProcessing={isProcessing}
                onDownload={handleDownload}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-50 py-16 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Three simple steps to perfect vector graphics
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Upload Your Image',
                description: 'Drag and drop or click to upload your PNG, JPG, or other image format. Supports files up to 10MB.'
              },
              {
                step: '02',
                title: 'Adjust Settings',
                description: 'Choose quality preset, color mode, and fine-tune detail level, smoothing, and optimization.'
              },
              {
                step: '03',
                title: 'Download SVG',
                description: 'Click convert and get your perfectly vectorized SVG in seconds. Edit in any vector software.'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-slate-200 dark:text-slate-800">
                  {item.step}
                </div>
                <div className="relative -mt-8 space-y-3">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FeaturesSection />
        </div>
      </section>

      {/* Content Section - SEO Optimized */}
      <section id="content" className="bg-slate-50 py-16 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ContentSection />
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ComparisonTable />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-slate-50 py-16 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FAQSection />
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
