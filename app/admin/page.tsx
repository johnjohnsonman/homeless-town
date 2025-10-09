'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Users, 
  Home, 
  MessageCircle, 
  Download, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  LogOut,
  X,
  BookOpen
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [discussions, setDiscussions] = useState([])
  const [guides, setGuides] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [showCreateGuideModal, setShowCreateGuideModal] = useState(false)
  const [createUserForm, setCreateUserForm] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'user'
  })
  const [createUserLoading, setCreateUserLoading] = useState(false)
  const [createUserError, setCreateUserError] = useState('')
  const [createGuideForm, setCreateGuideForm] = useState({
    title: '',
    category: 'basics',
    difficulty: '초급',
    readTime: '5분',
    summary: '',
    content: '',
    tags: '',
    isNew: false
  })
  const [createGuideLoading, setCreateGuideLoading] = useState(false)
  const [createGuideError, setCreateGuideError] = useState('')
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()

  // 인증 확인
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    fetchData()
  }, [isAuthenticated, user, router])

  // 통계 데이터 (API에서 가져온 데이터 사용)
  const displayStats = stats || {
    overview: {
      totalUsers: users.length,
      totalPosts: posts.length,
      totalDiscussions: discussions.length,
      totalGuides: guides.length,
      totalComments: 0,
      totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0),
      totalUpvotes: posts.reduce((sum, p) => sum + (p.upvotes || 0), 0)
    },
    posts: {
      active: posts.filter(p => p.status === 'active').length,
      urgent: posts.filter(p => p.urgent).length,
      verified: posts.filter(p => p.verified).length,
      adminPick: posts.filter(p => p.adminPick).length
    },
    discussions: {
      hot: discussions.filter(d => d.isHot).length,
      popular: discussions.filter(d => d.isPopular).length,
      new: discussions.filter(d => d.isNew).length
    }
  }

  const fetchData = async () => {
    try {
      // 통계 데이터와 기본 데이터를 함께 가져오기
      const [usersRes, postsRes, discussionsRes, guidesRes, statsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/housing-posts'),
        fetch('/api/discussions'),
        fetch('/api/contract-guides'),
        fetch('/api/admin/stats')
      ])
      
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData.users || [])
      }
      if (postsRes.ok) {
        const postsData = await postsRes.json()
        setPosts(postsData.posts || [])
      }
      if (discussionsRes.ok) {
        const discussionsData = await discussionsRes.json()
        setDiscussions(discussionsData.discussions || [])
      }
      if (guidesRes.ok) {
        const guidesData = await guidesRes.json()
        setGuides(guidesData.guides || [])
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData.stats)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`/api/housing-posts/${postId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setPosts(posts.filter(p => p.id !== postId))
        }
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
  }

  const handleDeleteDiscussion = async (discussionId) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`/api/discussions/${discussionId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setDiscussions(discussions.filter(d => d.id !== discussionId))
        }
      } catch (error) {
        console.error('Error deleting discussion:', error)
      }
    }
  }

  const handleDeleteUser = async (userId) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setUsers(users.filter(u => u.id !== userId))
        }
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const handleDeleteGuide = async (guideId) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`/api/contract-guides/${guideId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setGuides(guides.filter(g => g.id !== guideId))
        }
      } catch (error) {
        console.error('Error deleting guide:', error)
      }
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setCreateUserLoading(true)
    setCreateUserError('')

    try {
      console.log('Creating user with data:', createUserForm)
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createUserForm)
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (response.ok) {
        // 새 사용자 추가
        setUsers([data.user, ...users])
        setShowCreateUserModal(false)
        setCreateUserForm({
          username: '',
          password: '',
          name: '',
          email: '',
          role: 'user'
        })
      } else {
        setCreateUserError(data.error || '사용자 생성에 실패했습니다.')
      }
    } catch (error) {
      console.error('Create user error details:', error)
      setCreateUserError('사용자 생성 중 오류가 발생했습니다.')
    } finally {
      setCreateUserLoading(false)
    }
  }

  const handleCreateGuide = async (e) => {
    e.preventDefault()
    setCreateGuideLoading(true)
    setCreateGuideError('')

    try {
      const tagsArray = createGuideForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      const response = await fetch('/api/contract-guides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...createGuideForm,
          tags: tagsArray
        })
      })

      const data = await response.json()

      if (response.ok) {
        setGuides([data.guide, ...guides])
        setShowCreateGuideModal(false)
        setCreateGuideForm({
          title: '',
          category: 'basics',
          difficulty: '초급',
          readTime: '5분',
          summary: '',
          content: '',
          tags: '',
          isNew: false
        })
      } else {
        setCreateGuideError(data.error || '가이드 생성에 실패했습니다.')
      }
    } catch (error) {
      console.error('Create guide error:', error)
      setCreateGuideError('가이드 생성 중 오류가 발생했습니다.')
    } finally {
      setCreateGuideLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">무주택촌 관리자</h1>
              <p className="text-sm text-gray-600">서비스 관리 및 모니터링</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {user?.name}님 환영합니다
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: '개요', icon: TrendingUp },
              { id: 'users', label: '사용자', icon: Users },
              { id: 'posts', label: '게시글', icon: Home },
              { id: 'discussions', label: '토론', icon: MessageCircle },
              { id: 'guides', label: '계약가이드', icon: BookOpen },
              { id: 'settings', label: '설정', icon: AlertCircle },
              { id: 'resources', label: '자료실', icon: Download }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">총 사용자</p>
                    <p className="text-2xl font-bold text-gray-900">{displayStats.overview.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Home className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">활성 게시글</p>
                    <p className="text-2xl font-bold text-gray-900">{displayStats.posts.active}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">토론글</p>
                    <p className="text-2xl font-bold text-gray-900">{displayStats.overview.totalDiscussions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">계약 가이드</p>
                    <p className="text-2xl font-bold text-gray-900">{displayStats.overview.totalGuides}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
              <div className="space-y-3">
                {stats?.recentActivity?.posts?.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        새로운 {activity.type === 'discussion' ? '토론글' : '게시글'}이 등록되었습니다: {activity.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )) || (
                  <div className="text-center text-gray-500 py-4">
                    최근 활동이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">사용자 관리</h3>
              <button 
                onClick={() => setShowCreateUserModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                새 사용자
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용자</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">역할</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">{user.name?.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isActive ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            활성
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            비활성
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <Edit className="w-4 h-4 inline" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">게시글 관리</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="게시글 검색..."
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  <Search className="w-4 h-4 inline mr-2" />
                  검색
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{post.title}</h4>
                      {post.urgent && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-semibold">
                          긴급
                        </span>
                      )}
                      {post.verified && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                          인증
                        </span>
                      )}
                      {post.adminPick && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
                          관리자선택
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{post.content?.substring(0, 150)}...</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>조회수: {post.views || 0}</span>
                      <span>작성자: {post.nickname || post.author || '익명'}</span>
                      <span>추천: {post.upvotes || 0}</span>
                      <span>비추천: {post.downvotes || 0}</span>
                      <span>댓글: {post.commentCount || 0}</span>
                      <span>작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => window.open(`/housing-board`, '_blank')}
                      className="text-blue-600 hover:text-blue-900 p-2"
                      title="새 탭에서 보기"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 p-2" title="수정">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-900 p-2"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discussions Tab */}
        {activeTab === 'discussions' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">토론 관리</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="토론 검색..."
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  <Search className="w-4 h-4 inline mr-2" />
                  검색
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <div key={discussion.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{discussion.title}</h4>
                      {discussion.isHot && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-semibold">
                          HOT
                        </span>
                      )}
                      {discussion.isNew && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                          NEW
                        </span>
                      )}
                      {discussion.isPopular && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
                          인기
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{discussion.content?.substring(0, 150)}...</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>조회수: {discussion.views || 0}</span>
                      <span>작성자: {discussion.nickname || discussion.author || '익명'}</span>
                      <span>추천: {discussion.upvotes || 0}</span>
                      <span>비추천: {discussion.downvotes || 0}</span>
                      <span>댓글: {discussion.commentCount || 0}</span>
                      <span>작성일: {new Date(discussion.createdAt).toLocaleDateString()}</span>
                    </div>
                    {discussion.tags && discussion.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {discussion.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => window.open(`/discussions/${discussion.id}`, '_blank')}
                      className="text-blue-600 hover:text-blue-900 p-2"
                      title="새 탭에서 보기"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 p-2" title="수정">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteDiscussion(discussion.id)}
                      className="text-red-600 hover:text-red-900 p-2"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guides Tab */}
        {activeTab === 'guides' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">계약 가이드 관리</h3>
              <button 
                onClick={() => setShowCreateGuideModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                새 가이드
              </button>
            </div>
            <div className="space-y-4">
              {guides.map((guide) => (
                <div key={guide.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{guide.title}</h4>
                      {guide.isNew && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{guide.summary}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>카테고리: {guide.category}</span>
                      <span>난이도: {guide.difficulty}</span>
                      <span>읽기시간: {guide.readTime}</span>
                      <span>다운로드: {guide.downloads}</span>
                      <span>평점: {guide.rating}/5</span>
                    </div>
                    {guide.tags && guide.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {guide.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 p-2">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 p-2">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteGuide(guide.id)}
                      className="text-red-600 hover:text-red-900 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">시스템 설정</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 일반 설정 */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-800 border-b pb-2">일반 설정</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      사이트 제목
                    </label>
                    <input
                      type="text"
                      defaultValue="무주택촌"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      사이트 설명
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="임차인들을 위한 따뜻하고 지원적인 커뮤니티입니다"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      최대 파일 업로드 크기 (MB)
                    </label>
                    <input
                      type="number"
                      defaultValue="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 보안 설정 */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-800 border-b pb-2">보안 설정</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      세션 만료 시간 (분)
                    </label>
                    <input
                      type="number"
                      defaultValue="60"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      최대 로그인 시도 횟수
                    </label>
                    <input
                      type="number"
                      defaultValue="5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableRegistration"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enableRegistration" className="ml-2 block text-sm text-gray-700">
                      신규 사용자 가입 허용
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireEmailVerification"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="requireEmailVerification" className="ml-2 block text-sm text-gray-700">
                      이메일 인증 필수
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  설정 저장
                </button>
              </div>
            </div>

            {/* 알림 설정 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">알림 설정</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-800 border-b pb-2">이메일 알림</h4>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailNewPosts"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="emailNewPosts" className="ml-2 block text-sm text-gray-700">
                      새 게시글 알림
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailNewComments"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="emailNewComments" className="ml-2 block text-sm text-gray-700">
                      새 댓글 알림
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailSystemUpdates"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="emailSystemUpdates" className="ml-2 block text-sm text-gray-700">
                      시스템 업데이트 알림
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-800 border-b pb-2">푸시 알림</h4>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="pushUrgentPosts"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="pushUrgentPosts" className="ml-2 block text-sm text-gray-700">
                      긴급 게시글 알림
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="pushAdminAnnouncements"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="pushAdminAnnouncements" className="ml-2 block text-sm text-gray-700">
                      관리자 공지사항 알림
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  알림 설정 저장
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">자료실 관리</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 inline mr-2" />
                새 자료
              </button>
            </div>
            <div className="text-center py-12">
              <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">자료실 관리 기능은 준비 중입니다.</p>
            </div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">새 사용자 생성</h3>
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              {createUserError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {createUserError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  사용자명 *
                </label>
                <input
                  type="text"
                  required
                  value={createUserForm.username}
                  onChange={(e) => setCreateUserForm({...createUserForm, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="사용자명을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 *
                </label>
                <input
                  type="password"
                  required
                  value={createUserForm.password}
                  onChange={(e) => setCreateUserForm({...createUserForm, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이름 *
                </label>
                <input
                  type="text"
                  required
                  value={createUserForm.name}
                  onChange={(e) => setCreateUserForm({...createUserForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="이름을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  value={createUserForm.email}
                  onChange={(e) => setCreateUserForm({...createUserForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="이메일을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  역할
                </label>
                <select
                  value={createUserForm.role}
                  onChange={(e) => setCreateUserForm({...createUserForm, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">일반 사용자</option>
                  <option value="admin">관리자</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={createUserLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {createUserLoading ? '생성 중...' : '생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Guide Modal */}
      {showCreateGuideModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">새 계약 가이드 생성</h3>
              <button
                onClick={() => setShowCreateGuideModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateGuide} className="space-y-4">
              {createGuideError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {createGuideError}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목 *
                  </label>
                  <input
                    type="text"
                    required
                    value={createGuideForm.title}
                    onChange={(e) => setCreateGuideForm({...createGuideForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="가이드 제목을 입력하세요"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    카테고리 *
                  </label>
                  <select
                    required
                    value={createGuideForm.category}
                    onChange={(e) => setCreateGuideForm({...createGuideForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="basics">기본 지식</option>
                    <option value="documents">계약서</option>
                    <option value="deposit">보증금</option>
                    <option value="rights">권리 보호</option>
                    <option value="disputes">분쟁 해결</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    난이도 *
                  </label>
                  <select
                    required
                    value={createGuideForm.difficulty}
                    onChange={(e) => setCreateGuideForm({...createGuideForm, difficulty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="초급">초급</option>
                    <option value="중급">중급</option>
                    <option value="고급">고급</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    읽기시간 *
                  </label>
                  <input
                    type="text"
                    required
                    value={createGuideForm.readTime}
                    onChange={(e) => setCreateGuideForm({...createGuideForm, readTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 5분"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  요약 *
                </label>
                <textarea
                  required
                  rows={3}
                  value={createGuideForm.summary}
                  onChange={(e) => setCreateGuideForm({...createGuideForm, summary: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="가이드 요약을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  내용 *
                </label>
                <textarea
                  required
                  rows={8}
                  value={createGuideForm.content}
                  onChange={(e) => setCreateGuideForm({...createGuideForm, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="가이드 내용을 입력하세요 (마크다운 형식 지원)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  태그
                </label>
                <input
                  type="text"
                  value={createGuideForm.tags}
                  onChange={(e) => setCreateGuideForm({...createGuideForm, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 계약서, 작성법, 필수항목)"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isNew"
                  checked={createGuideForm.isNew}
                  onChange={(e) => setCreateGuideForm({...createGuideForm, isNew: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isNew" className="ml-2 block text-sm text-gray-700">
                  새 가이드로 표시
                </label>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateGuideModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={createGuideLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {createGuideLoading ? '생성 중...' : '생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 