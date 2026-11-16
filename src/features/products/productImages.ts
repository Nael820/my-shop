const IMAGE_WIDTH = 600
const IMAGE_HEIGHT = 400

function isUnsplash(src: string) {
  try {
    return new URL(src).hostname === 'images.unsplash.com'
  } catch {
    return false
  }
}

function optimizeUnsplashImage(src: string, width: number) {
  const url = new URL(src)
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'crop')
  url.searchParams.set('w', String(width))
  url.searchParams.set('h', String(Math.round((width * IMAGE_HEIGHT) / IMAGE_WIDTH)))
  url.searchParams.set('q', '70')
  url.searchParams.set('fm', 'webp')
  return url.toString()
}

export function getResponsiveProductImage(src: string, widths: number[], defaultWidth = IMAGE_WIDTH) {
  if (!isUnsplash(src)) {
    return { src, srcSet: undefined }
  }

  return {
    src: optimizeUnsplashImage(src, defaultWidth),
    srcSet: widths.map((width) => `${optimizeUnsplashImage(src, width)} ${width}w`).join(', '),
  }
}
