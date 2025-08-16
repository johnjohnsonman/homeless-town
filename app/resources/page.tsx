'use client'

import { useState } from 'react'
import Navigation from '../../components/Navigation'

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const resources = [
    {
      id: 1,
      title: "2024년 표준 임대차 계약서",
      description: "국토교통부에서 제공하는 표준 임대차 계약서입니다.",
      author: "국토교통부",
      downloads: 2847,
      rating: 4.8,
      type: "PDF"
    },
    {
      id: 2,
      title: "입주 시 체크리스트",
      description: "입주할 때 꼭 확인해야 할 사항들을 체크리스트로 정리했습니다.",
      author: "무주택촌",
      downloads: 1567,
      rating: 4.7,
      type: "PDF"
    },
    {
      id: 3,
      title: "보증금 반환 요청서",
      description: "보증금 반환을 요청할 때 사용할 수 있는 표준 서식입니다.",
      author: "법무법인",
      downloads: 892,
      rating: 4.6,
      type: "DOC"
    },
    {
      id: 4,
      title: "월세 인상 제한 규정 가이드",
      description: "월세 인상에 대한 법적 제한사항과 임차인의 권리를 상세히 설명한 가이드입니다.",
      author: "소비자보호원",
      downloads: 1234,
      rating: 4.9,
      type: "PDF"
    },
    {
      id: 5,
      title: "전입신고 절차 가이드",
      description: "전입신고를 위한 상세한 절차와 필요한 서류들을 정리했습니다.",
      author: "행정안전부",
      downloads: 678,
      rating: 4.5,
      type: "PDF"
    },
    {
      id: 6,
      title: "계약 해지 통지서",
      description: "계약을 중간에 해지할 때 사용할 수 있는 표준 통지서입니다.",
      author: "법무법인",
      downloads: 445,
      rating: 4.4,
      type: "DOC"
    },
    {
      id: 7,
      title: "집주인과의 소통 가이드",
      description: "집주인과 원활하게 소통하는 방법과 갈등을 예방하는 팁을 정리했습니다.",
      author: "커뮤니티",
      downloads: 1123,
      rating: 4.7,
      type: "PDF"
    },
    {
      id: 8,
      title: "부동산 중개 수수료 규정",
      description: "부동산 중개 수수료에 대한 법적 규정과 최대 수수료율을 상세히 설명한 자료입니다.",
      author: "공정거래위원회",
      downloads: 789,
      rating: 4.6,
      type: "PDF"
    },
    {
      id: 9,
      title: "입주 전 사진 촬영 가이드",
      description: "입주 전 사진 촬영이 왜 중요한지와 어떤 부분을 촬영해야 하는지에 대해 자세히 알아보겠습니다.",
      author: "사진전문가",
      downloads: 567,
      rating: 4.8,
      type: "PDF"
    },
    {
      id: 10,
      title: "월세 납부 영수증 템플릿",
      description: "월세를 납부할 때 사용할 수 있는 영수증 템플릿입니다.",
      author: "회계사무소",
      downloads: 334,
      rating: 4.3,
      type: "DOC"
    },
    {
      id: 11,
      title: "임대차 분쟁 해결 가이드",
      description: "임대차 관련 분쟁이 발생했을 때 해결할 수 있는 방법들을 단계별로 정리한 가이드입니다.",
      author: "소비자단체",
      downloads: 1456,
      rating: 4.9,
      type: "PDF"
    },
    {
      id: 12,
      title: "개인정보 보호 가이드",
      description: "집주인에게 제공해야 하는 개인정보의 범위와 보호 방법에 대해 알아보겠습니다.",
      author: "개인정보보호위원회",
      downloads: 456,
      rating: 4.5,
      type: "PDF"
    }
  ]

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navigation />
      
      {/* Header */}
      <div className="bg-brand-card border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-brand-ink mb-2">자료실</h1>
            <p className="text-brand-muted">임대차 계약에 필요한 모든 자료를 한 곳에서 다운로드하세요</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-brand-card rounded-2xl shadow-soft p-6 border border-brand-border mb-8">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="자료 제목이나 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-brand-border rounded-xl focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-brand-card rounded-2xl shadow-soft border border-brand-border hover:shadow-medium transition-all duration-200">
              <div className="p-6">
                {/* Title */}
                <h3 className="text-lg font-bold text-brand-ink mb-2">
                  {resource.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-brand-muted mb-4">
                  {resource.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-muted">작성자:</span>
                    <span className="font-medium text-brand-ink">{resource.author}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-muted">다운로드:</span>
                    <span className="font-medium text-brand-ink">{resource.downloads}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-muted">평점:</span>
                    <span className="font-medium text-brand-ink">{resource.rating}</span>
                  </div>
                </div>

                {/* Type Badge */}
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    resource.type === 'PDF' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {resource.type}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-brand-accent text-white px-4 py-2 rounded-lg hover:bg-brand-accent700 transition-colors font-semibold text-sm">
                    다운로드
                  </button>
                  <button className="px-4 py-2 bg-brand-surface text-brand-ink rounded-lg hover:bg-brand-card transition-colors border border-brand-border">
                    보기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Page Info */}
        <div className="mt-8 text-center text-sm text-brand-muted">
          총 {filteredResources.length}개의 자료를 찾았습니다
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-brand-accent rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">자료실 현황</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">{resources.length}</div>
              <div className="text-sm">총 자료 수</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{resources.reduce((sum, r) => sum + r.downloads, 0).toLocaleString()}</div>
              <div className="text-sm">총 다운로드</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{Math.round(resources.reduce((sum, r) => sum + r.rating, 0) / resources.length * 10) / 10}</div>
              <div className="text-sm">평균 평점</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{resources.filter(r => r.type === 'PDF').length}</div>
              <div className="text-sm">PDF 자료</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
