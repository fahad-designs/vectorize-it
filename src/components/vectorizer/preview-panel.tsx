'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Copy, ZoomIn, ZoomOut, Maximize2, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'

interface PreviewPanelProps {
  originalImage: string | null
  vectorizedSvg: string | null
  isProcessing: boolean
  onDownload: () => void
}

export function PreviewPanel({
  originalImage,
  vectorizedSvg,
  isProcessing,
  onDownload
}: PreviewPanelProps) {
  const [zoom, setZoom] = useState(100)
  const [viewMode, setViewMode] = useState<'original' | 'vector' | 'compare'>('compare')

  const handleCopySVG = async () => {
    if (vectorizedSvg) {
      try {
        await navigator.clipboard.writeText(vectorizedSvg)
        toast.success('SVG copied to clipboard!')
      } catch (error) {
        toast.error('Failed to copy SVG')
      }
    }
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const handleResetZoom = () => {
    setZoom(100)
  }

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <Maximize2 className="h-5 w-5" />
            Preview
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={vectorizedSvg ? 'default' : 'secondary'}>
              {vectorizedSvg ? 'Vectorized' : isProcessing ? 'Processing...' : 'Waiting'}
            </Badge>
            {vectorizedSvg && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCopySVG}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button size="sm" onClick={onDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b p-4">
            <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
              <TabsList>
                <TabsTrigger value="original">Original</TabsTrigger>
                <TabsTrigger value="vector">Vector</TabsTrigger>
                <TabsTrigger value="compare">Compare</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleZoomOut}
                disabled={!originalImage}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                {zoom}%
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleZoomIn}
                disabled={!originalImage}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleResetZoom}
                disabled={!originalImage}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview Area */}
          <ScrollArea className="flex-1">
            <div className="relative min-h-[400px] bg-slate-100 dark:bg-slate-900">
              <AnimatePresence mode="wait">
                {!originalImage ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-[400px] items-center justify-center text-slate-400 dark:text-slate-500"
                  >
                    <div className="text-center">
                      <Maximize2 className="mx-auto mb-2 h-12 w-12" />
                      <p>Upload an image to see the preview</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center p-8"
                  >
                    <div
                      className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800"
                      style={{
                        transform: `scale(${zoom / 100})`,
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      {viewMode === 'original' && (
                        <img
                          src={originalImage}
                          alt="Original"
                          className="max-w-full max-h-[500px] object-contain"
                        />
                      )}

                      {viewMode === 'vector' && vectorizedSvg && (
                        <div
                          className="max-w-full max-h-[500px]"
                          dangerouslySetInnerHTML={{ __html: vectorizedSvg }}
                        />
                      )}

                      {viewMode === 'compare' && (
                        <div className="flex gap-4">
                          <div>
                            <p className="mb-2 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                              Original
                            </p>
                            <img
                              src={originalImage}
                              alt="Original"
                              className="max-w-[250px] max-h-[500px] object-contain rounded-lg"
                            />
                          </div>
                          {vectorizedSvg ? (
                            <div>
                              <p className="mb-2 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                                Vector
                              </p>
                              <div
                                className="max-w-[250px] max-h-[500px] rounded-lg"
                                dangerouslySetInnerHTML={{ __html: vectorizedSvg }}
                              />
                            </div>
                          ) : (
                            <div className="w-[250px] flex items-center justify-center">
                              {isProcessing && (
                                <div className="text-center">
                                  <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-500 dark:border-slate-700" />
                                  <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Vectorizing...
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {!vectorizedSvg && isProcessing && viewMode !== 'compare' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
                          <div className="text-center">
                            <div className="mx-auto mb-3 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500 dark:border-slate-700" />
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Converting to vector...
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              This may take a few seconds
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Note about preview vs actual */}
                    {vectorizedSvg && (
                      <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                        Some converted images may not appear complete here but they are complete in actual - it is okay to download.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Zoom Slider */}
          <div className="border-t p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Zoom
              </span>
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={50}
                max={200}
                step={25}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
