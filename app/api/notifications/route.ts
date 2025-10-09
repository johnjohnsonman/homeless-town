import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 사용자 알림 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    let where: any = { userId }
    if (unreadOnly) {
      where.isRead = false
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.userNotification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.userNotification.count({ where }),
      prisma.userNotification.count({ where: { userId, isRead: false } })
    ])

    // 데이터 파싱
    const parsedNotifications = notifications.map(notification => ({
      ...notification,
      data: notification.data ? JSON.parse(notification.data) : null
    }))

    return NextResponse.json({
      success: true,
      notifications: parsedNotifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: '알림을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// 새 알림 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, title, message, data } = body

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    const notification = await prisma.userNotification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data ? JSON.stringify(data) : null
      }
    })

    return NextResponse.json({
      success: true,
      notification: {
        ...notification,
        data: notification.data ? JSON.parse(notification.data) : null
      }
    })

  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json(
      { error: '알림 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// 알림 읽음 처리
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId, userId, markAllAsRead } = body

    if (markAllAsRead && userId) {
      // 모든 알림을 읽음 처리
      await prisma.userNotification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      })

      return NextResponse.json({
        success: true,
        message: '모든 알림이 읽음 처리되었습니다.'
      })
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: '알림 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const notification = await prisma.userNotification.findUnique({
      where: { id: notificationId }
    })

    if (!notification) {
      return NextResponse.json(
        { error: '알림을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const updatedNotification = await prisma.userNotification.update({
      where: { id: notificationId },
      data: { isRead: true }
    })

    return NextResponse.json({
      success: true,
      notification: {
        ...updatedNotification,
        data: updatedNotification.data ? JSON.parse(updatedNotification.data) : null
      }
    })

  } catch (error) {
    console.error('Update notification error:', error)
    return NextResponse.json(
      { error: '알림 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

