import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ tags })

  } catch (error) {
    console.error('Tags API error:', error)
    return NextResponse.json(
      { error: '태그 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
