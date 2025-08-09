'use client'

import { useState } from 'react'
import Navigation from '../../components/Navigation'

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('popular')

  const categories = [
    { value: 'all', label: '전체 자료', count: 156 },
    { value: 'contracts', label: '계약 서식', count: 34 },
    { value: 'checklists', label: '체크리스트', count: 28 },
    { value: 'legal', label: '법적 자료', count: 22 },
    { value: 'guides', label: '가이드북', count: 31 },
    { value: 'templates', label: '템플릿', count: 25 },
    { value: 'calculators', label: '계산기', count: 16 }
  ]

  const resources = [
    {
      id: 1,
      title: "세입자 계약 전 체크리스트",
      description: "임대 계약을 체결하기 전에 반드시 확인해야 할 사항들을 체크할 수 있는 체크리스트입니다.",
      category: "checklists",
      fileType: "pdf",
      fileSize: "245KB",
      downloads: 2847,
      rating: 4.8,
      reviews: 156,
      lastUpdated: "2024-01-15",
      isPremium: false,
      isNew: true,
      tags: ["계약", "체크리스트", "첫임대", "보증금"]
    },
    {
      id: 2,
      title: "표준 임대 계약서 템플릿",
      description: "공정거래위원회 표준 임대 계약서를 기반으로 한 템플릿입니다.",
      category: "contracts",
      fileType: "docx",
      fileSize: "1.2MB",
      downloads: 1987,
      rating: 4.6,
      reviews: 89,
      lastUpdated: "2024-01-10",
      isPremium: false,
      isNew: false,
      tags: ["계약서", "표준", "공정거래위원회", "법적"]
    },
    {
      id: 3,
      title: "보증금 반환 요청서",
      description: "보증금 반환을 요청할 때 사용할 수 있는 공식 요청서 템플릿입니다.",
      category: "templates",
      fileType: "pdf",
      fileSize: "156KB",
      downloads: 1234,
      rating: 4.7,
      reviews: 67,
      lastUpdated: "2024-01-08",
      isPremium: false,
      isNew: false,
      tags: ["보증금", "반환", "요청서", "법적대응"]
    },
    {
      id: 4,
      title: "임대료 계산기 (엑셀)",
      description: "월세, 전세, 관리비 등을 포함한 총 임대 비용을 계산할 수 있는 엑셀 파일입니다.",
      category: "calculators",
      fileType: "xlsx",
      fileSize: "2.1MB",
      downloads: 3456,
      rating: 4.9,
      reviews: 234,
      lastUpdated: "2024-01-12",
      isPremium: true,
      isNew: false,
      tags: ["계산기", "임대료", "관리비", "엑셀"]
    },
    {
      id: 5,
      title: "입주 시 사진 촬영 가이드",
      description: "입주할 때 반드시 촬영해야 할 사진들과 촬영 방법을 안내하는 가이드입니다.",
      category: "guides",
      fileType: "pdf",
      fileSize: "3.4MB",
      downloads: 1876,
      rating: 4.5,
      reviews: 123,
      lastUpdated: "2024-01-05",
      isPremium: false,
      isNew: false,
      tags: ["입주", "사진", "증거", "보증금"]
    },
    {
      id: 6,
      title: "집주인과의 갈등 해결 가이드",
      description: "집주인과의 분쟁 상황에서 대처할 수 있는 방법들을 정리한 가이드입니다.",
      category: "guides",
      fileType: "pdf",
      fileSize: "1.8MB",
      downloads: 987,
      rating: 4.4,
      reviews: 78,
      lastUpdated: "2024-01-03",
      isPremium: false,
      isNew: false,
      tags: ["분쟁", "집주인", "갈등해결", "법적"]
    }
  ]

  const popularResources = [
    { title: "세입자 계약 전 체크리스트", downloads: 2847, category: "checklists" },
    { title: "임대료 계산기 (엑셀)", downloads: 3456, category: "calculators" },
    { title: "이사 체크리스트 (1개월 전부터)", downloads: 2341, category: "checklists" },
    { title: "입주 시 사진 촬영 가이드", downloads: 1876, category: "guides" },
    { title: "표준 임대 계약서 템플릿", downloads: 1987, category: "contracts" }
  ]

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return <span className="text-red-500 font-bold">PDF</span>
      case 'docx': return <span className="text-blue-500 font-bold">DOC</span>
      case 'xlsx': return <span className="text-green-500 font-bold">XLS</span>
      case 'jpg':
      case 'png': return <span className="text-purple-500 font-bold">IMG</span>
      default: return <span className="text-gray-500 font-bold">FILE</span>
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">자료실</h1>
              <p className="text-sm text-gray-600 mt-1">세입자를 위한 부동산 관련 자료와 서식</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="text-sm text-gray-600 hover:text-gray-900">
                자료 요청하기
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                📥 일괄 다운로드
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                    <input
                      type="text"
                      placeholder="자료 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="popular">인기순</option>
                    <option value="latest">최신순</option>
                    <option value="downloads">다운로드순</option>
                    <option value="rating">평점순</option>
                  </select>
                </div>
                
                <div className="text-sm text-gray-500">
                  {filteredResources.length}개 자료
                </div>
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        {getFileIcon(resource.fileType)}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {resource.title}
                          {resource.isNew && (
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">NEW</span>
                          )}
                          {resource.isPremium && (
                            <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">PREMIUM</span>
                          )}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{resource.fileSize}</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      📥
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        📥 {resource.downloads.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        ⭐ {resource.rating}
                      </span>
                      <span className="flex items-center">
                        🕒 {resource.lastUpdated}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      {categories.find(cat => cat.value === resource.category)?.label}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{resource.tags.length - 3}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                더 많은 자료 보기
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Categories */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">카테고리</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.label}</span>
                      <span className="text-xs text-gray-500">{category.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Resources */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">인기 자료</h3>
              <div className="space-y-3">
                {popularResources.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 line-clamp-1">{item.title}</span>
                    <div className="text-xs text-gray-500">
                      <div>{item.downloads.toLocaleString()}</div>
                      <div>다운로드</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* File Types */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">파일 형식</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-700">
                    <span className="text-red-500 font-bold mr-2">PDF</span>
                    PDF
                  </span>
                  <span className="text-gray-500">45개</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-700">
                    <span className="text-blue-500 font-bold mr-2">DOC</span>
                    Word
                  </span>
                  <span className="text-gray-500">28개</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-700">
                    <span className="text-green-500 font-bold mr-2">XLS</span>
                    Excel
                  </span>
                  <span className="text-gray-500">16개</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">자료실 통계</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">총 자료</span>
                  <span className="font-medium">156개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">총 다운로드</span>
                  <span className="font-medium">18,921회</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">평균 평점</span>
                  <span className="font-medium text-green-600">4.6/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">무료 자료</span>
                  <span className="font-medium">142개</span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">도움이 필요하신가요?</h3>
              <p className="text-xs text-gray-600 mb-3">
                찾고 있는 자료가 없다면 요청해주세요. 빠른 시일 내에 준비해드리겠습니다.
              </p>
              <button className="text-xs text-blue-600 hover:text-blue-800">
                자료 요청하기 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 