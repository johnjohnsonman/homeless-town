import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const voteSchema = z.object({
  postId: z.string().cuid(),
  delta: z.number().min(-1).max(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, delta } = voteSchema.parse(body)

    // Get current post
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { upvotes: true },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Calculate new upvotes (clamp to prevent negative)
    const newUpvotes = Math.max(0, post.upvotes + delta)

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { upvotes: newUpvotes },
      select: { upvotes: true },
    })

    return NextResponse.json({
      success: true,
      upvotes: updatedPost.upvotes,
    })
  } catch (error) {
    console.error('Error processing vote:', error)
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    )
  }
}
