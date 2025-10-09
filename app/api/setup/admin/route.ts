import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// 관리자 계정 생성 API (초기 설정용)
export async function POST(request: NextRequest) {
  try {
    // 보안: 이미 관리자가 있으면 생성 불가
    const existingAdmin = await prisma.admin.findFirst({
      where: { username: 'admin' }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: '관리자 계정이 이미 존재합니다.' },
        { status: 400 }
      )
    }

    // 관리자 계정 생성
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        name: '관리자',
        email: 'admin@homeless-town.com',
        role: 'admin'
      }
    })

    return NextResponse.json({
      success: true,
      message: '관리자 계정이 생성되었습니다.',
      admin: {
        username: admin.username,
        email: admin.email,
        name: admin.name
      }
    })

  } catch (error) {
    console.error('관리자 생성 오류:', error)
    
    // 더 자세한 오류 정보 제공
    let errorMessage = '관리자 계정 생성 중 오류가 발생했습니다.'
    
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        errorMessage = '데이터베이스 연결 오류입니다. DATABASE_URL을 확인해주세요.'
      } else if (error.message.includes('relation') || error.message.includes('table')) {
        errorMessage = '데이터베이스 테이블이 없습니다. 마이그레이션을 실행해주세요.'
      } else {
        errorMessage = `오류: ${error.message}`
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// 관리자 존재 여부 확인
export async function GET() {
  try {
    const adminCount = await prisma.admin.count()
    
    return NextResponse.json({
      hasAdmin: adminCount > 0,
      adminCount
    })
  } catch (error) {
    console.error('관리자 확인 오류:', error)
    return NextResponse.json(
      { error: '관리자 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

