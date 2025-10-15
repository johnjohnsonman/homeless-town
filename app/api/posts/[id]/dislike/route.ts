import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST: 비공감 추가 (로그인 없이 무제한 가능)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id

    // 로그인 체크 없이 바로 비공감 수 증가
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        downvotes: {
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
      disliked: true,
      updatedPost,
      message: '비공감이 추가되었습니다.'
    })
    
    // Render에서 동적 데이터 업데이트를 위해 캐시 방지
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('비공감 처리 실패:', error)
    return NextResponse.json(
      { error: '비공감을 처리하는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// GET: 게시글 비공감 수 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        upvotes: true,
        downvotes: true
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      upvotes: post.upvotes,
      downvotes: post.downvotes
    })
  } catch (error) {
    console.error('비공감 상태 확인 실패:', error)
    return NextResponse.json(
      { error: '비공감 상태를 확인하는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
