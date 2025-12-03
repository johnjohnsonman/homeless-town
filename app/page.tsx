'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '../components/Navigation'
import { MessageCircle, TrendingUp, Clock, ThumbsUp, Eye, Star, Plus, Search, Filter, Tag as TagIcon, Home as HomeIcon, FileText, Heart, Download, MapPin, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface PopularDiscussion {
  id: number
  title: string
  slug: string
  nickname: string
  upvotes: number
  downvotes: number
  commentCount: number
  views?: number
  tags: string[]
  createdAt: string
}

interface HousingPost {
  id: number
  title: string
  location?: string
  budget?: string
  type?: string
  urgent?: boolean
  createdAt: string
}

interface ContractGuide {
  id: number
  title: string
  summary: string
  category: string
}

interface CommunityStats {
  totalUsers: number
  todayPosts: number
  successMatches: number
  totalDownloads: number
}

export default function Home() {
  const [popularDiscussions, setPopularDiscussions] = useState<PopularDiscussion[]>([])
  const [housingPosts, setHousingPosts] = useState<HousingPost[]>([])
  const [contractGuides, setContractGuides] = useState<ContractGuide[]>([])
  const [stats, setStats] = useState<CommunityStats>({
    totalUsers: 0,
    todayPosts: 0,
    successMatches: 0,
    totalDownloads: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 인기 토론글 가져오기
        const discussionsRes = await fetch('/api/popular-discussions')
        if (discussionsRes.ok) {
          const discussionsData = await discussionsRes.json()
          setPopularDiscussions(discussionsData.discussions?.slice(0, 3) || [])
        }

        // 최신 주거 게시판 가져오기
        const housingRes = await fetch('/api/housing-posts?limit=2')
        if (housingRes.ok) {
          const housingData = await housingRes.json()
          setHousingPosts(housingData.posts?.slice(0, 2) || [])
        }

        // 계약 가이드 가져오기
        const guidesRes = await fetch('/api/contract-guides?limit=4')
        if (guidesRes.ok) {
          const guidesData = await guidesRes.json()
          setContractGuides(guidesData.guides?.slice(0, 4) || [])
        }

        // 통계 데이터 가져오기
        const statsRes = await fetch('/api/stats')
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData.stats || {
            totalUsers: 0,
            todayPosts: 0,
            successMatches: 0,
            totalDownloads: 0
          })
        }
      } catch (error) {
        console.error('데이터 가져오기 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return '방금 전'
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`
    return `${Math.floor(diffInMinutes / 1440)}일 전`
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR')
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-brand-accent py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              <span className="text-brand-gold">무주택촌</span>에 오신 것을 환영합니다
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              임차인들을 위한 따뜻하고 지원적인 커뮤니티입니다
            </p>
          </div>

          {/* Quick Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="궁금한 내용을 검색해보세요..."
                className="w-full px-6 py-4 text-lg border-0 rounded-2xl shadow-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none text-gray-800"
              />
              <button className="absolute right-2 top-2 bg-brand-gold text-white px-6 py-2 rounded-xl hover:bg-brand-accent transition-colors font-semibold">
                검색
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-4">
            <Link
              href="/forum"
              className="bg-brand-gold text-white px-6 py-3 rounded-xl hover:bg-yellow-600 transition-colors font-semibold flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>토론방 가기</span>
            </Link>
            <Link
              href="/housing-board"
              className="bg-brand-surface text-brand-ink px-6 py-3 rounded-xl hover:bg-brand-card transition-colors font-semibold border border-brand-border"
            >
              <HomeIcon className="w-5 h-5" />
              <span>주거 게시판</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Forum Popular Posts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Forum Popular Posts Section */}
            <div className="bg-brand-card rounded-2xl shadow-soft p-6 border border-brand-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-brand-ink">토론방 인기글</h2>
                    <p className="text-sm text-brand-muted">🔥 가장 활발한 토론 주제</p>
                  </div>
                </div>
                <Link href="/forum" className="text-brand-link hover:text-brand-accent text-sm font-semibold">
                  더보기 →
                </Link>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-accent" />
                  </div>
                ) : popularDiscussions.length > 0 ? (
                  popularDiscussions.map((discussion) => (
                    <Link 
                      key={discussion.id} 
                      href={`/discussions/${discussion.id}`}
                      className="block p-4 rounded-xl hover:bg-brand-surface transition-colors border border-brand-border"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-brand-ink flex-1">{discussion.title}</h3>
                        {discussion.tags && discussion.tags.length > 0 && (
                          <span className="px-3 py-1 bg-brand-surface text-brand-accent text-xs rounded-full font-semibold ml-2">
                            {discussion.tags[0]}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm text-brand-muted">
                        <span className="font-medium">작성자: {discussion.nickname || '익명'}</span>
                        <div className="flex items-center space-x-4">
                          {discussion.views !== undefined && (
                            <span className="flex items-center">
                              <TrendingUp className="w-4 h-4 mr-1 text-brand-accent" />
                              {formatNumber(discussion.views)}
                            </span>
                          )}
                          <span className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1 text-brand-accent" />
                            {discussion.commentCount || 0}
                          </span>
                          <span className="flex items-center">
                            <ThumbsUp className="w-4 h-4 mr-1 text-brand-accent" />
                            {discussion.upvotes - discussion.downvotes}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-brand-muted">
                    아직 인기 토론글이 없습니다.
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-brand-border">
                <Link href="/forum" className="block text-center py-3 bg-brand-accent text-white rounded-xl hover:bg-brand-accent700 transition-colors font-semibold">
                  토론 참여하기
                </Link>
              </div>
            </div>

            {/* Housing Board Section */}
            <div className="bg-brand-card rounded-2xl shadow-soft p-6 border border-brand-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center">
                    <HomeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-brand-ink">주거 게시판</h2>
                    <p className="text-sm text-brand-muted">🏠 최신 주거 요구사항</p>
                  </div>
                </div>
                <Link href="/housing-board" className="text-brand-link hover:text-brand-accent text-sm font-semibold">
                  더보기 →
                </Link>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-accent" />
                  </div>
                ) : housingPosts.length > 0 ? (
                  housingPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/housing-board`}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-brand-surface transition-colors border border-brand-border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-brand-ink">{post.title}</h3>
                          {post.urgent && (
                            <span className="px-2 py-1 bg-brand-accent text-white text-xs rounded-full font-semibold">긴급</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-brand-muted">
                          {post.location && (
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1 text-brand-accent" />
                              {post.location}
                            </span>
                          )}
                          {post.budget && (
                            <span className="font-medium text-brand-accent700">{post.budget}</span>
                          )}
                          {post.type && (
                            <span className="bg-brand-surface px-2 py-1 rounded text-xs">{post.type}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-brand-muted font-medium">{getTimeAgo(post.createdAt)}</div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-brand-muted">
                    아직 주거 게시글이 없습니다.
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-brand-border">
                <Link href="/housing-board" className="block text-center py-3 bg-brand-accent text-white rounded-xl hover:bg-brand-accent700 transition-colors font-semibold">
                  주거 요구사항 등록하기
                </Link>
              </div>
            </div>

            {/* Contract Guide Section */}
            <div className="bg-brand-card rounded-2xl shadow-soft p-6 border border-brand-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-brand-ink">계약 가이드</h2>
                    <p className="text-sm text-brand-muted">📋 임대차 계약 필수 지식</p>
                  </div>
                </div>
                <Link href="/contract-guide" className="text-brand-link hover:text-brand-accent text-sm font-semibold">
                  더보기 →
                </Link>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-accent" />
                  </div>
                ) : contractGuides.length > 0 ? (
                  contractGuides.map((guide) => (
                    <Link
                      key={guide.id}
                      href={`/contract-guide/${guide.id}`}
                      className="block p-4 rounded-xl hover:bg-brand-surface transition-colors border border-brand-border"
                    >
                      <h3 className="font-semibold text-brand-ink">{guide.title}</h3>
                      <p className="text-sm text-brand-muted mt-1">{guide.summary || '임차인을 위한 상세 가이드'}</p>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-brand-muted">
                    아직 계약 가이드가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Rental Buddy Section */}
            <div className="bg-brand-card rounded-2xl shadow-soft p-6 border border-brand-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-brand-ink">임대 버디</h2>
                    <p className="text-sm text-brand-muted">신뢰할 수 있는 동반자</p>
                  </div>
                </div>
                <Link href="/rental-buddy" className="text-brand-link hover:text-brand-accent text-sm font-semibold">
                  더보기 →
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { name: "김버디", location: "강남구", rating: 4.9, available: true },
                  { name: "이동반", location: "마포구", rating: 4.7, available: true },
                  { name: "박가이드", location: "송파구", rating: 4.8, available: false }
                ].map((buddy, index) => (
                  <div key={index} className="p-4 rounded-xl hover:bg-brand-surface transition-colors border border-brand-border">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-brand-ink">{buddy.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-brand-gold fill-current" />
                        <span className="text-sm font-bold text-brand-ink">{buddy.rating}</span>
                      </div>
                    </div>
                    <div className="text-sm text-brand-muted space-y-2">
                      <div className="flex justify-between">
                        <span>지역:</span>
                        <span className="font-medium">{buddy.location}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-brand-border">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          buddy.available 
                            ? 'bg-brand-surface text-brand-accent' 
                            : 'bg-brand-surface text-brand-muted'
                        }`}>
                          {buddy.available ? '대기중' : '매칭완료'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources Section */}
            <div className="bg-brand-card rounded-2xl shadow-soft p-6 border border-brand-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-brand-ink">자료실</h2>
                    <p className="text-sm text-brand-muted">최신 자료</p>
                  </div>
                </div>
                <Link href="/resources" className="text-brand-link hover:text-brand-accent text-sm font-semibold">
                  더보기 →
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { title: "2024년 표준 임대계약서", type: "계약서", rating: 4.8, isNew: true },
                  { title: "입주 시 사진 촬영 가이드", type: "가이드", rating: 4.6, isNew: false },
                  { title: "보증금 반환 요청서 템플릿", type: "서식", rating: 4.7, isNew: false }
                ].map((resource, index) => (
                  <div key={index} className="p-4 rounded-xl hover:bg-brand-surface transition-colors border border-brand-border">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-brand-ink flex-1">{resource.title}</h3>
                      {resource.isNew && (
                        <span className="px-2 py-1 bg-brand-accent text-white text-xs rounded-full font-semibold ml-2">NEW</span>
                      )}
                    </div>
                    <div className="text-sm text-brand-muted space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-brand-surface px-2 py-1 rounded text-xs">{resource.type}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-brand-gold fill-current" />
                          <span className="text-xs font-bold">{resource.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-brand-accent rounded-2xl shadow-soft p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                오늘의 팁
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>입주 시 모든 방의 사진을 촬영하여 보관하세요</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>계약서에 명시되지 않은 구두 약속은 믿지 마세요</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>보증금은 별도 계좌에 보관되어야 합니다</span>
                </div>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-brand-card rounded-2xl shadow-soft p-6 border border-brand-border">
              <h3 className="text-lg font-bold text-brand-ink mb-4">커뮤니티 현황</h3>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-accent" />
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-muted">총 회원수</span>
                    <span className="font-bold text-brand-accent">{formatNumber(stats.totalUsers)}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">오늘 게시글</span>
                    <span className="font-bold text-brand-accent">{formatNumber(stats.todayPosts)}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">성공 매칭</span>
                    <span className="font-bold text-brand-accent">{formatNumber(stats.successMatches)}건</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">자료 다운로드</span>
                    <span className="font-bold text-brand-accent">{formatNumber(stats.totalDownloads)}회</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}