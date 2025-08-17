import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST: 좋아요 추가/제거 (토글)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json()
    const postId = params.id

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 기존 좋아요 확인
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        postId
      }
    })

    if (existingLike) {
      // 좋아요 제거
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      })

      // 게시글 좋아요 수 감소
      await prisma.post.update({
        where: { id: postId },
        data: {
          upvotes: {
            decrement: 1
          }
        }
      })

      // 사용자 받은 좋아요 수 감소
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { author: true }
      })

      if (post?.author) {
        await prisma.user.update({
          where: { id: post.author },
          data: {
            totalLikes: {
              decrement: 1
            }
          }
        })
      }

      return NextResponse.json({ liked: false })
    } else {
      // 좋아요 추가 (익명 사용자 지원)
      await prisma.like.create({
        data: {
          userId,
          postId,
          user: undefined // 익명 사용자 지원
        }
      })

      // 게시글 좋아요 수 증가
      await prisma.post.update({
        where: { id: postId },
        data: {
          upvotes: {
            increment: 1
          }
        }
      })

      // 사용자 받은 좋아요 수 증가
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { author: true }
      })

      if (post?.author) {
        await prisma.user.update({
          where: { id: post.author },
          data: {
            totalLikes: {
              increment: 1
            }
          }
        })
      }

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('좋아요 처리 실패:', error)
    return NextResponse.json(
      { error: '좋아요를 처리하는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// GET: 사용자의 좋아요 상태 확인
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const postId = params.id

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const like = await prisma.like.findFirst({
      where: {
        userId,
        postId
      }
    })

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    console.error('좋아요 상태 확인 실패:', error)
    return NextResponse.json(
      { error: '좋아요 상태를 확인하는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
