'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navigation from '../../../components/Navigation'
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Eye, 
  Clock, 
  Bookmark,
  Share2,
  TrendingUp,
  TrendingDown,
  Star,
  Fire,
  Zap,
  Target
} from 'lucide-react'

interface Post {
  id: string
  title: string
  content: string
  author: string
  type: string
  marketTrend: 'up' | 'down' | null
  isHot: boolean
  isNew: boolean
  isPopular: boolean
  urgent: boolean
  verified: boolean
  createdAt: string
  upvotes: number
  downvotes: number
  views: number
  commentCount: number
  adminPick: boolean
  tags: string[]
}

interface Comment {
  id: string
  content: string
  author: string
  authorName: string
  createdAt: string
  likes: number
  dislikes: number
  replies: Comment[]
}

export default function DiscussionDetailPage() {
  const params = useParams()
  const postId = params.id as string
  
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // 임시 사용자 ID (실제로는 인증 시스템에서 가져와야 함)
  const currentUserId = 'user1'

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // 실제 API 호출로 대체 예정
        const response = await fetch(`/api/discussions/${postId}`)
        if (response.ok) {
          const data = await response.json()
          setPost(data.post)
        } else {
          // 샘플 데이터 사용
          setPost({
            id: postId,
            title: '보증금 반환 문제 해결 경험 공유',
            content: `집주인과의 보증금 반환 문제를 해결한 경험을 공유합니다. 

처음에 집주인이 보증금을 반환하지 않겠다고 했을 때 정말 당황스러웠어요. 하지만 법적 절차를 따라가면서 결국 성공적으로 해결할 수 있었습니다.

주요 포인트들:
1. 임대차계약서와 보증금 영수증 보관
2. 퇴거 시 사진 촬영 및 동행 확인
3. 법무법인 상담 및 내용증명 발송
4. 소액사건심판원 신청

이 과정에서 많은 분들이 도움을 주셨고, 특히 무주택촌 커뮤니티의 정보가 정말 유용했어요. 비슷한 상황에 처한 분들에게 도움이 되길 바랍니다.`,
            author: 'user2',
            type: 'discussion',
            marketTrend: null,
            isHot: false,
            isNew: false,
            isPopular: true,
            urgent: false,
            verified: true,
            createdAt: '2024-01-15T10:00:00Z',
            upvotes: 25,
            downvotes: 2,
            views: 234,
            commentCount: 8,
            adminPick: true,
            tags: ['계약', '법률', '보증금']
          })
        }
      } catch (error) {
        console.error('Failed to fetch post:', error)
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchPostData()
    }
  }, [postId])

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/comments`)
        if (response.ok) {
          const data = await response.json()
          setComments(data.comments || [])
        } else {
          // 샘플 댓글 데이터
          setComments([
            {
              id: '1',
              content: '정말 유용한 정보네요! 저도 비슷한 경험이 있어서 도움이 많이 됐습니다.',
              author: 'user1',
              authorName: '김철수',
              createdAt: '2024-01-15T11:00:00Z',
              likes: 5,
              dislikes: 0,
              replies: []
            },
            {
              id: '2',
              content: '보증금 반환 문제는 정말 까다롭죠. 법적 절차를 잘 따라야 합니다.',
              author: 'user3',
              authorName: '박민수',
              createdAt: '2024-01-15T12:00:00Z',
              likes: 8,
              dislikes: 0,
              replies: [
                {
                  id: '2-1',
                  content: '맞습니다. 특히 사진 촬영이 중요해요.',
                  author: 'user1',
                  authorName: '김철수',
                  createdAt: '2024-01-15T12:30:00Z',
                  likes: 3,
                  dislikes: 0,
                  replies: []
                }
              ]
            }
          ])
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error)
      }
    }

    if (postId) {
      fetchComments()
    }
  }, [postId])

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

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.liked)
        if (post) {
          setPost({
            ...post,
            upvotes: data.liked ? post.upvotes + 1 : post.upvotes - 1
          })
        }
      }
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  const handleBookmark = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsBookmarked(data.bookmarked)
      }
    } catch (error) {
      console.error('Failed to bookmark post:', error)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          author: currentUserId,
          parentId: replyTo
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const newCommentObj: Comment = {
          id: data.comment.id,
          content: newComment,
          author: currentUserId,
          authorName: '나',
          createdAt: new Date().toISOString(),
          likes: 0,
          dislikes: 0,
          replies: []
        }

        if (replyTo) {
          // 대댓글 추가
          setComments(prev => prev.map(comment => {
            if (comment.id === replyTo) {
              return { ...comment, replies: [...comment.replies, newCommentObj] }
            }
            return comment
          }))
        } else {
          // 새 댓글 추가
          setComments(prev => [newCommentObj, ...prev])
        }

        setNewComment('')
        setReplyTo(null)
        setReplyContent('')
        
        if (post) {
          setPost({ ...post, commentCount: post.commentCount + 1 })
        }
      }
    } catch (error) {
      console.error('Failed to submit comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-brand-card rounded-lg mb-4"></div>
            <div className="h-64 bg-brand-card rounded-2xl mb-6"></div>
            <div className="h-32 bg-brand-card rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-brand-ink mb-4">게시글을 찾을 수 없습니다</h1>
            <p className="text-brand-muted">요청하신 게시글이 존재하지 않습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 게시글 헤더 */}
        <div className="bg-brand-card rounded-2xl shadow-soft border border-brand-border p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-bold text-brand-ink">{post.title}</h1>
                {post.marketTrend && getMarketTrendIcon(post.marketTrend)}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-brand-muted mb-3">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{getTimeAgo(post.createdAt)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>조회 {post.views}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>댓글 {post.commentCount}</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-brand-accent/10 text-brand-accent text-sm rounded-full border border-brand-accent/20"
                  >
                    {tag}
                  </span>
                ))}
                {post.isHot && <span className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">HOT</span>}
                {post.isNew && <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">NEW</span>}
                {post.adminPick && <span className="px-2 py-1 bg-brand-gold text-white text-sm rounded-full">추천</span>}
              </div>
            </div>
          </div>
          
          {/* 게시글 내용 */}
          <div className="prose prose-brand max-w-none mb-6">
            <div className="whitespace-pre-wrap text-brand-ink leading-relaxed">
              {post.content}
            </div>
          </div>
          
          {/* 액션 버튼 */}
          <div className="flex items-center justify-between pt-4 border-t border-brand-border">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked
                    ? 'bg-brand-accent text-white'
                    : 'bg-brand-surface text-brand-muted hover:bg-brand-accent hover:text-white'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>좋아요 {post.upvotes}</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-brand-surface text-brand-muted rounded-lg hover:bg-brand-accent hover:text-white transition-colors">
                <ThumbsDown className="w-4 h-4" />
                <span>싫어요 {post.downvotes}</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBookmark}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'bg-brand-gold text-white'
                    : 'bg-brand-surface text-brand-muted hover:bg-brand-gold hover:text-white'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isBookmarked ? '북마크됨' : '북마크'}</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-brand-surface text-brand-muted rounded-lg hover:bg-brand-accent hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
                <span>공유</span>
              </button>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-brand-card rounded-2xl shadow-soft border border-brand-border p-6">
          <h2 className="text-xl font-semibold text-brand-ink mb-6">댓글 ({post.commentCount})</h2>
          
          {/* 댓글 작성 폼 */}
          <div className="mb-6">
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 작성해주세요..."
                className="w-full p-4 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent resize-none"
                rows={3}
                disabled={submitting}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? '작성 중...' : '댓글 작성'}
                </button>
              </div>
            </form>
          </div>
          
          {/* 댓글 목록 */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-brand-border pb-6 last:border-b-0">
                {/* 메인 댓글 */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-brand-ink">{comment.authorName}</span>
                      <span className="text-sm text-brand-muted">{getTimeAgo(comment.createdAt)}</span>
                    </div>
                  </div>
                  
                  <p className="text-brand-ink mb-3">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <button className="flex items-center space-x-1 text-brand-muted hover:text-brand-accent transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-brand-muted hover:text-brand-accent transition-colors">
                      <ThumbsDown className="w-4 h-4" />
                      <span>{comment.dislikes}</span>
                    </button>
                    <button 
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="text-brand-accent hover:underline"
                    >
                      답글
                    </button>
                  </div>
                </div>
                
                {/* 대댓글 작성 폼 */}
                {replyTo === comment.id && (
                  <div className="ml-8 mb-4">
                    <form onSubmit={handleCommentSubmit} className="space-y-3">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="답글을 작성해주세요..."
                        className="w-full p-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent resize-none"
                        rows={2}
                        disabled={submitting}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyTo(null)
                            setReplyContent('')
                          }}
                          className="px-4 py-2 text-brand-muted hover:text-brand-ink transition-colors"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          disabled={!replyContent.trim() || submitting}
                          className="px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          답글 작성
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* 대댓글 목록 */}
                {comment.replies.length > 0 && (
                  <div className="ml-8 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-brand-surface rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-brand-ink">{reply.authorName}</span>
                          <span className="text-sm text-brand-muted">{getTimeAgo(reply.createdAt)}</span>
                        </div>
                        <p className="text-brand-ink mb-2">{reply.content}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <button className="flex items-center space-x-1 text-brand-muted hover:text-brand-accent transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{reply.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-brand-muted hover:text-brand-accent transition-colors">
                            <ThumbsDown className="w-4 h-4" />
                            <span>{reply.dislikes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 