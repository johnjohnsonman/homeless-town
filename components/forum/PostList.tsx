'use client'

import { Suspense } from 'react'
import PostListClient from './PostListClient'
import PostListSkeleton from './PostListSkeleton'

interface PostListProps {
  searchParams: {
    tag?: string
    sort?: string
    page?: string
  }
}

export default function PostList({ searchParams }: PostListProps) {
  const tag = searchParams.tag || 'all'
  const sort = searchParams.sort || 'recent'
  const page = parseInt(searchParams.page || '1')

  return (
    <div className="space-y-4">
      <Suspense fallback={<PostListSkeleton />}>
        <PostListClient
          initialTag={tag}
          initialSort={sort}
          initialPage={page}
        />
      </Suspense>
    </div>
  )
}
