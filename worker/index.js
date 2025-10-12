// worker/index.js
const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');

// Node.js 18+ 에서 fetch 사용 가능, 그 이하 버전에서는 node-fetch 필요
// const fetch = require('node-fetch');

// Redis 연결
const connection = new IORedis(process.env.REDIS_URL);

// 큐 생성
const queueName = 'postQueue';
const postQueue = new Queue(queueName, { connection });

// 실제 작업자 로직
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

// 현실적인 게시글 내용 생성
function generateRealisticContent(category, title) {
  const baseContent = `
    <h2>${title}</h2>
    <p>안녕하세요! 무주택촌 회원분들과 경험과 정보를 공유하고 싶어서 글을 올려봅니다.</p>
  `;

  const categoryContents = {
    자유: `
      <p>무주택 생활하면서 느끼는 점들과 여러분의 경험담을 듣고 싶습니다.</p>
      <p>함께 고민하고 해결책을 찾아가면 좋을 것 같아요!</p>
    `,
    시황: `
      <p>최근 부동산 시장 동향에 대해 여러분의 의견을 들어보고 싶습니다.</p>
      <p>실제 경험하신 분들의 생생한 이야기를 들려주세요.</p>
    `,
    부동산시장: `
      <p>부동산 관련해서 궁금한 점들이 많아서 질문드립니다.</p>
      <p>경험 많으신 분들의 조언 부탁드려요!</p>
    `,
    임대시장: `
      <p>임대 관련해서 알고 계신 정보나 팁이 있으시면 공유해주세요.</p>
      <p>모두가 도움을 받을 수 있을 것 같아요.</p>
    `,
    분쟁사례: `
      <p>비슷한 상황을 겪어보신 분들의 경험담을 듣고 싶습니다.</p>
      <p>어떻게 해결하셨는지 조언 부탁드려요.</p>
    `,
    보증금: `
      <p>보증금 관련해서 궁금한 점들이 많습니다.</p>
      <p>여러분의 경험담을 들려주세요!</p>
    `,
    월세인상: `
      <p>월세 인상 관련해서 어떻게 대처하셨는지 궁금합니다.</p>
      <p>경험담과 조언 부탁드려요.</p>
    `,
    계약해지: `
      <p>계약 해지 관련해서 주의해야 할 점들이 있을까요?</p>
      <p>경험해보신 분들의 조언을 듣고 싶습니다.</p>
    `
  };

  return baseContent + (categoryContents[category] || '');
}

// 오늘 자동 글 등록
async function enqueueToday() {
  const categories = Object.keys(discussionTemplates);
  const TARGET_PER_CAT = Math.floor(160 / categories.length); // 총 160개 글을 카테고리별로 분배

  console.log(`🚀 ${categories.length}개 카테고리에 총 ${TARGET_PER_CAT * categories.length}개 게시글 등록 시작`);

  for (const category of categories) {
    const templates = discussionTemplates[category];
    
    for (let i = 0; i < TARGET_PER_CAT; i++) {
      // 템플릿에서 랜덤 선택 또는 새로운 제목 생성
      let title;
      if (i < templates.length) {
        title = `[${category}] ${templates[i]}`;
      } else {
        // 추가 제목 생성
        const variations = [
          `${category} 관련 질문드립니다`,
          `${category} 경험담 공유해요`,
          `${category} 궁금한 점이 있어요`,
          `${category} 팁 공유합니다`,
          `${category} 정보 공유해요`
        ];
        title = `[${category}] ${variations[i % variations.length]} #${i + 1}`;
      }

      const content = generateRealisticContent(category, title);
      
      // 하루에 걸쳐 분산 배치 (24시간 / 총 글 수)
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
