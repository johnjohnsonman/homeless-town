import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Prisma 클라이언트 연결 테스트
    await prisma.$connect()
    console.log('Database connection successful for GET request')
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // 검색 조건
    const where = search ? {
      OR: [
        { username: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    } : {}

    // 사용자 데이터 조회
    const [users, total] = await Promise.all([
      prisma.admin.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          lastLogin: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.admin.count({ where })
    ])

    console.log('Found users:', users.length, 'Total:', total)

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Users GET API error:', error)
    return NextResponse.json(
      { error: '사용자 데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST request received')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { username, password, name, email, role } = body

    // 필수 필드 검증
    if (!username || !password || !name) {
      console.log('Missing required fields:', { username: !!username, password: !!password, name: !!name })
      return NextResponse.json(
        { error: '사용자명, 비밀번호, 이름은 필수입니다.' },
        { status: 400 }
      )
    }

    console.log('All required fields present')

    // 사용자명 중복 확인
    const existingUser = await prisma.admin.findUnique({
      where: { username }
    })

    if (existingUser) {
      console.log('Username already exists:', username)
      return NextResponse.json(
        { error: '이미 존재하는 사용자명입니다.' },
        { status: 400 }
      )
    }

    console.log('Username is unique, proceeding with creation')

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('Password hashed successfully')

    // 새 사용자 생성
    const newUser = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email: email || null,
        role: role || 'user',
        isActive: true
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLogin: true
      }
    })

    console.log('User created successfully:', newUser)

    return NextResponse.json({
      message: '사용자가 성공적으로 생성되었습니다.',
      user: newUser
    }, { status: 201 })

  } catch (error) {
    console.error('Create user error details:', error)
    if (error instanceof Error) {
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { error: '사용자 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
