import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const querySchema = z.object({
  window: z.string().default('7d'),
  limit: z.coerce.number().min(1).max(50).default(10),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { window, limit } = querySchema.parse({
      window: searchParams.get('window'),
      limit: searchParams.get('limit'),
    })

    // Calculate date based on window
    const now = new Date()
    let startDate: Date
    
    if (window === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    } else if (window === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    } else {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // default to 7d
    }

    // First get admin pick posts
    const adminPicks = await prisma.post.findMany({
      where: {
        adminPick: true,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        upvotes: true,
        adminPick: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    // Then get top posts by upvotes
    const topPosts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        adminPick: false, // Exclude admin picks as they're already included
      },
      select: {
        id: true,
        title: true,
        slug: true,
        upvotes: true,
        adminPick: true,
      },
      orderBy: {
        upvotes: 'desc',
      },
      take: limit - adminPicks.length,
    })

    // Combine and sort: admin picks first, then by upvotes
    const combinedPosts = [...adminPicks, ...topPosts]
    
    // Sort by adminPick first, then by upvotes
    const sortedPosts = combinedPosts.sort((a, b) => {
      if (a.adminPick && !b.adminPick) return -1
      if (!a.adminPick && b.adminPick) return 1
      return b.upvotes - a.upvotes
    })

    return NextResponse.json(sortedPosts.slice(0, limit))
  } catch (error) {
    console.error('Error fetching popular posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular posts' },
      { status: 500 }
    )
  }
}
