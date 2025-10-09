import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 계약 가이드 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // 필터링 조건
    let where: any = {}
    
    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
        { content: { contains: search } }
      ]
    }

    // 가이드 데이터 조회
    const [guides, total] = await Promise.all([
      prisma.contractGuide.findMany({
        where,
        skip,
        take: limit,
        include: {
          tags: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contractGuide.count({ where })
    ])

    return NextResponse.json({
      success: true,
      guides,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get contract guides error:', error)
    return NextResponse.json(
      { error: '계약 가이드를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// 새 계약 가이드 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, category, difficulty, readTime, summary, content, tags, isNew } = body

    // 필수 필드 검증
    if (!title || !category || !difficulty || !readTime || !summary || !content) {
      return NextResponse.json(
        { error: '제목, 카테고리, 난이도, 읽기시간, 요약, 내용은 필수입니다.' },
        { status: 400 }
      )
    }

    // 새 가이드 생성
    const newGuide = await prisma.contractGuide.create({
      data: {
        title,
        category,
        difficulty,
        readTime,
        summary,
        content,
        isNew: isNew || false,
        downloads: 0,
        rating: 0,
        tags: {
          create: (tags || []).map((tagName: string) => ({
            name: tagName
          }))
        }
      },
      include: {
        tags: true
      }
    })

    return NextResponse.json({
      success: true,
      guide: newGuide
    })

  } catch (error) {
    console.error('Create contract guide error:', error)
    return NextResponse.json(
      { error: '계약 가이드 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
