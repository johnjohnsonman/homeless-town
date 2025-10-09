'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Globe, 
  Calendar,
  MessageCircle,
  Heart,
  Bookmark,
  Settings,
  Edit,
  Bell,
  BellOff,
  Share2,
  ExternalLink,
  Upload,
  Camera
} from 'lucide-react'

interface UserProfile {
  id: string
  username: string
  email?: string
  name: string
  avatar?: string
  bio?: string
  location?: string
  phone?: string
  website?: string
  joinDate: string
  lastSeen: string
  totalLikes: number
  totalDislikes: number
  totalPosts: number
  totalComments: number
  profile?: {
    bio?: string
    avatar?: string
    location?: string
    phone?: string
    website?: string
    socialLinks?: any
    preferences?: any
  }
  posts: Array<{
    id: string
    title: string
    slug: string
    type: string
    createdAt: string
    upvotes: number
    views: number
    commentCount: number
  }>
  bookmarks: Array<{
    id: string
    createdAt: string
    post: {
      id: string
      title: string
      slug: string
      type: string
      createdAt: string
      upvotes: number
      views: number
      commentCount: number
    }
  }>
  _count: {
    posts: number
    bookmarks: number
  }
}

export default function MyPage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentUser, isAuthenticated } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('posts')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAvatarUpload, setShowAvatarUpload] = useState(false)
  const [editForm, setEditForm] = useState({
    bio: '',
    location: '',
    phone: '',
    website: '',
    socialLinks: {
      twitter: '',
      instagram: '',
      facebook: '',
      linkedin: ''
    }
  })

  const userId = params.userId as string || currentUser?.id

  useEffect(() => {
    if (!isAuthenticated && !params.userId) {
      router.push('/login')
      return
    }

    fetchUserProfile()
  }, [userId, isAuthenticated, router])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/profile`)
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data.user)
        
        // 편집 폼 초기화
        if (data.user.profile) {
          setEditForm({
            bio: data.user.profile.bio || '',
            location: data.user.profile.location || '',
            phone: data.user.profile.phone || '',
            website: data.user.profile.website || '',
            socialLinks: data.user.profile.socialLinks || {
              twitter: '',
              instagram: '',
              facebook: '',
              linkedin: ''
            }
          })
        }
      }
    } catch (error) {
      console.error('프로필 가져오기 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`/api/users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        setShowEditModal(false)
        fetchUserProfile() // 프로필 다시 가져오기
      }
    } catch (error) {
      console.error('프로필 수정 실패:', error)
    }
  }

  const handleBookmarkToggle = async (postId: string) => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser?.id,
          postId
        })
      })

      if (response.ok) {
        fetchUserProfile() // 프로필 다시 가져오기
      }
    } catch (error) {
      console.error('북마크 처리 실패:', error)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'image')
      if (currentUser?.id) formData.append('userId', currentUser.id)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        const uploadedFile = data.file

        // 프로필에 아바타 URL 업데이트
        const updateResponse = await fetch(`/api/users/${userId}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...editForm,
            avatar: uploadedFile.url
          })
        })

        if (updateResponse.ok) {
          setShowAvatarUpload(false)
          fetchUserProfile() // 프로필 다시 가져오기
        }
      }
    } catch (error) {
      console.error('아바타 업로드 실패:', error)
      alert('아바타 업로드에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto"></div>
          <p className="mt-4 text-brand-ink">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-ink">사용자를 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === userProfile.id

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <div className="bg-brand-card border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start space-x-6">
            {/* 프로필 이미지 */}
            <div className="flex-shrink-0 relative group">
              <div className="w-24 h-24 bg-brand-accent rounded-full flex items-center justify-center">
                {userProfile.profile?.avatar ? (
                  <img 
                    src={userProfile.profile.avatar} 
                    alt={userProfile.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-brand-gold" />
                )}
              </div>
              
              {isOwnProfile && (
                <button
                  onClick={() => setShowAvatarUpload(true)}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-brand-accent text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-brand-accent/90"
                  title="프로필 이미지 변경"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 프로필 정보 */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-brand-ink">{userProfile.name}</h1>
                  <p className="text-brand-text">@{userProfile.username}</p>
                </div>
                
                {isOwnProfile && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>프로필 수정</span>
                  </button>
                )}
              </div>

              {userProfile.profile?.bio && (
                <p className="mt-3 text-brand-text">{userProfile.profile.bio}</p>
              )}

              {/* 연락처 정보 */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-brand-text">
                {userProfile.profile?.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{userProfile.profile.location}</span>
                  </div>
                )}
                {userProfile.profile?.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{userProfile.profile.phone}</span>
                  </div>
                )}
                {userProfile.profile?.website && (
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <a 
                      href={userProfile.profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-brand-accent"
                    >
                      웹사이트
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(userProfile.joinDate).toLocaleDateString()} 가입</span>
                </div>
              </div>

              {/* 통계 */}
              <div className="mt-6 flex space-x-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-brand-ink">{userProfile._count.posts}</div>
                  <div className="text-sm text-brand-text">게시글</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-brand-ink">{userProfile.totalComments}</div>
                  <div className="text-sm text-brand-text">댓글</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-brand-ink">{userProfile.totalLikes}</div>
                  <div className="text-sm text-brand-text">받은 좋아요</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-brand-ink">{userProfile._count.bookmarks}</div>
                  <div className="text-sm text-brand-text">북마크</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex space-x-8 border-b border-brand-border">
          {[
            { id: 'posts', label: '게시글', icon: MessageCircle },
            { id: 'bookmarks', label: '북마크', icon: Bookmark }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-accent text-brand-accent'
                    : 'border-transparent text-brand-text hover:text-brand-ink'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* 탭 내용 */}
        <div className="py-8">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {userProfile.posts.map((post) => (
                <div key={post.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-brand-ink mb-2">
                        <a 
                          href={`/${post.type === 'discussion' ? 'discussions' : 'housing-board'}/${post.slug}`}
                          className="hover:text-brand-accent"
                        >
                          {post.title}
                        </a>
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-brand-text">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>조회 {post.views}</span>
                        <span>추천 {post.upvotes}</span>
                        <span>댓글 {post.commentCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBookmarkToggle(post.id)}
                        className="p-2 text-brand-text hover:text-brand-accent"
                        title="북마크"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.open(`/${post.type === 'discussion' ? 'discussions' : 'housing-board'}/${post.slug}`, '_blank')}
                        className="p-2 text-brand-text hover:text-brand-accent"
                        title="새 탭에서 보기"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="space-y-4">
              {userProfile.bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-brand-ink mb-2">
                        <a 
                          href={`/${bookmark.post.type === 'discussion' ? 'discussions' : 'housing-board'}/${bookmark.post.slug}`}
                          className="hover:text-brand-accent"
                        >
                          {bookmark.post.title}
                        </a>
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-brand-text">
                        <span>{new Date(bookmark.post.createdAt).toLocaleDateString()}</span>
                        <span>조회 {bookmark.post.views}</span>
                        <span>추천 {bookmark.post.upvotes}</span>
                        <span>댓글 {bookmark.post.commentCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBookmarkToggle(bookmark.post.id)}
                        className="p-2 text-brand-accent"
                        title="북마크 해제"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        onClick={() => window.open(`/${bookmark.post.type === 'discussion' ? 'discussions' : 'housing-board'}/${bookmark.post.slug}`, '_blank')}
                        className="p-2 text-brand-text hover:text-brand-accent"
                        title="새 탭에서 보기"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 프로필 수정 모달 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-brand-card rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-brand-ink">프로필 수정</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-brand-text hover:text-brand-ink"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleEditProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">
                  자기소개
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-brand-bg text-brand-ink"
                  placeholder="자기소개를 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">
                  거주 지역
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-brand-bg text-brand-ink"
                  placeholder="거주 지역을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">
                  연락처
                </label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-brand-bg text-brand-ink"
                  placeholder="연락처를 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">
                  웹사이트
                </label>
                <input
                  type="url"
                  value={editForm.website}
                  onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                  className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-brand-bg text-brand-ink"
                  placeholder="웹사이트 URL을 입력하세요"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-brand-border text-brand-text rounded-lg hover:bg-brand-bg transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/90 transition-colors"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 아바타 업로드 모달 */}
      {showAvatarUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-brand-card rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-brand-ink">프로필 이미지 변경</h3>
              <button
                onClick={() => setShowAvatarUpload(false)}
                className="text-brand-text hover:text-brand-ink"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-32 h-32 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  {userProfile.profile?.avatar ? (
                    <img 
                      src={userProfile.profile.avatar} 
                      alt={userProfile.name}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-brand-gold" />
                  )}
                </div>
                <p className="text-sm text-brand-text">새로운 프로필 이미지를 선택하세요</p>
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleAvatarUpload(file)
                  }
                }}
                className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-brand-bg text-brand-ink"
              />
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAvatarUpload(false)}
                  className="flex-1 px-4 py-2 border border-brand-border text-brand-text rounded-lg hover:bg-brand-bg transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
