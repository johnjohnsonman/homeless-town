'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { 
  ArrowLeft, 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  Calendar,
  User,
  Tag,
  Send,
  Heart,
  Edit,
  Trash2,
  X,
  Check
} from 'lucide-react'

export default function DiscussionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [discussion, setDiscussion] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [liked, setLiked] = useState(false)
  const [editingComment, setEditingComment] = useState(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchDiscussionDetail()
    }
  }, [params.id])

  const fetchDiscussionDetail = async () => {
    try {
      // 토론글 상세 정보 가져오기
      const discussionResponse = await fetch(`/api/discussions/${params.id}`)
      if (discussionResponse.ok) {
        const discussionData = await discussionResponse.json()
        setDiscussion(discussionData)
      }

      // 댓글 목록 가져오기
      const commentsResponse = await fetch(`/api/discussions/${params.id}/comments`)
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json()
        setComments(commentsData)
      }
    } catch (error) {
      console.error('Error fetching discussion detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!discussion) return
    
    try {
      const response = await fetch(`/api/discussions/${discussion.id}/like`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setLiked(!liked)
        setDiscussion(prev => ({
          ...prev,
          likes: liked ? prev.likes - 1 : prev.likes + 1
        }))
      }
    } catch (error) {
      console.error('Error liking discussion:', error)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !discussion) return

    try {
      const response = await fetch(`/api/discussions/${discussion.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          authorId: '2' // 임시로 고정된 사용자 ID 사용
        })
      })

      if (response.ok) {
        const newCommentData = await response.json()
        setComments([newCommentData, ...comments])
        setDiscussion(prev => ({
          ...prev,
          comments: prev.comments + 1
        }))
        setNewComment('')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      alert('댓글 작성 중 오류가 발생했습니다.')
    }
  }

  const handleEditComment = (comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return

    try {
      const response = await fetch(`/api/discussions/${discussion.id}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent,
          authorId: '2' // 임시로 고정된 사용자 ID 사용
        })
      })

      if (response.ok) {
        const updatedComment = await response.json()
        setComments(comments.map(c => c.id === commentId ? updatedComment : c))
        setEditingComment(null)
        setEditContent('')
      } else {
        const error = await response.json()
        alert(error.error || '댓글 수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error updating comment:', error)
      alert('댓글 수정 중 오류가 발생했습니다.')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/discussions/${discussion.id}/comments/${commentId}?authorId=2`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setComments(comments.filter(c => c.id !== commentId))
        setDiscussion(prev => ({
          ...prev,
          comments: Math.max(0, prev.comments - 1)
        }))
        if (editingComment === commentId) {
          setEditingComment(null)
          setEditContent('')
        }
      } else {
        const error = await response.json()
        alert(error.error || '댓글 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('댓글 삭제 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">로딩 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!discussion) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">토론글을 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-6">요청하신 토론글이 존재하지 않거나 삭제되었습니다.</p>
            <button
              onClick={() => router.push('/discussions')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              토론방으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/discussions')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>토론방으로 돌아가기</span>
        </button>

        {/* Discussion Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                {discussion.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{discussion.title}</h1>
            
            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-gray-500 border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {discussion.authorName}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(discussion.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {discussion.views}
                </span>
                <button
                  onClick={handleLike}
                  className={`flex items-center transition-colors ${
                    liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                  {discussion.likes}
                </button>
                <span className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {discussion.comments}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {discussion.content}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            댓글 ({comments.length})
          </h3>

          {/* Comment Form */}
          <div className="mb-8">
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>댓글 작성</span>
                </button>
              </div>
            </form>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
              </div>
                         ) : (
               comments.map((comment) => (
                 <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                   <div className="flex items-start space-x-3">
                     <div className="flex-1">
                       <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center space-x-2">
                           <span className="font-medium text-gray-900">{comment.authorName}</span>
                           <span className="text-sm text-gray-500">
                             {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                               year: 'numeric',
                               month: 'long',
                               day: 'numeric',
                               hour: '2-digit',
                               minute: '2-digit'
                             })}
                           </span>
                           {comment.updatedAt && (
                             <span className="text-xs text-gray-400">(수정됨)</span>
                           )}
                         </div>
                         
                         {/* 댓글 작성자만 수정/삭제 버튼 표시 */}
                         {comment.authorId === '2' && (
                           <div className="flex items-center space-x-2">
                             {editingComment === comment.id ? (
                               <>
                                 <button
                                   onClick={() => handleUpdateComment(comment.id)}
                                   className="text-green-600 hover:text-green-800 p-1"
                                   title="저장"
                                 >
                                   <Check className="w-4 h-4" />
                                 </button>
                                 <button
                                   onClick={() => {
                                     setEditingComment(null)
                                     setEditContent('')
                                   }}
                                   className="text-gray-600 hover:text-gray-800 p-1"
                                   title="취소"
                                 >
                                   <X className="w-4 h-4" />
                                 </button>
                               </>
                             ) : (
                               <>
                                 <button
                                   onClick={() => handleEditComment(comment)}
                                   className="text-blue-600 hover:text-blue-800 p-1"
                                   title="수정"
                                 >
                                   <Edit className="w-4 h-4" />
                                 </button>
                                 <button
                                   onClick={() => handleDeleteComment(comment.id)}
                                   className="text-red-600 hover:text-red-800 p-1"
                                   title="삭제"
                                 >
                                   <Trash2 className="w-4 h-4" />
                                 </button>
                               </>
                             )}
                           </div>
                         )}
                       </div>
                       
                       {editingComment === comment.id ? (
                         <div className="space-y-2">
                           <textarea
                             value={editContent}
                             onChange={(e) => setEditContent(e.target.value)}
                             rows={3}
                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                           />
                         </div>
                       ) : (
                         <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                       )}
                     </div>
                   </div>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>
    </div>
  )
} 