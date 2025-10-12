import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST: 토론글 비공감/비공감 취소
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: postId } = params
    const { userId } = await request.json()

    // 기존 비공감 확인
    const existingDislike = await prisma.dislike.findFirst({
      where: {
        postId: postId,
        userId: userId || null
      }
    })

    if (existingDislike) {
      // 비공감 취소
      await prisma.dislike.delete({
        where: { id: existingDislike.id }
      })

      // 게시글의 비공감 수 감소
      await prisma.post.update({
        where: { id: postId },
        data: {
          downvotes: {
            decrement: 1
          }
        }
      })

      const response = NextResponse.json({ 
        disliked: false,
        message: '비공감이 취소되었습니다.'
      })
      
      // Render에서 동적 데이터 업데이트를 위해 캐시 방지
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      
      return response
    } else {
      // 비공감 추가 (익명 사용자 지원)
      await prisma.dislike.create({
        data: {
          userId: userId || null,
          postId: postId
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

      // 업데이트된 게시글 정보 조회
      const updatedPost = await prisma.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
          title: true,
          upvotes: true,
          downvotes: true,
          commentCount: true,
          createdAt: true
        }
      })

      const response = NextResponse.json({ 
        disliked: true,
        updatedPost,
        message: '비공감이 추가되었습니다.'
      })
      
      // Render에서 동적 데이터 업데이트를 위해 캐시 방지
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      
      return response
    }
  } catch (error) {
    console.error('토론글 비공감 처리 실패:', error)
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
    const { id: postId } = params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const existingDislike = await prisma.dislike.findFirst({
      where: {
        postId: postId,
        userId: userId || null
      }
    })

    return NextResponse.json({ 
      disliked: !!existingDislike 
    })
  } catch (error) {
    console.error('비공감 상태 확인 실패:', error)
    return NextResponse.json(
      { error: '비공감 상태를 확인하는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
