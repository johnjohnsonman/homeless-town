'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp, TrendingDown, Home, FileText, AlertTriangle, Users, Shield, Calculator, Scale } from 'lucide-react'

export default function NewDiscussionPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [marketTrend, setMarketTrend] = useState<'up' | 'down' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // 세입자들에게 필요한 실용적인 태그들
  const availableTags = [
    // 시황 관련 태그들 (상단에 배치)
    { name: '시황', icon: TrendingUp, color: 'bg-red-100 text-red-800 border-red-300' },
    { name: '부동산시장', icon: TrendingUp, color: 'bg-orange-100 text-orange-800 border-orange-300' },
    { name: '임대시장', icon: TrendingUp, color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    
    // 실용적 문제 해결 태그들
    { name: '분쟁사례', icon: AlertTriangle, color: 'bg-red-100 text-red-800 border-red-300' },
    { name: '보증금', icon: Calculator, color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { name: '월세인상', icon: TrendingUp, color: 'bg-orange-100 text-orange-800 border-orange-300' },
    { name: '계약해지', icon: FileText, color: 'bg-purple-100 text-purple-800 border-purple-300' },
    { name: '입주체크', icon: Home, color: 'bg-green-100 text-green-800 border-green-300' },
    { name: '집주인소통', icon: Users, color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    { name: '법적권리', icon: Scale, color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { name: '안전수칙', icon: Shield, color: 'bg-teal-100 text-teal-800 border-teal-300' },
    
    // 일반 부동산 태그들
    { name: '부동산', icon: Home, color: 'bg-pink-100 text-pink-800 border-pink-300' },
    { name: '투자', icon: TrendingUp, color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { name: '정책', icon: FileText, color: 'bg-cyan-100 text-cyan-800 border-cyan-300' }
  ]

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with:', { title, content, selectedTags, marketTrend })
    
    setLoading(true)
    setError('')

    try {
      const requestBody = {
        title,
        content,
        tags: selectedTags,
        marketTrend,
        nickname,
        password
      }
      
      console.log('Sending request to API:', requestBody)
      
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('API response status:', response.status)
      console.log('API response headers:', response.headers)

      const data = await response.json()
      console.log('API response data:', data)

      if (response.ok) {
        console.log('Discussion created successfully!')
        alert('토론글이 성공적으로 작성되었습니다!')
        router.push('/forum')
      } else {
        console.error('API error:', data)
        setError(data.error || '토론글 작성에 실패했습니다.')
      }
    } catch (error) {
      console.error('Network or other error:', error)
      setError('토론글 작성 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const getMarketTrendIcon = (trend: 'up' | 'down' | null) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />
    return null
  }

  const getMarketTrendText = (trend: 'up' | 'down' | null) => {
    if (trend === 'up') return '상승'
    if (trend === 'down') return '하락'
    return '중립'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">토론방으로 돌아가기</span>
            <span className="sm:hidden">뒤로</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">새 토론글 작성</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">무주택촌 커뮤니티에 새로운 토론을 시작하세요</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-white font-semibold text-lg">토론글 정보 입력</h2>
            <p className="text-blue-100 text-sm mt-1">제목과 내용을 작성하고 관련 태그를 선택해주세요</p>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all"
                placeholder="토론글의 제목을 입력하세요"
                maxLength={100}
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-2 flex items-center">
                <span className="bg-gray-100 px-2 py-1 rounded-full mr-2">{title.length}/100</span>
                명확하고 구체적인 제목을 작성하면 더 많은 분들이 참여할 수 있습니다
              </p>
            </div>

            {/* Nickname & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  닉네임 *
                </label>
                <input
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all"
                  placeholder="닉네임을 입력하세요"
                  maxLength={20}
                />
                <p className="text-xs text-gray-500 mt-1">글 수정/삭제 시 필요합니다</p>
              </div>
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
                <p className="text-xs text-gray-500 mt-1">글 수정/삭제 시 필요합니다</p>
              </div>
            </div>

            {/* Market Trend */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                시장 동향
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-green-300 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="marketTrend"
                    value="up"
                    checked={marketTrend === 'up'}
                    onChange={() => setMarketTrend('up')}
                    className="mr-3 text-green-600"
                  />
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-green-700 font-medium">상승</span>
                  </div>
                </label>
                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-red-300 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="marketTrend"
                    value="down"
                    checked={marketTrend === 'down'}
                    onChange={() => setMarketTrend('down')}
                    className="mr-3 text-red-600"
                  />
                  <div className="flex items-center">
                    <TrendingDown className="w-4 h-4 text-red-600 mr-2" />
                    <span className="text-red-700 font-medium">하락</span>
                  </div>
                </label>
                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="marketTrend"
                    value=""
                    checked={marketTrend === null}
                    onChange={() => setMarketTrend(null)}
                    className="mr-3 text-gray-600"
                  />
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-0 border-b-0 border-l-0 border-r-0 transform rotate-45 mr-2"></div>
                    <span className="text-gray-700 font-medium">중립</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                내용 *
              </label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-sm sm:text-base transition-all"
                placeholder="토론하고 싶은 내용을 자세히 작성해주세요. 경험담, 궁금한 점, 의견 등을 자유롭게 표현하세요."
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                구체적인 상황 설명과 함께 질문이나 의견을 남겨주시면 더 좋은 답변을 받을 수 있습니다
              </p>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                태그 선택 (최대 3개)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableTags.map((tag) => {
                  const Icon = tag.icon
                  const isSelected = selectedTags.includes(tag.name)
                  return (
                    <button
                      key={tag.name}
                      type="button"
                      onClick={() => handleTagToggle(tag.name)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-left hover:scale-105 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className={`text-sm font-medium ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>
                          {tag.name}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>선택된 태그:</strong> {selectedTags.length > 0 ? selectedTags.join(', ') : '없음'}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  관련된 태그를 선택하면 더 많은 분들이 찾을 수 있습니다
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !title.trim() || !content.trim()}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium shadow-sm hover:shadow-md"
              >
                {loading ? '작성 중...' : '토론글 작성'}
              </button>
            </div>
          </div>
        </form>

        {/* Cancel Button - Form 아래에 배치 */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            작성 취소하고 토론방으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}
