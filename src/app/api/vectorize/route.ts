// Vectorization API Route
// Simple, reliable pixel-based vectorization with good color handling
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

interface VectorizationSettings {
  quality: 'high' | 'medium' | 'low'
  colorMode: 'full-color' | 'grayscale' | 'black-white'
  colorSimplification: 'precise' | 'balanced' | 'simplified'
  detailLevel: number
  smoothing: number
  noiseReduction: boolean
  cornerDetection: number
  optimizationLevel: 'maximum' | 'high' | 'medium' | 'low'
}

interface ColorData {
  r: number
  g: number
  b: number
  count: number
}

// Group similar colors to reduce palette size
function groupSimilarColors(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  blockSize: number,
  simplification: 'precise' | 'balanced' | 'simplified'
): Map<string, ColorData> {
  const colorMap = new Map<string, ColorData>()

  const tolerance = {
    'precise': 3,
    'balanced': 8,
    'simplified': 15
  }[simplification]

  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      let r = 0, g = 0, b = 0, count = 0

      for (let by = 0; by < blockSize && y * blockSize + by < height; by++) {
        for (let bx = 0; bx < blockSize && x * blockSize + bx < width; bx++) {
          const idx = ((y * blockSize + by) * width + (x * blockSize + bx)) * 4
          if (idx + 3 < pixels.length) {
            r += pixels[idx]
            g += pixels[idx + 1]
            b += pixels[idx + 2]
            if (pixels[idx + 3] > 128) count++
          }
        }
      }

      if (count === 0) continue

      r = Math.floor(r / count)
      g = Math.floor(g / count)
      b = Math.floor(b / count)

      if (tolerance > 0) {
        r = Math.round(r / tolerance) * tolerance
        g = Math.round(g / tolerance) * tolerance
        b = Math.round(b / tolerance) * tolerance
      }

      r = Math.min(255, Math.max(0, r))
      g = Math.min(255, Math.max(0, g))
      b = Math.min(255, Math.max(0, b))

      const key = `${r},${g},${b}`
      const existing = colorMap.get(key)
      if (existing) {
        existing.count += count
      } else {
        colorMap.set(key, { r, g, b, count })
      }
    }
  }

  // Limit colors based on simplification mode
  if (simplification === 'simplified' && colorMap.size > 12) {
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
    return new Map(sortedColors.slice(0, 12))
  }

  if (simplification === 'balanced' && colorMap.size > 16) {
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
    return new Map(sortedColors.slice(0, 16))
  }

  return colorMap
}

// Find nearest color in palette
function findNearestColor(
  r: number, g: number, b: number,
  palette: ColorData[]
): ColorData {
  let minDist = Infinity
  let nearest = palette[0]

  for (const color of palette) {
    const dist = Math.sqrt(
      Math.pow(r - color.r, 2) +
      Math.pow(g - color.g, 2) +
      Math.pow(b - color.b, 2)
    )
    if (dist < minDist) {
      minDist = dist
      nearest = color
    }
  }

  return nearest
}

// Generate pixel-based SVG paths for color mode
function generateColorPaths(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  settings: VectorizationSettings
): string {
  // Map quality to block size for pixel sampling
  // High = smaller blocks (more detail), Low = larger blocks (faster)
  const qualityToBlockSize: Record<string, number> = {
    'high': 1,
    'medium': 2,
    'low': 4
  }
  const blockSize = qualityToBlockSize[settings.quality] || 1

  const colorPalette = groupSimilarColors(pixels, width, height, blockSize, settings.colorSimplification)
  const paletteArray = Array.from(colorPalette.values())

  // Create quantized color grid
  const colorGrid: string[] = new Array(width * height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      if (idx + 3 < pixels.length && pixels[idx + 3] > 128) {
        const r = pixels[idx]
        const g = pixels[idx + 1]
        const b = pixels[idx + 2]

        const color = findNearestColor(r, g, b, paletteArray)
        colorGrid[y * width + x] = `${color.r},${color.g},${color.b}`
      }
    }
  }

  // Generate rectangles for each color
  const processed = new Set<number>()
  let paths = ''

  for (const color of paletteArray) {
    const colorKey = `${color.r},${color.g},${color.b}`
    const colorHex = `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`

    // Find all rectangles of this color
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x

        if (processed.has(idx)) continue
        if (colorGrid[idx] !== colorKey) continue

        // Found a pixel of this color, find the rectangle extent
        let rectWidth = 1
        let rectHeight = 1

        // Check how many consecutive pixels of same color to the right
        while (x + rectWidth < width && colorGrid[y * width + (x + rectWidth)] === colorKey && !processed.has(y * width + (x + rectWidth))) {
          rectWidth++
        }

        // Check how many rows below have the same pattern
        let canExtend = true
        while (y + rectHeight < height && canExtend) {
          for (let dx = 0; dx < rectWidth; dx++) {
            const checkIdx = (y + rectHeight) * width + (x + dx)
            if (colorGrid[checkIdx] !== colorKey || processed.has(checkIdx)) {
              canExtend = false
              break
            }
          }
          if (canExtend) {
            rectHeight++
          }
        }

        // Add rectangle path
        paths += `<rect x="${x}" y="${y}" width="${rectWidth}" height="${rectHeight}" fill="${colorHex}"/>\n`

        // Mark all pixels in this rectangle as processed
        for (let ry = 0; ry < rectHeight; ry++) {
          for (let rx = 0; rx < rectWidth; rx++) {
            processed.add((y + ry) * width + (x + rx))
          }
        }
      }
    }
  }

  return paths
}

// Generate grayscale paths
function generateGrayscalePaths(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  settings: VectorizationSettings
): string {
  const levels = 16
  const colorGrid: number[] = new Array(width * height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      if (idx + 3 < pixels.length && pixels[idx + 3] > 128) {
        const brightness = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3
        const level = Math.floor((brightness / 255) * (levels - 1))
        colorGrid[y * width + x] = level
      }
    }
  }

  const processed = new Set<number>()
  let paths = ''

  for (let i = 0; i < levels; i++) {
    const grayValue = Math.floor((i / (levels - 1)) * 255)
    const hex = grayValue.toString(16).padStart(2, '0')
    const color = `#${hex}${hex}${hex}`

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x

        if (processed.has(idx)) continue
        if (colorGrid[idx] !== i) continue

        // Find rectangle extent
        let rectWidth = 1
        let rectHeight = 1

        while (x + rectWidth < width && colorGrid[y * width + (x + rectWidth)] === i && !processed.has(y * width + (x + rectWidth))) {
          rectWidth++
        }

        let canExtend = true
        while (y + rectHeight < height && canExtend) {
          for (let dx = 0; dx < rectWidth; dx++) {
            const checkIdx = (y + rectHeight) * width + (x + dx)
            if (colorGrid[checkIdx] !== i || processed.has(checkIdx)) {
              canExtend = false
              break
            }
          }
          if (canExtend) {
            rectHeight++
          }
        }

        paths += `<rect x="${x}" y="${y}" width="${rectWidth}" height="${rectHeight}" fill="${color}"/>\n`

        for (let ry = 0; ry < rectHeight; ry++) {
          for (let rx = 0; rx < rectWidth; rx++) {
            processed.add((y + ry) * width + (x + rx))
          }
        }
      }
    }
  }

  return paths
}

// Generate black and white paths
function generateBWPaths(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number,
  settings: VectorizationSettings
): string {
  const colorGrid: number[] = new Array(width * height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      if (idx + 3 < pixels.length && pixels[idx + 3] > 128) {
        const brightness = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3
        colorGrid[y * width + x] = brightness < threshold ? 1 : 0
      }
    }
  }

  const processed = new Set<number>()
  let paths = ''

  for (let color = 0; color <= 1; color++) {
    const fillColor = color === 1 ? '#000000' : '#ffffff'

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x

        if (processed.has(idx)) continue
        if (colorGrid[idx] !== color) continue

        // Find rectangle extent
        let rectWidth = 1
        let rectHeight = 1

        while (x + rectWidth < width && colorGrid[y * width + (x + rectWidth)] === color && !processed.has(y * width + (x + rectWidth))) {
          rectWidth++
        }

        let canExtend = true
        while (y + rectHeight < height && canExtend) {
          for (let dx = 0; dx < rectWidth; dx++) {
            const checkIdx = (y + rectHeight) * width + (x + dx)
            if (colorGrid[checkIdx] !== color || processed.has(checkIdx)) {
              canExtend = false
              break
            }
          }
          if (canExtend) {
            rectHeight++
          }
        }

        paths += `<rect x="${x}" y="${y}" width="${rectWidth}" height="${rectHeight}" fill="${fillColor}"/>\n`

        for (let ry = 0; ry < rectHeight; ry++) {
          for (let rx = 0; rx < rectWidth; rx++) {
            processed.add((y + ry) * width + (x + rx))
          }
        }
      }
    }
  }

  return paths
}

// Generate SVG from image
function generateSVGFromImage(
  buffer: Buffer,
  width: number,
  height: number,
  settings: VectorizationSettings
): string {
  const pixelData = new Uint8ClampedArray(buffer)

  let paths = ''

  if (settings.colorMode === 'black-white') {
    paths = generateBWPaths(pixelData, width, height, 128, settings)
  } else if (settings.colorMode === 'grayscale') {
    paths = generateGrayscalePaths(pixelData, width, height, settings)
  } else {
    paths = generateColorPaths(pixelData, width, height, settings)
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
${paths}
</svg>`

  return svg.trim()
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const settingsJson = formData.get('settings') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      )
    }

    let settings: VectorizationSettings = {
      quality: 'high',
      colorMode: 'full-color',
      colorSimplification: 'balanced',
      detailLevel: 90,
      smoothing: 75,
      noiseReduction: true,
      cornerDetection: 70,
      optimizationLevel: 'high'
    }

    if (settingsJson) {
      try {
        settings = { ...settings, ...JSON.parse(settingsJson) }
      } catch (e) {
        console.error('Failed to parse settings:', e)
      }
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let image = sharp(buffer)
    const metadata = await image.metadata()

    // Resize if too large
    const maxDimension = 1024
    if (metadata.width && metadata.width > maxDimension) {
      const ratio = maxDimension / metadata.width
      image = image.resize(maxDimension, Math.round((metadata.height || 0) * ratio))
    } else if (metadata.height && metadata.height > maxDimension) {
      const ratio = maxDimension / metadata.height
      image = image.resize(Math.round((metadata.width || 0) * ratio), maxDimension)
    }

    if (settings.noiseReduction) {
      image = image.blur(0.3)
    }

    if (settings.colorMode === 'grayscale') {
      image = image.grayscale()
    } else if (settings.colorMode === 'black-white') {
      image = image.threshold(128)
    }

    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const svg = generateSVGFromImage(data, info.width, info.height, settings)

    return NextResponse.json({
      success: true,
      svg: svg,
      width: info.width,
      height: info.height,
      originalWidth: metadata.width,
      originalHeight: metadata.height
    })
  } catch (error) {
    console.error('Vectorization error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}
