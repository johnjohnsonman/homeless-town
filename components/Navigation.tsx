'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, FileText, Users, Heart, MessageCircle, Download, LogIn } from 'lucide-react'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: '홈', href: '/', icon: Home },
    { name: '계약 가이드', href: '/contract-guide', icon: FileText },
    { name: '주거 게시판', href: '/housing-board', icon: Users },
    { name: '임대 버디', href: '/rental-buddy', icon: Heart },
    { name: '토론방', href: '/discussions', icon: MessageCircle },
    { name: '자료실', href: '/resources', icon: Download },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-warm-400 to-warm-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-semibold text-gradient">
                무주택촌
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-warm-700 hover:text-warm-900 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
            
            {/* Login Button */}
            <Link
              href="/login"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <LogIn className="w-4 h-4" />
              <span className="font-medium">로그인</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              href="/login"
              className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <LogIn className="w-4 h-4" />
              <span className="font-medium text-sm">로그인</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-warm-700 hover:text-warm-900 transition-colors duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-warm-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-3 py-2 text-warm-700 hover:text-warm-900 hover:bg-pastel-cream rounded-lg transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation