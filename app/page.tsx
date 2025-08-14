import Link from 'next/link'
import Navigation from '../components/Navigation'
import { FileText, Users, Heart, MessageCircle, Star, Shield, Coffee, Download, Search, TrendingUp, Clock, ThumbsUp, MapPin, Home as HomeIcon, Calculator, BookOpen, AlertCircle, CheckCircle } from 'lucide-react'

export default function Home() {
  // 최신 주거 게시글
  const latestHousingPosts = [
    {
      id: 1,
      title: "강남역 근처 원룸 구합니다",
      location: "강남구",
      budget: "월 80만원",
      type: "원룸",
      time: "10분 전",
      urgent: true
    },
    {
      id: 2,
      title: "홍대입구역 1인가구 월세",
      location: "마포구",
      budget: "월 60만원",
      type: "원룸",
      time: "30분 전",
      urgent: false
    },
    {
      id: 3,
      title: "잠실역 근처 2인가구",
      location: "송파구",
      budget: "월 120만원",
      type: "투룸",
      time: "1시간 전",
      urgent: true
    },
    {
      id: 4,
      title: "분당 정자동 신축 아파트",
      location: "성남시",
      budget: "월 150만원",
      type: "아파트",
      time: "2시간 전",
      urgent: false
    }
  ]

  // 인기 토론글
  const popularDiscussions = [
    {
      id: 1,
      title: "보증금 반환 받은 경험 공유",
      author: "임차인A",
      views: 1247,
      comments: 89,
      likes: 156,
      category: "보증금"
    },
    {
      id: 2,
      title: "집주인과 갈등 해결 방법",
      author: "임차인B",
      views: 892,
      comments: 67,
      likes: 134,
      category: "분쟁해결"
    },
    {
      id: 3,
      title: "월세 vs 전세 어떤 게 좋을까요?",
      author: "임차인C",
      views: 567,
      comments: 45,
      likes: 78,
      category: "계약"
    },
    {
      id: 4,
      title: "입주 시 체크해야 할 사항들",
      author: "임차인D",
      views: 445,
      comments: 34,
      likes: 67,
      category: "입주"
    }
  ]

  // 최신 자료
  const latestResources = [
    {
      id: 1,
      title: "2024년 표준 임대계약서",
      type: "계약서",
      downloads: 2341,
      rating: 4.8,
      isNew: true
    },
    {
      id: 2,
      title: "입주 시 사진 촬영 가이드",
      type: "가이드",
      downloads: 1876,
      rating: 4.6,
      isNew: false
    },
    {
      id: 3,
      title: "보증금 반환 요청서 템플릿",
      type: "서식",
      downloads: 1234,
      rating: 4.7,
      isNew: false
    },
    {
      id: 4,
      title: "임대료 계산기 (엑셀)",
      type: "계산기",
      downloads: 3456,
      rating: 4.9,
      isNew: true
    }
  ]

  // 임대 버디 매칭
  const rentalBuddies = [
    {
      id: 1,
      name: "김버디",
      location: "강남구",
      experience: "5년",
      rating: 4.9,
      reviews: 127,
      available: true
    },
    {
      id: 2,
      name: "이동반",
      location: "마포구",
      experience: "3년",
      rating: 4.7,
      reviews: 89,
      available: true
    },
    {
      id: 3,
      name: "박가이드",
      location: "송파구",
      experience: "7년",
      rating: 4.8,
      reviews: 156,
      available: false
    }
  ]

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
                placeholder="원하는 지역, 예산, 방 타입을 검색해보세요..."
                className="w-full px-6 py-4 text-lg border-0 rounded-2xl shadow-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none text-gray-800"
              />
              <button className="absolute right-2 top-2 bg-brand-gold text-white px-6 py-2 rounded-xl hover:bg-brand-accent transition-colors font-semibold">
                검색
              </button>
            </div>
          </div>

          {/* Quick Menus */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link
              href="/housing-board"
              className="bg-brand-surface p-4 rounded-2xl text-center text-brand-ink hover:bg-brand-card hover:scale-105 transition-all duration-200 shadow-soft hover:shadow-medium border border-brand-border"
            >
              <Search className="w-8 h-8 mx-auto mb-2 text-brand-accent" />
              <div className="text-sm font-semibold">주거지 검색</div>
            </Link>
            <Link
              href="/contract-guide"
              className="bg-brand-surface p-4 rounded-2xl text-center text-brand-ink hover:bg-brand-card hover:scale-105 transition-all duration-200 shadow-soft hover:shadow-medium border border-brand-border"
            >
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-brand-accent" />
              <div className="text-sm font-semibold">계약 가이드</div>
            </Link>
            <Link
              href="/resources"
              className="bg-brand-surface p-4 rounded-2xl text-center text-brand-ink hover:bg-brand-card hover:scale-105 transition-all duration-200 shadow-soft hover:shadow-medium border border-brand-border"
            >
              <Calculator className="w-8 h-8 mx-auto mb-2 text-brand-accent" />
              <div className="text-sm font-semibold">임대료 계산</div>
            </Link>
            <Link
              href="/rental-buddy"
              className="bg-brand-surface p-4 rounded-2xl text-center text-brand-ink hover:bg-brand-card hover:scale-105 transition-all duration-200 shadow-soft hover:shadow-medium border border-brand-border"
            >
              <Heart className="w-8 h-8 mx-auto mb-2 text-brand-accent" />
              <div className="text-sm font-semibold">임대 버디</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
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
                {popularDiscussions.map((discussion) => (
                  <div key={discussion.id} className="p-4 rounded-xl hover:bg-brand-surface transition-colors border border-brand-border">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-brand-ink flex-1">{discussion.title}</h3>
                      <span className="px-3 py-1 bg-brand-surface text-brand-accent text-xs rounded-full font-semibold ml-2">
                        {discussion.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-brand-muted">
                      <span className="font-medium">작성자: {discussion.author}</span>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1 text-brand-accent" />
                          {discussion.views}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1 text-brand-accent" />
                          {discussion.comments}
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp className="w-4 h-4 mr-1 text-brand-accent" />
                          {discussion.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
                {latestHousingPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-brand-surface transition-colors border border-brand-border">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-brand-ink">{post.title}</h3>
                        {post.urgent && (
                          <span className="px-2 py-1 bg-brand-accent text-white text-xs rounded-full font-semibold">긴급</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-brand-muted">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-brand-accent" />
                          {post.location}
                        </span>
                        <span className="font-medium text-brand-accent700">{post.budget}</span>
                        <span className="bg-brand-surface px-2 py-1 rounded text-xs">{post.type}</span>
                      </div>
                    </div>
                    <div className="text-xs text-brand-muted font-medium">{post.time}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-brand-border">
                <Link href="/housing-board" className="block text-center py-3 bg-brand-accent text-white rounded-xl hover:bg-brand-accent700 transition-colors font-semibold">
                  주거 요구사항 등록하기
                </Link>
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
                {rentalBuddies.map((buddy) => (
                  <div key={buddy.id} className="p-4 rounded-xl hover:bg-brand-surface transition-colors border border-brand-border">
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
                      <div className="flex justify-between">
                        <span>경력:</span>
                        <span className="font-medium">{buddy.experience}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-brand-border">
                        <span>리뷰 {buddy.reviews}개</span>
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
                {latestResources.map((resource) => (
                  <div key={resource.id} className="p-4 rounded-xl hover:bg-brand-surface transition-colors border border-brand-border">
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
                      <div className="text-xs text-brand-muted font-medium">
                        다운로드 {resource.downloads.toLocaleString()}회
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
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-muted">총 회원수</span>
                  <span className="font-bold text-brand-accent">12,847명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">오늘 게시글</span>
                  <span className="font-bold text-brand-accent">156개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">성공 매칭</span>
                  <span className="font-bold text-brand-accent">2,341건</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">자료 다운로드</span>
                  <span className="font-bold text-brand-accent">18,921회</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}