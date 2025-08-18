import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST: 댓글 비공감 토글
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { userId } = await request.json()
    const { commentId } = params

    // 기존 비공감 확인
    const existingDislike = await prisma.commentDislike.findFirst({
      where: {
        commentId: commentId,
        userId: userId || null
      }
    })

    if (existingDislike) {
      // 비공감 취소
      await prisma.commentDislike.delete({
        where: { id: existingDislike.id }
      })

      // 댓글의 비공감 수 감소
      await prisma.comment.update({
        where: { id: commentId },
        data: {
          downvotes: {
            decrement: 1
          }
        }
      })

      const response = NextResponse.json({ disliked: false })
      
      // Render에서 동적 데이터 업데이트를 위해 캐시 방지
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      
      return response
    } else {
      // 비공감 추가
      await prisma.commentDislike.create({
        data: {
          commentId: commentId,
          userId: userId || null
        }
      })

      // 댓글의 비공감 수 증가
      await prisma.comment.update({
        where: { id: commentId },
        data: {
          downvotes: {
            increment: 1
          }
        }
      })

      const response = NextResponse.json({ disliked: true })
      
      // Render에서 동적 데이터 업데이트를 위해 캐시 방지
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      
      return response
    }
  } catch (error) {
    console.error('댓글 비공감 처리 실패:', error)
    return NextResponse.json(
      { error: '비공감을 처리하는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// GET: 댓글 비공감 상태 확인
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const { commentId } = params

    if (!userId) {
      return NextResponse.json({ disliked: false })
    }

    const dislike = await prisma.commentDislike.findFirst({
      where: {
        commentId: commentId,
        userId: userId
      }
    })

    return NextResponse.json({ disliked: !!dislike })
  } catch (error) {
    console.error('댓글 비공감 상태 확인 실패:', error)
    return NextResponse.json({ disliked: false })
  }
}
