import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '25')
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

    // 토론글 데이터 조회 (더 많은 데이터를 가져와서 태그 섞기)
    const fetchLimit = Math.max(limit * 2, 20) // 최소 20개 이상 가져오기
    const [allPosts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: fetchLimit,
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
    
    // 태그를 섞어서 같은 태그가 연속으로 나오지 않게 정렬
    const shuffledPosts: typeof allPosts = []
    const used = new Set<number>()
    
    let lastTag: string | null = null
    let attempts = 0
    const maxAttempts = allPosts.length * 2
    
    while (shuffledPosts.length < Math.min(limit, allPosts.length) && attempts < maxAttempts) {
      let found = false
      
      // 다른 태그를 가진 게시글 찾기
      for (let i = 0; i < allPosts.length; i++) {
        if (used.has(i)) continue
        
        const post = allPosts[i]
        const postTags = post.tags.map(t => t.tag.name)
        const firstTag = postTags[0] || '기타'
        
        // 마지막 태그와 다른 태그를 가진 게시글 선택
        if (lastTag === null || firstTag !== lastTag) {
          shuffledPosts.push(post)
          used.add(i)
          lastTag = firstTag
          found = true
          break
        }
      }
      
      // 다른 태그를 가진 게시글이 없으면 아무거나 선택
      if (!found) {
        for (let i = 0; i < allPosts.length; i++) {
          if (!used.has(i)) {
            const post = allPosts[i]
            shuffledPosts.push(post)
            used.add(i)
            const postTags = post.tags.map(t => t.tag.name)
            lastTag = postTags[0] || '기타'
            break
          }
        }
      }
      
      attempts++
    }
    
    const posts = shuffledPosts.slice(0, limit)

    // 각 게시글의 실제 댓글 수 조회
    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const actualCommentCount = await prisma.comment.count({
          where: {
            postId: post.id,
            parentId: null // 대댓글이 아닌 최상위 댓글만
          }
        });
        
        return {
          ...post,
          actualCommentCount
        };
      })
    );

    // 응답 데이터 포맷팅
    const discussions = postsWithCommentCount.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.nickname || '익명',
      nickname: post.nickname || '익명',
      views: post.views || 0,
      upvotes: post.upvotes || 0,
      downvotes: post.downvotes || 0,
      commentCount: post.actualCommentCount, // 실제 댓글 수 사용
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
