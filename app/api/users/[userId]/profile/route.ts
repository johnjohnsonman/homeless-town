import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 사용자 프로필 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        posts: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            slug: true,
            type: true,
            createdAt: true,
            upvotes: true,
            views: true,
            commentCount: true
          }
        },
        bookmarks: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            post: {
              select: {
                id: true,
                title: true,
                slug: true,
                type: true,
                createdAt: true,
                upvotes: true,
                views: true,
                commentCount: true
              }
            }
          }
        },
        _count: {
          select: {
            posts: true,
            bookmarks: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 소셜 링크와 설정 파싱
    let socialLinks = null
    let preferences = null

    if (user.profile?.socialLinks) {
      try {
        socialLinks = JSON.parse(user.profile.socialLinks)
      } catch (e) {
        socialLinks = null
      }
    }

    if (user.profile?.preferences) {
      try {
        preferences = JSON.parse(user.profile.preferences)
      } catch (e) {
        preferences = null
      }
    }

    const profile = {
      ...user,
      profile: user.profile ? {
        ...user.profile,
        socialLinks,
        preferences
      } : null
    }

    return NextResponse.json({
      success: true,
      user: profile
    })

  } catch (error) {
    console.error('Get user profile error:', error)
    return NextResponse.json(
      { error: '사용자 프로필을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// 사용자 프로필 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    const body = await request.json()
    const { bio, avatar, location, phone, website, socialLinks, preferences } = body

    // 사용자 존재 확인
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 소셜 링크와 설정을 JSON 문자열로 변환
    const socialLinksJson = socialLinks ? JSON.stringify(socialLinks) : null
    const preferencesJson = preferences ? JSON.stringify(preferences) : null

    // 프로필 업데이트 또는 생성
    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        bio,
        avatar,
        location,
        phone,
        website,
        socialLinks: socialLinksJson,
        preferences: preferencesJson,
        updatedAt: new Date()
      },
      create: {
        userId,
        bio,
        avatar,
        location,
        phone,
        website,
        socialLinks: socialLinksJson,
        preferences: preferencesJson
      }
    })

    return NextResponse.json({
      success: true,
      profile: updatedProfile
    })

  } catch (error) {
    console.error('Update user profile error:', error)
    return NextResponse.json(
      { error: '프로필 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

