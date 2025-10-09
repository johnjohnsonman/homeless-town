import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 특정 가이드 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const guide = await prisma.contractGuide.findUnique({
      where: { id },
      include: {
        tags: true
      }
    })

    if (!guide) {
      return NextResponse.json(
        { error: '계약 가이드를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      guide
    })

  } catch (error) {
    console.error('Get contract guide error:', error)
    return NextResponse.json(
      { error: '계약 가이드를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// 가이드 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, category, difficulty, readTime, summary, content, tags, isNew } = body

    // 가이드 존재 확인
    const existingGuide = await prisma.contractGuide.findUnique({
      where: { id }
    })

    if (!existingGuide) {
      return NextResponse.json(
        { error: '계약 가이드를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 기존 태그 삭제
    await prisma.contractGuideTag.deleteMany({
      where: { guideId: id }
    })

    // 가이드 수정
    const updatedGuide = await prisma.contractGuide.update({
      where: { id },
      data: {
        title,
        category,
        difficulty,
        readTime,
        summary,
        content,
        isNew: isNew || false,
        updatedAt: new Date(),
        tags: {
          create: (tags || []).map((tagName: string) => ({
            name: tagName
          }))
        }
      },
      include: {
        tags: true
      }
    })

    return NextResponse.json({
      success: true,
      guide: updatedGuide
    })

  } catch (error) {
    console.error('Update contract guide error:', error)
    return NextResponse.json(
      { error: '계약 가이드 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// 가이드 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 가이드 존재 확인
    const existingGuide = await prisma.contractGuide.findUnique({
      where: { id }
    })

    if (!existingGuide) {
      return NextResponse.json(
        { error: '계약 가이드를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 가이드 삭제
    await prisma.contractGuide.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: '계약 가이드가 삭제되었습니다.'
    })

  } catch (error) {
    console.error('Delete contract guide error:', error)
    return NextResponse.json(
      { error: '계약 가이드 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
