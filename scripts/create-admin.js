const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('🔍 기존 관리자 계정 확인 중...')
    
    // 기존 관리자 확인
    const existingAdmin = await prisma.admin.findFirst({
      where: { username: 'admin' }
    })

    if (existingAdmin) {
      console.log('✅ 관리자 계정이 이미 존재합니다.')
      console.log(`   아이디: ${existingAdmin.username}`)
      console.log(`   이름: ${existingAdmin.name}`)
      console.log(`   이메일: ${existingAdmin.email}`)
      return
    }

    console.log('🔨 관리자 계정 생성 중...')
    
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    // 관리자 계정 생성
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        name: '관리자',
        email: 'admin@homeless-town.com',
        role: 'admin'
      }
    })

    console.log('✅ 관리자 계정이 생성되었습니다!')
    console.log('📋 로그인 정보:')
    console.log(`   아이디: ${admin.username}`)
    console.log(`   비밀번호: admin123`)
    console.log(`   이름: ${admin.name}`)
    console.log(`   이메일: ${admin.email}`)
    console.log('')
    console.log('🌐 로그인 URL: https://homeless-town.onrender.com/login')

  } catch (error) {
    console.error('❌ 관리자 계정 생성 실패:', error)
    
    if (error.message.includes('connect')) {
      console.error('💡 해결 방법:')
      console.error('   1. DATABASE_URL 환경 변수를 확인하세요')
      console.error('   2. 데이터베이스가 실행 중인지 확인하세요')
      console.error('   3. 네트워크 연결을 확인하세요')
    } else if (error.message.includes('relation') || error.message.includes('table')) {
      console.error('💡 해결 방법:')
      console.error('   1. 먼저 마이그레이션을 실행하세요: npx prisma migrate deploy')
      console.error('   2. 데이터베이스 스키마를 확인하세요')
    }
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
