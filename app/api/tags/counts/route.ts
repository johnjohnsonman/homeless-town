import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // 태그별 게시글 수 조회
    const tagCounts = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        posts: {
          _count: 'desc'
        }
      }
    })

    // 응답 데이터 포맷팅
    const tagsWithCounts = tagCounts.map(tag => ({
      name: tag.name,
      slug: tag.slug,
      count: tag._count.posts
    }))

    return NextResponse.json({
      success: true,
      tags: tagsWithCounts
    })

  } catch (error) {
    console.error('Tag counts API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '태그 카운트 조회 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
