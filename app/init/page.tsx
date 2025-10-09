'use client'

import { useState } from 'react'
import { Rocket, CheckCircle, XCircle, Loader, Database, User } from 'lucide-react'

export default function InitPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [result, setResult] = useState(null)

  const runInit = async () => {
    setLoading(true)
    setMessage('')
    setResult(null)
    
    try {
      const response = await fetch('/api/init', {
        method: 'POST'
      })
      
      const data = await response.json()
      setResult(data)
      
      if (response.ok) {
        setSuccess(true)
        setMessage(`✅ ${data.message}`)
      } else {
        setSuccess(false)
        setMessage(`❌ ${data.message}`)
      }
    } catch (error) {
      setSuccess(false)
      setMessage('❌ 초기 설정 중 오류가 발생했습니다.')
      console.error('초기 설정 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <Rocket className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            무주택촌 초기 설정
          </h1>
          <p className="text-gray-600">
            원클릭으로 모든 설정을 완료하세요
          </p>
        </div>

        {/* 기능 설명 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <Database className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900">데이터베이스 설정</h3>
              <p className="text-sm text-gray-600">테이블 생성 및 연결</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
            <User className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-medium text-gray-900">관리자 생성</h3>
              <p className="text-sm text-gray-600">admin 계정 자동 생성</p>
            </div>
          </div>
        </div>

        {/* 실행 버튼 */}
        <button
          onClick={runInit}
          disabled={loading}
          className="w-full py-4 px-6 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:opacity-50 flex items-center justify-center space-x-2 mb-6"
        >
          {loading ? (
            <>
              <Loader className="w-6 h-6 animate-spin" />
              <span>초기 설정 실행 중...</span>
            </>
          ) : (
            <>
              <Rocket className="w-6 h-6" />
              <span>🚀 원클릭 초기 설정 실행</span>
            </>
          )}
        </button>

        {/* 결과 표시 */}
        {message && (
          <div className={`p-6 rounded-lg mb-6 ${
            success 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-start space-x-3">
              {success ? (
                <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium">{message}</p>
                {result && (
                  <div className="mt-3 space-y-2">
                    {result.loginInfo && (
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-medium text-gray-900 mb-2">📋 로그인 정보:</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="font-medium">아이디:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded">{result.loginInfo.username}</code>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">비밀번호:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded">{result.loginInfo.password}</code>
                          </div>
                        </div>
                      </div>
                    )}
                    {result.errors && result.errors.length > 0 && (
                      <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                        <h4 className="font-medium text-yellow-800 mb-1">⚠️ 주의사항:</h4>
                        <ul className="text-sm text-yellow-700 list-disc list-inside">
                          {result.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 로그인 링크 */}
        {(success && result?.loginInfo) && (
          <div className="text-center">
            <a
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              🔐 로그인 페이지로 이동 →
            </a>
          </div>
        )}

        {/* 도움말 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            💡 이 기능이 하는 일:
          </h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>데이터베이스 연결 확인</li>
            <li>관리자 계정 생성 (admin / admin123)</li>
            <li>초기 설정 완료 확인</li>
          </ul>
          <p className="text-xs text-gray-500 mt-3">
            ⚠️ 이미 관리자가 있으면 생성되지 않습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
