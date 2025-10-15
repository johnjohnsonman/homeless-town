'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowUpIcon, ArrowDownIcon, EyeIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

interface Post {
  id: string
  title: string
  slug: string
  createdAt: string
  upvotes: number
  downvotes: number
  views: number
  commentCount: number
  adminPick: boolean
  tags: Array<{
    tag: {
      name: string
      slug: string
    }
  }>
}

interface PostListClientProps {
  initialTag: string
  initialSort: string
  initialPage: number
}

export default function PostListClient({
  initialTag,
  initialSort,
  initialPage,
}: PostListClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [voting, setVoting] = useState<Set<string>>(new Set())
  
  const observerRef = useRef<IntersectionObserver>()
  const lastPostRef = useRef<HTMLDivElement>(null)

  const tag = searchParams.get('tag') || initialTag
  const sort = searchParams.get('sort') || initialSort

  // Fetch posts function
  const fetchPosts = useCallback(async (page: number, append = false) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        tag: tag === 'all' ? 'all' : tag,
        sort,
        page: page.toString(),
        pageSize: '20',
      })

      const response = await fetch(`/api/posts?${params}`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      
      const data = await response.json()
      
      if (append) {
        setPosts(prev => [...prev, ...data.items])
      } else {
        setPosts(data.items)
      }
      
      setHasNextPage(!!data.nextPageCursor)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }, [tag, sort])

  // Initial fetch
  useEffect(() => {
    setPosts([])
    setCurrentPage(1)
    setHasNextPage(true)
    fetchPosts(1, false)
  }, [tag, sort, fetchPosts])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !loading) {
          fetchPosts(currentPage + 1, true)
        }
      },
      { threshold: 0.1 }
    )

    observerRef.current = observer

    if (lastPostRef.current) {
      observer.observe(lastPostRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, loading, currentPage, fetchPosts])

  // Handle vote
  const handleVote = async (postId: string, delta: number) => {
    if (voting.has(postId)) return

    try {
      setVoting(prev => new Set(prev).add(postId))
      
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, delta }),
      })

      if (response.ok) {
        const { upvotes } = await response.json()
        setPosts(prev => 
          prev.map(post => 
            post.id === postId ? { ...post, upvotes } : post
          )
        )
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setVoting(prev => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
    }
  }

  // Navigate to post
  const handlePostClick = (slug: string) => {
    router.push(`/forum/post/${slug}`)
  }

  if (posts.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">게시글이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {posts.map((post, index) => (
        <div
          key={post.id}
          ref={index === posts.length - 1 ? lastPostRef : null}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
          onClick={() => handlePostClick(post.slug)}
        >
          <div className="flex items-start gap-4">
            {/* Vote buttons */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleVote(post.id, 1)
                }}
                disabled={voting.has(post.id)}
                className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                aria-label="추천"
              >
                <ArrowUpIcon className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[2rem] text-center">
                {post.upvotes}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleVote(post.id, -1)
                }}
                disabled={voting.has(post.id)}
                className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                aria-label="비추천"
              >
                <ArrowDownIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Post content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {post.adminPick && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    STAFF PICK
                  </span>
                )}
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {post.title}
                </h3>
              </div>
              
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {post.tags.map(({ tag }) => (
                    <span
                      key={tag.slug}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Meta info */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </span>
                <div className="flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  <span>{post.commentCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  <span>{post.views}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}

      {/* End of posts */}
      {!hasNextPage && posts.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          모든 게시글을 불러왔습니다.
        </div>
      )}
    </div>
  )
}
