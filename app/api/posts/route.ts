import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const querySchema = z.object({
  tag: z.string().optional(),
  sort: z.enum(['recent', 'hot']).default('recent'),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { tag, sort, page, pageSize } = querySchema.parse({
      tag: searchParams.get('tag'),
      sort: searchParams.get('sort'),
      page: searchParams.get('page'),
      pageSize: searchParams.get('pageSize'),
    })

    const skip = (page - 1) * pageSize

    // Build where clause
    const where = tag && tag !== 'all' ? {
      tags: {
        some: {
          tag: {
            slug: tag
          }
        }
      }
    } : {}

    // Build orderBy clause
    const orderBy = sort === 'hot' 
      ? [
          { upvotes: 'desc' as const },
          { createdAt: 'desc' as const }
        ]
      : { createdAt: 'desc' as const }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          upvotes: true,
          views: true,
          adminPick: true,
          tags: {
            select: {
              tag: {
                select: {
                  name: true,
                  slug: true,
                }
              }
            }
          }
        },
        orderBy,
        skip,
        take: pageSize + 1, // +1 to check if there's a next page
      }),
      prisma.post.count({ where })
    ])

    const hasNextPage = posts.length > pageSize
    const items = posts.slice(0, pageSize)
    const nextPageCursor = hasNextPage ? page + 1 : null

    return NextResponse.json({
      items,
      nextPageCursor,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
