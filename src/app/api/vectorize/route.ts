// Vectorization API Route
// Simplified and stable vectorization with good color handling and smooth shapes
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

interface VectorizationSettings {
  quality: 'ultra-high' | 'high' | 'medium' | 'low'
  colorMode: 'full-color' | 'grayscale' | 'black-white'
  colorSimplification: 'precise' | 'balanced' | 'simplified'
  detailLevel: number
  smoothing: number
  noiseReduction: boolean
  cornerDetection: number
  optimizationLevel: 'maximum' | 'high' | 'medium' | 'low'
}

interface Point {
  x: number
  y: number
}

interface ColorData {
  r: number
  g: number
  b: number
}

// Group similar colors to reduce palette size
function groupSimilarColors(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  blockSize: number,
  simplification: 'precise' | 'balanced' | 'simplified'
): Map<string, { r: number, g: number, b: number, count: number }> {
  const colorMap = new Map<string, { r: number, g: number, b: number, count: number }>()

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
        existing.count++
      } else {
        colorMap.set(key, { r, g, b, count: 1 })
      }
    }
  }

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

// Simple boundary tracing using Moore-Neighbor algorithm
function traceBoundary(
  grid: Set<string>,
  width: number,
  height: number,
  startX: number,
  startY: number
): Point[] {
  const boundary: Point[] = []
  const visited = new Set<string>()

  let x = startX
  let y = startY
  let dir = 0 // Start looking right

  // 8-direction movements
  const directions = [
    { dx: 1, dy: 0 },   // right
    { dx: 1, dy: 1 },   // down-right
    { dx: 0, dy: 1 },   // down
    { dx: -1, dy: 1 },  // down-left
    { dx: -1, dy: 0 },  // left
    { dx: -1, dy: -1 }, // up-left
    { dx: 0, dy: -1 },  // up
    { dx: 1, dy: -1 }   // up-right
  ]

  const startXPos = x
  const startYPos = y
  const maxIterations = Math.min(width * height, 100000)
  let iterations = 0

  while (iterations < maxIterations) {
    const key = `${x},${y}`
    if (visited.has(key) && x === startXPos && y === startYPos && boundary.length > 3) {
      break
    }
    visited.add(key)
    boundary.push({ x, y })

    // Find next boundary pixel
    let found = false
    for (let i = 0; i < 8; i++) {
      const d = directions[(dir + i) % 8]
      const nx = x + d.dx
      const ny = y + d.dy

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nkey = `${nx},${ny}`
        if (grid.has(nkey)) {
          // Check if this pixel is on the boundary (has at least one non-region neighbor)
          let isBoundary = false
          for (const nd of directions) {
            const nnx = nx + nd.dx
            const nny = ny + nd.dy
            if (nnx < 0 || nnx >= width || nny < 0 || nny >= height ||
                !grid.has(`${nnx},${nny}`)) {
              isBoundary = true
              break
            }
          }

          if (isBoundary) {
            x = nx
            y = ny
            dir = (dir + i + 6) % 8 // Turn left
            found = true
            break
          }
        }
      }
    }

    if (!found) break
    iterations++
  }

  return boundary
}

// Find connected regions using BFS
function findConnectedRegions(
  grid: Set<string>,
  width: number,
  height: number
): Set<string>[] {
  const regions: Set<string>[] = []
  const visited = new Set<string>()

  const directions = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 }
  ]

  for (const key of grid) {
    if (visited.has(key)) continue

    const [startX, startY] = key.split(',').map(Number)
    const region = new Set<string>()
    const queue: { x: number, y: number }[] = [{ x: startX, y: startY }]

    while (queue.length > 0) {
      const { x, y } = queue.shift()!
      const pkey = `${x},${y}`

      if (visited.has(pkey)) continue
      if (!grid.has(pkey)) continue

      visited.add(pkey)
      region.add(pkey)

      for (const dir of directions) {
        const nx = x + dir.dx
        const ny = y + dir.dy
        const nkey = `${nx},${ny}`

        if (nx >= 0 && nx < width && ny >= 0 && ny < height &&
            grid.has(nkey) && !visited.has(nkey)) {
          queue.push({ x: nx, y: ny })
        }
      }
    }

    if (region.size > 0) {
      regions.push(region)
    }
  }

  return regions
}

// Simplify path using Ramer-Douglas-Peucker algorithm (iterative, non-recursive)
function simplifyPath(points: Point[], epsilon: number): Point[] {
  if (points.length <= 2) return points

  const keep = new Set<number>()
  const stack = [{ start: 0, end: points.length - 1 }]

  keep.add(0)
  keep.add(points.length - 1)

  while (stack.length > 0) {
    const { start, end } = stack.pop()!

    if (end - start <= 1) continue

    let maxDist = 0
    let maxIdx = start

    for (let i = start + 1; i < end; i++) {
      const dist = perpendicularDistance(points[i], points[start], points[end])
      if (dist > maxDist) {
        maxDist = dist
        maxIdx = i
      }
    }

    if (maxDist > epsilon) {
      keep.add(maxIdx)
      stack.push({ start, end: maxIdx })
      stack.push({ start: maxIdx, end })
    }
  }

  const indices = Array.from(keep).sort((a, b) => a - b)
  return indices.map(i => points[i])
}

// Calculate perpendicular distance
function perpendicularDistance(
  point: Point,
  lineStart: Point,
  lineEnd: Point
): number {
  const dx = lineEnd.x - lineStart.x
  const dy = lineEnd.y - lineStart.y
  const mag = Math.sqrt(dx * dx + dy * dy)

  if (mag < 0.00001) {
    return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) +
      Math.pow(point.y - lineStart.y, 2)
    )
  }

  const pvx = point.x - lineStart.x
  const pvy = point.y - lineStart.y
  const pvdot = (dx * pvx + dy * pvy) / (mag * mag)

  const ax = pvx - pvdot * dx
  const ay = pvy - pvdot * dy

  return Math.sqrt(ax * ax + ay * ay)
}

// Smooth path using simple averaging
function smoothPath(points: Point[], iterations: number = 1): Point[] {
  if (points.length < 3) return points

  let smoothed = [...points]

  for (let iter = 0; iter < iterations; iter++) {
    const newPoints = [...smoothed]

    for (let i = 1; i < smoothed.length - 1; i++) {
      const prev = smoothed[i - 1]
      const curr = smoothed[i]
      const next = smoothed[i + 1]

      newPoints[i] = {
        x: (prev.x + curr.x + next.x) / 3,
        y: (prev.y + curr.y + next.y) / 3
      }
    }

    smoothed = newPoints
  }

  return smoothed
}

// Generate SVG path from points
function generatePath(points: Point[], smoothing: number): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}Z`
  if (points.length === 2) {
    return `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}L${points[1].x.toFixed(1)},${points[1].y.toFixed(1)}Z`
  }

  // Simplify based on smoothing
  const epsilon = Math.max(0.5, (100 - smoothing) * 0.1)
  const simplified = simplifyPath(points, epsilon)

  // Apply light smoothing for curves
  const smoothed = smoothPath(simplified, 1)

  // Generate path with curve commands for smoother appearance
  let path = `M${smoothed[0].x.toFixed(1)},${smoothed[0].y.toFixed(1)}`

  for (let i = 1; i < smoothed.length; i++) {
    path += `L${smoothed[i].x.toFixed(1)},${smoothed[i].y.toFixed(1)}`
  }

  path += 'Z'

  return path
}

// Trace all contours for a color
function traceContours(grid: Set<string>, width: number, height: number): Point[][] {
  const contours: Point[][] = []

  if (grid.size === 0) return contours

  const regions = findConnectedRegions(grid, width, height)

  for (const region of regions) {
    if (region.size === 0) continue

    // Find starting point
    let minKey = ''
    let minX = width
    let minY = height

    for (const key of region) {
      const [x, y] = key.split(',').map(Number)
      if (y < minY || (y === minY && x < minX)) {
        minX = x
        minY = y
        minKey = key
      }
    }

    if (!minKey) continue

    const [startX, startY] = minKey.split(',').map(Number)
    const regionGrid = new Set<string>(region)

    const boundary = traceBoundary(regionGrid, width, height, startX, startY)

    if (boundary.length > 2) {
      contours.push(boundary)
    }
  }

  return contours
}

// Generate color paths
function generateColorPaths(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  settings: VectorizationSettings
): string {
  const blockSize = Math.max(1, Math.floor(4 - (settings.detailLevel / 30)))
  const colorPalette = groupSimilarColors(pixels, width, height, blockSize, settings.colorSimplification)
  const paletteArray = Array.from(colorPalette.entries()).map(([_, color]) => ({
    r: color.r,
    g: color.g,
    b: color.b
  }))

  const colorGrid = new Map<string, ColorData>()

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      if (idx + 3 < pixels.length && pixels[idx + 3] > 128) {
        const r = pixels[idx]
        const g = pixels[idx + 1]
        const b = pixels[idx + 2]

        // Find nearest color
        let minDist = Infinity
        let nearest = paletteArray[0]
        for (const color of paletteArray) {
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

        colorGrid.set(`${x},${y}`, nearest)
      }
    }
  }

  let paths = ''
  const processedPixels = new Set<string>()

  for (const color of paletteArray) {
    const colorHex = `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`

    const colorPixelGrid = new Set<string>()
    for (const [pos, pixelColor] of colorGrid) {
      if (pixelColor.r === color.r && pixelColor.g === color.g && pixelColor.b === color.b) {
        colorPixelGrid.add(pos)
      }
    }

    if (colorPixelGrid.size === 0) continue

    const contours = traceContours(colorPixelGrid, width, height)

    for (const contour of contours) {
      if (contour.length < 3) continue

      const path = generatePath(contour, settings.smoothing)

      if (path) {
        paths += `<path d="${path}" fill="${colorHex}"/>\n`
      }
    }

    for (const pos of colorPixelGrid) {
      processedPixels.add(pos)
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
  const colorGrid = new Map<number, Set<string>>()

  for (let i = 0; i < levels; i++) {
    colorGrid.set(i, new Set())
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      if (idx + 3 < pixels.length && pixels[idx + 3] > 128) {
        const brightness = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3
        const level = Math.floor((brightness / 255) * (levels - 1))
        colorGrid.get(level)!.add(`${x},${y}`)
      }
    }
  }

  let paths = ''

  for (let i = 0; i < levels; i++) {
    const grid = colorGrid.get(i)!
    if (grid.size === 0) continue

    const grayValue = Math.floor((i / (levels - 1)) * 255)
    const hex = grayValue.toString(16).padStart(2, '0')
    const color = `#${hex}${hex}${hex}`

    const contours = traceContours(grid, width, height)

    for (const contour of contours) {
      if (contour.length < 3) continue

      const path = generatePath(contour, settings.smoothing)

      if (path) {
        paths += `<path d="${path}" fill="${color}"/>\n`
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
  const grid = new Set<string>()

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      if (idx + 3 < pixels.length && pixels[idx + 3] > 128) {
        const brightness = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3
        if (brightness < threshold) {
          grid.add(`${x},${y}`)
        }
      }
    }
  }

  let paths = ''
  const contours = traceContours(grid, width, height)

  for (const contour of contours) {
    if (contour.length < 3) continue

    const path = generatePath(contour, settings.smoothing)

    if (path) {
      paths += `<path d="${path}" fill="#000"/>\n`
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

  return optimizeSVG(svg, settings.optimizationLevel)
}

// Optimize SVG
function optimizeSVG(svg: string, level: string): string {
  let optimized = svg

  if (level === 'maximum' || level === 'high') {
    optimized = optimized.replace(/<\?xml[^>]*\?>\s*/, '')
  }

  optimized = optimized.replace(/>\s+</g, '><')
  optimized = optimized.replace(/[\n\r\t]+/g, '')

  return optimized.trim()
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
      detailLevel: 75,
      smoothing: 50,
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
