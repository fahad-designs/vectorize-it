'use client'

import { motion } from 'framer-motion'
import { BookOpen, Code, Layers, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const contentSections = [
  {
    icon: BookOpen,
    title: 'Understanding Image Vectorization',
    content: `
      <p class="mb-4">
        Image vectorization transforms <strong>raster images</strong> (composed of pixels) into <strong>vector graphics</strong> (built using mathematical paths and curves). While raster images lose quality when scaled, vector graphics maintain perfect clarity at any size.
      </p>
      <p class="mb-4">
        This conversion process, also known as <strong>raster to vector conversion</strong> or <strong>vector tracing</strong>, analyzes the pixel data of your image and creates smooth, scalable paths that define shapes, colors, and gradients. The result is a fully editable <strong>SVG (Scalable Vector Graphics)</strong> file.
      </p>
      <h3 class="text-xl font-semibold mt-6 mb-3 text-slate-900 dark:text-slate-100">Why Vectorize Your Images?</h3>
      <ul class="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
        <li><strong>Infinite Scalability:</strong> Resize to any dimension without quality loss</li>
        <li><strong>Smaller File Sizes:</strong> Optimized SVGs are often smaller than raster equivalents</li>
        <li><strong>Full Editability:</strong> Modify colors, shapes, and paths in vector software</li>
        <li><strong>Print Ready:</strong> Perfect for business cards, banners, and large format prints</li>
        <li><strong>Web Optimized:</strong> Crisp on all displays including high-DPI/Retina screens</li>
      </ul>
    `
  },
  {
    icon: Code,
    title: 'How Our Vectorization Engine Works',
    content: `
      <p class="mb-4">
        VectorPro AI uses a <strong>hybrid vectorization approach</strong> combining advanced algorithms with intelligent preprocessing to deliver superior results. Here's what happens when you upload an image:
      </p>
      <ol class="list-decimal list-inside space-y-3 text-slate-600 dark:text-slate-400 mb-4">
        <li><strong>Image Preprocessing:</strong> We enhance contrast, reduce noise, and optimize the image for vectorization using Sharp's advanced image processing capabilities.</li>
        <li><strong>Edge Detection:</strong> Our algorithm identifies edges and boundaries with sub-pixel precision, capturing fine details that other converters miss.</li>
        <li><strong>Color Quantization:</strong> Smart color reduction maintains visual fidelity while optimizing the SVG for smaller file sizes. Choose from 4 to 32 color levels based on your needs.</li>
        <li><strong>Path Generation:</strong> Mathematical curves (Bézier paths) are created following the detected edges, with adjustable smoothing for natural-looking results.</li>
        <li><strong>SVG Optimization:</strong> The final SVG is optimized using multiple techniques including attribute reduction, path merging, and whitespace removal.</li>
      </ol>
      <p>
        This multi-stage process ensures that even complex photographs and detailed illustrations convert to clean, editable vectors with <strong>minimal manual cleanup</strong>.
      </p>
    `
  },
  {
    icon: Layers,
    title: 'Vector vs Raster: When to Use Each',
    content: `
      <p class="mb-4">
        Understanding when to use vector graphics versus raster images is crucial for designers and developers. Here's a comprehensive comparison:
      </p>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-slate-50 dark:bg-slate-900/50">
              <th class="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">Aspect</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">Vector Graphics (SVG)</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">Raster Images (PNG, JPG)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b">
              <td class="px-4 py-3 font-medium">Scalability</td>
              <td class="px-4 py-3 text-emerald-600 dark:text-emerald-400">Unlimited, no quality loss</td>
              <td class="px-4 py-3 text-amber-600 dark:text-amber-400">Limited, pixelates when enlarged</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-3 font-medium">File Size</td>
              <td class="px-4 py-3 text-emerald-600 dark:text-emerald-400">Small for simple graphics</td>
              <td class="px-4 py-3 text-amber-600 dark:text-amber-400">Large for high resolution</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-3 font-medium">Editability</td>
              <td class="px-4 py-3 text-emerald-600 dark:text-emerald-400">Fully editable paths and shapes</td>
              <td class="px-4 py-3 text-amber-600 dark:text-amber-400">Limited editing capabilities</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-3 font-medium">Best For</td>
              <td class="px-4 py-3">Logos, icons, illustrations, typography</td>
              <td class="px-4 py-3">Photographs, complex gradients</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-medium">Web Performance</td>
              <td class="px-4 py-3 text-emerald-600 dark:text-emerald-400">Excellent, scales perfectly</td>
              <td class="px-4 py-3 text-amber-600 dark:text-amber-400">Requires multiple sizes</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-4">
        <strong>Pro Tip:</strong> Use VectorPro AI to convert logos and icons to vectors for your website. This ensures they look crisp on all devices while keeping file sizes small for faster loading.
      </p>
    `
  },
  {
    icon: Zap,
    title: 'SVG Optimization Best Practices',
    content: `
      <p class="mb-4">
        After converting images to SVG, proper optimization ensures the best balance between quality and performance. Our vectorizer includes built-in optimization, but understanding these techniques helps you get the most out of your SVG files:
      </p>
      <h3 class="text-lg font-semibold mt-4 mb-2 text-slate-900 dark:text-slate-100">1. Path Simplification</h3>
      <p class="mb-3 text-slate-600 dark:text-slate-400">
        Reduce the number of anchor points in paths while maintaining visual accuracy. Our smoothing control (0-100%) automatically applies this during conversion.
      </p>
      <h3 class="text-lg font-semibold mt-4 mb-2 text-slate-900 dark:text-slate-100">2. Color Reduction</h3>
      <p class="mb-3 text-slate-600 dark:text-slate-400">
        Fewer colors mean smaller files. Use our quality presets to automatically determine the optimal color count for your image.
      </p>
      <h3 class="text-lg font-semibold mt-4 mb-2 text-slate-900 dark:text-slate-100">3. Remove Redundant Elements</h3>
      <p class="mb-3 text-slate-600 dark:text-slate-400">
        Our optimization level removes duplicate definitions, unused groups, and unnecessary attributes from the SVG code.
      </p>
      <h3 class="text-lg font-semibold mt-4 mb-2 text-slate-900 dark:text-slate-100">4. Use Efficient Attributes</h3>
      <p class="mb-3 text-slate-600 dark:text-slate-400">
        We transform redundant coordinates into efficient transforms and use shorthand notation where possible.
      </p>
      <p class="mt-4">
        With VectorPro AI's optimization levels (Maximum, High, Medium, Low), you can choose the right balance between file size and visual quality for your specific use case.
      </p>
    `
  }
]

export function ContentSection() {
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
          Master Image Vectorization
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Comprehensive guides to help you understand and get the most out of vector graphics
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
          {contentSections.map((section, index) => (
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
                  <div
                    className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
    </>
  )
}
