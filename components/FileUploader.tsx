'use client'

import { useState, useRef } from 'react'
import { Upload, File, X, AlertCircle } from 'lucide-react'

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

interface FileUploaderProps {
  type?: 'image' | 'document' | 'all'
  maxFiles?: number
  maxSize?: number // MB 단위
  onUploadComplete?: (files: UploadedFile[]) => void
  onFileRemove?: (fileId: string) => void
}

export default function FileUploader({
  type = 'all',
  maxFiles = 10,
  maxSize = 5,
  onUploadComplete,
  onFileRemove
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getAcceptedFileTypes = () => {
    switch (type) {
      case 'image':
        return 'image/*'
      case 'document':
        return '.pdf,.doc,.docx,.txt,.xls,.xlsx'
      default:
        return '*'
    }
  }

  const validateFile = (file: File): string | null => {
    // 파일 크기 체크
    const sizeInMB = file.size / (1024 * 1024)
    if (sizeInMB > maxSize) {
      return `파일 크기는 ${maxSize}MB를 초과할 수 없습니다.`
    }

    // 파일 타입 체크
    if (type === 'image' && !file.type.startsWith('image/')) {
      return '이미지 파일만 업로드할 수 있습니다.'
    }

    if (type === 'document') {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
      if (!allowedTypes.includes(file.type)) {
        return '지원하지 않는 파일 형식입니다.'
      }
    }

    return null
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length === 0) return

    // 최대 파일 개수 체크
    if (uploadedFiles.length + files.length > maxFiles) {
      setError(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`)
      return
    }

    setError(null)
    setUploading(true)

    try {
      const uploadPromises = files.map(async (file) => {
        // 파일 검증
        const validationError = validateFile(file)
        if (validationError) {
          throw new Error(validationError)
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type === 'image' ? 'image' : 'document')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '파일 업로드에 실패했습니다.')
        }

        const data = await response.json()
        return data.file as UploadedFile
      })

      const newFiles = await Promise.all(uploadPromises)
      setUploadedFiles(prev => [...prev, ...newFiles])
      
      if (onUploadComplete) {
        onUploadComplete(newFiles)
      }

      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error('파일 업로드 오류:', err)
      setError(err instanceof Error ? err.message : '파일 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleFileRemove = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
    if (onFileRemove) {
      onFileRemove(fileId)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* 업로드 영역 */}
      <div className="border-2 border-dashed border-brand-border rounded-lg p-6 text-center hover:border-brand-accent transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={getAcceptedFileTypes()}
          onChange={handleFileSelect}
          className="hidden"
          id={`file-upload-${type}`}
        />
        <label
          htmlFor={`file-upload-${type}`}
          className="cursor-pointer"
        >
          <Upload className="w-12 h-12 text-brand-text mx-auto mb-3" />
          <p className="text-brand-ink font-medium mb-1">
            클릭하여 파일 업로드
          </p>
          <p className="text-sm text-brand-text">
            {type === 'image' && '이미지 파일 (JPG, PNG, GIF)'}
            {type === 'document' && '문서 파일 (PDF, DOC, XLS, TXT)'}
            {type === 'all' && '모든 파일 형식'}
            <br />
            최대 {maxFiles}개, 파일당 {maxSize}MB 이하
          </p>
        </label>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* 업로드 중 */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <p className="text-sm text-blue-700">파일 업로드 중...</p>
        </div>
      )}

      {/* 업로드된 파일 목록 (문서용) */}
      {type === 'document' && uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-brand-ink">업로드된 파일</h4>
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between bg-brand-card border border-brand-border rounded-lg p-3"
            >
              <div className="flex items-center space-x-3 flex-1">
                <File className="w-5 h-5 text-brand-text flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-ink truncate">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-brand-text">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleFileRemove(file.id)}
                className="p-1 text-brand-text hover:text-red-500 transition-colors"
                title="파일 삭제"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

