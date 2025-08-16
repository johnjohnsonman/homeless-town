import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST: 북마크 추가/제거 (토글)
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

      return NextResponse.json({ bookmarked: false })
    } else {
      // 북마크 추가
      await prisma.bookmark.create({
        data: {
          userId,
          postId
        }
      })

      return NextResponse.json({ bookmarked: true })
    }
  } catch (error) {
    console.error('북마크 처리 실패:', error)
    return NextResponse.json(
      { error: '북마크를 처리하는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// GET: 사용자의 북마크 상태 확인
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

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    })

    return NextResponse.json({ bookmarked: !!bookmark })
  } catch (error) {
    console.error('북마크 상태 확인 실패:', error)
    return NextResponse.json(
      { error: '북마크 상태를 확인하는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
