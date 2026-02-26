'use client'

import { useState } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { localeNames, localeFlags, locales, type Locale } from '@/i18n'

interface LanguageSelectorProps {
  currentLocale?: Locale
  onLocaleChange?: (locale: Locale) => void
}

export function LanguageSelector({ currentLocale = 'en', onLocaleChange }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false)

  const handleLocaleChange = (locale: Locale) => {
    if (onLocaleChange) {
      onLocaleChange(locale)
    } else {
      // If no handler provided, reload with locale in URL
      const url = new URL(window.location.href)
      if (locale === 'en') {
        url.pathname = url.pathname.replace(/^\/[a-z]{2}\//, '/') || '/'
      } else {
        const currentPath = url.pathname.replace(/^\/[a-z]{2}\//, '/') || '/'
        url.pathname = `/${locale}${currentPath}`
      }
      window.location.replace(url.toString())
    }
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{localeFlags[currentLocale]} {localeNames[currentLocale]}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className="flex items-center justify-between gap-2 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
            </span>
            {currentLocale === locale && <Check className="h-4 w-4 text-emerald-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
