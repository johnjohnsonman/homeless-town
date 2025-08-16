'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '../../components/Navigation'
import { Plus, Search, Filter, MapPin, Home, Users, Calendar, Clock, Star, MessageSquare, Eye } from 'lucide-react'

export default function HousingBoardPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  // 샘플 데이터
  const housingPosts = [
    {
      id: 1,
      title: "강남역 근처 원룸 구합니다",
      content: "강남역 10분 거리에 위치한 원룸을 구하고 있습니다. 월세 80만원 이하, 보증금 500만원 이하로 구합니다.",
      author: "구인자A",
      authorRating: 4.8,
      location: "강남구",
      type: "원룸",
      budget: "월 80만원",
      deposit: "500만원",
      size: "15평",
      floor: "3층",
      createdAt: "2024-01-15",
      views: 156,
      comments: 8,
      urgent: true,
      verified: true
    },
    {
      id: 2,
      title: "홍대입구역 1인가구 월세",
      content: "홍대입구역 근처 1인가구용 원룸을 구합니다. 깔끔하고 조용한 곳을 원합니다.",
      author: "구인자B",
      authorRating: 4.6,
      location: "마포구",
      type: "원룸",
      budget: "월 60만원",
      deposit: "300만원",
      size: "12평",
      floor: "2층",
      createdAt: "2024-01-14",
      views: 89,
      comments: 5,
      urgent: false,
      verified: true
    },
    {
      id: 3,
      title: "송파구 2룸 전세 구합니다",
      content: "송파구 2룸 전세를 구합니다. 가족이 살 수 있는 넓은 공간을 원합니다.",
      author: "구인자C",
      authorRating: 4.9,
      location: "송파구",
      type: "투룸",
      budget: "전세",
      deposit: "1억원",
      size: "25평",
      floor: "5층",
      createdAt: "2024-01-13",
      views: 234,
      comments: 12,
      urgent: false,
      verified: false
    },
    {
      id: 4,
      title: "분당구 신축 아파트 월세",
      content: "분당구 신축 아파트 월세를 구합니다. 깨끗하고 현대적인 시설을 원합니다.",
      author: "구인자D",
      authorRating: 4.7,
      location: "분당구",
      type: "아파트",
      budget: "월 120만원",
      deposit: "800만원",
      size: "30평",
      floor: "15층",
      createdAt: "2024-01-12",
      views: 167,
      comments: 9,
      urgent: true,
      verified: true
    },
    {
      id: 5,
      title: "잠실역 근처 오피스텔",
      content: "잠실역 근처 오피스텔을 구합니다. 비즈니스용으로 사용할 예정입니다.",
      author: "구인자E",
      authorRating: 4.5,
      location: "송파구",
      type: "오피스텔",
      budget: "월 150만원",
      deposit: "1000만원",
      size: "35평",
      floor: "8층",
      createdAt: "2024-01-11",
      views: 98,
      comments: 6,
      urgent: false,
      verified: false
    },
    {
      id: 6,
      title: "마포구 원룸 긴급 구합니다",
      content: "마포구 원룸을 긴급하게 구합니다. 이번 주 내에 입주 가능한 곳을 원합니다.",
      author: "구인자F",
      authorRating: 4.3,
      location: "마포구",
      type: "원룸",
      budget: "월 70만원",
      deposit: "400만원",
      size: "13평",
      floor: "1층",
      createdAt: "2024-01-10",
      views: 312,
      comments: 15,
      urgent: true,
      verified: true
    },
    {
      id: 7,
      title: "강북구 투룸 월세",
      content: "강북구 투룸 월세를 구합니다. 2인 가구가 살 수 있는 공간을 원합니다.",
      author: "구인자G",
      authorRating: 4.8,
      location: "강북구",
      type: "투룸",
      budget: "월 90만원",
      deposit: "600만원",
      size: "20평",
      floor: "4층",
      createdAt: "2024-01-09",
      views: 145,
      comments: 8,
      urgent: false,
      verified: true
    },
    {
      id: 8,
      title: "영등포구 원룸 구합니다",
      content: "영등포구 원룸을 구합니다. 직장이 가까운 곳을 원합니다.",
      author: "구인자H",
      authorRating: 4.4,
      location: "영등포구",
      type: "원룸",
      budget: "월 75만원",
      deposit: "450만원",
      size: "14평",
      floor: "6층",
      createdAt: "2024-01-08",
      views: 78,
      comments: 4,
      urgent: false,
      verified: false
    },
    {
      id: 9,
      title: "서초구 아파트 전세",
      content: "서초구 아파트 전세를 구합니다. 좋은 학군을 원합니다.",
      author: "구인자I",
      authorRating: 4.9,
      location: "서초구",
      type: "아파트",
      budget: "전세",
      deposit: "1.2억원",
      size: "28평",
      floor: "12층",
      createdAt: "2024-01-07",
      views: 289,
      comments: 18,
      urgent: false,
      verified: true
    },
    {
      id: 10,
      title: "노원구 원룸 긴급",
      content: "노원구 원룸을 긴급하게 구합니다. 이번 달 내에 입주 가능한 곳을 원합니다.",
      author: "구인자J",
      authorRating: 4.2,
      location: "노원구",
      type: "원룸",
      budget: "월 65만원",
      deposit: "350만원",
      size: "11평",
      floor: "3층",
      createdAt: "2024-01-06",
      views: 201,
      comments: 11,
      urgent: true,
      verified: false
    }
  ]

  const locations = ['전체', '강남구', '마포구', '송파구', '분당구', '강북구', '영등포구', '서초구', '노원구']
  const types = ['전체', '원룸', '투룸', '아파트', '오피스텔']

  // 필터링된 게시글
  const filteredPosts = housingPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || post.type === selectedType
    const matchesLocation = selectedLocation === 'all' || post.location === selectedLocation
    
    return matchesSearch && matchesType && matchesLocation
  })

  // 페이지네이션
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return '방금 전'
    if (diffInHours < 24) return `${diffInHours}시간 전`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}일 전`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navigation />
      
      {/* Header */}
      <div className="bg-brand-card border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brand-ink">주거 게시판</h1>
              <p className="text-brand-muted mt-1">임차인들의 주거 요구사항을 확인하고 매칭해보세요</p>
            </div>
            <Link
              href="/housing-board/new"
              className="bg-brand-accent text-white px-6 py-3 rounded-xl hover:bg-brand-accent700 transition-colors font-semibold flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>주거 요구사항 등록</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar - Filters */}
          <div className="lg:w-64 space-y-6">
            {/* Search */}
            <div className="bg-brand-card rounded-2xl shadow-soft border border-brand-border p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input
                  type="text"
                  placeholder="주거 공간 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="bg-brand-card rounded-2xl shadow-soft border border-brand-border p-4">
              <h3 className="font-semibold text-brand-ink mb-3">주거 유형</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: '전체' },
                  { value: '원룸', label: '원룸' },
                  { value: '투룸', label: '투룸' },
                  { value: '아파트', label: '아파트' },
                  { value: '오피스텔', label: '오피스텔' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value={option.value}
                      checked={selectedType === option.value}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="mr-2 text-brand-accent"
                    />
                    <span className="text-sm text-brand-ink">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className="bg-brand-card rounded-2xl shadow-soft border border-brand-border p-4">
              <h3 className="font-semibold text-brand-ink mb-3">지역</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: '전체' },
                  { value: '강남구', label: '강남구' },
                  { value: '마포구', label: '마포구' },
                  { value: '송파구', label: '송파구' },
                  { value: '분당구', label: '분당구' },
                  { value: '강북구', label: '강북구' },
                  { value: '영등포구', label: '영등포구' },
                  { value: '서초구', label: '서초구' },
                  { value: '노원구', label: '노원구' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="location"
                      value={option.value}
                      checked={selectedLocation === option.value}
                      onChange={(e) => setSelectedLocation(e.target.value)}
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
            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentPosts.map((post) => (
                <div key={post.id} className="bg-brand-card rounded-2xl shadow-soft border border-brand-border overflow-hidden hover:shadow-medium transition-all duration-200">
                  {/* Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-brand-ink line-clamp-2 mb-2">
                          <Link href={`/housing-board/${post.id}`} className="hover:text-brand-accent transition-colors">
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-sm text-brand-muted line-clamp-3 mb-3">
                          {post.content}
                        </p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center space-x-2 mb-4">
                      {post.urgent && (
                        <span className="px-2 py-1 bg-brand-accent text-white text-xs rounded-full font-medium">긴급</span>
                      )}
                      {post.verified && (
                        <span className="px-2 py-1 bg-brand-gold text-white text-xs rounded-full font-medium">인증</span>
                      )}
                      <span className="px-2 py-1 bg-brand-accent/10 text-brand-accent text-xs rounded-full font-medium border border-brand-accent/20">
                        {post.type}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-brand-muted">예산</span>
                        <span className="font-medium text-brand-ink">{post.budget}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-brand-muted">보증금</span>
                        <span className="font-medium text-brand-ink">{post.deposit}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-brand-muted">면적</span>
                        <span className="font-medium text-brand-ink">{post.size}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-brand-surface border-t border-brand-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-brand-accent/10 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-brand-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-brand-ink">{post.author}</p>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-brand-gold fill-current" />
                            <span className="text-xs text-brand-muted">{post.authorRating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-brand-ink">{post.location}</p>
                        <p className="text-xs text-brand-muted">{post.floor}층</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-brand-muted">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {post.views}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {post.comments}
                        </span>
                      </div>
                      <span className="text-xs">{getTimeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-brand-muted bg-brand-surface border border-brand-border rounded-lg hover:bg-brand-accent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    이전
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => {
                    const pageNum = i + 1
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
              총 {filteredPosts.length}개의 주거 요구사항 중 {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)}번째를 보고 있습니다
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}