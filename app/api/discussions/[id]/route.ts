import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: '토론글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 응답 데이터 포맷팅
    const formattedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author || '익명',
      views: post.views || 0,
      upvotes: post.upvotes || 0,
      downvotes: post.downvotes || 0,
      commentCount: post.commentCount || 0,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      tags: post.tags.map(pt => pt.tag.name),
      marketTrend: post.marketTrend || null,
      isHot: post.isHot || false,
      isNew: post.isNew || false,
      isPopular: post.isPopular || false,
      type: post.type || 'discussion'
    }

    return NextResponse.json({
      post: formattedPost
    })

  } catch (error) {
    console.error('Get discussion error:', error)
    return NextResponse.json(
      { error: '토론글을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, content, tags, marketTrend, password } = body

    // 필수 필드 검증
    if (!title || !content || !password) {
      return NextResponse.json(
        { error: '제목, 내용, 비밀번호는 필수입니다.' },
        { status: 400 }
      )
    }

    // 글 찾기
    const post = await prisma.post.findUnique({
      where: { id }
    })

    if (!post) {
      return NextResponse.json(
        { error: '토론글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 비밀번호 확인
    if (post.password !== password) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      )
    }

    // 기존 태그 관계 삭제
    await prisma.postTag.deleteMany({
      where: { postId: id }
    })

    // 글 수정
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        marketTrend,
        updatedAt: new Date()
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    // 새 태그 연결
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // 기존 태그 찾기 또는 새로 생성
        let tag = await prisma.tag.findUnique({
          where: { name: tagName }
        })

        if (!tag) {
          tag = await prisma.tag.create({
            data: { name: tagName }
          })
        }

        // PostTag 연결 생성
        await prisma.postTag.create({
          data: {
            postId: id,
            tagId: tag.id
          }
        })
      }
    }

    // 업데이트된 글 다시 조회 (태그 포함)
    const finalPost = await prisma.post.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    // 응답 데이터 포맷팅
    const formattedPost = {
      id: finalPost!.id,
      title: finalPost!.title,
      content: finalPost!.content,
      author: finalPost!.author || '익명',
      nickname: finalPost!.nickname,
      views: finalPost!.views || 0,
      upvotes: finalPost!.upvotes || 0,
      downvotes: finalPost!.downvotes || 0,
      commentCount: finalPost!.commentCount || 0,
      createdAt: finalPost!.createdAt,
      updatedAt: finalPost!.updatedAt,
      tags: finalPost!.tags.map(pt => pt.tag.name),
      marketTrend: finalPost!.marketTrend || null,
      isHot: finalPost!.isHot || false,
      isNew: finalPost!.isNew || false,
      isPopular: finalPost!.isPopular || false,
      type: finalPost!.type || 'discussion'
    }

    return NextResponse.json({
      post: formattedPost
    })

  } catch (error) {
    console.error('Update discussion error:', error)
    return NextResponse.json(
      { error: '토론글 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { password } = body

    // 비밀번호 확인
    if (!password) {
      return NextResponse.json(
        { error: '비밀번호는 필수입니다.' },
        { status: 400 }
      )
    }

    // 글 찾기
    const post = await prisma.post.findUnique({
      where: { id }
    })

    if (!post) {
      return NextResponse.json(
        { error: '토론글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 비밀번호 확인
    if (post.password !== password) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      )
    }

    // 먼저 PostTag 관계 삭제
    await prisma.postTag.deleteMany({
      where: { postId: id }
    })

    // 그 다음 Post 삭제
    await prisma.post.delete({
      where: { id }
    })

    return NextResponse.json({
      message: '토론글이 성공적으로 삭제되었습니다.'
    })

  } catch (error) {
    console.error('Delete discussion error:', error)
    return NextResponse.json(
      { error: '토론글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
