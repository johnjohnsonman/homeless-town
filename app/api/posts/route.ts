import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '25')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'latest'

    // 페이지네이션 계산
    const skip = (page - 1) * limit

    // 필터 조건 구성
    const where: any = {}
    
    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag
          }
        }
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } }
      ]
    }

    // 정렬 조건
    let orderBy: any = {}
    switch (sort) {
      case 'popular':
        orderBy = { upvotes: 'desc' }
        break
      case 'views':
        orderBy = { views: 'desc' }
        break
      case 'latest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    // 게시글 조회
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ])

    // 각 게시글의 실제 댓글 수 조회
    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const actualCommentCount = await prisma.comment.count({
          where: {
            postId: post.id,
            parentId: null // 대댓글이 아닌 최상위 댓글만
          }
        });
        
        return {
          ...post,
          actualCommentCount
        };
      })
    );

    // 응답 데이터 구성
    const formattedPosts = postsWithCommentCount.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      views: post.views,
      commentCount: post.actualCommentCount, // 실제 댓글 수 사용
      adminPick: post.adminPick,
      tags: post.tags.map(pt => ({
        id: pt.tag.id,
        name: pt.tag.name,
        slug: pt.tag.slug
      }))
    }))

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Posts API error:', error)
    return NextResponse.json(
      { error: '게시글 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
