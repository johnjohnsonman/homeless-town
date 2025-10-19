import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '15')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const location = searchParams.get('location') || ''

    const skip = (page - 1) * limit

    // 검색 조건
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } }
      ]
    }

    if (type) {
      where.type = type
    }

    if (location) {
              where.location = { contains: location }
    }

    // 게시글 데이터 조회
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.post.count({ where })
    ])

    // 응답 데이터 변환
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      type: '원룸', // 기본값
      location: '서울시 강남구', // 기본값
      budget: '월세 80만원', // 기본값
      author: '익명',
      rating: 4.5,
      views: post.views,
      comments: 0,
      urgent: false,
      verified: false,
      createdAt: post.createdAt
    }))

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Housing posts API error:', error)
    return NextResponse.json(
      { error: '게시글 데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
