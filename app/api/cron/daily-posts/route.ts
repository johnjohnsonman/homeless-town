import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Cron job을 위한 API (Render의 Cron Jobs 또는 외부 서비스에서 호출)
export async function POST(request: NextRequest) {
  try {
    // 보안: Render Cron Secret 확인
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('일일 AI 게시글 생성 시작...')

    // AI 게시글 생성 API 호출
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/generate-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count: 20 })
    })

    if (!response.ok) {
      throw new Error(`AI 게시글 생성 실패: ${response.statusText}`)
    }

    const result = await response.json()

    console.log('일일 AI 게시글 생성 완료:', result.message)

    return NextResponse.json({
      success: true,
      message: '일일 AI 게시글 생성이 완료되었습니다.',
      details: result
    })

  } catch (error) {
    console.error('Cron job 오류:', error)
    return NextResponse.json(
      { error: '일일 게시글 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// 테스트용 GET 엔드포인트
export async function GET() {
  return NextResponse.json({
    message: 'AI 게시글 자동 생성 Cron Job API',
    usage: 'POST /api/cron/daily-posts with Bearer token',
    schedule: '매일 오전 9시에 20개의 AI 게시글 자동 생성'
  })
}
