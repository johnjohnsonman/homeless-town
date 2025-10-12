import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST: 토론글 좋아요 (로그인 없이 무제한 가능)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: postId } = params

    // 로그인 체크 없이 바로 좋아요 수 증가
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        upvotes: {
          increment: 1
        }
      },
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
      liked: true,
      updatedPost,
      message: '좋아요가 추가되었습니다.'
    })
    
    // Render에서 동적 데이터 업데이트를 위해 캐시 방지
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('토론글 좋아요 처리 실패:', error)
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
    const { id: postId } = params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const existingLike = await prisma.like.findFirst({
      where: {
        postId: postId,
        userId: userId || null
      }
    })

    return NextResponse.json({ 
      liked: !!existingLike 
    })
  } catch (error) {
    console.error('좋아요 상태 확인 실패:', error)
    return NextResponse.json(
      { error: '좋아요 상태를 확인하는데 실패했습니다.' },
      { status: 500 }
    )
  }
} 