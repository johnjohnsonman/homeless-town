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
    return NextResponse.json(
      { error: '관리자 계정 생성 중 오류가 발생했습니다.' },
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

