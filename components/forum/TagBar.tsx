'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface Tag {
  id: string
  name: string
  slug: string
}

interface TagBarProps {
  tags: Tag[]
}

export default function TagBar({ tags }: TagBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null)

  const currentTag = searchParams.get('tag') || 'all'

  useEffect(() => {
    if (scrollContainer) {
      const checkScroll = () => {
        setCanScrollLeft(scrollContainer.scrollLeft > 0)
        setCanScrollRight(
          scrollContainer.scrollLeft <
            scrollContainer.scrollWidth - scrollContainer.clientWidth
        )
      }

      checkScroll()
      scrollContainer.addEventListener('scroll', checkScroll)
      return () => scrollContainer.removeEventListener('scroll', checkScroll)
    }
  }, [scrollContainer])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer) {
      const scrollAmount = 200
      scrollContainer.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleTagClick = (tagSlug: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('tag', tagSlug)
    params.set('page', '1') // Reset to first page
    router.push(`/forum?${params.toString()}`)
  }

  return (
    <div className="relative">
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200 hover:bg-white transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {/* Scroll Right Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200 hover:bg-white transition-all"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {/* Tags Container */}
      <div
        ref={setScrollContainer}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* All Tags */}
        <button
          onClick={() => handleTagClick('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentTag === 'all'
              ? 'bg-primary text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
          }`}
        >
          전체
        </button>

        {/* Individual Tags */}
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.slug)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentTag === tag.slug
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  )
}
