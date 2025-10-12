import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

// 자동 포스팅 API (관리자 전용)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, categorySlug, status = 'published', tags = [] } = body

    // 관리자 인증 (간단한 토큰 방식)
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 내용이 필요합니다.' },
        { status: 400 }
      )
    }

    // 슬러그 생성
    const slug = slugify(title, { lower: true, strict: true })

    // 게시글 생성
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        author: body.author || '무주택촌봇',
        nickname: body.author || '무주택촌봇',
        password: '1234', // 자동 생성 게시글용 고정 비밀번호
        type: 'discussion',
        urgent: false,
        verified: false,
        marketTrend: null,
        isHot: false,
        isNew: true,
        isPopular: false,
        adminPick: false,
        upvotes: 0,
        downvotes: 0,
        views: 0,
        commentCount: 0
      }
    })

    // 태그 처리 (기존 태그 시스템 활용)
    if (tags.length > 0) {
      for (const tagName of tags) {
        // 태그가 없으면 생성
        let tag = await prisma.tag.findUnique({
          where: { name: tagName }
        })

        if (!tag) {
          tag = await prisma.tag.create({
            data: { name: tagName }
          })
        }

        // 게시글과 태그 연결
        await prisma.postTag.create({
          data: {
            postId: post.id,
            tagId: tag.id
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: categorySlug
      }
    })

  } catch (error: any) {
    console.error('자동 포스팅 생성 오류:', error)
    console.error('오류 상세:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause
    })
    return NextResponse.json(
      { 
        error: '게시글 생성 중 오류가 발생했습니다.',
        details: error.message,
        type: error.name
      },
      { status: 500 }
    )
  }
}

// 자동 포스팅 통계 조회
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    // 최근 7일간 자동 생성된 게시글 통계
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const autoPosts = await prisma.post.findMany({
      where: {
        nickname: '무주택촌봇',
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        views: true,
        upvotes: true,
        downvotes: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 카테고리별 통계
    const categoryStats = await prisma.post.groupBy({
      by: ['title'],
      where: {
        nickname: '무주택촌봇',
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      _count: {
        id: true
      }
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalAutoPosts: autoPosts.length,
        recentPosts: autoPosts.slice(0, 10),
        categoryStats
      }
    })

  } catch (error) {
    console.error('자동 포스팅 통계 조회 오류:', error)
    return NextResponse.json(
      { error: '통계 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
