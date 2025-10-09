'use client'

import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MyPageRedirect() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else if (user?.id) {
      router.push(`/mypage/${user.id}`)
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto"></div>
        <p className="mt-4 text-brand-ink">마이페이지로 이동 중...</p>
      </div>
    </div>
  )
}

