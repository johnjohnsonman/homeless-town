'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, FileText, Users, Heart, MessageCircle, Download, LogIn, LogOut, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  const navigation = [
    { name: '토론방', href: '/forum', icon: MessageCircle },
    { name: '계약 가이드', href: '/contract-guide', icon: FileText },
    { name: '주거 게시판', href: '/housing-board', icon: Users },
    { name: '임대 버디', href: '/rental-buddy', icon: Heart },
    { name: '자료실', href: '/resources', icon: Download },
  ]

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <nav className="bg-brand-card/80 backdrop-blur-sm shadow-soft sticky top-0 z-50 border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center flex-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-semibold text-brand-ink">
                무주택촌
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-1 text-brand-ink hover:text-brand-accent transition-colors duration-200 whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex items-center justify-end flex-1 space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/mypage"
                  className="flex items-center space-x-2 bg-brand-surface text-brand-ink px-4 py-2 rounded-lg hover:bg-brand-card transition-colors duration-200 border border-brand-border"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">마이페이지</span>
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center space-x-2 bg-brand-surface text-brand-ink px-4 py-2 rounded-lg hover:bg-brand-card transition-colors duration-200 border border-brand-border"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">관리자</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">로그아웃</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-2 bg-brand-accent text-white px-4 py-2 rounded-lg hover:bg-brand-accent700 transition-colors duration-200"
              >
                <LogIn className="w-4 h-4" />
                <span className="font-medium">로그인</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-ink hover:text-brand-accent transition-colors duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-brand-card border-t border-brand-border">
            <div className="px-4 py-3">
              {/* Navigation Links */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-center space-x-2 px-3 py-3 text-brand-ink hover:text-brand-accent hover:bg-brand-surface rounded-lg transition-all duration-200 text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
              
              {/* Auth Buttons */}
              <div className="border-t border-brand-border pt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      href="/admin"
                      className="flex items-center justify-center space-x-2 bg-brand-surface text-brand-ink px-3 py-3 rounded-lg hover:bg-brand-card transition-colors duration-200 border border-brand-border"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span className="font-medium">관리자</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white px-3 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">로그아웃</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center space-x-2 bg-brand-accent text-white px-3 py-3 rounded-lg hover:bg-brand-accent700 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="font-medium">로그인</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation