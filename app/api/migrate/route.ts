import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    console.log('🚀 데이터베이스 마이그레이션 시작...')
    
    // 데이터베이스 연결 테스트
    await prisma.$connect()
    console.log('✅ 데이터베이스 연결 성공')
    
    // Prisma 마이그레이션 실행 (스키마 동기화)
    console.log('📊 스키마 동기화 중...')
    
    // 기본 테이블 생성 확인
    const result = await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Post" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "content" TEXT NOT NULL,
        "nickname" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "type" TEXT NOT NULL DEFAULT 'discussion',
        "urgent" BOOLEAN NOT NULL DEFAULT false,
        "verified" BOOLEAN NOT NULL DEFAULT false,
        "marketTrend" TEXT,
        "isHot" BOOLEAN NOT NULL DEFAULT false,
        "isNew" BOOLEAN NOT NULL DEFAULT false,
        "isPopular" BOOLEAN NOT NULL DEFAULT false,
        "adminPick" BOOLEAN NOT NULL DEFAULT false,
        "upvotes" INTEGER NOT NULL DEFAULT 0,
        "downvotes" INTEGER NOT NULL DEFAULT 0,
        "views" INTEGER NOT NULL DEFAULT 0,
        "commentCount" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      )
    `
    
    console.log('✅ Post 테이블 생성 완료')
    
    // Tag 테이블 생성
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Tag" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "slug" TEXT NOT NULL UNIQUE,
        "description" TEXT,
        "color" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    console.log('✅ Tag 테이블 생성 완료')
    
    // PostTag 테이블 생성
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "PostTag" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "postId" TEXT NOT NULL,
        "tagId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE,
        FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE
      )
    `
    
    console.log('✅ PostTag 테이블 생성 완료')
    
    // 기본 태그 생성
    const defaultTags = [
      '자유', '시황', '부동산시장', '임대시장', '분쟁사례', '보증금',
      '월세인상', '계약해지', '입주체크', '집주인소통', '법적권리',
      '안전수칙', '부동산', '투자', '정책'
    ]
    
    for (const tagName of defaultTags) {
      await prisma.$executeRaw`
        INSERT INTO "Tag" ("id", "name", "slug", "createdAt")
        VALUES (gen_random_uuid()::text, $1, $2, CURRENT_TIMESTAMP)
        ON CONFLICT ("name") DO NOTHING
      `, tagName, tagName.toLowerCase().replace(/\s+/g, '-')
    }
    
    console.log('✅ 기본 태그 생성 완료')
    
    // 테이블 생성 확인
    const postCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Post"`
    const tagCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Tag"`
    
    console.log('🎉 마이그레이션 완료!')
    
    return NextResponse.json({
      success: true,
      message: '데이터베이스 마이그레이션 완료',
      data: {
        postCount: postCount[0]?.count || 0,
        tagCount: tagCount[0]?.count || 0,
        tablesCreated: ['Post', 'Tag', 'PostTag']
      }
    })
    
  } catch (error) {
    console.error('마이그레이션 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '마이그레이션 실패',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
