import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 데이터베이스 시드 시작...')

  // 기존 데이터 삭제
  await prisma.postTag.deleteMany()
  await prisma.post.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.user.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.like.deleteMany()
  await prisma.dislike.deleteMany()
  await prisma.commentLike.deleteMany()
  await prisma.commentDislike.deleteMany()
  await prisma.bookmark.deleteMany()

  // 태그 생성
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: '주거' },
      update: {},
      create: { name: '주거', color: '#3B82F6' }
    }),
    prisma.tag.upsert({
      where: { name: '계약' },
      update: {},
      create: { name: '계약', color: '#10B981' }
    }),
    prisma.tag.upsert({
      where: { name: '법률' },
      update: {},
      create: { name: '법률', color: '#F59E0B' }
    }),
    prisma.tag.upsert({
      where: { name: '시황' },
      update: {},
      create: { name: '시황', color: '#EF4444' }
    }),
    prisma.tag.upsert({
      where: { name: '부동산' },
      update: {},
      create: { name: '부동산', color: '#8B5CF6' }
    }),
    prisma.tag.upsert({
      where: { name: '투자' },
      update: {},
      create: { name: '투자', color: '#06B6D4' }
    }),
    prisma.tag.upsert({
      where: { name: '정책' },
      update: {},
      create: { name: '정책', color: '#84CC16' }
    }),
    prisma.tag.upsert({
      where: { name: '분쟁사례' },
      update: {},
      create: { name: '분쟁사례', color: '#F97316' }
    }),
    prisma.tag.upsert({
      where: { name: '보증금' },
      update: {},
      create: { name: '보증금', color: '#EC4899' }
    }),
    prisma.tag.upsert({
      where: { name: '월세인상' },
      update: {},
      create: { name: '월세인상', color: '#14B8A6' }
    }),
    prisma.tag.upsert({
      where: { name: '계약해지' },
      update: {},
      create: { name: '계약해지', color: '#6366F1' }
    }),
    prisma.tag.upsert({
      where: { name: '입주체크' },
      update: {},
      create: { name: '입주체크', color: '#22C55E' }
    }),
    prisma.tag.upsert({
      where: { name: '집주인소통' },
      update: {},
      create: { name: '집주인소통', color: '#EAB308' }
    }),
    prisma.tag.upsert({
      where: { name: '법적권리' },
      update: {},
      create: { name: '법적권리', color: '#F43F5E' }
    }),
    prisma.tag.upsert({
      where: { name: '안전수칙' },
      update: {},
      create: { name: '안전수칙', color: '#0EA5E9' }
    })
  ])

  // 샘플 사용자 생성
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: 'user1',
        email: 'user1@example.com',
        name: '김철수',
        bio: '부동산에 관심이 많은 임차인입니다.',
        location: '서울시 강남구',
        totalLikes: 15,
        totalDislikes: 2,
        totalPosts: 3,
        totalComments: 8
      }
    }),
    prisma.user.create({
      data: {
        username: 'user2',
        email: 'user2@example.com',
        name: '이영희',
        bio: '법률 상담을 도와드립니다.',
        location: '서울시 마포구',
        totalLikes: 28,
        totalDislikes: 1,
        totalPosts: 5,
        totalComments: 12
      }
    }),
    prisma.user.create({
      data: {
        username: 'user3',
        email: 'user3@example.com',
        name: '박민수',
        bio: '부동산 투자에 대한 정보를 공유합니다.',
        location: '서울시 송파구',
        totalLikes: 42,
        totalDislikes: 5,
        totalPosts: 7,
        totalComments: 18
      }
    })
  ])

  // 어드민 계정 생성
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: '관리자',
      email: 'admin@homeless-town.com',
      role: 'admin'
    }
  })

  console.log('✅ 어드민 계정 생성 완료:', admin.username)

  // 샘플 게시글 생성
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: '강남역 근처 원룸 구합니다',
        slug: 'gangnam-room-wanted-1',
        content: '강남역 10분 거리에 위치한 원룸을 구하고 있습니다. 월세 80만원 이하, 보증금 500만원 이하로 구합니다.',
        author: users[0].id,
        type: 'housing',
        marketTrend: 'up',
        isHot: true,
        isNew: true,
        isPopular: false,
        urgent: true,
        verified: true,
        upvotes: 12,
        downvotes: 1,
        views: 156,
        commentCount: 3,
        adminPick: false,
        tags: {
          create: [
            { tagId: tags[0].id }, // 주거
            { tagId: tags[3].id }  // 시황
          ]
        }
      }
    }),
    prisma.post.create({
      data: {
        title: '보증금 반환 문제 해결 경험 공유',
        slug: 'deposit-return-experience-2',
        content: '집주인과의 보증금 반환 문제를 해결한 경험을 공유합니다. 법적 절차와 주의사항에 대해 설명드립니다.',
        author: users[1].id,
        type: 'discussion',
        marketTrend: null,
        isHot: false,
        isNew: false,
        isPopular: true,
        urgent: false,
        verified: true,
        upvotes: 25,
        downvotes: 2,
        views: 234,
        commentCount: 8,
        adminPick: true,
        tags: {
          create: [
            { tagId: tags[1].id }, // 계약
            { tagId: tags[2].id }, // 법률
            { tagId: tags[8].id }  // 보증금
          ]
        }
      }
    }),
    prisma.post.create({
      data: {
        title: '월세 vs 전세 비교 분석',
        slug: 'monthly-vs-jeonse-comparison-3',
        content: '현재 부동산 시장 상황에서 월세와 전세 중 어떤 선택이 더 유리한지 분석해보았습니다.',
        author: users[2].id,
        type: 'discussion',
        marketTrend: 'down',
        isHot: true,
        isNew: false,
        isPopular: true,
        urgent: false,
        verified: false,
        upvotes: 38,
        downvotes: 4,
        views: 456,
        commentCount: 15,
        adminPick: false,
        tags: {
          create: [
            { tagId: tags[3].id }, // 시황
            { tagId: tags[4].id }, // 부동산
            { tagId: tags[5].id }  // 투자
          ]
        }
      }
    })
  ])

  // 샘플 댓글 생성
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: '정말 유용한 정보네요! 저도 비슷한 경험이 있어서 도움이 많이 됐습니다.',
        author: users[1].id,
        postId: posts[0].id,
        likes: 5,
        dislikes: 0
      }
    }),
    prisma.comment.create({
      data: {
        content: '강남역 근처는 정말 비싸죠. 예산을 조금 더 늘려보시는 건 어떨까요?',
        author: users[2].id,
        postId: posts[0].id,
        likes: 3,
        dislikes: 1
      }
    }),
    prisma.comment.create({
      data: {
        content: '보증금 반환 문제는 정말 까다롭죠. 법적 절차를 잘 따라야 합니다.',
        author: users[0].id,
        postId: posts[1].id,
        likes: 8,
        dislikes: 0
      }
    })
  ])

  // 샘플 좋아요/싫어요 생성
  await Promise.all([
    prisma.like.create({
      data: {
        userId: users[0].id,
        postId: posts[1].id
      }
    }),
    prisma.like.create({
      data: {
        userId: users[1].id,
        postId: posts[2].id
      }
    }),
    prisma.like.create({
      data: {
        userId: users[2].id,
        postId: posts[0].id
      }
    }),
    prisma.dislike.create({
      data: {
        userId: users[0].id,
        postId: posts[2].id
      }
    })
  ])

  // 샘플 북마크 생성
  await Promise.all([
    prisma.bookmark.create({
      data: {
        userId: users[0].id,
        postId: posts[1].id
      }
    }),
    prisma.bookmark.create({
      data: {
        userId: users[1].id,
        postId: posts[2].id
      }
    })
  ])

  console.log('✅ 시드 데이터 생성 완료')
  console.log(`- 태그: ${tags.length}개`)
  console.log(`- 사용자: ${users.length}명`)
  console.log(`- 게시글: ${posts.length}개`)
  console.log(`- 댓글: ${comments.length}개`)
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 실패:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
