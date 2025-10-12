import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('🔍 데이터베이스 디버깅 시작...')
    console.log('📊 DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')
    
    // 데이터베이스 연결 테스트
    await prisma.$connect()
    console.log('✅ 데이터베이스 연결 성공')
    
    // 실제 게시글 수 확인
    const totalPosts = await prisma.post.count()
    console.log('📊 총 게시글 수:', totalPosts)
    
    // 최근 게시글 10개 조회
    const recentPosts = await prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        nickname: true,
        createdAt: true,
        type: true,
        content: true
      }
    })
    
    console.log('📝 최근 게시글:', recentPosts.length, '개')
    
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
    
    console.log('🤖 봇 게시글:', botPosts.length, '개')
    
    // 다양한 작성자 게시글 확인
    const authorPosts = await prisma.post.findMany({
      where: { 
        nickname: { not: '무주택촌봇' }
      },
      select: {
        id: true,
        title: true,
        nickname: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
    
    console.log('👥 다른 작성자 게시글:', authorPosts.length, '개')
    
    // 태그 확인
    const tags = await prisma.tag.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        color: true,
        createdAt: true
      }
    })
    
    console.log('🏷️ 태그 수:', tags.length, '개')
    
    return NextResponse.json({
      success: true,
      message: '데이터베이스 디버깅 완료',
      debug: {
        databaseUrl: process.env.DATABASE_URL?.substring(0, 50) + '...',
        totalPosts,
        recentPosts,
        botPosts: {
          count: botPosts.length,
          posts: botPosts
        },
        authorPosts: {
          count: authorPosts.length,
          posts: authorPosts
        },
        tags: {
          count: tags.length,
          tags: tags
        }
      }
    })
    
  } catch (error) {
    console.error('데이터베이스 디버깅 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '데이터베이스 디버깅 실패',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
        databaseUrl: process.env.DATABASE_URL?.substring(0, 50) + '...'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
