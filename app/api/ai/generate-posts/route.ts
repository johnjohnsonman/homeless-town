import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'
import slugify from 'slugify'

const prisma = new PrismaClient()

// OpenAI 클라이언트 초기화 함수
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set')
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

// 게시글 주제별 템플릿
const postTemplates = [
  {
    category: '시황',
    tags: ['시황', '부동산시장'],
    topics: [
      '서울 아파트 전세가 상승세 지속',
      '경기도 신도시 임대료 급등 현상',
      '부동산 시장 침체 속에서도 상승하는 지역들',
      '전세사기 예방을 위한 체크리스트',
      '월세 인상률 상한제 도입 논의'
    ]
  },
  {
    category: '자유',
    tags: ['자유', '일상'],
    topics: [
      '전세 계약 갱신 시 주의사항',
      '집 구할 때 꼭 확인해야 할 것들',
      '월세 vs 전세, 어떤 게 더 유리할까?',
      '혼자 살기 좋은 원룸 찾기 팁',
      '이사 준비 체크리스트 공유'
    ]
  },
  {
    category: '분쟁사례',
    tags: ['분쟁사례', '법적권리'],
    topics: [
      '월세 연체로 인한 퇴거 통보 대처법',
      '보증금 반환 거부 당했을 때',
      '집주인과의 갈등 해결 방법',
      '임대차 계약서에 숨겨진 함정들',
      '전세금 사기 피해 예방법'
    ]
  },
  {
    category: '정책',
    tags: ['정책', '법적권리'],
    topics: [
      '청년 전세대출 지원 정책 변화',
      '임대차 3법 주요 개정사항',
      '공공임대주택 신청 조건과 절차',
      '전세자금대출 금리 인하 소식',
      '임대사업자 등록 의무화'
    ]
  },
  {
    category: '안전수칙',
    tags: ['안전수칙', '입주체크'],
    topics: [
      '전세/월세 계약 전 필수 확인사항',
      '부동산 중개업소 선택 가이드',
      '임대차 계약서 검토 포인트',
      '입주 전 점검해야 할 시설들',
      '전세금 반환 보장 방법'
    ]
  }
]

async function generatePostContent(topic: string, category: string): Promise<{ title: string; content: string }> {
  try {
    const openai = getOpenAIClient()
    
    const prompt = `
다음 주제로 무주택촌 커뮤니티 토론글을 작성해주세요:

주제: ${topic}
카테고리: ${category}

요구사항:
1. 제목은 30자 이내로 작성
2. 내용은 200-400자 정도로 작성
3. 실제 경험담이나 구체적인 정보를 포함
4. 다른 사용자들이 댓글을 달고 싶어할 만한 질문이나 의견 요청 포함
5. 친근하고 공감대를 형성할 수 있는 톤으로 작성
6. 한국어로 작성
7. 이모지는 사용하지 마세요

응답 형식:
제목: [제목]
내용: [내용]
`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.8,
    })

    const response = completion.choices[0]?.message?.content || ''
    
    // 응답 파싱
    const titleMatch = response.match(/제목:\s*(.+)/)
    const contentMatch = response.match(/내용:\s*([\s\S]+)/)
    
    const title = titleMatch?.[1]?.trim() || topic
    const content = contentMatch?.[1]?.trim() || ''

    return { title, content }
  } catch (error) {
    console.error('OpenAI API 오류:', error)
    // 폴백 콘텐츠
    return {
      title: topic,
      content: `${topic}에 대해 어떻게 생각하시나요? 실제 경험담이나 조언이 있으시면 댓글로 공유해주세요!`
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { count = 20 } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    const generatedPosts = []

    for (let i = 0; i < count; i++) {
      // 랜덤하게 템플릿 선택
      const template = postTemplates[Math.floor(Math.random() * postTemplates.length)]
      const topic = template.topics[Math.floor(Math.random() * template.topics.length)]
      
      // AI로 콘텐츠 생성
      const { title, content } = await generatePostContent(topic, template.category)
      
      // 슬러그 생성
      const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now()
      
      // 게시글 생성
      const post = await prisma.post.create({
        data: {
          title,
          slug,
          content,
          author: 'system', // 시스템이 생성한 글
          nickname: 'AI 어시스턴트',
          password: 'ai-generated',
          type: 'discussion',
          tags: {
            create: template.tags.map(tagName => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: { name: tagName }
                }
              }
            }))
          }
        },
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        }
      })

      generatedPosts.push(post)
      
      // API 호출 간격 조절 (Rate limiting 방지)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return NextResponse.json({
      success: true,
      message: `${count}개의 AI 게시글이 생성되었습니다.`,
      posts: generatedPosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        tags: post.tags.map(pt => pt.tag.name)
      }))
    })

  } catch (error) {
    console.error('AI 게시글 생성 오류:', error)
    return NextResponse.json(
      { error: 'AI 게시글 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// 수동으로 게시글 생성하는 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const count = parseInt(searchParams.get('count') || '1')

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    // 랜덤하게 템플릿 선택
    const template = postTemplates[Math.floor(Math.random() * postTemplates.length)]
    const topic = template.topics[Math.floor(Math.random() * template.topics.length)]
    
    // AI로 콘텐츠 생성
    const { title, content } = await generatePostContent(topic, template.category)
    
    // 슬러그 생성
    const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now()
    
    // 게시글 생성
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        author: 'system',
        nickname: 'AI 어시스턴트',
        password: 'ai-generated',
        type: 'discussion',
        tags: {
          create: template.tags.map(tagName => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName }
              }
            }
          }))
        }
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'AI 게시글이 생성되었습니다.',
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        tags: post.tags.map(pt => pt.tag.name)
      }
    })

  } catch (error) {
    console.error('AI 게시글 생성 오류:', error)
    return NextResponse.json(
      { error: 'AI 게시글 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
