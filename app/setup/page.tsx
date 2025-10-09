'use client'

import { useState } from 'react'
import { ShieldCheck, CheckCircle, XCircle, Loader } from 'lucide-react'

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [migrateLoading, setMigrateLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null)

  const checkAdmin = async () => {
    try {
      const response = await fetch('/api/setup/admin')
      const data = await response.json()
      setHasAdmin(data.hasAdmin)
    } catch (error) {
      console.error('관리자 확인 오류:', error)
    }
  }

  const createAdmin = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/setup/admin', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess(true)
        setMessage('✅ 관리자 계정이 생성되었습니다!\n\n아이디: admin\n비밀번호: admin123\n\n이제 로그인 페이지로 이동하세요.')
        setHasAdmin(true)
      } else {
        setSuccess(false)
        setMessage(`❌ ${data.error}`)
        if (data.error.includes('이미 존재')) {
          setHasAdmin(true)
        }
      }
    } catch (error) {
      setSuccess(false)
      setMessage('❌ 관리자 계정 생성 중 오류가 발생했습니다.')
      console.error('생성 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const runMigration = async () => {
    setMigrateLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/setup/migrate', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess(true)
        setMessage('✅ 데이터베이스 마이그레이션이 완료되었습니다!\n\n이제 관리자 계정을 생성할 수 있습니다.')
      } else {
        setSuccess(false)
        setMessage(`❌ ${data.error}\n\n상세: ${data.details}`)
      }
    } catch (error) {
      setSuccess(false)
      setMessage('❌ 마이그레이션 실행 중 오류가 발생했습니다.')
      console.error('마이그레이션 오류:', error)
    } finally {
      setMigrateLoading(false)
    }
  }

  // 페이지 로드 시 관리자 확인
  useState(() => {
    checkAdmin()
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            무주택촌 초기 설정
          </h1>
          <p className="text-gray-600">
            관리자 계정을 생성하여 서비스를 시작하세요
          </p>
        </div>

        {/* 상태 표시 */}
        {hasAdmin !== null && (
          <div className={`mb-6 p-4 rounded-lg ${
            hasAdmin 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center space-x-2">
              {hasAdmin ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    관리자 계정이 이미 존재합니다
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">
                    관리자 계정이 없습니다
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* 마이그레이션 버튼 */}
        <button
          onClick={runMigration}
          disabled={migrateLoading}
          className="w-full py-3 px-4 rounded-lg font-medium transition-colors bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800 disabled:opacity-50 flex items-center justify-center space-x-2 mb-4"
        >
          {migrateLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>마이그레이션 중...</span>
            </>
          ) : (
            <span>🔧 데이터베이스 마이그레이션 실행</span>
          )}
        </button>

        {/* 생성 버튼 */}
        <button
          onClick={createAdmin}
          disabled={loading || hasAdmin === true}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            hasAdmin === true
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          } disabled:opacity-50 flex items-center justify-center space-x-2`}
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>생성 중...</span>
            </>
          ) : (
            <span>
              {hasAdmin === true ? '이미 생성됨' : '관리자 계정 생성하기'}
            </span>
          )}
        </button>

        {/* 메시지 표시 */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg whitespace-pre-line ${
            success 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* 로그인 링크 */}
        {(success || hasAdmin === true) && (
          <div className="mt-6 text-center">
            <a
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              로그인 페이지로 이동 →
            </a>
          </div>
        )}

        {/* 계정 정보 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            📋 기본 관리자 계정 정보
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span className="font-medium">아이디:</span>
              <code className="bg-gray-200 px-2 py-0.5 rounded">admin</code>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">비밀번호:</span>
              <code className="bg-gray-200 px-2 py-0.5 rounded">admin123</code>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            ⚠️ 보안을 위해 첫 로그인 후 비밀번호를 변경하세요
          </p>
        </div>

        {/* 다시 확인 버튼 */}
        <button
          onClick={checkAdmin}
          className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          🔄 관리자 존재 여부 다시 확인
        </button>
      </div>
    </div>
  )
}

