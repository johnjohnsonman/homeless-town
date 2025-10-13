import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('Comment 테이블 마이그레이션 시작...')
    
    // Comment 테이블 생성
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Comment" (
        "id" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "author" TEXT NOT NULL,
        "postId" TEXT NOT NULL,
        "parentId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "likes" INTEGER NOT NULL DEFAULT 0,
        "dislikes" INTEGER NOT NULL DEFAULT 0,
        "upvotes" INTEGER NOT NULL DEFAULT 0,
        "downvotes" INTEGER NOT NULL DEFAULT 0,
        
        CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
      )
    `
    
    // 인덱스 생성
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Comment_postId_idx" ON "Comment"("postId")
    `
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Comment_author_idx" ON "Comment"("author")
    `
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Comment_createdAt_idx" ON "Comment"("createdAt")
    `
    
    // 외래 키 제약 조건 추가
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" 
        FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE
      `
    } catch (error: any) {
      if (!error.message.includes('already exists')) {
        throw error
      }
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" 
        FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE
      `
    } catch (error: any) {
      if (!error.message.includes('already exists')) {
        throw error
      }
    }
    
    console.log('Comment 테이블 마이그레이션 완료!')
    
    return NextResponse.json({
      success: true,
      message: 'Comment 테이블이 성공적으로 생성되었습니다.'
    })
  } catch (error: any) {
    console.error('마이그레이션 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '마이그레이션 실패',
        details: error.message
      },
      { status: 500 }
    )
  }
}

