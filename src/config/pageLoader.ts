// src/config/pageLoader.ts
import React from 'react'

const pageModules = import.meta.glob('@/pages/**/*.tsx')

// lazy 컴포넌트 캐시
const lazyCache: Record<string, React.LazyExoticComponent<any>> = {}

export function loadPageByUrl(url: string) {
  // 1. query 제거
  const path = url.split('?')[0]

  const filePath =
    '/src/pages' + path + '.tsx'

  if (lazyCache[filePath]) {
    return lazyCache[filePath]
  }

  const importer = pageModules[filePath]
  if (!importer) {
    console.warn('페이지 파일 없음:', filePath)
    return null
  }

  const Lazy = React.lazy(importer as any)
  lazyCache[filePath] = Lazy

  return Lazy
}
