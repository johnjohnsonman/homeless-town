'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  Flame,
  Zap,
  Target,
  ArrowLeft,
  Edit,
  Trash2,
  Home,
  FileText,
  AlertTriangle,
  Shield,
  Calculator,
  Scale,
  Users
} from 'lucide-react'

interface Post {
  id: string
  title: string
  content: string
  author: string
  nickname?: string
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
  createdAt: string
  likes: number
  dislikes: number
  upvotes: number
  downvotes: number
  replies: Comment[]
  isLiked?: boolean
  isDisliked?: boolean
}

export default function DiscussionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string
  
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [password, setPassword] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [marketTrend, setMarketTrend] = useState<'up' | 'down' | null>(null)
  const [commentNickname, setCommentNickname] = useState('')
  const [commentPassword, setCommentPassword] = useState('')
  const [commentSortBy, setCommentSortBy] = useState<'latest' | 'popular'>('latest')

  // 임시 사용자 ID (실제로는 인증 시스템에서 가져와야 함)
  // 현재는 익명 사용자로 처리
  const currentUserId = `anonymous_${Date.now()}`

  // 사용 가능한 태그들
  const availableTags = [
    { name: '시황', icon: <TrendingUp className="w-4 h-4" /> },
    { name: '부동산시장', icon: <Home className="w-4 h-4" /> },
    { name: '임대시장', icon: <FileText className="w-4 h-4" /> },
    { name: '분쟁사례', icon: <AlertTriangle className="w-4 h-4" /> },
    { name: '보증금', icon: <Shield className="w-4 h-4" /> },
    { name: '월세인상', icon: <Calculator className="w-4 h-4" /> },
    { name: '계약해지', icon: <Scale className="w-4 h-4" /> },
    { name: '입주체크', icon: <Users className="w-4 h-4" /> },
    { name: '집주인소통', icon: <MessageSquare className="w-4 h-4" /> },
    { name: '법적권리', icon: <Shield className="w-4 h-4" /> },
    { name: '안전수칙', icon: <AlertTriangle className="w-4 h-4" /> }
  ]

  // 태그 토글 함수
  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(tag => tag !== tagName)
        : [...prev, tagName]
    )
  }

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // 실제 API 호출로 대체 예정
        const response = await fetch(`/api/discussions/${postId}`)
        if (response.ok) {
          const data = await response.json()
          setPost(data.post)
        } else {
          // API 실패 시 빈 데이터로 설정
          setPost(null)
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
          // API 실패 시 빈 배열로 설정
          setComments([])
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

  // 댓글 정렬 함수
  const sortComments = (commentsToSort: Comment[]) => {
    const sortedComments = [...commentsToSort]
    
    if (commentSortBy === 'popular') {
      // 공감순 정렬 (공감 수가 높은 순서)
      sortedComments.sort((a, b) => {
        const aScore = (a.upvotes || 0) - (a.downvotes || 0)
        const bScore = (b.upvotes || 0) - (b.downvotes || 0)
        return bScore - aScore
      })
    } else {
      // 최신순 정렬 (생성일 기준)
      sortedComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    
    return sortedComments
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



  const handleDislike = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsDisliked(data.disliked)
        
        // 게시글 싫어요 수 업데이트
        if (post) {
          setPost({
            ...post,
            downvotes: data.disliked ? post.downvotes + 1 : post.downvotes - 1
          })
        }
      }
    } catch (error) {
      console.error('Failed to dislike post:', error)
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

  const handleCommentLike = async (commentId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // 댓글 목록에서 해당 댓글 업데이트
        setComments(prev => prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: data.liked,
              upvotes: data.liked ? (comment.upvotes || 0) + 1 : Math.max(0, (comment.upvotes || 0) - 1)
            }
          }
          return comment
        }))
      }
    } catch (error) {
      console.error('Failed to like comment:', error)
    }
  }

  const handleCommentDislike = async (commentId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // 댓글 목록에서 해당 댓글 업데이트
        setComments(prev => prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isDisliked: data.disliked,
              downvotes: data.disliked ? (comment.downvotes || 0) + 1 : Math.max(0, (comment.downvotes || 0) - 1)
            }
          }
          return comment
        }))
      }
    } catch (error) {
      console.error('Failed to dislike comment:', error)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !commentNickname.trim() || !commentPassword.trim()) return
    
    // 비밀번호가 4자리 숫자인지 확인
    if (!/^\d{4}$/.test(commentPassword)) {
      alert('비밀번호는 4자리 숫자로 입력해주세요.')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          author: commentNickname,
          parentId: replyTo
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const newCommentObj: Comment = {
          id: data.comment.id,
          content: newComment,
          author: commentNickname,
          createdAt: new Date().toISOString(),
          likes: 0,
          dislikes: 0,
          upvotes: 0,
          downvotes: 0,
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
        setCommentNickname('')
        setCommentPassword('')
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

  const handleEdit = async () => {
    if (!password.trim()) {
      alert('비밀번호를 입력해주세요.')
      return
    }

    try {
      const response = await fetch(`/api/discussions/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          tags: selectedTags,
          marketTrend,
          password
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPost(data.post)
        setIsEditing(false)
        setShowEditModal(false)
        setPassword('')
        alert('글이 수정되었습니다.')
      } else {
        const errorData = await response.json()
        alert(errorData.error || '수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to edit post:', error)
      alert('수정 중 오류가 발생했습니다.')
    }
  }

  const handleDelete = async () => {
    if (!password.trim()) {
      alert('비밀번호를 입력해주세요.')
      return
    }

    if (!confirm('정말로 이 글을 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`/api/discussions/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        alert('글이 삭제되었습니다.')
        router.push('/forum')
      } else {
        const errorData = await response.json()
        alert(errorData.error || '삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('삭제 중 오류가 발생했습니다.')
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
              {/* 수정/삭제 버튼 */}
              <div className="flex items-center space-x-2 mb-4">
                <button
                  onClick={() => {
                    setEditTitle(post.title)
                    setEditContent(post.content)
                    setSelectedTags(post.tags || [])
                    setMarketTrend(post.marketTrend)
                    setShowEditModal(true)
                  }}
                  className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  수정
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </button>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Link
                  href="/forum"
                  className="inline-flex items-center px-3 py-2 bg-brand-accent/10 text-brand-accent text-sm font-medium rounded-lg hover:bg-brand-accent/20 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  목록으로
                </Link>
              </div>
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
                <span>공감 {post.upvotes}</span>
              </button>
              
              <button
                onClick={handleDislike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isDisliked
                    ? 'bg-red-500 text-white'
                    : 'bg-brand-surface text-brand-muted hover:bg-red-500 hover:text-white'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>비공감 {post.downvotes}</span>
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
              {/* 닉네임과 비밀번호 입력 (한 줄) */}
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">
                  작성자 정보 *
                </label>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={commentNickname}
                      onChange={(e) => setCommentNickname(e.target.value)}
                      placeholder="닉네임"
                      className="w-full p-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent"
                      required
                      maxLength={20}
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="password"
                      value={commentPassword}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                        setCommentPassword(value)
                      }}
                      placeholder="비밀번호"
                      className="w-full p-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent text-center"
                      required
                      maxLength={4}
                      pattern="[0-9]{4}"
                      title="4자리 숫자를 입력하세요"
                    />
                  </div>
                </div>
                <p className="text-xs text-brand-muted mt-1">닉네임과 4자리 숫자 비밀번호를 입력하세요 (댓글 수정/삭제 시 필요)</p>
              </div>
              
              {/* 댓글 내용 */}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 작성해주세요..."
                className="w-full p-4 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent resize-none"
                rows={3}
                disabled={submitting}
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim() || !commentNickname.trim() || !commentPassword.trim() || submitting}
                  className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? '작성 중...' : '댓글 작성'}
                </button>
              </div>
            </form>
          </div>
          
          {/* 댓글 정렬 옵션 */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-brand-ink">댓글 ({comments.length})</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-brand-muted">정렬:</span>
              <button
                onClick={() => setCommentSortBy('latest')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  commentSortBy === 'latest'
                    ? 'bg-brand-accent text-white'
                    : 'bg-brand-card text-brand-ink hover:bg-brand-surface'
                }`}
              >
                최신순
              </button>
              <button
                onClick={() => setCommentSortBy('popular')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  commentSortBy === 'popular'
                    ? 'bg-brand-accent text-white'
                    : 'bg-brand-card text-brand-ink hover:bg-brand-surface'
                }`}
              >
                공감순
              </button>
            </div>
          </div>
          
          {/* 댓글 목록 */}
          <div className="space-y-6">
            {sortComments(comments).map((comment) => (
              <div key={comment.id} className="border-b border-brand-border pb-6 last:border-b-0">
                {/* 메인 댓글 */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                    <span className="font-medium text-brand-ink">{comment.author}</span>
                    <span className="text-sm text-brand-muted">{getTimeAgo(comment.createdAt)}</span>
                  </div>
                  </div>
                  
                  <p className="text-brand-ink mb-3">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <button 
                      onClick={() => handleCommentLike(comment.id)}
                      className={`flex items-center space-x-1 transition-colors ${
                        comment.isLiked ? 'text-brand-accent' : 'text-brand-muted hover:text-brand-accent'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>공감 {comment.upvotes || 0}</span>
                    </button>
                    <button 
                      onClick={() => handleCommentDislike(comment.id)}
                      className={`flex items-center space-x-1 transition-colors ${
                        comment.isDisliked ? 'text-brand-accent' : 'text-brand-muted hover:text-brand-accent'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>비공감 {comment.downvotes || 0}</span>
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
                          <span className="font-medium text-brand-ink">{reply.author}</span>
                          <span className="text-sm text-brand-muted">{getTimeAgo(reply.createdAt)}</span>
                        </div>
                        <p className="text-brand-ink mb-2">{reply.content}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <button className="flex items-center space-x-1 text-brand-muted hover:text-brand-accent transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span>공감 {reply.upvotes || 0}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-brand-muted hover:text-brand-accent transition-colors">
                            <ThumbsDown className="w-4 h-4" />
                            <span>비공감 {reply.downvotes || 0}</span>
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

      {/* 수정 모달 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-2xl p-8 w-full max-w-4xl mx-4 mt-8 mb-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">글 수정</h3>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setPassword('')
                  setEditTitle('')
                  setEditContent('')
                  setSelectedTags([])
                  setMarketTrend(null)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* 닉네임 (고정 표시) */}
              <div className="pt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  닉네임
                </label>
                <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                  {post?.nickname || '익명'}
                </div>
                <p className="text-xs text-gray-500 mt-1">닉네임은 수정할 수 없습니다</p>
              </div>

              {/* 제목 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all"
                  placeholder="토론글의 제목을 입력하세요"
                  maxLength={100}
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-2 flex items-center">
                  <span className="bg-gray-100 px-2 py-1 rounded-full mr-2">{editTitle.length}/100</span>
                  명확하고 구체적인 제목을 작성하면 더 많은 분들이 참여할 수 있습니다
                </p>
              </div>

              {/* 시황 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  시황
                </label>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setMarketTrend('up')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                      marketTrend === 'up'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>상승</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarketTrend('down')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                      marketTrend === 'down'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-red-300'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                    <span>하락</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarketTrend(null)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                      marketTrend === null
                        ? 'border-gray-500 bg-gray-50 text-gray-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>중립</span>
                  </button>
                </div>
              </div>

              {/* 태그 선택 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  태그 선택
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.name}
                      type="button"
                      onClick={() => handleTagToggle(tag.name)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all text-sm ${
                        selectedTags.includes(tag.name)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {tag.icon}
                      <span>{tag.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 내용 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  내용 *
                </label>
                <textarea
                  required
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all resize-none"
                  placeholder="토론글의 내용을 자세히 작성해주세요..."
                  rows={8}
                  maxLength={2000}
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-2 flex items-center">
                  <span className="bg-gray-100 px-2 py-1 rounded-full mr-2">{editContent.length}/2000</span>
                  구체적인 사례나 경험을 포함하면 더 유용한 토론이 될 수 있습니다
                </p>
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  비밀번호 *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all"
                  placeholder="비밀번호를 입력하세요"
                  maxLength={20}
                />
                <p className="text-xs text-gray-500 mt-1">글 수정 시 필요합니다</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-10 pt-8 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setPassword('')
                  setEditTitle('')
                  setEditContent('')
                  setSelectedTags([])
                  setMarketTrend(null)
                }}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                취소
              </button>
              <button
                onClick={handleEdit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                수정 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">글 삭제</h3>
            <p className="text-gray-600 mb-4">정말로 이 글을 삭제하시겠습니까?</p>
            <div>
              <label className="block text-sm font-medium mb-2">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setPassword('')
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 