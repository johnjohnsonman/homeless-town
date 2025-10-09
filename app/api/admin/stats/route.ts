import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // 기본 통계 데이터 수집
    const [
      totalUsers,
      totalPosts,
      totalDiscussions,
      totalGuides,
      totalComments,
      activePosts,
      urgentPosts,
      verifiedPosts,
      adminPickPosts,
      hotDiscussions,
      popularDiscussions,
      newDiscussions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count({ where: { type: 'post' } }),
      prisma.post.count({ where: { type: 'discussion' } }),
      prisma.contractGuide.count(),
      prisma.comment.count(),
      prisma.post.count({ where: { type: 'post', urgent: false } }),
      prisma.post.count({ where: { urgent: true } }),
      prisma.post.count({ where: { verified: true } }),
      prisma.post.count({ where: { adminPick: true } }),
      prisma.post.count({ where: { isHot: true } }),
      prisma.post.count({ where: { isPopular: true } }),
      prisma.post.count({ where: { isNew: true } })
    ])

    // 최근 활동 데이터
    const recentPosts = await prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,
        nickname: true,
        author: true
      }
    })

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true
      }
    })

    // 카테고리별 가이드 통계
    const guidesByCategory = await prisma.contractGuide.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    })

    // 월별 게시글 통계 (최근 6개월)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyPosts = await prisma.post.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      _count: {
        id: true
      }
    })

    // 인기 태그 통계
    const popularTags = await prisma.postTag.groupBy({
      by: ['tagId'],
      _count: {
        tagId: true
      },
      orderBy: {
        _count: {
          tagId: 'desc'
        }
      },
      take: 10
    })

    // 태그 이름 가져오기
    const tagIds = popularTags.map(pt => pt.tagId)
    const tags = await prisma.tag.findMany({
      where: {
        id: {
          in: tagIds
        }
      },
      select: {
        id: true,
        name: true
      }
    })

    const tagsWithNames = popularTags.map(pt => {
      const tag = tags.find(t => t.id === pt.tagId)
      return {
        name: tag?.name || 'Unknown',
        count: pt._count.tagId
      }
    })

    // 총 조회수 계산
    const totalViews = await prisma.post.aggregate({
      _sum: {
        views: true
      }
    })

    // 총 추천수 계산
    const totalUpvotes = await prisma.post.aggregate({
      _sum: {
        upvotes: true
      }
    })

    const stats = {
      overview: {
        totalUsers,
        totalPosts,
        totalDiscussions,
        totalGuides,
        totalComments,
        totalViews: totalViews._sum.views || 0,
        totalUpvotes: totalUpvotes._sum.upvotes || 0
      },
      posts: {
        active: activePosts,
        urgent: urgentPosts,
        verified: verifiedPosts,
        adminPick: adminPickPosts
      },
      discussions: {
        hot: hotDiscussions,
        popular: popularDiscussions,
        new: newDiscussions
      },
      guides: {
        byCategory: guidesByCategory.map(g => ({
          category: g.category,
          count: g._count.category
        }))
      },
      recentActivity: {
        posts: recentPosts.map(post => ({
          id: post.id,
          title: post.title,
          type: post.type,
          author: post.nickname || post.author || '익명',
          createdAt: post.createdAt
        })),
        users: recentUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }))
      },
      popularTags: tagsWithNames,
      monthlyStats: monthlyPosts.map(mp => ({
        month: mp.createdAt.toISOString().substring(0, 7),
        count: mp._count.id
      }))
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Get admin stats error:', error)
    return NextResponse.json(
      { error: '통계 데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

