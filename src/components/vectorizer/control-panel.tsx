'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Sliders, Palette, Wand2, FileCode, ChevronDown, Settings2 } from 'lucide-react'

interface ControlPanelProps {
  settings: VectorizationSettings
  onSettingsChange: (settings: VectorizationSettings) => void
  disabled?: boolean
}

export interface VectorizationSettings {
  quality: 'ultra-high' | 'high' | 'medium' | 'low'
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
        {/* Quick Settings - Always Visible */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Wand2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Quality Preset
          </Label>
          <RadioGroup
            value={settings.quality}
            onValueChange={(value: any) => updateSetting('quality', value)}
            disabled={disabled}
          >
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2 rounded-lg border bg-white p-3 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700">
                <RadioGroupItem value="ultra-high" id="ultra-high" />
                <Label htmlFor="ultra-high" className="cursor-pointer text-sm font-medium">
                  Ultra
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border bg-white p-3 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="cursor-pointer text-sm font-medium">
                  High
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border bg-white p-3 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="cursor-pointer text-sm font-medium">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border bg-white p-3 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="cursor-pointer text-sm font-medium">
                  Low
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Color Mode - Always Visible */}
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

        {/* Color Simplification - Always Visible */}
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

        {/* Advanced Settings - Collapsible */}
        <Accordion type="single" collapsible defaultValue="advanced" className="w-full">
          <AccordionItem value="advanced" className="border-0">
            <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                Advanced Settings
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pt-2">
              {/* Detail Level */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Detail Level</Label>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {settings.detailLevel}%
                  </span>
                </div>
                <Slider
                  value={[settings.detailLevel]}
                  onValueChange={(value) => updateSetting('detailLevel', value[0])}
                  min={10}
                  max={100}
                  step={5}
                  disabled={disabled}
                  className="cursor-pointer"
                />
              </div>

              {/* Smoothing */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Smoothing</Label>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {settings.smoothing}%
                  </span>
                </div>
                <Slider
                  value={[settings.smoothing]}
                  onValueChange={(value) => updateSetting('smoothing', value[0])}
                  min={0}
                  max={100}
                  step={5}
                  disabled={disabled}
                  className="cursor-pointer"
                />
              </div>

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

              <Separator className="my-4" />

              {/* Optimization Level */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-semibold">
                  <FileCode className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  SVG Optimization
                </Label>
                <Select
                  value={settings.optimizationLevel}
                  onValueChange={(value: any) => updateSetting('optimizationLevel', value)}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maximum">Maximum (Smallest Size)</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low (Best Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
