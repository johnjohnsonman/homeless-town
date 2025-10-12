// worker/index.js
const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const OpenAI = require('openai');

// 다양한 사용자 닉네임 목록
const diverseAuthors = [
  '무주택청년', '전세고민러', '월세절약왕', '부동산초보', '원룸탐정',
  '계약서달인', '보증금전문가', '임대차고수', '부동산정보통', '주거고민상담사',
  '전세마스터', '월세협상가', '원룸헌터', '계약고수', '보증금왕',
  '임대차박사', '부동산매니아', '주거전문가', '전세고수', '월세달인',
  '원룸마스터', '계약서고수', '보증금전문', '임대차왕', '부동산고수',
  '주거정보통', '전세전문가', '월세고수', '원룸전문', '계약달인',
  '보증금고수', '임대차전문', '부동산달인', '주거고수', '전세왕',
  '월세전문가', '원룸고수', '계약전문가', '보증금달인', '임대차고수'
];

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Node.js 18+ 에서 fetch 사용 가능, 그 이하 버전에서는 node-fetch 필요
// const fetch = require('node-fetch');

// Redis 연결 (선택적)
let connection = null;
let postQueue = null;
const queueName = 'postQueue';

// Redis 연결 완전 비활성화 (메모리 모드로 실행)
console.log('⚠️ Redis 연결 비활성화, 메모리 모드로 실행');

// 실제 작업자 로직 (Redis가 있을 때만)
if (connection && postQueue) {
  new Worker(
    queueName,
    async (job) => {
      const { title, content, categorySlug } = job.data;

      console.log(`📢 게시글 생성 중: ${title}`);

      const res = await fetch(`${process.env.SITE_BASE_URL}/api/admin/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          categorySlug,
          status: 'published',
          tags: ['자동작성'],
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`❌ POST 실패: ${res.status} ${text}`);
      }

      await new Promise((r) => setTimeout(r, 1000)); // 게시 간격 (1초)
    },
    { connection, concurrency: 1 }
  );
}

// 토론 주제 템플릿
const discussionTemplates = {
  자유: [
    '무주택촌에서 살아가는 팁 공유해요',
    '전세 vs 월세 고민입니다',
    '원룸 구하기 어려운 시기인가요?',
    '집 구할 때 가장 중요한 것',
    '무주택 기간이 길어지면서 느끼는 점들'
  ],
  시황: [
    '요즘 부동산 시장 어떻게 보시나요?',
    '전세 시장 동향 분석',
    '월세 상승세 계속될까요?',
    '부동산 정책 변화 전망',
    '지역별 임대시장 현황'
  ],
  부동산시장: [
    '아파트 vs 오피스텔 고민',
    '신축 vs 리모델링 어느게 나을까?',
    '부동산 중개비 절약 방법',
    '매물 정보 어디서 구하시나요?',
    '부동산 계약 전 체크리스트'
  ],
  임대시장: [
    '월세 협상 성공 경험담',
    '보증금 반환 관련 경험',
    '임대차 계약서 꼼꼼히 챙기기',
    '월세 인상 제한 조항',
    '임대인과의 소통 팁'
  ],
  분쟁사례: [
    '보증금 반환 거부 당했을 때',
    '월세 인상 통보 받았을 때',
    '시설 고장 시 처리 방법',
    '입주 거부 당한 경험',
    '계약 해지 관련 분쟁'
  ],
  보증금: [
    '보증금 반환 받는 팁',
    '보증금 대출 이용해보신 분?',
    '보증금 적립금 활용법',
    '보증금 반환 시기',
    '보증금 관련 법적 권리'
  ],
  월세인상: [
    '월세 인상률 어느 정도가 적정한가요?',
    '월세 협상 성공 사례',
    '월세 인상 통보 받았을 때 대처법',
    '월세 인상 제한 조항 활용',
    '월세 vs 전세 전환 고민'
  ],
  계약해지: [
    '임대차 계약 해지 절차',
    '계약 해지 시 주의사항',
    '갑작스러운 계약 해지 대처법',
    '계약 해지 후 이사 준비',
    '계약 해지 관련 법적 문제'
  ]
};

// 댓글 템플릿
const commentTemplates = [
  '좋은 정보 감사합니다!',
  '저도 비슷한 경험이 있어요',
  '도움이 되는 글이네요',
  '추가로 궁금한 점이 있습니다',
  '실용적인 팁이네요',
  '저도 시도해볼게요',
  '정보 공유 감사합니다',
  '유용한 내용이네요'
];

// OpenAI API를 사용한 자연스러운 게시글 내용 생성
async function generateRealisticContent(category, title) {
  try {
    const prompt = `당신은 한국의 무주택자들이 사용하는 온라인 커뮤니티에서 게시글을 작성하는 사람입니다. 

주제: "${category}" 관련 - "${title}"

다음 조건을 만족하는 자연스러운 게시글을 작성해주세요:
1. 실제 사람이 쓴 것처럼 자연스럽고 개인적인 톤
2. 구체적인 상황이나 경험담 포함
3. 감정적인 표현 (걱정, 기대, 불안, 희망 등)
4. 다른 사람들의 조언을 요청하는 내용
5. 200-300자 정도의 적당한 길이
6. 이모지 적절히 사용 (1-2개)
7. 마지막에 댓글을 부탁하는 문구

예시 톤:
- "요즘 정말 고민이 많아서 글 올려봅니다..."
- "혹시 비슷한 경험 있으신 분 계신가요?"
- "정말 막막해서 도움 요청드려요..."

자연스럽고 진정성 있는 게시글을 작성해주세요:`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "당신은 한국의 무주택자 커뮤니티에서 활동하는 친근하고 솔직한 사람입니다. 실제 경험담을 바탕으로 한 자연스러운 게시글을 작성합니다."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 400,
      temperature: 0.8,
    });

    const generatedContent = response.choices[0].message.content.trim();
    console.log(`🤖 OpenAI로 생성된 내용 (${category}):`, generatedContent.substring(0, 100) + '...');
    
    return generatedContent;
  } catch (error) {
    console.error('OpenAI API 오류:', error);
    
    // OpenAI API 실패 시 폴백 템플릿 사용
    const fallbackContents = {
      자유: [
        "안녕하세요! 요즘 원룸 찾기가 너무 어려워서 고민이 많아요. 혹시 좋은 방법이나 팁 있으시면 알려주세요!",
        "무주택 생활하면서 느끼는 점들이 많아서 공유하고 싶어요. 비슷한 경험 있으신 분들 댓글 부탁드려요!"
      ],
      시황: [
        "요즘 부동산 시장이 너무 불안정해서 걱정이에요. 여러분은 어떻게 생각하시나요?",
        "전세 시장 동향이 계속 바뀌고 있는데, 언제쯤 안정될까요? 의견 부탁드려요!"
      ],
      부동산시장: [
        "부동산 중개비가 너무 비싸서 부담스러워요. 절약할 수 있는 방법 있나요?",
        "아파트 vs 오피스텔 고민 중이에요. 각각의 장단점이 뭘까요?"
      ],
      임대시장: [
        "월세 협상 성공하신 분들 경험담 들려주세요! 어떻게 하셨는지 궁금해요.",
        "임대차 계약서 꼼꼼히 챙기라고 하는데, 어떤 부분을 특히 주의해야 할까요?"
      ],
      분쟁사례: [
        "보증금 반환 거부 당한 적 있으신 분 계신가요? 어떻게 해결하셨는지 궁금해요.",
        "월세 인상 통보 받았을 때 어떻게 대처하셨는지 경험담 들려주세요."
      ],
      보증금: [
        "보증금 대출 이용해보신 분 계신가요? 어떤 조건인지 궁금해요.",
        "보증금 적립금 활용하는 방법 있나요? 알려주세요!"
      ],
      월세인상: [
        "월세 인상률이 어느 정도가 적정하다고 생각하시나요?",
        "월세 협상 성공 사례 있으시면 들려주세요!"
      ],
      계약해지: [
        "임대차 계약 해지 절차가 복잡한가요? 경험담 들려주세요.",
        "계약 해지 시 주의사항이 뭔지 궁금해요."
      ]
    };

    const contents = fallbackContents[category] || ["안녕하세요! 관련해서 궁금한 점이 있어서 질문드려요."];
    const randomContent = contents[Math.floor(Math.random() * contents.length)];
    
    const endings = [
      "여러분의 경험담과 조언 부탁드려요! 🙏",
      "비슷한 경험 있으신 분들 댓글 부탁드려요!",
      "좋은 정보 있으시면 공유해주세요!"
    ];
    
    const randomEnding = endings[Math.floor(Math.random() * endings.length)];
    
    return `${randomContent}

${randomEnding}`;
  }
}

// 오늘 자동 글 등록
async function enqueueToday() {
  if (!postQueue) {
    console.log('⚠️ Redis가 연결되지 않아 즉시 실행 모드로 전환');
    
    // Redis 없이 즉시 실행
    const categories = Object.keys(discussionTemplates);
    const TARGET_PER_CAT = Math.floor(160 / categories.length);
    
    console.log(`🚀 ${categories.length}개 카테고리에 총 ${TARGET_PER_CAT * categories.length}개 게시글 즉시 생성 시작`);

    for (const category of categories) {
      const templates = discussionTemplates[category];
      
      for (let i = 0; i < Math.min(TARGET_PER_CAT, 3); i++) { // 테스트용으로 3개만
        let title;
        if (i < templates.length) {
          title = `[${category}] ${templates[i]}`;
        } else {
          const variations = [
            `${category} 관련 질문드립니다`,
            `${category} 경험담 공유해요`,
            `${category} 궁금한 점이 있어요`
          ];
          title = `[${category}] ${variations[i % variations.length]} #${i + 1}`;
        }

        const content = await generateRealisticContent(category, title);
        
        try {
          console.log(`📢 게시글 생성 시도: ${title}`);
          console.log(`🔗 API URL: ${process.env.SITE_BASE_URL}/api/admin/posts`);
          console.log(`🔑 Admin Token: ${process.env.ADMIN_TOKEN ? '설정됨' : '설정되지 않음'}`);
          
          const res = await fetch(`${process.env.SITE_BASE_URL}/api/admin/posts`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title,
              content,
              categorySlug: category,
              status: 'published',
              tags: [category], // 카테고리를 태그로 사용
              author: diverseAuthors[Math.floor(Math.random() * diverseAuthors.length)],
            }),
          });

          const responseText = await res.text();
          console.log(`📊 응답 상태: ${res.status}`);
          console.log(`📄 응답 내용: ${responseText}`);

          if (res.ok) {
            console.log(`✅ 게시글 생성 성공: ${title}`);
          } else {
            console.log(`❌ 게시글 생성 실패: ${title} - ${res.status}`);
            console.log(`❌ 오류 상세: ${responseText}`);
            
            // 500 오류인 경우 상세 정보 출력
            if (res.status === 500) {
              console.log(`🚨 500 오류 감지! API 엔드포인트에서 오류 발생.`);
              console.log(`🔍 메인 앱 URL: ${process.env.SITE_BASE_URL}`);
              
              try {
                // 응답을 JSON으로 파싱하여 상세 오류 정보 확인
                let errorDetails = responseText;
                try {
                  const errorJson = JSON.parse(responseText);
                  errorDetails = JSON.stringify(errorJson, null, 2);
                } catch (parseError) {
                  // JSON 파싱 실패 시 원본 텍스트 사용
                }
                console.log(`🔍 API 오류 상세: ${errorDetails}`);
              } catch (error) {
                console.log(`🔍 오류 상세 파싱 실패: ${error.message}`);
              }
            }
            
            // 502 오류인 경우 메인 앱 상태 확인
            if (res.status === 502) {
              console.log(`🚨 502 오류 감지! 메인 앱 상태를 확인하세요.`);
              console.log(`🔍 메인 앱 URL: ${process.env.SITE_BASE_URL}`);
              console.log(`🔍 메인 앱 헬스체크 시도...`);
              
              try {
                const healthCheck = await fetch(`${process.env.SITE_BASE_URL}/api/debug-db`);
                console.log(`🔍 헬스체크 상태: ${healthCheck.status}`);
              } catch (healthError) {
                console.log(`🔍 헬스체크 실패: ${healthError.message}`);
              }
            }
          }
        } catch (error) {
          console.log(`❌ 게시글 생성 오류: ${title}`, error.message);
        }
        
        await new Promise((r) => setTimeout(r, 5000)); // 5초 간격 (OpenAI API 호출 시간 고려)
      }
    }
    
    console.log('🎉 즉시 실행 완료!');
    return;
  }

  // Redis가 있을 때의 기존 로직
  const categories = Object.keys(discussionTemplates);
  const TARGET_PER_CAT = Math.floor(160 / categories.length);

  console.log(`🚀 ${categories.length}개 카테고리에 총 ${TARGET_PER_CAT * categories.length}개 게시글 등록 시작`);

  for (const category of categories) {
    const templates = discussionTemplates[category];
    
    for (let i = 0; i < TARGET_PER_CAT; i++) {
      let title;
      if (i < templates.length) {
        title = `[${category}] ${templates[i]}`;
      } else {
        const variations = [
          `${category} 관련 질문드립니다`,
          `${category} 경험담 공유해요`,
          `${category} 궁금한 점이 있어요`,
          `${category} 팁 공유합니다`,
          `${category} 정보 공유해요`
        ];
        title = `[${category}] ${variations[i % variations.length]} #${i + 1}`;
      }

      const content = await generateRealisticContent(category, title);
      
      const totalPosts = TARGET_PER_CAT * categories.length;
      const delayMs = Math.floor((i * categories.length + categories.indexOf(category)) * (24 * 60 * 60 * 1000) / totalPosts);

      await postQueue.add(
        'post',
        { title, content, categorySlug: category },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 30_000 },
          delay: delayMs,
          removeOnComplete: true,
          removeOnFail: false,
        }
      );
    }
    
    console.log(`✅ ${category} 카테고리 ${TARGET_PER_CAT}개 글 등록 완료`);
  }

  console.log('🎉 오늘 작업 등록 완료!');
}

module.exports = { enqueueToday };
