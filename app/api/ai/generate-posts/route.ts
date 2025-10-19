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

// 게시글 주제별 템플릿 (12개 카테고리로 확장)
const postTemplates = [
  {
    category: '시황',
    tags: ['시황', '부동산시장'],
    topics: [
      '서울 아파트 전세가 상승세 지속',
      '경기도 신도시 임대료 급등 현상',
      '부동산 시장 침체 속에서도 상승하는 지역들',
      '전세사기 예방을 위한 체크리스트',
      '월세 인상률 상한제 도입 논의',
      '지역별 임대시장 현황 분석',
      '부동산 정책 변화가 임대시장에 미치는 영향'
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
      '이사 준비 체크리스트 공유',
      '무주택 생활하면서 느끼는 점들',
      '원룸 생활의 장단점'
    ]
  },
  {
    category: '부동산시장',
    tags: ['부동산시장', '부동산'],
    topics: [
      '아파트 vs 오피스텔 선택 기준',
      '신축 vs 리모델링 어느게 나을까?',
      '부동산 중개비 절약하는 방법',
      '매물 정보 어디서 구하시나요?',
      '부동산 계약 전 체크리스트',
      '부동산 투자 성공 사례',
      '매물 사기 당한 경험과 예방법'
    ]
  },
  {
    category: '임대시장',
    tags: ['임대시장', '월세인상'],
    topics: [
      '월세 협상 성공했어요! 후기 올려요',
      '보증금 반환 관련 경험 공유해요',
      '임대차 계약서 꼼꼼히 챙기기',
      '월세 인상 제한 조항 활용법',
      '임대인과의 소통 팁',
      '월세 협상 꿀팁 공유합니다',
      '전세 전환 시 유의사항'
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
      '전세금 사기 피해 예방법',
      '시설 고장 시 처리 방법',
      '입주 거부 당한 경험과 해결책'
    ]
  },
  {
    category: '보증금',
    tags: ['보증금', '계약해지'],
    topics: [
      '보증금 반환 받는 꿀팁 공유해요',
      '보증금 대출 이용해보신 분 있나요?',
      '보증금 적립금 활용법',
      '보증금 반환 시기 언제인가요?',
      '보증금 관련 법적 권리',
      '보증금 반환 거부 당했을 때 대처법',
      '보증금 반환 성공 사례 공유합니다'
    ]
  },
  {
    category: '월세인상',
    tags: ['월세인상', '집주인소통'],
    topics: [
      '월세 인상률 진짜 미쳤어요',
      '월세 협상 성공 사례 공유해요',
      '월세 인상 통보 받았을 때 대처법',
      '월세 인상 제한 조항 활용하기',
      '월세 vs 전세 전환 고민',
      '월세 인상 거부할 수 있나요?',
      '월세 협상 꿀팁 공유합니다'
    ]
  },
  {
    category: '계약해지',
    tags: ['계약해지', '안전수칙'],
    topics: [
      '임대차 계약 해지 절차 알려주세요',
      '계약 해지 시 주의사항',
      '갑작스러운 계약 해지 대처법',
      '계약 해지 후 이사 준비',
      '계약 해지 관련 법적 문제',
      '계약 해지 시 보증금 반환은?',
      '계약 해지 후 이사 경험 공유해요'
    ]
  },
  {
    category: '입주체크',
    tags: ['입주체크', '안전수칙'],
    topics: [
      '입주 전 꼭 확인해야 할 체크리스트',
      '전세/월세 계약 전 필수 확인사항',
      '부동산 중개업소 선택 가이드',
      '임대차 계약서 검토 포인트',
      '입주 전 점검해야 할 시설들',
      '전세금 반환 보장 방법',
      '입주 시 주의사항과 팁'
    ]
  },
  {
    category: '집주인소통',
    tags: ['집주인소통', '법적권리'],
    topics: [
      '집주인과의 원활한 소통 방법',
      '월세 협상 시 집주인과의 대화법',
      '집주인과 갈등 해결하는 방법',
      '집주인에게 요구사항 전달하는 법',
      '집주인과의 관계 유지 팁',
      '집주인과의 소통 시 주의사항',
      '집주인과 친해지는 방법'
    ]
  },
  {
    category: '투자',
    tags: ['투자', '정책'],
    topics: [
      '부동산 투자 성공 전략',
      '소액 부동산 투자 방법',
      '전세 투자 시 주의사항',
      '부동산 투자 타이밍 분석',
      '투자용 부동산 선택 기준',
      '부동산 투자 리스크 관리',
      '부동산 투자 수익률 계산법'
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
      '임대사업자 등록 의무화',
      '주거급여 신청 방법과 조건',
      '정부 주거 지원 정책 안내'
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
