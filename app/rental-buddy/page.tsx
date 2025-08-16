'use client'

import { useState } from 'react'
import Navigation from '../../components/Navigation'
import { Heart, Star, MapPin, Clock, MessageCircle, Phone, Mail, Calendar, Users, Award, Shield, CheckCircle, Filter, Search } from 'lucide-react'

export default function RentalBuddyPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')

  const locations = ['전체', '강남구', '마포구', '송파구', '분당구', '강북구', '영등포구', '서초구', '노원구']
  const ratings = ['전체', '4.5+', '4.0+', '3.5+']

  const buddies = [
    {
      id: 1,
      name: "김버디",
      avatar: "김",
      location: "강남구",
      rating: 4.9,
      totalMatches: 127,
      successRate: 98,
      experience: "5년",
      specialties: ['원룸', '투룸', '아파트'],
      languages: ['한국어', '영어'],
      available: true,
      responseTime: "1시간 이내",
      description: "강남구 전문 임대 버디입니다. 5년간 127건의 성공적인 매칭을 도왔으며, 특히 원룸과 투룸 매칭에 특화되어 있습니다.",
      reviews: [
        { author: "임차인A", rating: 5, comment: "정말 친절하고 전문적이에요!" },
        { author: "임차인B", rating: 5, comment: "빠르고 정확한 정보를 제공해주셨어요." }
      ],
      certifications: ['공인중개사', '부동산학과 졸업'],
      lastActive: "방금 전"
    },
    {
      id: 2,
      name: "이동반",
      avatar: "이",
      location: "마포구",
      rating: 4.7,
      totalMatches: 89,
      successRate: 95,
      experience: "3년",
      specialties: ['원룸', '오피스텔'],
      languages: ['한국어'],
      available: true,
      responseTime: "2시간 이내",
      description: "마포구 지역을 중심으로 활동하는 임대 버디입니다. 특히 홍대, 합정 지역의 원룸과 오피스텔에 대한 깊은 지식을 가지고 있습니다.",
      reviews: [
        { author: "임차인C", rating: 5, comment: "지역 정보를 정말 잘 알고 계세요." },
        { author: "임차인D", rating: 4, comment: "친절하고 도움이 많이 되었어요." }
      ],
      certifications: ['부동산학과 졸업'],
      lastActive: "30분 전"
    },
    {
      id: 3,
      name: "박가이드",
      avatar: "박",
      location: "송파구",
      rating: 4.8,
      totalMatches: 156,
      successRate: 97,
      experience: "7년",
      specialties: ['아파트', '투룸', '빌라'],
      languages: ['한국어', '중국어'],
      available: false,
      responseTime: "3시간 이내",
      description: "송파구 아파트 전문 임대 버디입니다. 7년간 156건의 성공적인 매칭을 도왔으며, 특히 가족형 주거에 특화되어 있습니다.",
      reviews: [
        { author: "임차인E", rating: 5, comment: "가족을 위한 주거를 찾는데 정말 도움이 되었어요." },
        { author: "임차인F", rating: 5, comment: "전문적이고 신뢰할 수 있어요." }
      ],
      certifications: ['공인중개사', '부동산학과 졸업', '중국어 능력시험 1급'],
      lastActive: "2시간 전"
    },
    {
      id: 4,
      name: "최동반",
      avatar: "최",
      location: "분당구",
      rating: 4.6,
      totalMatches: 67,
      successRate: 93,
      experience: "2년",
      specialties: ['신축아파트', '원룸'],
      languages: ['한국어'],
      available: true,
      responseTime: "1시간 이내",
      description: "분당구 신축 아파트 전문 임대 버디입니다. 새로운 단지와 현대적인 시설에 대한 정보를 제공합니다.",
      reviews: [
        { author: "임차인G", rating: 5, comment: "신축 아파트 정보를 정말 잘 알고 계세요." },
        { author: "임차인H", rating: 4, comment: "빠른 응답과 정확한 정보 감사합니다." }
      ],
      certifications: ['부동산학과 졸업'],
      lastActive: "1시간 전"
    },
    {
      id: 5,
      name: "정버디",
      avatar: "정",
      location: "강북구",
      rating: 4.5,
      totalMatches: 45,
      successRate: 91,
      experience: "1년",
      specialties: ['원룸', '투룸'],
      languages: ['한국어'],
      available: true,
      responseTime: "4시간 이내",
      description: "강북구 지역을 중심으로 활동하는 신규 임대 버디입니다. 젊은 감각과 친근한 소통으로 많은 임차인들의 사랑을 받고 있습니다.",
      reviews: [
        { author: "임차인I", rating: 5, comment: "친근하고 편안하게 상담받을 수 있어요." },
        { author: "임차인J", rating: 4, comment: "신규지만 정보는 정확해요." }
      ],
      certifications: ['부동산학과 졸업'],
      lastActive: "방금 전"
    },
    {
      id: 6,
      name: "한전문가",
      avatar: "한",
      location: "영등포구",
      rating: 4.9,
      totalMatches: 203,
      successRate: 99,
      experience: "10년",
      specialties: ['오피스텔', '아파트', '빌라'],
      languages: ['한국어', '영어', '일본어'],
      available: true,
      responseTime: "30분 이내",
      description: "영등포구 최고의 임대 버디입니다. 10년간 203건의 성공적인 매칭을 도왔으며, 다국어 지원과 빠른 응답으로 유명합니다.",
      reviews: [
        { author: "임차인K", rating: 5, comment: "정말 빠르고 정확해요!" },
        { author: "임차인L", rating: 5, comment: "다국어 지원이 정말 도움이 되었어요." }
      ],
      certifications: ['공인중개사', '부동산학과 졸업', '영어능력시험 1급', '일본어능력시험 N1'],
      lastActive: "방금 전"
    }
  ]

  // 필터링된 버디들
  const filteredBuddies = buddies.filter(buddy => {
    const matchesSearch = buddy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buddy.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = selectedLocation === 'all' || buddy.location === selectedLocation
    const matchesRating = selectedRating === 'all' || 
                         (selectedRating === '4.5+' && buddy.rating >= 4.5) ||
                         (selectedRating === '4.0+' && buddy.rating >= 4.0) ||
                         (selectedRating === '3.5+' && buddy.rating >= 3.5)
    
    return matchesSearch && matchesLocation && matchesRating
  })

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navigation />
      
      {/* Header */}
      <div className="bg-brand-card border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-brand-ink mb-2">임대 버디</h1>
            <p className="text-brand-muted">신뢰할 수 있는 임대 버디와 함께 완벽한 주거를 찾아보세요</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-brand-card rounded-2xl shadow-soft p-6 border border-brand-border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input
                  type="text"
                  placeholder="버디 이름이나 설명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-brand-border rounded-xl focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 border border-brand-border rounded-xl focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all duration-200"
              >
                {locations.map((location) => (
                  <option key={location} value={location === '전체' ? 'all' : location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full px-4 py-3 border border-brand-border rounded-xl focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none transition-all duration-200"
              >
                {ratings.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Buddies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuddies.map((buddy) => (
            <div key={buddy.id} className="bg-brand-card rounded-2xl shadow-soft border border-brand-border hover:shadow-medium transition-all duration-200">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {buddy.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-brand-ink">{buddy.name}</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className={`w-4 h-4 fill-current ${getRatingColor(buddy.rating)}`} />
                          <span className={`font-bold ${getRatingColor(buddy.rating)}`}>{buddy.rating}</span>
                        </div>
                        <span className="text-sm text-brand-muted">({buddy.totalMatches}건)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      buddy.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {buddy.available ? '대기중' : '매칭완료'}
                    </div>
                    <div className="text-xs text-brand-muted mt-1">{buddy.lastActive}</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-brand-muted mb-4 line-clamp-2">
                  {buddy.description}
                </p>

                {/* Specialties */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-brand-ink mb-2">전문 분야</h4>
                  <div className="flex flex-wrap gap-2">
                    {buddy.specialties.map((specialty) => (
                      <span key={specialty} className="px-2 py-1 bg-brand-surface text-brand-accent text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-brand-accent" />
                    <span className="text-brand-ink">{buddy.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-brand-accent" />
                    <span className="text-brand-ink">{buddy.responseTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-brand-accent" />
                    <span className="text-brand-ink">{buddy.experience} 경력</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-brand-accent" />
                    <span className="text-brand-ink">{buddy.successRate}% 성공률</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-brand-accent text-white px-4 py-2 rounded-lg hover:bg-brand-accent700 transition-colors font-semibold text-sm flex items-center justify-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>상담하기</span>
                  </button>
                  <button className="px-4 py-2 bg-brand-surface text-brand-ink rounded-lg hover:bg-brand-card transition-colors border border-brand-border">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-brand-accent rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">임대 버디는 어떻게 작동하나요?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">버디 선택</h3>
              <p className="text-sm">지역과 전문 분야에 맞는 임대 버디를 선택하세요</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">상담 및 매칭</h3>
              <p className="text-sm">요구사항을 상담하고 최적의 주거를 매칭받으세요</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">입주 완료</h3>
              <p className="text-sm">만족스러운 주거로 입주하고 새로운 생활을 시작하세요</p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-brand-muted">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>신원 확인 완료</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>평점 시스템</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>성공률 보장</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}