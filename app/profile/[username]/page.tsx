'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navigation from '../../../components/Navigation'
import { 
  Calendar, 
  MapPin, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  FileText, 
  Bookmark,
  Eye,
  Star,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

interface User {
  id: string
  username: string
  name: string
  email: string
  avatar: string | null
  bio: string | null
  location: string | null
  joinDate: string
  lastSeen: string
  totalLikes: number
  totalDislikes: number
  totalPosts: number
  totalComments: number
}

interface Post {
  id: string
  title: string
  type: string
  createdAt: string
  upvotes: number
  downvotes: number
  views: number
  commentCount: number
  marketTrend: 'up' | 'down' | null
  isHot: boolean
  isNew: boolean
  isPopular: boolean
  adminPick: boolean
}

interface Comment {
  id: string
  content: string
  postId: string
  postTitle: string
  createdAt: string
  likes: number
  dislikes: number
}

interface Bookmark {
  id: string
  postId: string
  postTitle: string
  postType: string
  createdAt: string
}

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'bookmarks'>('posts')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 실제 API 호출로 대체 예정
        const response = await fetch(`/api/users/${username}`)
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setPosts(data.posts || [])
          setComments(data.comments || [])
          setBookmarks(data.bookmarks || [])
        } else {
          // 샘플 데이터 사용
          setUser({
            id: '1',
            username: 'user1',
            name: '김철수',
            email: 'user1@example.com',
            avatar: null,
            bio: '부동산에 관심이 많은 임차인입니다. 다양한 경험을 공유하고 도움을 받고 싶습니다.',
            location: '서울시 강남구',
            joinDate: '2024-01-01T00:00:00Z',
            lastSeen: '2024-01-15T10:00:00Z',
            totalLikes: 15,
            totalDislikes: 2,
            totalPosts: 3,
            totalComments: 8
          })
          
          setPosts([
            {
              id: '1',
              title: '강남역 근처 원룸 구합니다',
              type: 'housing',
              createdAt: '2024-01-15T10:00:00Z',
              upvotes: 12,
              downvotes: 1,
              views: 156,
              commentCount: 3,
              marketTrend: 'up',
              isHot: true,
              isNew: true,
              isPopular: false,
              adminPick: false
            },
            {
              id: '2',
              title: '월세 협상 전략 가이드',
              type: 'discussion',
              createdAt: '2024-01-14T15:00:00Z',
              upvotes: 8,
              downvotes: 0,
              views: 89,
              commentCount: 5,
              marketTrend: null,
              isHot: false,
              isNew: false,
              isPopular: true,
              adminPick: false
            }
          ])
          
          setComments([
            {
              id: '1',
              content: '정말 유용한 정보네요! 저도 비슷한 경험이 있어서 도움이 많이 됐습니다.',
              postId: '1',
              postTitle: '보증금 반환 문제 해결 경험 공유',
              createdAt: '2024-01-15T09:00:00Z',
              likes: 5,
              dislikes: 0
            },
            {
              id: '2',
              content: '이런 팁들이 정말 도움이 됩니다. 감사합니다!',
              postId: '2',
              postTitle: '집주인과의 소통 방법',
              createdAt: '2024-01-14T16:00:00Z',
              likes: 3,
              dislikes: 0
            }
          ])
          
          setBookmarks([
            {
              id: '1',
              postId: '1',
              postTitle: '보증금 반환 문제 해결 경험 공유',
              postType: 'discussion',
              createdAt: '2024-01-15T08:00:00Z'
            },
            {
              id: '2',
              postId: '2',
              postTitle: '월세 vs 전세 비교 분석',
              postType: 'discussion',
              createdAt: '2024-01-14T14:00:00Z'
            }
          ])
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchUserData()
    }
  }, [username])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return '방금 전'
    if (diffInHours < 24) return `${diffInHours}시간 전`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}일 전`
    return date.toLocaleDateString()
  }

  const getMarketTrendIcon = (trend: 'up' | 'down' | null) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-500" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-blue-500" />
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-brand-card rounded-2xl mb-6"></div>
            <div className="h-8 bg-brand-card rounded-lg mb-4"></div>
            <div className="h-64 bg-brand-card rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-brand-ink mb-4">사용자를 찾을 수 없습니다</h1>
            <p className="text-brand-muted">요청하신 사용자 프로필이 존재하지 않습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 프로필 헤더 */}
        <div className="bg-brand-card rounded-2xl shadow-soft border border-brand-border p-6 mb-6">
          <div className="flex items-start space-x-6">
            {/* 아바타 */}
            <div className="w-24 h-24 bg-brand-accent/20 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-brand-accent">{user.name.charAt(0)}</span>
              )}
            </div>
            
            {/* 사용자 정보 */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-brand-ink">{user.name}</h1>
                <span className="text-sm text-brand-muted">@{user.username}</span>
              </div>
              
              {user.bio && (
                <p className="text-brand-muted mb-4">{user.bio}</p>
              )}
              
              <div className="flex items-center space-x-6 text-sm text-brand-muted">
                {user.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(user.joinDate).toLocaleDateString()} 가입</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{new Date(user.lastSeen).toLocaleDateString()} 마지막 활동</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 통계 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-brand-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-accent">{user.totalLikes}</div>
              <div className="text-sm text-brand-muted">받은 좋아요</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-accent">{user.totalPosts}</div>
              <div className="text-sm text-brand-muted">작성한 글</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-accent">{user.totalComments}</div>
              <div className="text-sm text-brand-muted">작성한 댓글</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-accent">{Math.round((user.totalLikes / (user.totalLikes + user.totalDislikes)) * 100)}%</div>
              <div className="text-sm text-brand-muted">호감도</div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-brand-card rounded-2xl shadow-soft border border-brand-border p-1 mb-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'bg-brand-accent text-white'
                  : 'text-brand-muted hover:text-brand-ink'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              작성한 글 ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'comments'
                  ? 'bg-brand-accent text-white'
                  : 'text-brand-muted hover:text-brand-ink'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              작성한 댓글 ({comments.length})
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'bookmarks'
                  ? 'bg-brand-accent text-white'
                  : 'text-brand-muted hover:text-brand-ink'
              }`}
            >
              <Bookmark className="w-4 h-4 inline mr-2" />
              북마크 ({bookmarks.length})
            </button>
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="bg-brand-card rounded-2xl shadow-soft border border-brand-border p-6">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <p className="text-center text-brand-muted py-8">아직 작성한 글이 없습니다.</p>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="border-b border-brand-border pb-4 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Link 
                            href={`/discussions/${post.id}`} 
                            className="text-lg font-semibold text-brand-ink hover:text-brand-accent transition-colors"
                          >
                            {post.title}
                          </Link>
                          {post.marketTrend && getMarketTrendIcon(post.marketTrend)}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-brand-muted mb-2">
                          <span className="flex items-center space-x-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{post.upvotes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <ThumbsDown className="w-4 h-4" />
                            <span>{post.downvotes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.commentCount}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-brand-accent/10 text-brand-accent text-xs rounded-full">
                            {post.type === 'housing' ? '주거' : post.type === 'discussion' ? '토론' : '일반'}
                          </span>
                          {post.isHot && <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">HOT</span>}
                          {post.isNew && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">NEW</span>}
                          {post.adminPick && <span className="px-2 py-1 bg-brand-gold text-white text-xs rounded-full">추천</span>}
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-brand-muted ml-4">
                        {getTimeAgo(post.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-center text-brand-muted py-8">아직 작성한 댓글이 없습니다.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-b border-brand-border pb-4 last:border-b-0">
                    <div className="mb-2">
                      <Link 
                        href={`/discussions/${comment.postId}`}
                        className="text-sm text-brand-accent hover:underline"
                      >
                        {comment.postTitle}
                      </Link>
                    </div>
                    
                    <p className="text-brand-ink mb-2">{comment.content}</p>
                    
                    <div className="flex items-center justify-between text-sm text-brand-muted">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{comment.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ThumbsDown className="w-4 h-4" />
                          <span>{comment.dislikes}</span>
                        </span>
                      </div>
                      <span>{getTimeAgo(comment.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="space-y-4">
              {bookmarks.length === 0 ? (
                <p className="text-center text-brand-muted py-8">아직 북마크한 글이 없습니다.</p>
              ) : (
                bookmarks.map((bookmark) => (
                  <div key={bookmark.id} className="border-b border-brand-border pb-4 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link 
                          href={`/discussions/${bookmark.postId}`}
                          className="text-lg font-semibold text-brand-ink hover:text-brand-accent transition-colors"
                        >
                          {bookmark.postTitle}
                        </Link>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="px-2 py-1 bg-brand-accent/10 text-brand-accent text-xs rounded-full">
                            {bookmark.postType === 'housing' ? '주거' : bookmark.postType === 'discussion' ? '토론' : '일반'}
                          </span>
                          <span className="text-sm text-brand-muted">
                            {getTimeAgo(bookmark.createdAt)}에 북마크
                          </span>
                        </div>
                      </div>
                      
                      <Bookmark className="w-5 h-5 text-brand-accent" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
