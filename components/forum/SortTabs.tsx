'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function SortTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || 'recent'

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', sort)
    params.set('page', '1') // Reset to first page
    router.push(`/forum?${params.toString()}`)
  }

  return (
    <div className="flex bg-white rounded-2xl shadow-sm border border-gray-200 p-1">
      <button
        onClick={() => handleSortChange('recent')}
        className={`flex-1 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
          currentSort === 'recent'
            ? 'bg-primary text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        최신순
      </button>
      <button
        onClick={() => handleSortChange('hot')}
        className={`flex-1 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
          currentSort === 'hot'
            ? 'bg-primary text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        인기순
      </button>
    </div>
  )
}
