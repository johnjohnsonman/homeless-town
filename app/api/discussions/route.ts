import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const tag = searchParams.get('tag') || ''

    const skip = (page - 1) * limit

    // 검색 및 태그 필터링 조건
    let where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } }
      ]
    }

    if (tag && tag !== 'all') {
      where.tags = {
        some: {
          tag: {
            name: tag
          }
        }
      }
    }

    // 토론글 데이터 조회
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.post.count({ where })
    ])

    // 응답 데이터 포맷팅
    const discussions = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author || '익명',
      nickname: post.nickname || '익명',
      views: post.views || 0,
      upvotes: post.upvotes || 0,
      downvotes: post.downvotes || 0,
      commentCount: post.commentCount || 0,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      tags: post.tags.map(pt => pt.tag.name),
      marketTrend: post.marketTrend || null,
      isHot: post.isHot || false,
      isNew: post.isNew || false,
      isPopular: post.isPopular || false
    }))

    return NextResponse.json({
      discussions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Discussions API error:', error)
    return NextResponse.json(
      { error: '토론글 데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Creating new discussion:', body)
    
    const { title, content, tags, marketTrend, nickname, password } = body

    // 필수 필드 검증
    if (!title || !content || !nickname || !password) {
      return NextResponse.json(
        { error: '제목, 내용, 닉네임, 비밀번호는 필수입니다.' },
        { status: 400 }
      )
    }

    // slug 생성 (제목 기반, 중복 방지)
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100)
    
    let slug = baseSlug
    let counter = 1
    
    // slug 중복 확인 및 해결
    while (true) {
      const existingPost = await prisma.post.findUnique({
        where: { slug }
      })
      
      if (!existingPost) {
        break
      }
      
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // 새 토론글 생성
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        author: null,
        nickname,
        password,
        marketTrend,
        slug,
        views: 0,
        upvotes: 0,
        downvotes: 0,
        commentCount: 0,
        isHot: false,
        isNew: true,
        isPopular: false,
        type: 'discussion'
      }
    })

    // 태그 연결 (기존 태그가 있는 경우)
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // 기존 태그 찾기 또는 새로 생성
        let tag = await prisma.tag.findUnique({
          where: { name: tagName }
        })

        if (!tag) {
          tag = await prisma.tag.create({
            data: { name: tagName }
          })
        }

        // PostTag 연결 생성
        await prisma.postTag.create({
          data: {
            postId: newPost.id,
            tagId: tag.id
          }
        })
      }
    }

    // 생성된 토론글 반환
    const createdDiscussion = {
      id: newPost.id,
      title: newPost.title,
      content: newPost.content,
      author: '익명',
      nickname: newPost.nickname,
      views: newPost.views,
      upvotes: newPost.upvotes,
      downvotes: newPost.downvotes,
      commentCount: newPost.commentCount,
      createdAt: newPost.createdAt,
      updatedAt: newPost.updatedAt,
      tags: tags || [],
      marketTrend: newPost.marketTrend,
      isHot: newPost.isHot,
      isNew: newPost.isNew,
      isPopular: newPost.isPopular
    }

    console.log('Discussion created successfully:', createdDiscussion)

    return NextResponse.json({
      message: '토론글이 성공적으로 작성되었습니다.',
      discussion: createdDiscussion
    }, { status: 201 })

  } catch (error) {
    console.error('Create discussion error:', error)
    return NextResponse.json(
      { error: '토론글 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
