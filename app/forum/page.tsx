import { Suspense } from 'react'
import Navigation from '@/components/Navigation'
import TagBar from '@/components/forum/TagBar'
import SortTabs from '@/components/forum/SortTabs'
import PostList from '@/components/forum/PostList'
import PopularSidebar from '@/components/forum/PopularSidebar'
import { prisma } from '@/lib/prisma'

interface ForumPageProps {
  searchParams: {
    tag?: string
    sort?: string
    page?: string
  }
}

async function getTags() {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
    return tags
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const tags = await getTags()

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brand-ink mb-2">토론방</h1>
              <p className="text-brand-muted">
                다양한 주제에 대해 의견을 나누고 정보를 공유해보세요.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="/" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-surface hover:bg-brand-card text-brand-ink rounded-xl border border-brand-border transition-colors duration-200"
              >
                ← 홈으로 돌아가기
              </a>
            </div>
          </div>
        </div>

        {/* Tag Bar */}
        <div className="mb-6">
          <Suspense fallback={<div className="h-12 bg-brand-surface rounded-2xl animate-pulse" />}>
            <TagBar tags={tags} />
          </Suspense>
        </div>

        {/* Sort Tabs */}
        <div className="mb-6 max-w-xs">
          <SortTabs />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Left: Post List */}
          <div className="space-y-4">
            <Suspense fallback={<div className="h-96 bg-brand-surface rounded-2xl animate-pulse" />}>
              <PostList searchParams={searchParams} />
            </Suspense>
          </div>

          {/* Right: Popular Sidebar */}
          <div className="lg:block">
            <Suspense fallback={<div className="h-96 bg-brand-surface rounded-2xl animate-pulse" />}>
              <PopularSidebar />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
