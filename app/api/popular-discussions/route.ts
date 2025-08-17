import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 공감 순으로 정렬하여 상위 10개 토론글 조회
    const popularDiscussions = await prisma.post.findMany({
      where: {
        type: 'discussion'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        upvotes: true,
        downvotes: true,
        commentCount: true,
        createdAt: true,
        nickname: true,
        tags: {
          select: {
            tag: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { upvotes: 'desc' },
        { commentCount: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 10
    })

    // 태그 정보를 평면화하고 공감 점수 계산
    const discussionsWithScore = popularDiscussions.map(discussion => {
      const tags = discussion.tags.map(t => t.tag.name)
      const score = discussion.upvotes - discussion.downvotes
      
      return {
        id: discussion.id,
        title: discussion.title,
        slug: discussion.slug,
        upvotes: discussion.upvotes,
        downvotes: discussion.downvotes,
        commentCount: discussion.commentCount,
        createdAt: discussion.createdAt,
        nickname: discussion.nickname,
        tags,
        score
      }
    })

    return NextResponse.json({
      success: true,
      discussions: discussionsWithScore
    })
  } catch (error) {
    console.error('인기토론글 조회 실패:', error)
    return NextResponse.json(
      { success: false, error: '인기토론글을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
