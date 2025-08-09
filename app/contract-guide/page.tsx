import Navigation from '@/components/Navigation'
import { AlertCircle, CheckCircle, Book, Users, Clock, DollarSign } from 'lucide-react'

export default function ContractGuide() {
  const essentialPoints = [
    {
      title: "보증금",
      description: "보증금 금액, 보관 절차, 반환 조건에 대한 권리를 알아보세요.",
      icon: DollarSign,
      tips: [
        "대부분 지역에서 보증금은 2-3개월 월세를 초과할 수 없음",
        "별도 계좌에 보관되어야 함",
        "서면 영수증을 받으세요",
        "입주 시 부동산 상태를 문서화하세요"
      ]
    },
    {
      title: "임대 조건",
      description: "기간, 갱신 옵션, 해지 조항을 이해하세요.",
      icon: Clock,
      tips: [
        "정기 계약 vs 월세 계약",
        "해지 통지 기간",
        "자동 갱신 조항",
        "계약 해지 위약금"
      ]
    },
    {
      title: "유지보수 책임",
      description: "수리 및 유지보수를 누가 담당하는지 명확히 구분하세요.",
      icon: CheckCircle,
      tips: [
        "집주인: 구조, 난방, 배관",
        "임차인: 소규모 수리, 청소",
        "긴급 연락 절차",
        "응답 시간"
      ]
    },
    {
      title: "임대료 및 수수료",
      description: "모든 비용, 결제 방법, 연체료 정책.",
      icon: AlertCircle,
      tips: [
        "월세 금액 및 납부일",
        "허용되는 결제 방법",
        "연체료 금액 및 유예 기간",
        "공과금 책임"
      ]
    }
  ]

  const caseStudies = [
    {
      title: "숨겨진 수수료의 놀라움",
      author: "마리아, 26세",
      category: "수수료 및 비용",
      story: "임대료가 좋은 거래라고 생각했지만, 계약서에 묻혀있는 필수 주차비, 반려동물 수수료, '편의시설 수수료'를 놓쳤습니다. 서명하기 전에 항상 모든 월간 비용의 완전한 내역을 요청하세요.",
      lesson: "서명하기 전에 모든 수수료의 상세한 내역을 요청하세요. 주차, 반려동물, 편의시설 및 기타 잠재적 비용에 대해 구체적으로 문의하세요.",
      bgColor: "bg-pastel-pink"
    },
    {
      title: "보증금 회수 승리",
      author: "제임스, 32세", 
      category: "보증금",
      story: "입주할 때 모든 방의 사진과 비디오를 찍고 기존 손상을 기록했습니다. 이사할 때 집주인이 '기존' 문제에 대해 비용을 청구하려 했습니다. 제 문서화 덕분에 2,400달러 보증금을 전액 돌려받았습니다.",
      lesson: "입주 시와 이사 시 모든 것을 사진/비디오로 문서화하세요. 입주 후 즉시 집주인에게 사본을 보내세요.",
      bgColor: "bg-pastel-sage"
    },
    {
      title: "전세 대출의 악몽",
      author: "애슐리, 24세",
      category: "계약 위반", 
      story: "직장 때문에 이사해야 했고 임대권을 인수할 사람을 찾았습니다. 제 계약서에는 서면 허가 없이 전세 대출을 금지하는 조항이 있었습니다. 결국 3개월 동안 이중 임대료를 지불했습니다.",
      lesson: "전세 대출 조항을 항상 확인하고 어떤 약속을 하기 전에 집주인으로부터 서면 허가를 받으세요.",
      bgColor: "bg-pastel-lavender"
    }
  ]

  const redFlags = [
    "검토할 시간 없이 즉시 서명하도록 압박",
    "서면 계약에 포함되지 않은 구두 약속",
    "이상한 보증금 금액이나 결제 방법",
    "모호한 유지보수 책임 조항",
    "기존 손상에 대한 항목별 목록 없음",
    "합리적이지 않은 제한이나 규칙"
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-pastel-peach via-pastel-cream to-pastel-warm py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-warm-900 mb-4">
            임대 계약 가이드
          </h1>
          <p className="text-xl text-warm-700 leading-relaxed">
            임대 계약을 자신 있게 탐색할 수 있도록 도와주는 필수 지식과 실제 경험
          </p>
        </div>
      </section>

      {/* Essential Points */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-warm-900 mb-4">
              알아야 할 필수 사항
            </h2>
            <p className="text-lg text-warm-600 max-w-2xl mx-auto">
              모든 임차인이 계약을 서명하기 전에 이해해야 하는 중요한 영역들입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {essentialPoints.map((point, index) => {
              const Icon = point.icon
              return (
                <div key={index} className="card">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-warm-400 to-warm-600 rounded-lg flex items-center justify-center mr-3">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-warm-900">{point.title}</h3>
                  </div>
                  <p className="text-warm-600 mb-4">{point.description}</p>
                  <ul className="space-y-2">
                    {point.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start text-sm text-warm-700">
                        <CheckCircle className="w-4 h-4 text-warm-500 mr-2 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Red Flags */}
      <section className="py-20 bg-pastel-mint">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-warm-900 mb-4">
              주의해야 할 위험 신호
            </h2>
            <p className="text-lg text-warm-600">
              멈추고 재고해야 할 경고 신호들
            </p>
          </div>

          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {redFlags.map((flag, index) => (
                <div key={index} className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-warm-700">{flag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-warm-900 mb-4">
              우리 커뮤니티의 실제 이야기
            </h2>
            <p className="text-lg text-warm-600 max-w-2xl mx-auto">
              어려운 상황을 극복한 동료 임차인들의 경험에서 배워보세요
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <div key={index} className={`${study.bgColor} rounded-2xl p-6 shadow-soft`}>
                <div className="flex items-center mb-4">
                  <Book className="w-6 h-6 text-warm-700 mr-2" />
                  <span className="text-sm font-medium text-warm-600 uppercase tracking-wide">
                    {study.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-warm-900 mb-2">
                  {study.title}
                </h3>
                
                <p className="text-sm text-warm-600 mb-4">작성자: {study.author}</p>
                
                <p className="text-warm-700 mb-4 leading-relaxed">
                  {study.story}
                </p>
                
                <div className="bg-white/60 rounded-lg p-4">
                  <h4 className="font-semibold text-warm-900 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 text-warm-600 mr-2" />
                    핵심 교훈
                  </h4>
                  <p className="text-sm text-warm-700">{study.lesson}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Share Your Story CTA */}
      <section className="py-20 bg-gradient-to-r from-warm-500 to-warm-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            계약 관련 이야기를 공유하고 싶으신가요?
          </h2>
          <p className="text-xl text-warm-100 mb-8">
            성공 사례와 교훈을 공유하여 다른 임차인들을 도와주세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-warm-600 px-8 py-4 rounded-xl font-semibold hover:bg-pastel-cream transition-colors duration-200">
              이야기 공유하기
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-warm-600 transition-all duration-200">
              질문하기
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}