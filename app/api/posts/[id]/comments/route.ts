import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: 게시글의 댓글 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = params.id

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
        parentId: null // 대댓글이 아닌 최상위 댓글만
      },
      include: {
        replies: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('댓글 조회 실패:', error)
    return NextResponse.json(
      { error: '댓글을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 새 댓글 생성
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { content, author, parentId } = await request.json()
    const postId = params.id

    if (!content || !author) {
      return NextResponse.json(
        { error: '댓글 내용과 작성자가 필요합니다.' },
        { status: 400 }
      )
    }

    // 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 댓글 생성
    const comment = await prisma.comment.create({
      data: {
        content,
        author,
        postId,
        parentId: parentId || null
      }
    })

    // 게시글의 댓글 수 업데이트
    await prisma.post.update({
      where: { id: postId },
      data: {
        commentCount: {
          increment: 1
        }
      }
    })

    // 익명 사용자는 사용자 업데이트를 건너뜀

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error('댓글 생성 실패:', error)
    return NextResponse.json(
      { error: '댓글을 생성하는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
