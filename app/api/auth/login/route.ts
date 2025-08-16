import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: '사용자명과 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 어드민 계정 조회
    const admin = await prisma.admin.findUnique({
      where: { username }
    })

    if (!admin) {
      return NextResponse.json(
        { error: '존재하지 않는 사용자명입니다.' },
        { status: 401 }
      )
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { error: '비활성화된 계정입니다.' },
        { status: 401 }
      )
    }

    // 비밀번호 검증
    const isValidPassword = await bcrypt.compare(password, admin.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    // 마지막 로그인 시간 업데이트
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    })

    // 응답 데이터 (비밀번호 제외)
    const { password: _, ...adminData } = admin

    return NextResponse.json({
      message: '로그인 성공',
      user: adminData
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
