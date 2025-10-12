'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '../../components/Navigation'
import { 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  Clock, 
  Plus,
  Star,
  Flame,
  Zap,
  Target
} from 'lucide-react'

interface Post {
  id: string
  title: string
  author: string
  nickname?: string
  createdAt: string
  upvotes: number
  downvotes: number
  views: number
  comments: number
  tags: string[]
  marketTrend?: 'up' | 'down' | null
  isHot: boolean
  isNew: boolean
  isPopular: boolean
  adminPick: boolean
}

interface PopularPost {
  id: string
  title: string
  views: number
  comments: number
  upvotes: number
  downvotes: number
  isHot: boolean
  isNew: boolean
}

interface PopularDiscussion {
  id: string
  title: string
  slug: string
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: string
  nickname: string
  tags: string[]
  score: number
}

interface Tag {
  name: string
  count: number
  isActive: boolean
}

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([])
  const [popularDiscussions, setPopularDiscussions] = useState<PopularDiscussion[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [sortBy, setSortBy] = useState('latest')
  const [selectedTag, setSelectedTag] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const postsPerPage = 10

  // 실제 API 데이터 사용
  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/discussions?page=${currentPage}&limit=${postsPerPage}&tag=${selectedTag}&search=${searchQuery}`)
        const data = await response.json()
        if (data.discussions) {
          setPosts(data.discussions)
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchPopularDiscussions = async () => {
      try {
        const response = await fetch('/api/popular-discussions', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        const data = await response.json()
        if (data.success && data.discussions) {
          setPopularDiscussions(data.discussions)
          console.log('인기토론글 업데이트됨:', data.discussions)
        }
      } catch (error) {
        console.error('Failed to fetch popular discussions:', error)
      }
    }

    const fetchTagCounts = async () => {
      try {
        const response = await fetch('/api/tags/counts')
        const data = await response.json()
        if (data.success && data.tags) {
          setTags(data.tags)
          console.log('태그 카운트 업데이트됨:', data.tags)
        }
      } catch (error) {
        console.error('Failed to fetch tag counts:', error)
      }
    }

    fetchPosts()
    fetchPopularDiscussions()
    fetchTagCounts()
    
    // 인기토론글과 태그 카운트를 15초마다 새로고침 (더 빠른 업데이트를 위해)
    const interval = setInterval(() => {
      fetchPopularDiscussions()
      fetchTagCounts()
    }, 15000)
    
    return () => clearInterval(interval)
  }, [currentPage, selectedTag, searchQuery])
      

  // 인기토론글 새로고침 함수
  const refreshPopularDiscussions = async () => {
    try {
      const response = await fetch('/api/popular-discussions', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const data = await response.json()
      if (data.success && data.discussions) {
        setPopularDiscussions(data.discussions)
        console.log('인기토론글 즉시 새로고침됨:', data.discussions)
      }
    } catch (error) {
      console.error('Failed to refresh popular discussions:', error)
    }
  }

  // 태그 카운트 새로고침 함수
  const refreshTagCounts = async () => {
    try {
      const response = await fetch('/api/tags/counts', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const data = await response.json()
      if (data.success && data.tags) {
        setTags(data.tags)
        console.log('태그 카운트 즉시 새로고침됨:', data.tags)
      }
    } catch (error) {
      console.error('Failed to refresh tag counts:', error)
    }
  }

  // 게시글 공감 처리 함수
  const handleVote = async (postId: string, voteType: 'like' | 'dislike') => {
    try {
      const apiEndpoint = voteType === 'like' 
        ? `/api/discussions/${postId}/like`
        : `/api/discussions/${postId}/dislike`
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`${voteType} response:`, data) // 디버깅용
        
        // 게시글 목록의 공감 숫자 업데이트 (로그인 없이 무제한 공감)
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  upvotes: voteType === 'like' 
                    ? (data.updatedPost?.upvotes || post.upvotes + 1)
                    : post.upvotes,
                  downvotes: voteType === 'dislike'
                    ? (data.updatedPost?.downvotes || post.downvotes + 1)
                    : post.downvotes
                }
              : post
          )
        )
        
        // 인기토론글 및 태그 카운트 즉시 새로고침
        await Promise.all([
          refreshPopularDiscussions(),
          refreshTagCounts()
        ])
        
        console.log(`${voteType} 처리 완료:`, data)
      } else {
        console.error(`${voteType} failed:`, response.status, response.statusText)
      }
    } catch (error) {
      console.error(`Failed to ${voteType} post:`, error)
    }
  }

  // 게시글 공감 처리 후 인기토론글 및 태그 카운트 업데이트
  const handleVoteUpdate = async (postId: string, newUpvotes: number, newDownvotes: number) => {
    // 게시글 목록의 공감 숫자 업데이트
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, upvotes: newUpvotes, downvotes: newDownvotes }
          : post
      )
    )
    
    // 인기토론글 및 태그 카운트 즉시 새로고침
    await Promise.all([
      refreshPopularDiscussions(),
      refreshTagCounts()
    ])
  }

  // 좋아요/싫어요 후 인기토론글 업데이트를 위한 이벤트 리스너
  useEffect(() => {
    const handleVoteEvent = (event: CustomEvent) => {
      const { postId, upvotes, downvotes } = event.detail
      handleVoteUpdate(postId, upvotes, downvotes)
    }

    // 커스텀 이벤트 리스너 추가
    window.addEventListener('vote-updated', handleVoteEvent as EventListener)
    
    return () => {
      window.removeEventListener('vote-updated', handleVoteEvent as EventListener)
    }
  }, [])

  const samplePopularPosts: PopularPost[] = [
    {
      id: '1',
      title: '월세 인상에 대한 대응 방안 토론',
      views: 234,
      comments: 18,
      upvotes: 45,
      downvotes: 3,
      isHot: true,
      isNew: false
    },
    {
      id: '2',
      title: '보증금 반환 문제 해결 경험 공유',
      views: 189,
      comments: 12,
      upvotes: 32,
      downvotes: 1,
      isHot: false,
      isNew: true
    },
    {
      id: '3',
      title: '집주인과의 소통 방법 팁',
      views: 156,
      comments: 8,
      upvotes: 28,
      downvotes: 2,
      isHot: false,
      isNew: true
    },
    {
      id: '4',
      title: '부동산 시장 전망과 임차인 전략',
      views: 456,
      comments: 25,
      upvotes: 67,
      downvotes: 5,
      isHot: true,
      isNew: false
    },
    {
      id: '5',
      title: '계약서 체크리스트 공유',
      views: 678,
      comments: 34,
      upvotes: 89,
      downvotes: 2,
      isHot: true,
      isNew: false
    }
  ]

  // 실제 API에서 가져온 태그들만 사용

  useEffect(() => {
    // API에서 데이터 가져오기
    const fetchData = async () => {
      try {
        // 실제 API 호출로 대체 예정
        const response = await fetch(`/api/discussions?page=${currentPage}&sort=${sortBy}&tag=${selectedTag}&search=${searchQuery}`)
        if (response.ok) {
          const data = await response.json()
          console.log('API Response:', data)
          setPosts(data.discussions || [])
          setPopularPosts(data.popularPosts || [])
        } else {
          // API 실패 시 기본 인기글 데이터 사용
          setPosts([])
          setPopularPosts(samplePopularPosts)
        }
  } catch (error) {
          console.error('Failed to fetch data:', error)
          // 에러 시 기본 인기글 데이터 사용
          setPosts([])
          setPopularPosts(samplePopularPosts)
        } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage, sortBy, selectedTag, searchQuery])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return '방금 전'
    if (diffInHours < 24) return `${diffInHours}시간 전`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}일 전`
    return date.toLocaleDateString()
  }

  const getVoteScore = (upvotes: number, downvotes: number) => {
    return upvotes - downvotes
  }

  const getMarketTrendIcon = (trend: 'up' | 'down' | null) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-500" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-blue-500" />
    return null
  }

  const getMarketTrendText = (trend: 'up' | 'down' | null) => {
    if (trend === 'up') return '상승'
    if (trend === 'down') return '하락'
    return null
  }

  const totalPages = Math.ceil(posts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = posts.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navigation />
      
        {/* Header */}
      <div className="bg-brand-card border-b border-brand-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-brand-ink">토론방</h1>
              <p className="text-sm text-brand-muted">무주택촌 커뮤니티의 활발한 토론을 만나보세요</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/forum/new"
                className="inline-flex items-center px-4 py-2 bg-brand-accent text-white text-sm font-medium rounded-lg hover:bg-brand-accent700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                새 글쓰기
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar - Tags */}
          <div className="lg:w-64 space-y-4">
            <div className="bg-brand-card rounded-2xl shadow-soft border border-brand-border p-4">
              <h3 className="font-semibold text-brand-ink mb-3">태그</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedTag('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedTag === 'all'
                      ? 'bg-brand-accent text-white'
                      : 'text-brand-ink hover:bg-brand-accent/10'
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => setSelectedTag('자유')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedTag === '자유'
                      ? 'bg-brand-accent text-white'
                      : 'text-brand-ink hover:bg-brand-accent/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>자유</span>
                    <span className="text-xs opacity-70">{tags.find(t => t.name === '자유')?.count || 0}</span>
                  </div>
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => setSelectedTag(tag.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedTag === tag.name
                        ? 'bg-brand-accent text-white'
                        : 'text-brand-ink hover:bg-brand-accent/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{tag.name}</span>
                      <span className="text-xs opacity-70">{tag.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="bg-brand-card rounded-2xl shadow-soft border border-brand-border p-4">
              <h3 className="font-semibold text-brand-ink mb-3">정렬</h3>
              <div className="space-y-2">
                {[
                  { value: 'latest', label: '최신순' },
                  { value: 'popular', label: '인기순' },
                  { value: 'views', label: '조회순' },
                  { value: 'comments', label: '댓글순' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="mr-2 text-brand-accent"
                    />
                    <span className="text-sm text-brand-ink">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>


          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="bg-brand-card rounded-2xl shadow-soft border border-brand-border p-4 mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="토론글 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-3">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-brand-card rounded-2xl shadow-soft border border-brand-border p-4 animate-pulse">
                    <div className="h-4 bg-brand-border rounded mb-2"></div>
                    <div className="h-3 bg-brand-border rounded w-3/4"></div>
                  </div>
                ))
              ) : (
                currentPosts.map((post) => (
                  <div key={post.id} className="bg-brand-card rounded-2xl shadow-soft border border-brand-border hover:shadow-medium transition-all duration-200">
                    <div className="p-4">
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <Link href={`/discussions/${post.id}`} className="block hover:bg-brand-accent/5 rounded-lg p-2 -m-2 transition-colors">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-sm font-semibold text-brand-ink hover:text-brand-accent transition-colors">
                                {post.title}
                              </h3>
                              {post.marketTrend && (
                                <div className="flex items-center space-x-1">
                                  {getMarketTrendIcon(post.marketTrend)}
                                  <span className="text-xs text-brand-muted">
                                    {getMarketTrendText(post.marketTrend)}
                                  </span>
                                </div>
                              )}
        </div>

                            {/* Tags */}
                            <div className="flex items-center space-x-1 mb-2">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-brand-accent/10 text-brand-accent text-xs rounded-full border border-brand-accent/20"
                                >
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 3 && (
                                <span className="text-xs text-brand-muted">+{post.tags.length - 3}</span>
                              )}
                            </div>
                          </Link>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center space-x-1 ml-2">
                          {post.isHot && <Flame className="w-4 h-4 text-red-500" />}
                          {post.isNew && <Zap className="w-4 h-4 text-yellow-500" />}
                          {post.isPopular && <Star className="w-4 h-4 text-brand-gold" />}
                          {post.adminPick && <Target className="w-4 h-4 text-brand-accent" />}
                        </div>
                      </div>

                      {/* Post Meta */}
                      <div className="flex items-center justify-between text-xs text-brand-muted">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {post.comments}
                          </span>
                          <span className="flex items-center">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {getVoteScore(post.upvotes, post.downvotes)}
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {post.views}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>{post.nickname || '익명'}</span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {getTimeAgo(post.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Vote Buttons */}
                      <div className="flex items-center justify-center space-x-4 mt-3 pt-3 border-t border-brand-border">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleVote(post.id, 'like')
                          }}
                          className="flex items-center space-x-1 px-3 py-1 text-xs bg-brand-surface text-brand-muted rounded-lg hover:bg-brand-accent hover:text-white transition-colors"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>공감 {post.upvotes}</span>
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleVote(post.id, 'dislike')
                          }}
                          className="flex items-center space-x-1 px-3 py-1 text-xs bg-brand-surface text-brand-muted rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <ThumbsDown className="w-3 h-3" />
                          <span>비공감 {post.downvotes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
        </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-brand-muted bg-brand-surface border border-brand-border rounded-lg hover:bg-brand-accent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    이전
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-brand-accent text-white'
                            : 'text-brand-muted bg-brand-surface border border-brand-border hover:bg-brand-accent hover:text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-brand-muted bg-brand-surface border border-brand-border rounded-lg hover:bg-brand-accent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}

            {/* Page Info */}
            <div className="mt-4 text-center text-sm text-brand-muted">
              총 {posts.length}개의 토론글 중 {startIndex + 1}-{Math.min(endIndex, posts.length)}번째를 보고 있습니다
            </div>
          </div>

          {/* Right Sidebar - Popular Discussions */}
          <div className="lg:w-80 space-y-4">
            <div className="bg-brand-card rounded-2xl shadow-soft border border-brand-border p-4">
              <h3 className="font-semibold text-brand-ink mb-3 flex items-center">
                <Flame className="w-4 h-4 mr-2 text-orange-500" />
                인기토론글
              </h3>
              <div className="space-y-3">
                {popularDiscussions.length > 0 ? (
                  popularDiscussions.map((discussion, index) => (
                    <div key={discussion.id} className="border-b border-brand-border pb-3 last:border-b-0">
                      <div className="flex items-start space-x-2 mb-2">
                        <span className="text-xs font-bold text-brand-accent bg-brand-accent/10 px-1.5 py-0.5 rounded flex-shrink-0">
                          {index + 1}
                        </span>
                        <h4 className="text-sm font-medium text-brand-ink line-clamp-2 leading-tight">
                          <Link href={`/discussions/${discussion.id}`} className="hover:text-brand-accent transition-colors">
                            {discussion.title}
                          </Link>
                        </h4>
                      </div>
                      <div className="flex items-center justify-between text-xs text-brand-muted">
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {discussion.upvotes}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {discussion.commentCount}
                          </span>
                        </div>
                        <span className="text-xs opacity-70">
                          {discussion.nickname || '익명'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-brand-muted text-center py-4">
                    인기토론글이 없습니다
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
