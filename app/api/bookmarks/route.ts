import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 북마크 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
              type: true,
              createdAt: true,
              upvotes: true,
              views: true,
              commentCount: true,
              nickname: true,
              tags: {
                include: {
                  tag: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          }
        }
      }),
      prisma.bookmark.count({ where: { userId } })
    ])

    return NextResponse.json({
      success: true,
      bookmarks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get bookmarks error:', error)
    return NextResponse.json(
      { error: '북마크를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// 북마크 추가/제거
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, postId } = body

    if (!userId || !postId) {
      return NextResponse.json(
        { error: '사용자 ID와 게시글 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 기존 북마크 확인
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    })

    if (existingBookmark) {
      // 북마크 제거
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      })

      return NextResponse.json({
        success: true,
        action: 'removed',
        message: '북마크가 제거되었습니다.'
      })
    } else {
      // 북마크 추가
      await prisma.bookmark.create({
        data: {
          userId,
          postId
        }
      })

      return NextResponse.json({
        success: true,
        action: 'added',
        message: '북마크가 추가되었습니다.'
      })
    }

  } catch (error) {
    console.error('Toggle bookmark error:', error)
    return NextResponse.json(
      { error: '북마크 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// 북마크 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const postId = searchParams.get('postId')

    if (!userId || !postId) {
      return NextResponse.json(
        { error: '사용자 ID와 게시글 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    })

    if (!bookmark) {
      return NextResponse.json(
        { error: '북마크를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    await prisma.bookmark.delete({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: '북마크가 삭제되었습니다.'
    })

  } catch (error) {
    console.error('Delete bookmark error:', error)
    return NextResponse.json(
      { error: '북마크 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

