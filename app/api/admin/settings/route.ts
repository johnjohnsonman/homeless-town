import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 시스템 설정 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || ''
    const isPublic = searchParams.get('isPublic')

    let where: any = {}
    
    if (category && category !== 'all') {
      where.category = category
    }

    if (isPublic !== null) {
      where.isPublic = isPublic === 'true'
    }

    const settings = await prisma.systemSetting.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { key: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      settings
    })

  } catch (error) {
    console.error('Get system settings error:', error)
    return NextResponse.json(
      { error: '시스템 설정을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// 시스템 설정 생성/수정
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value, description, category, isPublic } = body

    // 필수 필드 검증
    if (!key || !value) {
      return NextResponse.json(
        { error: '키와 값은 필수입니다.' },
        { status: 400 }
      )
    }

    // 기존 설정 확인
    const existingSetting = await prisma.systemSetting.findUnique({
      where: { key }
    })

    let setting
    if (existingSetting) {
      // 기존 설정 업데이트
      setting = await prisma.systemSetting.update({
        where: { key },
        data: {
          value,
          description,
          category: category || 'general',
          isPublic: isPublic || false,
          updatedAt: new Date()
        }
      })
    } else {
      // 새 설정 생성
      setting = await prisma.systemSetting.create({
        data: {
          key,
          value,
          description,
          category: category || 'general',
          isPublic: isPublic || false
        }
      })
    }

    return NextResponse.json({
      success: true,
      setting
    })

  } catch (error) {
    console.error('Create/Update system setting error:', error)
    return NextResponse.json(
      { error: '시스템 설정 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// 시스템 설정 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: '삭제할 설정의 키가 필요합니다.' },
        { status: 400 }
      )
    }

    const setting = await prisma.systemSetting.findUnique({
      where: { key }
    })

    if (!setting) {
      return NextResponse.json(
        { error: '설정을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    await prisma.systemSetting.delete({
      where: { key }
    })

    return NextResponse.json({
      success: true,
      message: '시스템 설정이 삭제되었습니다.'
    })

  } catch (error) {
    console.error('Delete system setting error:', error)
    return NextResponse.json(
      { error: '시스템 설정 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

