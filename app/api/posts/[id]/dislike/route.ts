import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST: 비공감 추가/제거 (토글)
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

    // 기존 비공감 확인
    const existingDislike = await prisma.dislike.findFirst({
      where: {
        userId,
        postId
      }
    })

    if (existingDislike) {
      // 비공감 제거
      await prisma.dislike.delete({
        where: {
          id: existingDislike.id
        }
      })

      // 게시글 비공감 수 감소
      await prisma.post.update({
        where: { id: postId },
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
      await prisma.dislike.create({
        data: {
          userId,
          postId,
          user: undefined // 익명 사용자 지원
        }
      })

      // 게시글 비공감 수 증가
      await prisma.post.update({
        where: { id: postId },
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
    console.error('비공감 처리 실패:', error)
    return NextResponse.json(
      { error: '비공감을 처리하는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// GET: 사용자의 비공감 상태 확인
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

    const dislike = await prisma.dislike.findFirst({
      where: {
        userId,
        postId
      }
    })

    return NextResponse.json({ disliked: !!dislike })
  } catch (error) {
    console.error('비공감 상태 확인 실패:', error)
    return NextResponse.json(
      { error: '비공감 상태를 확인하는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
