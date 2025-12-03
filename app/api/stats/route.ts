import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 오늘 게시글 수
    const todayPosts = await prisma.post.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    })

    // 총 회원수
    const totalUsers = await prisma.user.count()

    // 총 게시글 수
    const totalPosts = await prisma.post.count()

    // 총 토론글 수
    const totalDiscussions = await prisma.post.count({
      where: {
        type: 'discussion'
      }
    })

    // 총 자료 다운로드 수 (계약 가이드 다운로드 합계)
    const totalDownloads = await prisma.contractGuide.aggregate({
      _sum: {
        downloads: true
      }
    })

    // 성공 매칭 수 (임대 버디 관련 - 현재는 임시로 주거 게시판 게시글 수로 대체)
    // 실제로는 별도 매칭 테이블이 있으면 그걸 사용해야 함
    const successMatches = await prisma.post.count({
      where: {
        type: 'post'
      }
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        todayPosts,
        totalPosts,
        totalDiscussions,
        successMatches,
        totalDownloads: totalDownloads._sum.downloads || 0
      }
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: '통계 데이터를 가져오는 중 오류가 발생했습니다.',
        stats: {
          totalUsers: 0,
          todayPosts: 0,
          totalPosts: 0,
          totalDiscussions: 0,
          successMatches: 0,
          totalDownloads: 0
        }
      },
      { status: 500 }
    )
  }
}

