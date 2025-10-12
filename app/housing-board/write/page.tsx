'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import Navigation from '../../../components/Navigation'
import FileUploader from '../../../components/FileUploader'
import ImageGallery from '../../../components/ImageGallery'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  MapPin, 
  Home, 
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react'

interface UploadedFile {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  type: string
  isPublic: boolean
  createdAt: string
}

export default function WritePostPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [images, setImages] = useState<UploadedFile[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    type: '원룸',
    budget: '',
    deposit: '',
    size: '',
    floor: '',
    urgent: false,
    verified: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFileUpload = (files: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...files])
    
    // 이미지 파일만 별도로 관리
    const imageFiles = files.filter(file => file.mimeType.startsWith('image/'))
    setImages(prev => [...prev, ...imageFiles])
  }

  const handleFileRemove = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
    setImages(prev => prev.filter(file => file.id !== fileId))
  }

  const handleImageVisibilityToggle = async (imageId: string, isPublic: boolean) => {
    try {
      const response = await fetch(`/api/upload/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublic: !isPublic })
      })

      if (response.ok) {
        setImages(prev => 
          prev.map(image => 
            image.id === imageId 
              ? { ...image, isPublic: !isPublic }
              : image
          )
        )
        setUploadedFiles(prev => 
          prev.map(file => 
            file.id === imageId 
              ? { ...file, isPublic: !isPublic }
              : file
          )
        )
      }
    } catch (error) {
      console.error('이미지 공개 설정 변경 실패:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.')
      return
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      // 게시글 생성
      const postData = {
        title: formData.title,
        content: formData.content,
        nickname: user?.name || '익명',
        password: '1234', // 임시 비밀번호
        type: 'post',
        urgent: formData.urgent,
        verified: formData.verified,
        // 추가 필드들
        location: formData.location,
        housingType: formData.type,
        budget: formData.budget,
        deposit: formData.deposit,
        size: formData.size,
        floor: formData.floor
      }

      const response = await fetch('/api/housing-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      })

      if (response.ok) {
        const data = await response.json()
        const postId = data.post.id

        // 업로드된 파일들을 게시글에 연결
        if (uploadedFiles.length > 0) {
          await Promise.all(
            uploadedFiles.map(file =>
              fetch(`/api/upload/${file.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId })
              })
            )
          )
        }

        alert('게시글이 성공적으로 작성되었습니다.')
        router.push('/housing-board')
      } else {
        const error = await response.json()
        alert(error.error || '게시글 작성에 실패했습니다.')
      }
    } catch (error) {
      console.error('게시글 작성 실패:', error)
      alert('게시글 작성 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-brand-accent mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-brand-ink mb-2">로그인이 필요합니다</h2>
          <p className="text-brand-text mb-4">게시글을 작성하려면 로그인해주세요.</p>
          <button
            onClick={() => router.push('/login')}
            className="btn-primary"
          >
            로그인하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-brand-text hover:text-brand-ink hover:bg-brand-card rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-brand-ink">게시글 작성</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => router.push('/housing-board')}
              className="btn-secondary"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? '작성 중...' : '게시글 작성'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="card">
            <h2 className="text-lg font-semibold text-brand-ink mb-4">기본 정보</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">
                  제목 *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-brand-bg text-brand-ink"
                  placeholder="게시글 제목을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">
                  내용 *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-brand-bg text-brand-ink"
                  placeholder="상세 내용을 입력하세요"
                  required
                />
              </div>
            </div>
          </div>

          {/* 주거 정보 */}
          <div className="card">
            <h2 className="text-lg font-semibold text-brand-ink mb-4">주거 정보</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">
                  지역
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-brand-bg text-brand-ink"
                  placeholder="예: 강남구, 마포구"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">
                  주거 형태
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-brand-bg text-brand-ink"
                >
                  <option value="원룸">원룸</option>
                  <option value="투룸">투룸</option>
                  <option value="쓰리룸">쓰리룸</option>
                  <option value="오피스텔">오피스텔</option>
                  <option value="아파트">아파트</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">
                  월세 예산
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-brand-bg text-brand-ink"
                  placeholder="예: 월 80만원"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">
                  보증금
                </label>
                <input
                  type="text"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-brand-bg text-brand-ink"
                  placeholder="예: 500만원"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">
                  평수
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-brand-bg text-brand-ink"
                  placeholder="예: 15평"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1">
                  층수
                </label>
                <input
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent bg-brand-bg text-brand-ink"
                  placeholder="예: 3층"
                />
              </div>
            </div>
          </div>

          {/* 이미지 업로드 */}
          <div className="card">
            <h2 className="text-lg font-semibold text-brand-ink mb-4">이미지 업로드</h2>
            <FileUploader
              type="image"
              onUploadComplete={handleFileUpload}
              onFileRemove={handleFileRemove}
              maxFiles={10}
              maxSize={5}
            />
            
            {images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-medium text-brand-ink mb-4">업로드된 이미지</h3>
                <ImageGallery
                  images={images}
                  onImageRemove={handleFileRemove}
                  onToggleVisibility={handleImageVisibilityToggle}
                />
              </div>
            )}
          </div>

          {/* 문서 업로드 */}
          <div className="card">
            <h2 className="text-lg font-semibold text-brand-ink mb-4">문서 업로드</h2>
            <FileUploader
              type="document"
              onUploadComplete={handleFileUpload}
              onFileRemove={handleFileRemove}
              maxFiles={5}
              maxSize={10}
            />
          </div>

          {/* 옵션 */}
          <div className="card">
            <h2 className="text-lg font-semibold text-brand-ink mb-4">게시글 옵션</h2>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="urgent"
                  checked={formData.urgent}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-brand-accent focus:ring-brand-accent border-brand-border rounded"
                />
                <span className="text-sm text-brand-ink">긴급 게시글로 표시</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-brand-accent focus:ring-brand-accent border-brand-border rounded"
                />
                <span className="text-sm text-brand-ink">인증된 게시글로 표시</span>
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}











