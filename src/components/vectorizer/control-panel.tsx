'use client'

import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Palette, Wand2, Settings2 } from 'lucide-react'

interface ControlPanelProps {
  settings: VectorizationSettings
  onSettingsChange: (settings: VectorizationSettings) => void
  disabled?: boolean
}

export interface VectorizationSettings {
  quality: 'high' | 'medium' | 'low'
  colorMode: 'full-color' | 'grayscale' | 'black-white'
  colorSimplification: 'precise' | 'balanced' | 'simplified'
  detailLevel: number
  smoothing: number
  noiseReduction: boolean
  cornerDetection: number
  optimizationLevel: 'maximum' | 'high' | 'medium' | 'low'
}

export function ControlPanel({ settings, onSettingsChange, disabled }: ControlPanelProps) {
  const updateSetting = <K extends keyof VectorizationSettings>(
    key: K,
    value: VectorizationSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <Card className="h-full">
      <CardHeader className="border-b bg-slate-50 dark:bg-slate-900/30">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings2 className="h-5 w-5" />
          Settings
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Quality Preset */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Wand2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Quality Preset
          </Label>
          <Select
            value={settings.quality}
            onValueChange={(value: any) => updateSetting('quality', value)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High Quality (Recommended)</SelectItem>
              <SelectItem value="medium">Medium Quality (Faster)</SelectItem>
              <SelectItem value="low">Low Quality (Fastest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Color Mode */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Palette className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Color Mode
          </Label>
          <Select
            value={settings.colorMode}
            onValueChange={(value: any) => updateSetting('colorMode', value)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-color">Full Color</SelectItem>
              <SelectItem value="grayscale">Grayscale</SelectItem>
              <SelectItem value="black-white">Black & White</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Color Simplification */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Palette className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Color Simplification
          </Label>
          <Select
            value={settings.colorSimplification}
            onValueChange={(value: any) => updateSetting('colorSimplification', value)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="precise">Precise (More Colors)</SelectItem>
              <SelectItem value="balanced">Balanced (Recommended)</SelectItem>
              <SelectItem value="simplified">Simplified (Fewer Colors)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Groups similar colors for easier editing
          </p>
        </div>

        <Separator />

        {/* Noise Reduction */}
        <div className="flex items-center justify-between rounded-lg border bg-white p-3 dark:bg-slate-800">
          <div className="space-y-1">
            <Label className="text-sm">Noise Reduction</Label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Remove small artifacts
            </p>
          </div>
          <Switch
            checked={settings.noiseReduction}
            onCheckedChange={(value) => updateSetting('noiseReduction', value)}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  )
}
