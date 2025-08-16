import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 먼저 PostTag 관계 삭제
    await prisma.postTag.deleteMany({
      where: { postId: id }
    })

    // 그 다음 Post 삭제
    await prisma.post.delete({
      where: { id }
    })

    return NextResponse.json({
      message: '게시글이 성공적으로 삭제되었습니다.'
    })

  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json(
      { error: '게시글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
