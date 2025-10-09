'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '../../../components/Navigation'
import { ArrowLeft, BookOpen, Clock, Download, Share2, Star, ThumbsUp, Eye, MessageCircle, TrendingUp, AlertTriangle, CheckCircle, Info, FileText, Scale, Shield, DollarSign, Home } from 'lucide-react'

interface Guide {
  id: number
  title: string
  category: string
  difficulty: string
  readTime: string
  summary: string
  content: string
  tags: string[]
  downloads: number
  rating: number
  isNew: boolean
}

interface PopularDiscussion {
  id: string
  title: string
  slug: string
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: string
  nickname: string
  tags: string[]
  score: number
}

interface LatestDiscussion {
  id: string
  title: string
  slug: string
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: string
  nickname: string
  tags: string[]
  views: number
}

export default function GuideDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [guide, setGuide] = useState<Guide | null>(null)
  const [popularDiscussions, setPopularDiscussions] = useState<PopularDiscussion[]>([])
  const [latestDiscussions, setLatestDiscussions] = useState<LatestDiscussion[]>([])
  const [loading, setLoading] = useState(true)

  const guides: Guide[] = [
    {
      id: 1,
      title: "표준 임대차 계약서 작성법",
      category: "documents",
      difficulty: "초급",
      readTime: "5분",
      summary: "임대차 계약서의 필수 항목과 작성 방법을 단계별로 설명합니다.",
      content: `
        임대차 계약서는 임차인과 집주인의 권리와 의무를 명확히 하는 중요한 문서입니다.
        
        **필수 항목:**
        - 임대인과 임차인의 성명 및 주소
        - 임대물의 표시 (주소, 면적, 용도)
        - 임대차의 목적
        - 임대차 기간
        - 보증금 및 월세
        - 계약 해지 조건
        - 기타 특약사항
        
        **작성 시 주의사항:**
        1. 모든 항목을 명확하게 작성
        2. 구두 약속은 문서에 반드시 포함
        3. 법적 효력이 있는 용어 사용
        4. 계약서 사본 보관
        
        **계약서 양식 다운로드:**
        표준 임대차 계약서 양식을 다운로드하여 사용하실 수 있습니다.
        
        **법적 근거:**
        - 주택임대차보호법
        - 민법 제618조 이하
        - 상가건물 임대차보호법 (상가의 경우)
      `,
      tags: ['계약서', '작성법', '필수항목'],
      downloads: 1247,
      rating: 4.8,
      isNew: true
    },
    {
      id: 2,
      title: "보증금 반환 조건과 절차",
      category: "deposit",
      difficulty: "중급",
      readTime: "8분",
      summary: "보증금 반환을 위한 법적 조건과 절차를 상세히 설명합니다.",
      content: `
        보증금은 임차인이 계약을 이행한 후 반환받을 수 있는 권리가 있습니다.
        
        **반환 조건:**
        - 계약 기간 만료
        - 계약 해지 시 적절한 사전 통지
        - 임대물의 원상 복구
        - 미납 임대료 정산
        
        **반환 절차:**
        1. 입주 시 사진 촬영 및 체크리스트 작성
        2. 계약 만료 1개월 전 통지
        3. 임대물 점검 및 정리
        4. 보증금 반환 요청서 작성
        5. 법적 절차 (필요시)
        
        **주의사항:**
        - 입주 시 사진 촬영은 필수
        - 계약서에 명시되지 않은 구두 약속은 믿지 말 것
        - 보증금은 별도 계좌에 보관되어야 함
        
        **분쟁 발생 시:**
        - 소액사건심판원 신청
        - 법무법인 상담
        - 임대차분쟁조정위원회 신청
      `,
      tags: ['보증금', '반환', '절차'],
      downloads: 892,
      rating: 4.7,
      isNew: false
    },
    {
      id: 3,
      title: "월세 인상 제한 규정",
      category: "rights",
      difficulty: "중급",
      readTime: "6분",
      summary: "월세 인상에 대한 법적 제한사항과 임차인의 권리를 설명합니다.",
      content: `
        월세 인상은 법적으로 제한되어 있으며, 임차인은 이를 거부할 권리가 있습니다.
        
        **법적 제한:**
        - 계약 기간 중 월세 인상 금지
        - 계약 갱신 시 최대 인상률 제한
        - 부당한 인상 요구 거부 권리
        
        **최대 인상률:**
        - 일반적으로 연 5% 이내
        - 물가 상승률 고려
        - 시장 상황 반영
        
        **대응 방법:**
        1. 법적 근거 확인
        2. 내용증명 발송
        3. 소액사건심판원 신청
        4. 법무법인 상담
        
        **주의사항:**
        - 계약서에 명시되지 않은 인상 요구 거부
        - 법적 절차는 생각보다 간단
        - 전문가 상담 권장
        
        **관련 법령:**
        - 주택임대차보호법 제7조
        - 상가건물 임대차보호법 제10조
      `,
      tags: ['월세', '인상', '제한'],
      downloads: 1567,
      rating: 4.9,
      isNew: false
    },
    {
      id: 4,
      title: "계약 해지 시 주의사항",
      category: "basics",
      difficulty: "초급",
      readTime: "4분",
      summary: "계약을 중간에 해지할 때 주의해야 할 사항들을 정리했습니다.",
      content: `
        계약 해지는 신중하게 결정해야 하며, 법적 절차를 따라야 합니다.
        
        **해지 사유:**
        - 상호 합의
        - 계약 위반
        - 부득이한 사정
        
        **해지 절차:**
        1. 상대방에게 해지 의사 통지
        2. 해지 사유 명시
        3. 정리 기간 설정
        4. 임대물 점검 및 정리
        5. 보증금 정산
        
        **주의사항:**
        - 갑작스러운 해지 금지
        - 적절한 사전 통지
        - 원상 복구 의무
        - 손해배상 가능성
        
        **권장사항:**
        - 전문가 상담
        - 서면 통지
        - 증거 자료 보관
        
        **법적 근거:**
        - 민법 제618조 (임대차의 해지)
        - 주택임대차보호법 제6조
      `,
      tags: ['계약해지', '절차', '주의사항'],
      downloads: 734,
      rating: 4.6,
      isNew: false
    },
    {
      id: 5,
      title: "집주인과의 갈등 해결 방법",
      category: "disputes",
      difficulty: "고급",
      readTime: "10분",
      summary: "집주인과의 갈등을 효과적으로 해결하는 방법과 전략을 제시합니다.",
      content: `
        갈등은 소통과 법적 지식을 바탕으로 해결할 수 있습니다.
        
        **갈등 유형:**
        - 보증금 반환 거부
        - 월세 인상 요구
        - 시설 수리 거부
        - 계약 위반
        
        **해결 방법:**
        1. 상호 소통 시도
        2. 중재자 개입
        3. 법적 절차
        4. 전문가 상담
        
        **소통 전략:**
        - 감정적 대응 금지
        - 객관적 사실 제시
        - 서면 소통
        - 증거 자료 준비
        
        **법적 대응:**
        - 소액사건심판원
        - 법무법인 상담
        - 소송 (최후 수단)
        
        **예방 방법:**
        - 명확한 계약서 작성
        - 정기적인 소통
        - 문제 조기 발견
        
        **분쟁조정기관:**
        - 임대차분쟁조정위원회
        - 주민센터 민원실
        - 법원 소액사건심판원
      `,
      tags: ['갈등해결', '소통', '법적대응'],
      downloads: 1123,
      rating: 4.8,
      isNew: false
    },
    {
      id: 6,
      title: "전입신고 절차와 필요한 서류",
      category: "basics",
      difficulty: "초급",
      readTime: "3분",
      summary: "전입신고를 위한 상세한 절차와 필요한 서류들을 정리했습니다.",
      content: `
        전입신고는 새로운 주소지로 이사할 때 반드시 해야 하는 행정 절차입니다.
        
        **전입신고 기간:**
        - 이사한 날로부터 14일 이내
        
        **필요한 서류:**
        1. 신분증 (주민등록증, 운전면허증 등)
        2. 임대차 계약서
        3. 전입신고서
        
        **신고 방법:**
        1. 온라인 신고 (정부24)
        2. 동사무소 방문
        3. 우편 신고
        
        **주의사항:**
        - 기한 내 신고 필수
        - 정확한 주소 입력
        - 계약서 보관
        
        **혜택:**
        - 주민센터 서비스 이용
        - 투표권 행사
        - 각종 혜택 신청
        
        **관련 기관:**
        - 주민센터
        - 정부24 온라인 서비스
        - 관할 동사무소
      `,
      tags: ['전입신고', '절차', '서류'],
      downloads: 567,
      rating: 4.5,
      isNew: false
    }
  ]

  useEffect(() => {
    const guideId = parseInt(params.id as string)
    const foundGuide = guides.find(g => g.id === guideId)
    setGuide(foundGuide || null)

    const fetchDiscussions = async () => {
      try {
        // 인기 토론글 가져오기
        const popularResponse = await fetch('/api/popular-discussions')
        if (popularResponse.ok) {
          const popularData = await popularResponse.json()
          setPopularDiscussions(popularData.discussions || [])
        }

        // 최신 토론글 가져오기
        const latestResponse = await fetch('/api/discussions?limit=10')
        if (latestResponse.ok) {
          const latestData = await latestResponse.json()
          setLatestDiscussions(latestData.discussions || [])
        }
      } catch (error) {
        console.error('토론글 데이터 가져오기 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDiscussions()
  }, [params.id])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '초급': return 'bg-green-100 text-green-800'
      case '중급': return 'bg-yellow-100 text-yellow-800'
      case '고급': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basics': return Info
      case 'documents': return FileText
      case 'deposit': return DollarSign
      case 'rights': return Shield
      case 'disputes': return Scale
      default: return BookOpen
    }
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-brand-ink mb-4">가이드를 찾을 수 없습니다</h1>
            <Link href="/contract-guide" className="btn-primary">
              계약 가이드로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const CategoryIcon = getCategoryIcon(guide.category)
  
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navigation />
      
      {/* Header */}
      <div className="bg-brand-card border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/contract-guide" 
                className="flex items-center text-brand-muted hover:text-brand-accent transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                계약 가이드
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-brand-muted hover:text-brand-accent transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-brand-muted hover:text-brand-accent transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-brand-card rounded-2xl shadow-soft p-8 border border-brand-border">
              {/* Guide Header */}
              <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center">
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-brand-ink mb-2">{guide.title}</h1>
                      <p className="text-brand-muted">{guide.summary}</p>
                    </div>
                  </div>
                  {guide.isNew && (
                    <span className="px-3 py-1 bg-brand-accent text-white text-sm rounded-full font-semibold">
                      NEW
                    </span>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                    <span className="flex items-center text-brand-muted">
                      <Clock className="w-4 h-4 mr-1" />
                      {guide.readTime}
                    </span>
                    <span className="flex items-center text-brand-muted">
                      <Download className="w-4 h-4 mr-1" />
                      {guide.downloads}회 다운로드
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-brand-gold fill-current" />
                    <span className="text-sm font-bold text-brand-ink">{guide.rating}</span>
                    <span className="text-sm text-brand-muted">/5</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {guide.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-brand-surface text-brand-accent text-sm rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-brand-ink leading-relaxed">
                  {guide.content}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-8 border-t border-brand-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="btn-primary flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>PDF 다운로드</span>
                    </button>
                    <button className="btn-secondary flex items-center space-x-2">
                      <Share2 className="w-4 h-4" />
                      <span>공유하기</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-brand-muted hover:text-brand-accent transition-colors">
                      <ThumbsUp className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-brand-muted">도움이 되었나요?</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Popular Discussions */}
            <div className="bg-brand-card rounded-2xl shadow-soft p-6 border border-brand-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-ink">인기 토론글</h3>
                    <p className="text-sm text-brand-muted">🔥 가장 활발한 토론</p>
                  </div>
                </div>
                <Link href="/forum" className="text-brand-link hover:text-brand-accent text-sm font-semibold">
                  더보기 →
                </Link>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-brand-border rounded mb-2"></div>
                        <div className="h-3 bg-brand-border rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : popularDiscussions.length > 0 ? (
                  popularDiscussions.slice(0, 10).map((discussion, index) => (
                    <Link
                      key={discussion.id}
                      href={`/discussions/${discussion.id}`}
                      className="block p-3 rounded-xl hover:bg-brand-surface transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-semibold text-brand-ink line-clamp-2 group-hover:text-brand-accent transition-colors">
                          {discussion.title}
                        </h4>
                        <span className="text-xs text-brand-muted ml-2 flex-shrink-0">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-brand-muted">
                        <span className="flex items-center">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {discussion.score}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          {discussion.commentCount}
                        </span>
                        <span>{discussion.nickname}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center text-brand-muted py-4">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">아직 토론글이 없습니다</p>
                  </div>
                )}
              </div>
            </div>

            {/* Latest Discussions */}
            <div className="bg-brand-card rounded-2xl shadow-soft p-6 border border-brand-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-ink">최신 토론글</h3>
                    <p className="text-sm text-brand-muted">✨ 새로 올라온 글</p>
                  </div>
                </div>
                <Link href="/forum" className="text-brand-link hover:text-brand-accent text-sm font-semibold">
                  더보기 →
                </Link>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-brand-border rounded mb-2"></div>
                        <div className="h-3 bg-brand-border rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : latestDiscussions.length > 0 ? (
                  latestDiscussions.slice(0, 10).map((discussion, index) => (
                    <Link
                      key={discussion.id}
                      href={`/discussions/${discussion.id}`}
                      className="block p-3 rounded-xl hover:bg-brand-surface transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-semibold text-brand-ink line-clamp-2 group-hover:text-brand-accent transition-colors">
                          {discussion.title}
                        </h4>
                        <span className="text-xs text-brand-muted ml-2 flex-shrink-0">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-brand-muted">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {discussion.views}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          {discussion.commentCount}
                        </span>
                        <span>{discussion.nickname}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center text-brand-muted py-4">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">아직 토론글이 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}