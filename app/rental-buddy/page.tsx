'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { Users, MapPin, MessageSquare, Filter, Search, Star, Clock, Heart, CheckCircle, AlertCircle } from 'lucide-react'

export default function RentalBuddy() {
  const [selectedService, setSelectedService] = useState('all')
  
  const buddies = [
    {
      id: 1,
      name: "알렉산드라 첸",
      experience: "3년간 임차인 지원 경험",
      rating: 4.9,
      reviews: 47,
      location: "시내 및 주변 지역",
      avatar: "AC",
      specialties: ["첫 임대", "계약 검토", "협상 지원"],
      availability: "주말 및 저녁",
      about: "여러 임대 계약을 직접 경험한 사람으로서, 그 과정이 얼마나 압도적일 수 있는지 이해합니다. 부동산 시찰과 계약 서명 시 차분하고 지식 있는 지원을 제공하기 위해 여기 있습니다.",
      services: ["부동산 시찰", "계약 서명", "협상 지원"],
      languages: ["영어", "중국어"],
      verified: true
    },
    {
      id: 2, 
      name: "마커스 존슨",
      experience: "5년간 부동산 경험",
      rating: 4.8,
      reviews: 73,
      location: "전 도시 이용 가능",
      avatar: "MJ",
      specialties: ["법적 검토", "부동산 검사", "투자 조언"],
      availability: "유연한 일정",
      about: "전직 부동산 중개업자에서 임대 버디로 전향했습니다. 계약을 이해하고, 위험 신호를 발견하며, 정보에 기반한 결정을 내릴 수 있도록 전문 지식을 제공합니다.",
      services: ["부동산 시찰", "계약 서명", "법적 검토", "부동산 검사"],
      languages: ["영어", "스페인어"],
      verified: true
    },
    {
      id: 3,
      name: "프리야 파텔",
      experience: "2년간 학생 지원",
      rating: 4.7,
      reviews: 32,
      location: "대학가 및 인근",
      avatar: "PP",
      specialties: ["학생 주거", "저렴한 옵션", "국제 학생"],
      availability: "오후 및 주말",
      about: "저렴하고 안전한 주거지를 찾는 것의 독특한 어려움을 이해하는 대학원생입니다. 특히 국제 학생들이 임대 과정을 탐색하는 것을 돕는 데 경험이 풍부합니다.",
      services: ["부동산 시찰", "계약 서명", "번역 도움"],
      languages: ["영어", "힌디어", "구자라트어"],
      verified: true
    }
  ]

  const serviceTypes = [
    { value: 'all', label: '모든 서비스' },
    { value: 'viewing', label: '부동산 시찰' },
    { value: 'signing', label: '계약 서명' },
    { value: 'review', label: '계약 검토' },
    { value: 'negotiation', label: '협상 지원' }
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-pastel-lavender via-pastel-blue to-pastel-mint py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-warm-900 mb-4">
              임대 버디 서비스
            </h1>
            <p className="text-xl text-warm-700 leading-relaxed max-w-3xl mx-auto">
              부동산 시찰과 계약 서명 시 함께할 신뢰할 수 있는 동반자를 찾으세요. 임대 과정을 혼자서 탐색하지 마세요.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary flex items-center justify-center">
              <Heart className="w-5 h-5 mr-2" />
              버디 찾기
            </button>
            <button className="btn-secondary">
              버디 되기
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-12 bg-white border-b border-warm-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-warm-400 to-warm-600 rounded-xl flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-warm-900 mb-2">인증된 버디</h3>
              <p className="text-warm-600 text-sm">모든 버디는 신원 조회와 인증을 거칩니다</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-warm-400 to-warm-600 rounded-xl flex items-center justify-center mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-warm-900 mb-2">평점 및 리뷰</h3>
              <p className="text-warm-600 text-sm">서비스를 이용한 임차인들의 실제 리뷰</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-warm-400 to-warm-600 rounded-xl flex items-center justify-center mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-warm-900 mb-2">커뮤니티 주도</h3>
              <p className="text-warm-600 text-sm">임차인들이 임차인들을 위해 진심으로 만든 서비스</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Filter */}
      <section className="py-8 bg-pastel-warm border-b border-warm-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {serviceTypes.map(service => (
              <button
                key={service.value}
                onClick={() => setSelectedService(service.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedService === service.value
                    ? 'bg-warm-500 text-white shadow-soft'
                    : 'bg-white text-warm-700 hover:bg-pastel-cream'
                }`}
              >
                {service.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Buddies List */}
      <section className="py-12 bg-pastel-warm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {buddies.map((buddy) => (
              <div key={buddy.id} className="card hover:shadow-medium transition-all duration-200">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Avatar & Basic Info */}
                  <div className="flex flex-col items-center lg:items-start lg:w-48">
                    <div className="w-20 h-20 bg-gradient-to-r from-warm-400 to-warm-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3">
                      {buddy.avatar}
                    </div>
                    <h3 className="text-xl font-semibold text-warm-900 mb-1 text-center lg:text-left">
                      {buddy.name}
                    </h3>
                    <p className="text-warm-600 text-sm mb-2">{buddy.experience}</p>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(buddy.rating) ? 'text-warm-400 fill-current' : 'text-warm-200'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-warm-600 ml-2">
                        {buddy.rating} ({buddy.reviews} 리뷰)
                      </span>
                    </div>
                    {buddy.verified && (
                      <div className="flex items-center text-sm text-green-600">
                        <UserCheck className="w-4 h-4 mr-1" />
                        인증됨
                      </div>
                    )}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1">
                    <p className="text-warm-700 leading-relaxed mb-4">
                      {buddy.about}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-warm-900 mb-2 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          서비스 지역
                        </h4>
                        <p className="text-sm text-warm-600">{buddy.location}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-warm-900 mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          이용 가능 시간
                        </h4>
                        <p className="text-sm text-warm-600">{buddy.availability}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-warm-900 mb-2">전문 분야</h4>
                      <div className="flex flex-wrap gap-2">
                        {buddy.specialties.map((specialty, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-pastel-blue text-warm-700 rounded-full text-sm"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-warm-900 mb-2">제공 서비스</h4>
                      <div className="flex flex-wrap gap-2">
                        {buddy.services.map((service, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-warm-100 text-warm-700 rounded-full text-sm"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-warm-900 mb-2">언어</h4>
                      <p className="text-sm text-warm-600">{buddy.languages.join(', ')}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="lg:w-48 space-y-3">
                    <button className="w-full btn-primary">
                      버디에게 연락하기
                    </button>
                    <button className="w-full btn-secondary flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      메시지 보내기
                    </button>
                    <button className="w-full text-warm-600 hover:text-warm-800 transition-colors text-sm">
                      리뷰 보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-warm-900 mb-4">
              임대 버디가 작동하는 방법
            </h2>
            <p className="text-lg text-warm-600 max-w-2xl mx-auto">
              임대 여정에 대한 지원을 받는 것은 간단하고 안전합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: 1, title: "임대 버디 둘러보기", description: "프로필, 평점, 전문 분야를 검토하여 적합한 매치를 찾으세요" },
              { step: 2, title: "미팅 예약하기", description: "선택한 버디와 연결하여 상황을 논의하세요" },
              { step: 3, title: "지원 받기", description: "버디가 시찰과 서명에 함께하도록 하세요" },
              { step: 4, title: "완료 및 리뷰", description: "미래의 임차인들을 돕기 위해 리뷰를 남기세요" }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-warm-400 to-warm-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-warm-900 mb-2">{item.title}</h3>
                <p className="text-warm-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Buddy CTA */}
      <section className="py-20 bg-gradient-to-r from-warm-500 to-warm-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            다른 임차인들을 도우고 싶으신가요?
          </h2>
          <p className="text-xl text-warm-100 mb-8">
            임대 버디 커뮤니티에 참여하고 동료 임차인들이 자신 있게 여정을 탐색할 수 있도록 돕는 동시에 수입을 얻으세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-warm-600 px-8 py-4 rounded-xl font-semibold hover:bg-pastel-cream transition-colors duration-200">
              버디 지원하기
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-warm-600 transition-all duration-200">
              자세히 알아보기
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}