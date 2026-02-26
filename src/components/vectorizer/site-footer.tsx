'use client'

import { Github, Twitter, Mail, Heart } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-white dark:bg-slate-950">
      <div className="container px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              VectorPro AI
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Professional-quality image vectorization, completely free.
              Transform your images into scalable SVG vectors in seconds.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#features"
                  className="text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#comparison"
                  className="text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  Compare
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/blog"
                  className="text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/guides"
                  className="text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  Guides
                </a>
              </li>
              <li>
                <a
                  href="/tutorials"
                  className="text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  Tutorials
                </a>
              </li>
              <li>
                <a
                  href="/api"
                  className="text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  API (Coming Soon)
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">
              Connect
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@vectorpro.ai"
                className="text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} VectorPro AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            Made with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> for designers
          </div>
        </div>
      </div>
    </footer>
  )
}
