import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const tags = [
  { name: '주거', slug: 'housing' },
  { name: '계약', slug: 'contract' },
  { name: '법률', slug: 'legal' },
  { name: '금융', slug: 'finance' },
  { name: '이사', slug: 'moving' },
  { name: '인테리어', slug: 'interior' },
  { name: '동네정보', slug: 'neighborhood' },
  { name: '공동체', slug: 'community' },
  { name: '정책', slug: 'policy' },
  { name: '뉴스', slug: 'news' },
  { name: '일상', slug: 'daily' },
  { name: '질문', slug: 'question' },
  { name: '팁', slug: 'tip' },
  { name: '후기', slug: 'review' },
  { name: '잡담', slug: 'chat' },
]

const sampleTitles = [
  '월세 계약서 작성할 때 주의사항',
  '전입신고 절차와 필요한 서류',
  '보증금 반환 거부 당했을 때 대처법',
  '월세 인상에 대한 법적 대응',
  '집주인과의 분쟁 해결 방법',
  '전세 전환 시 고려사항',
  '부동산 중개수수료 절약 팁',
  '집 구할 때 체크해야 할 체크리스트',
  '월세 납부일 연체 시 벌칙',
  '임대차 계약 갱신 요청 방법',
  '집 수리 시 집주인 책임 범위',
  '월세 계약 해지 시 주의사항',
  '전입신고 미신고 시 벌칙',
  '보증금 반환 청구 소송',
  '집주인과의 소통 방법',
  '월세 인상 제한 규정',
  '전세 전환 시 중개수수료',
  '부동산 계약서 검토 포인트',
  '집 구할 때 사기 피해 예방법',
  '월세 납부 증빙 자료 관리',
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Create tags
  console.log('Creating tags...')
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    })
  }

  // Get all tags for reference
  const createdTags = await prisma.tag.findMany()

  // Create posts
  console.log('Creating posts...')
  for (let i = 0; i < 80; i++) {
    const title = sampleTitles[i % sampleTitles.length]
    const slug = `${title.replace(/[^a-zA-Z0-9가-힣]/g, '-').toLowerCase()}-${i + 1}`
    
    // Random date within last 30 days
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30))
    
    // Random upvotes (0-50)
    const upvotes = Math.floor(Math.random() * 51)
    
    // Random views (0-200)
    const views = Math.floor(Math.random() * 201)
    
    // 10% chance of being admin pick
    const adminPick = Math.random() < 0.1
    
    // Random tags (1-3 tags)
    const postTags = []
    const numTags = Math.floor(Math.random() * 3) + 1
    const shuffledTags = [...createdTags].sort(() => 0.5 - Math.random())
    
    for (let j = 0; j < numTags; j++) {
      if (shuffledTags[j]) {
        postTags.push({
          tagId: shuffledTags[j].id,
        })
      }
    }

    await prisma.post.create({
      data: {
        title: `${title} ${i + 1}`,
        slug,
        content: `이것은 ${title}에 대한 샘플 내용입니다. 실제 사용 시에는 더 자세하고 유용한 정보를 포함해야 합니다.`,
        createdAt,
        upvotes,
        views,
        adminPick,
        tags: {
          create: postTags,
        },
      },
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
