'use client'

import { useEffect, useState } from 'react'
import { FireIcon } from '@heroicons/react/24/solid'
import { ChatBubbleLeftIcon, EyeIcon } from '@heroicons/react/24/outline'

interface PopularPost {
  id: string
  title: string
  slug: string
  upvotes: number
  commentCount: number
  views: number
  adminPick: boolean
}

export default function PopularSidebar() {
  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await fetch('/api/popular')
        if (response.ok) {
          const data = await response.json()
          setPopularPosts(data)
        }
      } catch (error) {
        console.error('Error fetching popular posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularPosts()
  }, [])

  if (loading) {
    return (
      <div className="bg-brand-card rounded-2xl shadow-soft border border-brand-border p-6 sticky top-22">
        <div className="flex items-center gap-2 mb-4">
          <FireIcon className="w-5 h-5 text-brand-accent" />
          <h2 className="text-lg font-semibold text-brand-ink">
            인기글 TOP 10
          </h2>
          <span className="text-sm text-brand-muted">(7일)</span>
        </div>
        <div className="text-center text-brand-muted py-8">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="bg-brand-card rounded-2xl shadow-soft border border-brand-border p-6 sticky top-22">
      <div className="flex items-center gap-2 mb-4">
        <FireIcon className="w-5 h-5 text-brand-accent" />
        <h2 className="text-lg font-semibold text-brand-ink">
          인기글 TOP 10
        </h2>
        <span className="text-sm text-brand-muted">(7일)</span>
      </div>

      {popularPosts.length === 0 ? (
        <p className="text-brand-muted text-center py-8">인기 게시글이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {popularPosts.map((post, index) => (
            <div
              key={post.id}
              className="group cursor-pointer"
              onClick={() => {
                // Navigate to post (this will be handled by parent)
                window.location.href = `/forum/post/${post.slug}`
              }}
            >
              <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-brand-surface transition-colors">
                {/* Rank */}
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-surface flex items-center justify-center">
                  <span className="text-xs font-medium text-brand-muted">
                    {index + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {post.adminPick && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-brand-gold text-white">
                        STAFF
                      </span>
                    )}
                    <h3 className="text-sm font-medium text-brand-ink line-clamp-2 group-hover:text-brand-accent transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-brand-muted">
                    <div className="flex items-center gap-1">
                      <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                      <span>{post.commentCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <EyeIcon className="w-3.5 h-3.5" />
                      <span>{post.views}</span>
                    </div>
                    <span>추천 {post.upvotes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
