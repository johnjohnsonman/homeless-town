'use client'

import { useState } from 'react'
import Navigation from '../../components/Navigation'
import { Plus, MapPin, DollarSign, Calendar, Users, Filter, Search, Heart } from 'lucide-react'

export default function HousingBoard() {
  const [showPostForm, setShowPostForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const housingRequests = [
    {
      id: 1,
      title: "반려동물 허용 정책이 있는 시내 근처 원룸 찾습니다",
      poster: "사라 M.",
      budget: "$1,200-1,500",
      location: "시내 / 중앙가",
      moveDate: "2024년 3월",
      details: "세탁기가 있는 현대적인 원룸을 찾는 직장인입니다. 작은 강아지(11kg)가 있고 일주일에 2일 재택근무를 하므로 조용한 건물이 이상적입니다.",
      preferences: ["반려동물 허용", "세탁기", "주차", "조용한 건물"],
      posted: "2일 전",
      responses: 3
    },
    {
      id: 2,
      title: "좋은 학교가 있는 2룸이 필요한 3인 가족",
      poster: "마이클 R.",
      budget: "$1,800-2,200",
      location: "교외 지역 선호",
      moveDate: "2024년 6월",
      details: "좋은 초등학교가 있는 가족 친화적인 동네를 찾고 있습니다. 2룸이 필요하며, 6살 아이를 위해 작은 마당이나 근처 공원이 있으면 좋겠습니다.",
      preferences: ["좋은 학교", "가족 친화적 동네", "마당/공원 근처", "2룸 이상"],
      posted: "1주일 전",
      responses: 7
    },
    {
      id: 3,
      title: "대학교 근처 저렴한 원룸/1룸을 찾는 학생",
      poster: "엠마 L.",
      budget: "$800-1,100",
      location: "대학가",
      moveDate: "2024년 8월",
      details: "캠퍼스에서 도보/자전거 거리에 있는 저렴한 주거지를 찾는 대학원생입니다. 가구 있거나 없거나 상관없습니다. 원격 연구 작업을 위해 안정적인 인터넷이 필수입니다.",
      preferences: ["캠퍼스 근처", "좋은 인터넷", "저렴함", "학생 친화적"],
      posted: "3일 전",
      responses: 5
    }
  ]

  const filters = [
    { value: 'all', label: '모든 요청' },
    { value: 'studio', label: '원룸' },
    { value: '1br', label: '1룸' },
    { value: '2br', label: '2룸 이상' },
    { value: 'budget', label: '저렴한 가격' },
    { value: 'luxury', label: '고급' }
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-pastel-sage via-pastel-mint to-pastel-blue py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-warm-900 mb-4">
              주거 요청 게시판
            </h1>
            <p className="text-xl text-warm-700 leading-relaxed max-w-3xl mx-auto">
              상세한 주거 요구사항을 게시하고 집주인과 중개업자가 연락할 수 있도록 하세요
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowPostForm(true)}
              className="btn-primary flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              주거 요청 게시하기
            </button>
            <button className="btn-secondary">
              내 요청 보기
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-warm-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-400 w-5 h-5" />
              <input
                type="text"
                placeholder="위치, 예산, 키워드로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-warm-600" />
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="input-field min-w-[160px]"
              >
                {filters.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Housing Requests */}
      <section className="py-12 bg-pastel-warm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {housingRequests.map((request) => (
              <div key={request.id} className="card hover:shadow-medium transition-all duration-200">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-warm-900 leading-tight">
                        {request.title}
                      </h3>
                      <button className="text-warm-400 hover:text-warm-600 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-warm-600 mb-4">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {request.poster}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {request.posted}
                      </span>
                      <span className="text-warm-500">
                        집주인 응답 {request.responses}개
                      </span>
                    </div>
                    
                    <p className="text-warm-700 leading-relaxed mb-4">
                      {request.details}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {request.preferences.map((pref, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-warm-100 text-warm-700 rounded-full text-sm"
                        >
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="lg:w-64 space-y-3">
                    <div className="bg-pastel-cream rounded-xl p-4">
                      <div className="flex items-center text-warm-700 mb-2">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span className="font-medium">예산</span>
                      </div>
                      <p className="font-semibold text-warm-900">{request.budget}/월</p>
                    </div>
                    
                    <div className="bg-pastel-cream rounded-xl p-4">
                      <div className="flex items-center text-warm-700 mb-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="font-medium">위치</span>
                      </div>
                      <p className="font-semibold text-warm-900">{request.location}</p>
                    </div>
                    
                    <div className="bg-pastel-cream rounded-xl p-4">
                      <div className="flex items-center text-warm-700 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-medium">이사 날짜</span>
                      </div>
                      <p className="font-semibold text-warm-900">{request.moveDate}</p>
                    </div>
                    
                    <button className="w-full btn-primary">
                      임차인에게 연락하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="btn-secondary">
              더 많은 요청 보기
            </button>
          </div>
        </div>
      </section>

      {/* Post Form Modal */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-warm-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-warm-900">
                  주거 요청 게시하기
                </h2>
                <button 
                  onClick={() => setShowPostForm(false)}
                  className="text-warm-400 hover:text-warm-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form className="p-6 space-y-6">
              <div>
                <label className="block font-medium text-warm-900 mb-2">
                  요청 제목 *
                </label>
                <input
                  type="text"
                  placeholder="찾고 있는 것에 대한 간단한 설명"
                  className="input-field"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-warm-900 mb-2">
                    예산 범위 *
                  </label>
                  <input
                    type="text"
                    placeholder="예: $1,200-1,500"
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block font-medium text-warm-900 mb-2">
                    희망 이사 날짜 *
                  </label>
                  <input
                    type="text"
                    placeholder="예: 2024년 3월"
                    className="input-field"
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-medium text-warm-900 mb-2">
                  선호 지역 *
                </label>
                <input
                  type="text"
                  placeholder="동네, 구역, 또는 일반적인 지역"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block font-medium text-warm-900 mb-2">
                  상세 요구사항 *
                </label>
                <textarea
                  rows={4}
                  placeholder="이상적인 집, 생활 방식 요구사항, 직장 상황, 가족 규모 등을 설명하세요."
                  className="input-field resize-none"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  요청 게시하기
                </button>
                <button 
                  type="button"
                  onClick={() => setShowPostForm(false)}
                  className="btn-secondary flex-1"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-warm-900 mb-12">
            주거 게시판이 작동하는 방법
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 bg-gradient-to-r from-warm-400 to-warm-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-warm-900 mb-2">요구사항 게시하기</h3>
              <p className="text-warm-600">이상적인 집, 예산, 일정에 대한 상세한 정보를 공유하세요</p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-gradient-to-r from-warm-400 to-warm-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-warm-900 mb-2">집주인이 연락하기</h3>
              <p className="text-warm-600">부동산 소유자와 중개업자가 일치하는 옵션으로 직접 연락합니다</p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-gradient-to-r from-warm-400 to-warm-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-warm-900 mb-2">집 찾기</h3>
              <p className="text-warm-600">옵션을 검토하고, 시찰을 예약하고, 완벽한 임대주택을 선택하세요</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}