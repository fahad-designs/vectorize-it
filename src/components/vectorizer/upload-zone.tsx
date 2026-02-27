'use client'

import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  onClear: () => void
  isProcessing?: boolean
}

export function UploadZone({ onFileSelect, selectedFile, onClear, isProcessing }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const imageFile = files.find((file) =>
        file.type.startsWith('image/')
      )

      if (imageFile) {
        onFileSelect(imageFile)
      }
    },
    [onFileSelect]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && file.type.startsWith('image/')) {
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <Card className="border-2 border-dashed transition-all hover:border-emerald-300 dark:hover:border-emerald-700">
      <CardContent className="p-8">
        <AnimatePresence mode="wait">
          {!selectedFile ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative"
            >
              <div
                className={`flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                    : 'border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-emerald-600 dark:hover:bg-slate-900'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/gif"
                  onChange={handleFileInput}
                />
                <motion.div
                  animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Upload className="mb-4 h-16 w-16 text-slate-400 dark:text-slate-500" />
                </motion.div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Drop your image here
                </h3>
                <p className="mb-4 text-center text-slate-600 dark:text-slate-400">
                  or click to browse files
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Badge variant="secondary" className="font-normal">
                    PNG
                  </Badge>
                  <Badge variant="secondary" className="font-normal">
                    JPG
                  </Badge>
                  <Badge variant="secondary" className="font-normal">
                    WEBP
                  </Badge>
                  <Badge variant="secondary" className="font-normal">
                    BMP
                  </Badge>
                  <Badge variant="secondary" className="font-normal">
                    GIF
                  </Badge>
                </div>
                <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                  Maximum file size: 10MB
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="selected"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                {!isProcessing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClear}
                    className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Processing image...
                    </span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                <ImageIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Ready to vectorize • Click "Convert to SVG" to begin
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
