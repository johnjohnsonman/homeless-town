'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { 
  MapPin, 
  Home, 
  Users, 
  Calendar, 
  Clock, 
  Star, 
  MessageSquare, 
  Eye, 
  Bookmark,
  ExternalLink
} from 'lucide-react'

interface Post {
  id: string
  title: string
  content: string
  author: string
  authorRating?: number
  location: string
  type: string
  budget?: string
  deposit?: string
  size?: string
  floor?: string
  createdAt: string
  views: number
  comments: number
  urgent?: boolean
  verified?: boolean
  slug?: string
  postType?: string
}

interface PostCardProps {
  post: Post
  onBookmarkToggle?: (postId: string) => void
  isBookmarked?: boolean
}

export default function PostCard({ post, onBookmarkToggle, isBookmarked = false }: PostCardProps) {
  const { isAuthenticated } = useAuth()
  const [bookmarked, setBookmarked] = useState(isBookmarked)

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.')
      return
    }

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id
        })
      })

      if (response.ok) {
        const data = await response.json()
        setBookmarked(data.action === 'added')
        if (onBookmarkToggle) {
          onBookmarkToggle(post.id)
        }
      }
    } catch (error) {
      console.error('북마크 처리 실패:', error)
    }
  }

  const getPostUrl = () => {
    if (post.postType === 'discussion') {
      return `/discussions/${post.slug || post.id}`
    }
    return `/housing-board/${post.slug || post.id}`
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* 제목과 상태 배지 */}
          <div className="flex items-center space-x-2 mb-3">
            <h3 className="text-lg font-semibold text-brand-ink line-clamp-1">
              <Link href={getPostUrl()} className="hover:text-brand-accent">
                {post.title}
              </Link>
            </h3>
            {post.urgent && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-semibold">
                긴급
              </span>
            )}
            {post.verified && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                인증
              </span>
            )}
          </div>

          {/* 내용 미리보기 */}
          <p className="text-brand-text text-sm mb-4 line-clamp-2">
            {post.content}
          </p>

          {/* 상세 정보 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="flex items-center space-x-2 text-sm text-brand-text">
              <MapPin className="w-4 h-4 text-brand-accent" />
              <span>{post.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-brand-text">
              <Home className="w-4 h-4 text-brand-accent" />
              <span>{post.type}</span>
            </div>
            {post.budget && (
              <div className="flex items-center space-x-2 text-sm text-brand-text">
                <Users className="w-4 h-4 text-brand-accent" />
                <span>{post.budget}</span>
              </div>
            )}
            {post.deposit && (
              <div className="flex items-center space-x-2 text-sm text-brand-text">
                <Star className="w-4 h-4 text-brand-accent" />
                <span>보증금 {post.deposit}</span>
              </div>
            )}
          </div>

          {/* 작성자 정보 */}
          <div className="flex items-center justify-between text-sm text-brand-text">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{post.author}</span>
              {post.authorRating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span>{post.authorRating}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{post.createdAt}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-3 h-3" />
                <span>{post.comments}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col items-center space-y-2 ml-4">
          {isAuthenticated && (
            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-lg transition-colors ${
                bookmarked 
                  ? 'text-brand-accent bg-brand-accent/10' 
                  : 'text-brand-text hover:text-brand-accent hover:bg-brand-accent/10'
              }`}
              title={bookmarked ? '북마크 해제' : '북마크 추가'}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          )}
          <button
            onClick={() => window.open(getPostUrl(), '_blank')}
            className="p-2 text-brand-text hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors"
            title="새 탭에서 보기"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

