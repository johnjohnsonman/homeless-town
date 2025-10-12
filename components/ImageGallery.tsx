'use client'

import { useState } from 'react'
import { X, Download, ExternalLink, Eye, EyeOff } from 'lucide-react'

interface ImageFile {
  id: string
  filename: string
  originalName: string
  url: string
  size: number
  isPublic: boolean
  createdAt: string
}

interface ImageGalleryProps {
  images: ImageFile[]
  onImageRemove?: (imageId: string) => void
  onToggleVisibility?: (imageId: string, isPublic: boolean) => void
  className?: string
}

export default function ImageGallery({ 
  images, 
  onImageRemove, 
  onToggleVisibility,
  className = '' 
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openModal = (image: ImageFile, index: number) => {
    setSelectedImage(image)
    setCurrentIndex(index)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedImage(images[currentIndex + 1])
    }
  }

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setSelectedImage(images[currentIndex - 1])
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (images.length === 0) {
    return (
      <div className={`text-center py-8 text-brand-text ${className}`}>
        <p>업로드된 이미지가 없습니다.</p>
      </div>
    )
  }

  return (
    <>
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
        {images.map((image, index) => (
          <div key={image.id} className="relative group">
            <div className="aspect-square bg-brand-surface rounded-lg overflow-hidden cursor-pointer">
              <img
                src={image.url}
                alt={image.originalName}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                onClick={() => openModal(image, index)}
              />
            </div>
            
            {/* 오버레이 */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    openModal(image, index)
                  }}
                  className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                  title="크게 보기"
                >
                  <Eye className="w-4 h-4 text-gray-700" />
                </button>
                
                <a
                  href={image.url}
                  download={image.originalName}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                  title="다운로드"
                >
                  <Download className="w-4 h-4 text-gray-700" />
                </a>
              </div>
            </div>

            {/* 파일 정보 */}
            <div className="mt-2">
              <p className="text-xs text-brand-text truncate" title={image.originalName}>
                {image.originalName}
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-brand-text/70">
                  {formatFileSize(image.size)}
                </p>
                <div className="flex items-center space-x-1">
                  {onToggleVisibility && (
                    <button
                      onClick={() => onToggleVisibility(image.id, image.isPublic)}
                      className={`p-1 rounded ${
                        image.isPublic 
                          ? 'text-green-600 hover:bg-green-100' 
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={image.isPublic ? '공개' : '비공개'}
                    >
                      {image.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 이미지 모달 */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* 이전/다음 버튼 */}
            {images.length > 1 && (
              <>
                {currentIndex > 0 && (
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {currentIndex < images.length - 1 && (
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </>
            )}

            {/* 이미지 */}
            <img
              src={selectedImage.url}
              alt={selectedImage.originalName}
              className="max-w-full max-h-full object-contain"
            />

            {/* 이미지 정보 */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-lg p-4">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="font-medium">{selectedImage.originalName}</p>
                  <p className="text-sm opacity-75">
                    {formatFileSize(selectedImage.size)} • {images.length}개 중 {currentIndex + 1}번째
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={selectedImage.url}
                    download={selectedImage.originalName}
                    className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                    title="다운로드"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <a
                    href={selectedImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                    title="새 탭에서 보기"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}











