import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 태그별 게시글 수 조회 - PostTag 테이블을 통해 연결
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
      count: tag._count.posts
    }))

    console.log('태그 카운트 조회 결과:', tagsWithCounts)

    return NextResponse.json({
      success: true,
      tags: tagsWithCounts
    })

  } catch (error) {
    console.error('Tag counts API error:', error)
    
    // 대안: 직접 PostTag 테이블에서 카운트 조회
    try {
      console.log('대안 방법으로 태그 카운트 조회 시도...')
      
      const alternativeCounts = await prisma.$queryRaw`
        SELECT t.name, COUNT(pt."postId") as count
        FROM "Tag" t
        LEFT JOIN "PostTag" pt ON t.id = pt."tagId"
        GROUP BY t.id, t.name
        ORDER BY count DESC
      `
      
      const formattedCounts = alternativeCounts.map((item: any) => ({
        name: item.name,
        count: Number(item.count)
      }))
      
      console.log('대안 태그 카운트 결과:', formattedCounts)
      
      return NextResponse.json({
        success: true,
        tags: formattedCounts
      })
      
    } catch (alternativeError) {
      console.error('대안 방법도 실패:', alternativeError)
      return NextResponse.json(
        { 
          success: false, 
          error: '태그 카운트 조회 중 오류가 발생했습니다.',
          details: error.message
        },
        { status: 500 }
      )
    }
  }
}
