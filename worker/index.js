// worker/index.js
const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const OpenAI = require('openai');
const axios = require('axios');

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 뉴스 API 설정
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'your-news-api-key';
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

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

// 카테고리에 맞는 태그들을 반환하는 함수
function getTagsForCategory(category) {
  const tagMap = {
    '시황': ['시황', '부동산시장'],
    '자유': ['자유', '일상'],
    '부동산시장': ['부동산시장', '부동산'],
    '임대시장': ['임대시장', '월세인상'],
    '분쟁사례': ['분쟁사례', '법적권리'],
    '보증금': ['보증금', '계약해지'],
    '월세인상': ['월세인상', '집주인소통'],
    '계약해지': ['계약해지', '안전수칙'],
    '입주체크': ['입주체크', '안전수칙'],
    '집주인소통': ['집주인소통', '법적권리'],
    '투자': ['투자', '정책'],
    '정책': ['정책', '법적권리']
  };
  
  return tagMap[category] || [category];
}

// 최신 부동산 뉴스 가져오기 (구체적인 키워드로 검색)
async function fetchRealEstateNews() {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        q: '부동산 OR 아파트 OR 전세 OR 빌라 OR 월세 OR "부동산 정책" OR "전세 대출" OR "월세 상한제" OR "임대차 3법" OR "청년 전세" OR "주택 공급" OR "부동산 시장" OR "전세가" OR "월세가" OR "임대료"',
        language: 'ko',
        sortBy: 'publishedAt',
        pageSize: 15,
        apiKey: NEWS_API_KEY
      }
    });
    
    return response.data.articles || [];
  } catch (error) {
    console.log('뉴스 API 오류:', error.message);
    return [];
  }
}

// 뉴스 기반 토론글 생성 (구체적이고 현실적으로)
async function generateNewsBasedPost(newsItem) {
  try {
    const prompt = `
다음 부동산 뉴스를 바탕으로 무주택촌 커뮤니티 토론글을 작성해주세요:

뉴스 제목: ${newsItem.title}
뉴스 내용: ${newsItem.description || newsItem.content || ''}
뉴스 출처: ${newsItem.source?.name || ''}
발행일: ${newsItem.publishedAt || ''}

요구사항:
1. 제목은 30자 이내로 작성 (뉴스 내용을 바탕으로 하지만 직접적인 뉴스 제목이 아닌 토론 주제로)
2. 내용은 300-500자 정도로 작성
3. 실제 무주택자/전세자/월세자의 관점에서 작성
4. 뉴스의 구체적인 내용(수치, 지역, 정책명 등)을 포함
5. 뉴스가 개인에게 미치는 실제적인 영향에 대해 언급
6. 다른 사용자들이 댓글을 달고 싶어할 만한 구체적인 질문이나 의견 요청 포함
7. 친근하지만 현실적인 톤으로 작성
8. 한국어로 작성
9. 이모지는 사용하지 마세요
10. "어떻게 생각하시나요?" 같은 일반적인 질문보다는 구체적인 상황에 대한 의견을 요청

응답 형식:
제목: [제목]
내용: [내용]
태그: [태그1,태그2]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // 응답 파싱
    const titleMatch = response.match(/제목:\s*(.+)/);
    const contentMatch = response.match(/내용:\s*([\s\S]+?)(?=태그:|$)/);
    const tagsMatch = response.match(/태그:\s*(.+)/);
    
    const title = titleMatch?.[1]?.trim() || newsItem.title;
    const content = contentMatch?.[1]?.trim() || '';
    const tags = tagsMatch?.[1]?.split(',').map(t => t.trim()) || ['시황'];

    return { title, content, tags };
  } catch (error) {
    console.log('OpenAI 뉴스 기반 글 생성 오류:', error.message);
    return {
      title: `${newsItem.title}에 대해 어떻게 생각하시나요?`,
      content: `${newsItem.title} 뉴스를 보니 정말 걱정이 되네요. 여러분은 어떻게 생각하시나요? 실제 경험담이나 의견이 있으시면 댓글로 공유해주세요!`,
      tags: ['시황']
    };
  }
}

// AI 기반 구체적이고 현실적인 댓글 생성
async function generateAIComment(postContent, postTitle, commentCount = 3) {
  try {
    const prompt = `
다음 토론글에 대한 구체적이고 현실적인 댓글 ${commentCount}개를 작성해주세요:

제목: ${postTitle}
내용: ${postContent}

요구사항:
1. 각 댓글은 30-100자 정도로 작성
2. 실제 무주택자/전세자/월세자의 관점에서 작성
3. 구체적인 수치, 지역, 경험담을 포함
4. 뉴스나 정책에 대한 구체적인 의견 제시
5. 실제 상황에 대한 현실적인 조언이나 경험 공유
6. 친근하지만 전문적인 톤으로 작성
7. 한국어로 작성
8. 이모지는 사용하지 마세요
9. 각 댓글은 서로 다른 관점이나 구체적인 경험을 반영
10. "공감합니다", "좋은 글입니다" 같은 일반적인 댓글 금지
11. 구체적인 지역명, 금액, 정책명 등을 언급

응답 형식:
댓글1: [구체적인 내용]
댓글2: [구체적인 내용]
댓글3: [구체적인 내용]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // 댓글 파싱
    const comments = [];
    for (let i = 1; i <= commentCount; i++) {
      const commentMatch = response.match(new RegExp(`댓글${i}:\\s*(.+?)(?=댓글${i+1}:|$)`));
      if (commentMatch) {
        comments.push(commentMatch[1].trim());
      }
    }
    
    return comments.filter(comment => comment.length > 0);
  } catch (error) {
    console.log('AI 댓글 생성 오류:', error.message);
    return [
      '서울 강남구에서 전세 구하는데 정말 어려워요',
      '월세 50만원인데 올해 10% 올랐어요',
      '청년 전세대출 신청했는데 승인까지 2주 걸렸습니다'
    ];
  }
}

// 토론 주제 템플릿 (12개 카테고리로 확장)
const discussionTemplates = {
  시황: [
    '요즘 부동산 시장 어떻게 보시나요?',
    '전세 시장 동향 분석',
    '월세 상승세 계속될까요?',
    '부동산 정책 변화 전망',
    '지역별 임대시장 현황',
    '부동산 시장 개미치네 진짜',
    '월세 올라가는 속도 미쳤음',
    '전세 시장 언제 안정될까?',
    '부동산 정책 자꾸 바뀌어서 혼란스러워',
    '지금이 계약하기 좋은 타이밍일까?'
  ],
  자유: [
    '무주택촌에서 살아가는 팁 공유해요',
    '전세 vs 월세 고민입니다',
    '원룸 구하기 어려운 시기인가요?',
    '집 구할 때 가장 중요한 것',
    '무주택 기간이 길어지면서 느끼는 점들',
    '원룸 구하기 개빡세네 ㅠㅠ',
    '전세 월세 고민되네 진짜',
    '집 구하기 너무 어려워서 미치겠음',
    '무주택 생활 2년차인데 지쳐',
    '원룸 찾으러 다니는게 지옥이야'
  ],
  부동산시장: [
    '아파트 vs 오피스텔 고민',
    '신축 vs 리모델링 어느게 나을까?',
    '부동산 중개비 절약 방법',
    '매물 정보 어디서 구하시나요?',
    '부동산 계약 전 체크리스트',
    '아파트 오피스텔 뭐가 나을까?',
    '중개비 너무 비싸서 미치겠어',
    '신축이랑 리모델링 중에 뭐가 좋음?',
    '부동산 매물 어디서 찾아?',
    '계약할 때 뭘 체크해야 함?'
  ],
  임대시장: [
    '월세 협상 성공 경험담',
    '보증금 반환 관련 경험',
    '임대차 계약서 꼼꼼히 챙기기',
    '월세 인상 제한 조항',
    '임대인과의 소통 팁',
    '월세 협상 어떻게 해야 함?',
    '보증금 돌려받기 개어려움',
    '계약서 읽기 너무 복잡해',
    '집주인이 월세 올린다고 하는데 막을 수 있음?',
    '집주인이랑 어떻게 대화해야 함?'
  ],
  분쟁사례: [
    '보증금 반환 거부 당했을 때',
    '월세 인상 통보 받았을 때',
    '시설 고장 시 처리 방법',
    '입주 거부 당한 경험',
    '계약 해지 관련 분쟁',
    '보증금 안 돌려준다고 개빡쳐',
    '월세 올린다고 갑자기 통보함',
    '에어컨 고장났는데 누가 고쳐?',
    '계약했는데 입주 거부당함',
    '집주인하고 싸웠는데 어떻게 해결함?'
  ],
  보증금: [
    '보증금 반환 받는 팁',
    '보증금 대출 이용해보신 분?',
    '보증금 적립금 활용법',
    '보증금 반환 시기',
    '보증금 관련 법적 권리',
    '보증금 돌려받기 개힘들어',
    '보증금 대출 써본 사람 있음?',
    '보증금 어떻게 활용함?',
    '보증금 언제쯤 돌려받을 수 있음?',
    '보증금 관련 법적으로 뭔 권리 있음?'
  ],
  월세인상: [
    '월세 인상률 어느 정도가 적정한가요?',
    '월세 협상 성공 사례',
    '월세 인상 통보 받았을 때 대처법',
    '월세 인상 제한 조항 활용',
    '월세 vs 전세 전환 고민',
    '월세 인상률 얼마나 올려도 되나?',
    '월세 협상 성공한 사람 있음?',
    '월세 올린다고 갑자기 통보함 ㅡㅡ',
    '월세 인상 막을 수 있는 방법 있음?',
    '월세 전세 전환 고민되네'
  ],
  계약해지: [
    '임대차 계약 해지 절차',
    '계약 해지 시 주의사항',
    '갑작스러운 계약 해지 대처법',
    '계약 해지 후 이사 준비',
    '계약 해지 관련 법적 문제',
    '계약 해지 절차 개복잡해',
    '계약 해지할 때 뭘 주의해야 함?',
    '갑자기 계약 해지 당했는데 어쩌지?',
    '계약 해지하고 이사 준비 어떻게 함?',
    '계약 해지 관련 법적 문제 생겼는데'
  ],
  입주체크: [
    '입주 전 꼭 확인해야 할 체크리스트',
    '전세/월세 계약 전 필수 확인사항',
    '부동산 중개업소 선택 가이드',
    '임대차 계약서 검토 포인트',
    '입주 전 점검해야 할 시설들',
    '전세금 반환 보장 방법',
    '입주 시 주의사항과 팁',
    '계약 전 체크리스트 알려주세요',
    '입주할 때 뭘 확인해야 함?',
    '부동산 중개사 어떻게 선택함?'
  ],
  집주인소통: [
    '집주인과의 원활한 소통 방법',
    '월세 협상 시 집주인과의 대화법',
    '집주인과 갈등 해결하는 방법',
    '집주인에게 요구사항 전달하는 법',
    '집주인과의 관계 유지 팁',
    '집주인과의 소통 시 주의사항',
    '집주인과 친해지는 방법',
    '집주인이랑 어떻게 대화해야 함?',
    '집주인과 갈등 생겼을 때 해결법',
    '집주인한테 요구사항 어떻게 말함?'
  ],
  투자: [
    '부동산 투자 성공 전략',
    '소액 부동산 투자 방법',
    '전세 투자 시 주의사항',
    '부동산 투자 타이밍 분석',
    '투자용 부동산 선택 기준',
    '부동산 투자 리스크 관리',
    '부동산 투자 수익률 계산법',
    '부동산 투자 어떻게 시작함?',
    '소액으로도 부동산 투자 가능함?',
    '투자용 부동산 뭐가 좋음?'
  ],
  정책: [
    '청년 전세대출 지원 정책 변화',
    '임대차 3법 주요 개정사항',
    '공공임대주택 신청 조건과 절차',
    '전세자금대출 금리 인하 소식',
    '임대사업자 등록 의무화',
    '주거급여 신청 방법과 조건',
    '정부 주거 지원 정책 안내',
    '청년 전세대출 어떻게 신청함?',
    '공공임대주택 신청 조건이 뭐임?',
    '주거급여 받을 수 있는 조건이 뭐임?'
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

// OpenAI API를 사용한 다양한 게시글 생성
async function generateRealisticContent(category, title, postType, usePolite) {
  try {
    const prompt = `당신은 무주택 세입자 커뮤니티의 활발한 회원입니다. 
카테고리: ${category}
제목: ${title}
글 유형: ${postType}
말투: ${usePolite ? '존댓말' : '반말'}

다음 규칙을 따라 게시글을 작성해주세요:
1. ${postType === '질문' ? '궁금한 점을 구체적으로 질문' : '유용한 정보나 경험을 구체적으로 공유'}
2. ${usePolite ? '정중한 존댓말 사용 (예: ~입니다, ~해요, ~인가요?)' : '자연스러운 DC 스타일 반말 사용 (예: ~임, ~함, ~인가?)'}
3. 이모지 적절히 사용 (😊, 😭, 💸, 🏠 등)
4. 실제 세입자가 쓴 것처럼 구체적이고 생생하게
5. HTML 태그 사용 금지
6. 3-5문장 정도의 적당한 길이
7. 친근하고 공감가는 톤으로

예시 (반말):
- 질문: "월세 협상 어떻게 해야 함? 집주인한테 뭐라고 말해야 깎아줄까? 경험담 좀 알려줘 ㅠㅠ"
- 정보: "보증금 돌려받을 때 이거 꼭 체크하셈. 나는 이거 몰라서 50만원 날렸음 ㅡㅡ 입주할 때 사진 다 찍어두고, 퇴실 때도 똑같이 찍어서 비교해라. 특히 벽지, 장판, 싱크대 상태 제일 중요함"

예시 (존댓말):
- 질문: "월세 협상은 어떻게 하면 좋을까요? 집주인분께 어떻게 말씀드려야 할지 고민이에요 ㅠㅠ 경험담 공유 부탁드립니다!"
- 정보: "보증금 돌려받을 때 이것만은 꼭 체크하세요. 저는 몰라서 50만원 손해 봤습니다 😭 입주할 때 사진을 다 찍어두시고, 퇴실할 때도 똑같이 찍어서 비교하세요. 특히 벽지, 장판, 싱크대 상태가 제일 중요해요!"

게시글 내용만 작성하고, 다른 설명은 하지 마세요.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '당신은 무주택 세입자 커뮤니티의 활발한 회원입니다. DC 스타일의 반말로 자연스럽고 공감가는 게시글을 작성합니다.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 300,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API 오류:', error.message);
    return generateFallbackContent(category, title);
  }
}

// 게시글에 대한 댓글 생성 (OpenAI API 사용)
async function generateComments(postContent, postType, category, commentCount, postUsePolite) {
  try {
    const prompt = `당신은 무주택 세입자 커뮤니티의 다양한 회원들입니다.
게시글 유형: ${postType}
게시글 내용: ${postContent}
카테고리: ${category}

${postType === '질문' ? '이 질문에 대한 답변 댓글' : '이 정보글에 대한 반응 댓글'} ${commentCount}개를 작성해주세요.

규칙:
1. 각 댓글은 서로 다른 사람이 작성한 것처럼 다양한 톤 사용
2. 반말과 존댓말을 랜덤하게 섞어서 사용 (각 댓글마다 다른 말투)
3. ${postType === '질문' ? '구체적이고 실용적인 답변이나 경험담' : '공감, 질문, 추가 정보 제공 등 다양한 반응'}
4. 이모지 적절히 사용
5. 각 댓글은 2-4문장 정도
6. 댓글마다 줄바꿈으로 구분 (구분자: |||)

예시 (질문글 - 반말과 존댓말 혼합):
ㄹㅇ 나도 궁금했던건데 ㅋㅋ 집주인한테 솔직하게 말하면 의외로 협상 잘됨|||저는 작년에 5만원 깎았어요 ㅎㅎ 시세 조사해서 가격표 보여드리면서 얘기했더니 바로 OK 나오더라구요|||월세는 협상 안되는줄 알았는데 가능하구나 ㄷㄷ 나도 해봐야지|||오 꿀팁이네요! 저장했습니다 감사합니다 ^^

예시 (정보글 - 반말과 존댓말 혼합):
오 이거 진짜 유용한 정보다 👍|||완전 공감해요 ㅠㅠ 저도 사진 안찍어놔서 보증금 깎였거든요|||이런 정보 너무 감사함 ㅋㅋ 다음에 이사갈 때 꼭 해야지|||벽지 하나 찢어졌다고 30만원 뜯겼어요 ㅡㅡ 정말 황당했습니다

댓글들만 작성하고, 다른 설명은 하지 마세요.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '당신은 무주택 세입자 커뮤니티의 다양한 회원들입니다. 각자 다른 톤으로 댓글을 작성합니다.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 1.0, // 더 다양한 댓글을 위해
      max_tokens: 400,
    });

    const commentsText = response.choices[0].message.content.trim();
    return commentsText.split('|||').map(c => c.trim()).filter(c => c.length > 0);
  } catch (error) {
    console.error('댓글 생성 API 오류:', error.message);
    // 폴백 댓글
    return postType === '질문' 
      ? ['답변 감사합니다!', '저도 궁금했는데 ㅋㅋ', '오 이거 좋은 정보네요']
      : ['공감합니다 ㅠㅠ', '저도 비슷한 경험 있어요', '유용한 정보 감사합니다!'];
  }
}

// API 실패 시 폴백 함수
function generateFallbackContent(category, title) {
  // 더 다양하고 자연스러운 템플릿들
  const diverseContents = {
    자유: [
      "요즘 정말 막막해서 글 올려봅니다... 😔 원룸 찾은 지 3개월째인데 정말 어렵네요. 월세는 너무 비싸고, 전세는 보증금이 부족해서... 혹시 비슷한 상황이셨던 분들 어떻게 해결하셨는지 조언 부탁드려요! 🙏",
      "안녕하세요! 무주택 생활하면서 느끼는 점이 많아서 공유해봅니다. 정말 외로울 때가 많은데, 비슷한 마음이신 분들 계신가요? 서로 힘이 되어주면 좋겠어요 💪",
      "전세 vs 월세 고민이 심해요... 😅 부모님은 전세를 추천하시는데, 보증금이 부담스럽고... 여러분은 어떤 기준으로 선택하셨나요? 경험담 들려주세요!",
      "요즘 원룸 구하기가 정말 지옥이네요... 😭 중개비도 비싸고, 좋은 곳은 금방 사라지고... 혹시 좋은 팁 있으시면 공유해주세요!",
      "무주택 생활 2년차입니다. 처음엔 자유로워서 좋았는데 이제는 정말 힘들어요... 🏠 집에 대한 그리움이 커지네요. 여러분은 어떠신가요?"
    ],
    시황: [
      "요즘 부동산 시장이 너무 불안정해서 밤잠을 못 자고 있어요... 😰 정말 언제쯤 안정될까요? 전문가분들 의견 궁금합니다!",
      "전세 시장이 계속 오르락내리락하는데 정말 스트레스예요... 😓 지금이 계약하기 좋은 시기일까요? 아니면 더 기다려야 할까요?",
      "월세 상승세가 정말 무서워요... 💸 작년보다 20%나 올랐다고 하네요. 이게 언제까지 갈까요? 정말 걱정이에요.",
      "부동산 정책이 자주 바뀌어서 혼란스러워요... 😵‍💫 임차인 입장에서 어떤 정책이 도움이 될까요? 의견 부탁드려요!",
      "요즘 전세 사기 사건이 너무 많아서 무서워요... 😨 어떻게 하면 안전하게 전세를 구할 수 있을까요?"
    ],
    부동산시장: [
      "부동산 중개비가 정말 부담스러워요... 😤 보통 0.5%인데 큰 돈이잖아요. 혹시 절약할 수 있는 방법 있나요?",
      "아파트 vs 오피스텔 고민이 심해요... 🤔 아파트는 관리비가 비싸고, 오피스텔은 좀 불안하고... 각각의 장단점이 뭘까요?",
      "신축 vs 리모델링 중 어떤 게 더 나을까요? 😕 신축은 비싸지만 깨끗하고, 리모델링은 저렴하지만 불안하고... 경험담 공유 부탁드려요!",
      "부동산 매물 정보는 어디서 구하시나요? 🏠 네이버부동산, 직방, 다방 다 봤는데... 혹시 더 좋은 사이트 있나요?",
      "계약 전에 꼭 확인해야 할 체크리스트가 있을까요? 📋 실수하면 나중에 후회할 것 같아서... 조언 부탁드려요!"
    ],
    임대시장: [
      "월세 협상 성공하신 분들 정말 부럽습니다... 😍 어떻게 하셨는지 경험담 들려주세요! 저도 시도해보고 싶어요.",
      "임대차 계약서가 너무 복잡해요... 📄 어떤 부분을 특히 주의해야 할까요? 꼼꼼히 챙기라고 하는데 어디서부터 시작해야 할지 모르겠어요.",
      "보증금 반환 받을 때 문제 없으셨나요? 😰 혹시 깎이거나 거부당한 경험 있으신 분 계신가요? 팁 알려주세요!",
      "월세 인상 제한 조항이 있다고 들었는데... 🤷‍♀️ 어떻게 활용할 수 있나요? 집주인이 월세 올린다고 하는데 막을 수 있을까요?",
      "임대인과 소통할 때 주의할 점이 있을까요? 😅 너무 친해지면 안 되고, 너무 딱딱하면 안 되고... 적당한 선이 어디인지 모르겠어요."
    ],
    분쟁사례: [
      "보증금 반환 거부 당한 적 있으신 분 계신가요? 😡 어떻게 해결하셨는지 정말 궁금해요... 저도 비슷한 상황이라서...",
      "월세 인상 통보 받았을 때 어떻게 대처하셨나요? 😤 정말 갑작스러워서 당황했어요... 경험담 들려주세요.",
      "시설 고장 시 집주인과 어떻게 소통하셨나요? 🔧 에어컨이 고장났는데 수리비를 누가 내야 할지 모르겠어요...",
      "입주 거부 당한 경험 있으신 분 계신가요? 🚪 계약서에 서명했는데 집주인이 갑자기 바꿨다고 하네요... 어떻게 해결하셨나요?",
      "계약 해지 관련 분쟁 경험 있으신 분들 조언 부탁드려요... 😰 집주인이 갑자기 나가라고 하네요."
    ],
    보증금: [
      "보증금 대출 이용해보신 분 계신가요? 💰 어떤 조건인지 정말 궁금해요... 이자율이나 한도 같은 거요.",
      "보증금 적립금 활용하는 방법 있나요? 💡 그냥 놔두는 것보다 뭔가 할 수 있는 게 있을까요?",
      "보증금 반환 받는 팁 있으시면 공유 부탁드려요! 🙏 집주인이 깎으려고 하는데 어떻게 해야 할까요?",
      "보증금 반환 시기는 언제쯤인가요? ⏰ 계약 만료 후 얼마나 걸리나요? 궁금해요.",
      "보증금 관련 법적 권리가 있다고 들었는데... ⚖️ 어떤 것들이 있나요? 모르면 손해 볼 것 같아서..."
    ],
    월세인상: [
      "월세 인상률이 어느 정도가 적정하다고 생각하시나요? 📈 집주인이 10% 올린다고 하는데 너무 많은 건가요?",
      "월세 협상 성공 사례 있으시면 들려주세요! 💪 어떻게 말씀하셨는지 정말 궁금해요.",
      "월세 인상 통보 받았을 때 대처법 알려주세요... 😰 정말 당황스러워요.",
      "월세 vs 전세 전환을 고려 중인데 어떻게 생각하시나요? 🤔 월세가 계속 오르니까 전세가 나을까요?",
      "월세 인상 제한 조항을 어떻게 활용할 수 있나요? 📋 임대차 3법이 있다고 들었는데..."
    ],
    계약해지: [
      "임대차 계약 해지 절차가 복잡한가요? 📝 경험담 들려주세요... 이사 준비도 해야 하고 정말 복잡할 것 같아요.",
      "계약 해지 시 주의사항이 뭔지 궁금해요... ⚠️ 실수하면 손해 볼 것 같아서 미리 알고 싶어요.",
      "갑작스러운 계약 해지 당했을 때 어떻게 대처해야 할까요? 😱 집주인이 갑자기 나가라고 하네요...",
      "계약 해지 후 이사 준비는 어떻게 하시나요? 📦 이사비도 비싸고... 절약할 수 있는 방법 있나요?",
      "계약 해지 관련 법적 문제가 있을 수 있나요? ⚖️ 집주인과 마찰이 생겼는데..."
    ]
  };

  const contents = diverseContents[category] || ["안녕하세요! 관련해서 궁금한 점이 있어서 질문드려요."];
  const randomContent = contents[Math.floor(Math.random() * contents.length)];
  
  return randomContent;
}

// AI 기반 게시글 생성
async function createPostWithAI(postData) {
  try {
    const response = await fetch(`${process.env.SITE_BASE_URL || 'https://homeless-town.onrender.com'}/api/discussions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: postData.title,
        content: postData.content,
        tags: postData.tags || ['시황'],
        nickname: diverseAuthors[Math.floor(Math.random() * diverseAuthors.length)],
        password: 'ai123',
        marketTrend: Math.random() > 0.5 ? 'up' : 'down'
      }),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ AI 게시글 생성 성공: ${postData.title}`);
      return result.id || true;
    } else {
      const errorText = await response.text();
      console.log(`❌ AI 게시글 생성 실패: ${postData.title} - ${errorText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ AI 게시글 생성 오류: ${postData.title} - ${error.message}`);
    return false;
  }
}

// AI 기반 댓글 생성
async function createAIComments(postId, postTitle, postContent) {
  try {
    const comments = await generateAIComment(postContent, postTitle, 3);
    
    for (const commentContent of comments) {
      await fetch(`${process.env.SITE_BASE_URL || 'https://homeless-town.onrender.com'}/api/discussions/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentContent,
          nickname: diverseAuthors[Math.floor(Math.random() * diverseAuthors.length)],
          password: 'ai123'
        }),
      });
      
      // 댓글 간 간격
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`💬 AI 댓글 ${comments.length}개 생성 완료`);
  } catch (error) {
    console.log(`❌ AI 댓글 생성 오류: ${error.message}`);
  }
}

// AI로 템플릿 기반 글을 구체적이고 현실적으로 향상
async function generateAIEnhancedPost(template, category) {
  try {
    const prompt = `
다음 주제를 바탕으로 무주택촌 커뮤니티 토론글을 작성해주세요:

주제: ${template}
카테고리: ${category}

요구사항:
1. 제목은 30자 이내로 작성
2. 내용은 300-500자 정도로 작성
3. 실제 무주택자/전세자/월세자의 관점에서 작성
4. 구체적인 수치, 지역, 금액, 정책명을 포함
5. 실제 경험이나 상황을 구체적으로 묘사
6. 다른 사용자들이 댓글을 달고 싶어할 만한 구체적인 질문이나 의견 요청 포함
7. 친근하지만 현실적인 톤으로 작성
8. 한국어로 작성
9. 이모지는 사용하지 마세요
10. 자연스럽고 실제 사용자가 쓴 것처럼 작성
11. "어떻게 생각하시나요?" 같은 일반적인 질문보다는 구체적인 상황에 대한 의견을 요청
12. 최신 부동산 시장 동향이나 정책 변화를 반영

응답 형식:
제목: [제목]
내용: [내용]
태그: [태그1,태그2]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // 응답 파싱
    const titleMatch = response.match(/제목:\s*(.+)/);
    const contentMatch = response.match(/내용:\s*([\s\S]+?)(?=태그:|$)/);
    const tagsMatch = response.match(/태그:\s*(.+)/);
    
    const title = titleMatch?.[1]?.trim() || template;
    const content = contentMatch?.[1]?.trim() || '';
    const tags = tagsMatch?.[1]?.split(',').map(t => t.trim()) || getTagsForCategory(category);

    return { title, content, tags };
  } catch (error) {
    console.log('AI 템플릿 향상 오류:', error.message);
    return {
      title: template,
      content: `${template}에 대해 어떻게 생각하시나요? 실제 경험담이나 조언이 있으시면 댓글로 공유해주세요!`,
      tags: getTagsForCategory(category)
    };
  }
}

// 오늘 자동 글 등록
async function enqueueToday() {
  if (!postQueue) {
    console.log('⚠️ Redis가 연결되지 않아 즉시 실행 모드로 전환');
    
    console.log('🚀 개선된 자동 포스팅 시작 (뉴스 기반 + AI 생성)...');
    
    // 뉴스 기반 포스팅 먼저 시도
    let newsBasedPosts = 0;
    try {
      console.log('📰 최신 부동산 뉴스 가져오는 중...');
      const newsItems = await fetchRealEstateNews();
      
      if (newsItems.length > 0) {
        console.log(`📰 ${newsItems.length}개의 부동산 뉴스를 찾았습니다.`);
        
        // 최신 뉴스 3개로 토론글 생성
        const selectedNews = newsItems.slice(0, 3);
        
        for (const newsItem of selectedNews) {
          const newsPost = await generateNewsBasedPost(newsItem);
          console.log(`📰 뉴스 기반 토론글 생성: ${newsPost.title}`);
          
          const success = await createPostWithAI(newsPost);
          if (success) {
            newsBasedPosts++;
            console.log(`✅ 뉴스 기반 포스팅 성공: ${newsPost.title}`);
            
            // AI 댓글도 생성
            await createAIComments(success, newsPost.title, newsPost.content);
          } else {
            console.log(`❌ 뉴스 기반 포스팅 실패: ${newsPost.title}`);
          }
          
          // 포스팅 간 간격
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } else {
        console.log('📰 부동산 뉴스를 찾을 수 없습니다. 일반 포스팅으로 진행합니다.');
      }
    } catch (error) {
      console.log('📰 뉴스 API 오류:', error.message);
      console.log('📰 일반 포스팅으로 진행합니다.');
    }
    
    // 기존 템플릿 기반 포스팅 (뉴스 기반이 부족할 경우)
    const categories = Object.keys(discussionTemplates);
    const remainingPosts = Math.max(0, 5 - newsBasedPosts); // 총 5개 목표
    
    console.log(`📝 템플릿 기반 포스팅 ${remainingPosts}개 추가 생성`);

    for (let i = 0; i < remainingPosts; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const templates = discussionTemplates[category];
      
      // 템플릿에서 랜덤하게 선택
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      
      // AI로 자연스러운 글 생성
      const aiPost = await generateAIEnhancedPost(randomTemplate, category);
      
      console.log(`🤖 AI 향상된 템플릿 기반 글 생성: ${aiPost.title}`);
      
      const success = await createPostWithAI(aiPost);
      if (success) {
        console.log(`✅ AI 템플릿 기반 포스팅 성공: ${aiPost.title}`);
        
        // AI 댓글도 생성
        await createAIComments(success, aiPost.title, aiPost.content);
      } else {
        console.log(`❌ AI 템플릿 기반 포스팅 실패: ${aiPost.title}`);
      }
      
      // 포스팅 간 간격
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log(`🎉 자동 포스팅 완료! 뉴스 기반: ${newsBasedPosts}개, 템플릿 기반: ${remainingPosts}개`);
    
    return;
  }
  
  // Redis가 있는 경우의 기존 로직 (간소화)
  try {
    console.log('📝 Redis 큐에 작업 추가 중...');
          
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
              tags: getTagsForCategory(category), // 카테고리에 맞는 태그들 사용
              author: diverseAuthors[Math.floor(Math.random() * diverseAuthors.length)],
            }),
          });

          const responseText = await res.text();
          console.log(`📊 응답 상태: ${res.status}`);
          console.log(`📄 응답 내용: ${responseText}`);

          if (res.ok) {
            console.log(`✅ 게시글 생성 성공: ${title}`);
            
            // 게시글 생성 성공 시 댓글 추가
            try {
              const postData = JSON.parse(responseText);
              const postId = postData.post?.id;
              
              if (postId) {
                // 2~5개의 랜덤 댓글 수 결정
                const commentCount = Math.floor(Math.random() * 4) + 2; // 2~5
                console.log(`💬 댓글 ${commentCount}개 생성 중...`);
                
                // 댓글 생성 (게시글 말투 정보 전달)
                const comments = await generateComments(content, postType, category, commentCount, usePolite);
                
                // 각 댓글을 순차적으로 작성
                for (const commentContent of comments) {
                  const commentAuthor = diverseAuthors[Math.floor(Math.random() * diverseAuthors.length)];
                  
                  try {
                    const commentRes = await fetch(`${process.env.SITE_BASE_URL}/api/posts/${postId}/comments`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        content: commentContent,
                        author: commentAuthor,
                        nickname: commentAuthor,
                      }),
                    });
                    
                    if (commentRes.ok) {
                      console.log(`✅ 댓글 작성 성공: ${commentContent.substring(0, 30)}...`);
                    } else {
                      console.log(`❌ 댓글 작성 실패: ${commentRes.status}`);
                    }
                    
                    // 댓글 작성 간격 (0.5초)
                    await new Promise((r) => setTimeout(r, 500));
                  } catch (commentError) {
                    console.error(`댓글 작성 오류:`, commentError.message);
                  }
                }
              }
            } catch (commentError) {
              console.error(`댓글 생성 과정 오류:`, commentError.message);
            }
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
      
      // 모든 템플릿을 랜덤하게 섞어서 사용
      const shuffledTemplates = [...templates].sort(() => Math.random() - 0.5);
      const baseTemplate = shuffledTemplates[i % shuffledTemplates.length];
      
      // 제목에 랜덤 요소 추가하여 중복 방지
      const randomSuffixes = [
        '', ' 정말 고민이에요', ' 도움 부탁드려요', ' 조언 구해요', 
        ' 경험담 공유해요', ' 궁금해요', ' 어떻게 해야 할까요?',
        ' 팁 있나요?', ' 정보 부탁드려요', ' 의견 궁금해요',
        ' 고민이에요', ' 막막해요', ' 힘들어요', ' 어려워요'
      ];
      
      const randomSuffix = randomSuffixes[Math.floor(Math.random() * randomSuffixes.length)];
      title = `[${category}] ${baseTemplate}${randomSuffix}`;

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
