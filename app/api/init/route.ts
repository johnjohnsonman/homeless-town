import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// 초기 설정 API - 모든 것을 한번에 실행
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 초기 설정 시작...')
    
    const results = {
      migration: null,
      admin: null,
      errors: []
    }

    // 1. 관리자 계정 확인
    try {
      const existingAdmin = await prisma.admin.findFirst({
        where: { username: 'admin' }
      })
      
      if (existingAdmin) {
        return NextResponse.json({
          success: true,
          message: '✅ 관리자 계정이 이미 존재합니다!',
          admin: {
            username: existingAdmin.username,
            name: existingAdmin.name,
            email: existingAdmin.email
          },
          loginInfo: {
            username: 'admin',
            password: 'admin123'
          }
        })
      }
    } catch (error) {
      console.error('관리자 확인 오류:', error)
      results.errors.push(`관리자 확인 오류: ${error.message}`)
    }

    // 2. 관리자 계정 생성
    try {
      console.log('🔨 관리자 계정 생성 중...')
      
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

      results.admin = {
        username: admin.username,
        name: admin.name,
        email: admin.email
      }

      console.log('✅ 관리자 계정 생성 완료!')

    } catch (error) {
      console.error('관리자 생성 오류:', error)
      results.errors.push(`관리자 생성 오류: ${error.message}`)
    }

    // 결과 반환
    if (results.admin) {
      return NextResponse.json({
        success: true,
        message: '✅ 초기 설정이 완료되었습니다!',
        admin: results.admin,
        loginInfo: {
          username: 'admin',
          password: 'admin123'
        },
        errors: results.errors
      })
    } else {
      return NextResponse.json({
        success: false,
        message: '❌ 초기 설정에 실패했습니다.',
        errors: results.errors
      }, { status: 500 })
    }

  } catch (error) {
    console.error('초기 설정 오류:', error)
    
    return NextResponse.json({
      success: false,
      message: '초기 설정 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// 상태 확인
export async function GET() {
  try {
    // 데이터베이스 연결 테스트
    await prisma.$connect()
    
    // 관리자 존재 여부 확인
    const adminCount = await prisma.admin.count()
    const hasAdmin = adminCount > 0
    
    return NextResponse.json({
      success: true,
      databaseConnected: true,
      hasAdmin,
      adminCount,
      message: hasAdmin ? '관리자 계정이 존재합니다' : '관리자 계정이 없습니다'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      databaseConnected: false,
      hasAdmin: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
