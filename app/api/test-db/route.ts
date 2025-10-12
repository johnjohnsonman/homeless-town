import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // 데이터베이스 연결 테스트
    await prisma.$connect()
    
    // 총 게시글 수 확인
    const totalPosts = await prisma.post.count()
    
    // 최근 게시글 5개 조회
    const recentPosts = await prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        nickname: true,
        createdAt: true,
        type: true
      }
    })
    
    // 무주택촌봇 게시글 확인
    const botPosts = await prisma.post.findMany({
      where: { nickname: '무주택촌봇' },
      select: {
        id: true,
        title: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({
      success: true,
      message: '데이터베이스 연결 성공',
      data: {
        totalPosts,
        recentPosts,
        botPosts: {
          count: botPosts.length,
          posts: botPosts
        }
      }
    })
    
  } catch (error) {
    console.error('데이터베이스 테스트 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '데이터베이스 연결 실패',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
