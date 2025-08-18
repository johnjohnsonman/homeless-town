import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST: 댓글 공감 토글
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { userId } = await request.json()
    const { commentId } = params

    // 기존 공감 확인
    const existingLike = await prisma.commentLike.findFirst({
      where: {
        commentId: commentId,
        userId: userId || null
      }
    })

    if (existingLike) {
      // 공감 취소
      await prisma.commentLike.delete({
        where: { id: existingLike.id }
      })

      // 댓글의 공감 수 감소
      await prisma.comment.update({
        where: { id: commentId },
        data: {
          upvotes: {
            decrement: 1
          }
        }
      })

      const response = NextResponse.json({ liked: false })
      
      // Render에서 동적 데이터 업데이트를 위해 캐시 방지
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      
      return response
    } else {
      // 공감 추가
      await prisma.commentLike.create({
        data: {
          commentId: commentId,
          userId: userId || null
        }
      })

      // 댓글의 공감 수 증가
      await prisma.comment.update({
        where: { id: commentId },
        data: {
          upvotes: {
            increment: 1
          }
        }
      })

      const response = NextResponse.json({ liked: true })
      
      // Render에서 동적 데이터 업데이트를 위해 캐시 방지
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      
      return response
    }
  } catch (error) {
    console.error('댓글 공감 처리 실패:', error)
    return NextResponse.json(
      { error: '공감을 처리하는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// GET: 댓글 공감 상태 확인
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const { commentId } = params

    if (!userId) {
      return NextResponse.json({ liked: false })
    }

    const like = await prisma.commentLike.findFirst({
      where: {
        commentId: commentId,
        userId: userId
      }
    })

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    console.error('댓글 공감 상태 확인 실패:', error)
    return NextResponse.json({ liked: false })
  }
}
