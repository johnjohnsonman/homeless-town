// 개선된 자동 포스팅 시스템 (뉴스 기반 업그레이드)
const express = require('express');
const axios = require('axios');

const app = express();

// 뉴스 API 설정
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'your-news-api-key';
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

// 뉴스 기반 토론글 생성 함수
async function fetchRealEstateNews() {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        q: '부동산 OR 전세 OR 월세 OR 임대차 OR 주택',
        language: 'ko',
        sortBy: 'publishedAt',
        pageSize: 10,
        apiKey: NEWS_API_KEY
      }
    });

    if (response.data && response.data.articles) {
      return response.data.articles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name
      }));
    }
    return [];
  } catch (error) {
    console.error('뉴스 API 오류:', error.message);
    return [];
  }
}

// 뉴스 기반 토론글 생성
function generateNewsBasedPost(newsItem) {
  const newsTitle = newsItem.title;
  const newsDescription = newsItem.description || '';
  
  // 뉴스 제목에서 키워드 추출
  const keywords = extractKeywords(newsTitle);
  const category = categorizeNews(keywords);
  
  // 뉴스 기반 토론글 제목 생성
  const discussionTitles = [
    `${newsTitle} 관련해서 어떻게 생각하세요?`,
    `${newsTitle} 이거 진짜 맞나요?`,
    `${newsTitle} 이 정책이 우리한테 어떤 영향일까요?`,
    `${newsTitle} 이거 보니까 걱정되네요`,
    `${newsTitle} 이거 어떻게 대처해야 할까요?`,
    `${newsTitle} 이거 정말 실현될까요?`,
    `${newsTitle} 이거 우리한테 도움될까요?`,
    `${newsTitle} 이거 보니까 전세 시장이 더 어려워질 것 같아요`,
    `${newsTitle} 이거 정말 필요한 정책인가요?`,
    `${newsTitle} 이거로 인해 월세가 더 오를까요?`
  ];
  
  const selectedTitle = discussionTitles[Math.floor(Math.random() * discussionTitles.length)];
  
  // 뉴스 기반 내용 생성
  const contentTemplates = [
    `오늘 뉴스에서 "${newsTitle}" 이라는 기사를 봤는데요.\n\n${newsDescription}\n\n이거 정말 걱정되네요. 우리 같은 무주택자들에게 어떤 영향이 있을까요?\n\n혹시 관련해서 아시는 분 있으시면 조언 부탁드려요!`,
    
    `"${newsTitle}" 이 기사 보셨나요?\n\n${newsDescription}\n\n이거 보니까 정말 불안해지네요. 전세 시장이 더 어려워질 것 같은데...\n\n여러분은 어떻게 생각하세요?`,
    
    `뉴스에서 "${newsTitle}" 이라고 나왔는데요.\n\n${newsDescription}\n\n이거 정말 실현되면 우리한테 어떤 영향이 있을까요? 월세가 더 오를까요?\n\n걱정되네요...`,
    
    `"${newsTitle}" 이 기사 보니까 정말 화나네요.\n\n${newsDescription}\n\n이런 정책들이 계속 나오면 우리는 언제 집을 살 수 있을까요?\n\n여러분도 같은 생각이시죠?`,
    
    `오늘 "${newsTitle}" 이라는 뉴스를 봤는데요.\n\n${newsDescription}\n\n이거 정말 필요한 정책인가요? 아니면 또 다른 부작용이 생길까요?\n\n걱정되네요...`
  ];
  
  const selectedContent = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
  
  return {
    title: selectedTitle,
    content: selectedContent,
    category: category,
    tags: [category, '시황', '정책'],
    style: 'question',
    isNewsBased: true,
    newsSource: newsItem.source,
    newsUrl: newsItem.url
  };
}

// 키워드 추출 함수
function extractKeywords(title) {
  const keywords = [];
  const keywordMap = {
    '전세': '전세',
    '월세': '월세',
    '임대차': '임대차',
    '보증금': '보증금',
    '정책': '정책',
    '금리': '금리',
    '대출': '대출',
    '투자': '투자',
    '아파트': '아파트',
    '오피스텔': '오피스텔',
    '신축': '신축',
    '리모델링': '리모델링',
    '중개비': '중개비',
    '계약': '계약',
    '해지': '해지',
    '인상': '인상',
    '하락': '하락',
    '상승': '상승'
  };
  
  for (const [keyword, category] of Object.entries(keywordMap)) {
    if (title.includes(keyword)) {
      keywords.push(category);
    }
  }
  
  return keywords;
}

// 뉴스 카테고리 분류 함수
function categorizeNews(keywords) {
  if (keywords.includes('전세') || keywords.includes('월세')) return '시황';
  if (keywords.includes('정책') || keywords.includes('금리')) return '정책';
  if (keywords.includes('투자')) return '투자';
  if (keywords.includes('계약') || keywords.includes('해지')) return '계약해지';
  if (keywords.includes('보증금')) return '보증금';
  if (keywords.includes('인상')) return '월세인상';
  if (keywords.includes('아파트') || keywords.includes('오피스텔')) return '부동산시장';
  if (keywords.includes('임대차')) return '임대시장';
  
  return '시황'; // 기본값
}

// 자연스러운 작성자 풀
const authorPool = [
  '피곤한하루', '초보생존자', '지친영혼', '정보맨', '배고픈고양이',
  '집구하러왔어요', '조심조심', '협상왕', '고민많은청년', '실화담',
  '절약달인', '무료러버', '생활고수', '라면마스터', '와이파이헌터',
  '전세금찾아요', '법률궁금', '보증금찾자', '계약서실수', '분쟁당사자',
  '서울이사', '경기살이', '부산이사준비', '대구살이', '인천거주자',
  '일용직찾아요', '알바정보맨', '재택원해요', '자격없어요', '야간알바러',
  '건강관심많아요', '치과공포증', '상담받고싶어요', '운동싫어요', '스트레스많아요',
  '인간만남', '위로받고싶어요', '계획러', '탈출성공자', '미래설계자'
];

// 자연스러운 토론 주제 템플릿 (12개 카테고리로 확장)
const discussionTemplates = {
  시황: [
    { title: '2025년 전세 시장 전망 어떻게 보시나요?', style: 'question' },
    { title: '월세 상승세 언제 끝날까요?', style: 'question' },
    { title: '부동산 정책 변화 전망 좀 알려주세요', style: 'question' },
    { title: '지역별 임대시장 현황 공유해요', style: 'info' },
    { title: '부동산 시장 동향 분석 자료 공유합니다', style: 'info' },
    { title: '전세 시장 침체 원인과 전망', style: 'info' },
    { title: '부동산 투자 타이밍 어떻게 생각하세요?', style: 'question' },
    { title: '월세 상승이 계속되는 이유', style: 'info' },
    { title: '부동산 시장 개미치네 진짜', style: 'dc' },
    { title: '지금이 계약하기 좋은 타이밍일까?', style: 'question' }
  ],
  자유: [
    { title: '무주택촌에서 살아가는 팁 좀 알려주세요', style: 'question' },
    { title: '아 진짜 힘들다... 누군가 들어줄 사람 없나요?', style: 'dc' },
    { title: '무료 식당 정보 공유합니다!', style: 'info' },
    { title: '오늘 뭐 먹지? ㅋㅋㅋ', style: 'dc' },
    { title: '월세 vs 전세 어떤 게 나을까요?', style: 'question' },
    { title: '부동산 중개수수료 절약 꿀팁 공유합니다', style: 'info' },
    { title: '계약서 작성 시 꼭 확인해야 할 사항들', style: 'info' },
    { title: '보증금 반환 받았던 경험 공유해요', style: 'case' },
    { title: '집주인과 갈등 해결한 사례 있으신가요?', style: 'question' },
    { title: '원룸 구하기 개빡세네 ㅠㅠ', style: 'dc' }
  ],
  부동산시장: [
    { title: '아파트 vs 오피스텔 진짜 고민이에요', style: 'question' },
    { title: '신축 vs 리모델링 어느게 나을까요?', style: 'question' },
    { title: '부동산 중개비 절약하는 방법', style: 'info' },
    { title: '매물 정보 어디서 구하시나요?', style: 'question' },
    { title: '부동산 계약 전 체크리스트 알려주세요', style: 'question' },
    { title: '부동산 중개사 선택 팁 공유합니다', style: 'info' },
    { title: '매물 사기 당한 경험 있으신가요?', style: 'question' },
    { title: '부동산 투자 성공 사례 공유해요', style: 'case' },
    { title: '아파트 오피스텔 뭐가 나을까?', style: 'question' },
    { title: '중개비 너무 비싸서 미치겠어', style: 'dc' }
  ],
  임대시장: [
    { title: '월세 협상 성공했어요! 후기 올려요', style: 'case' },
    { title: '보증금 반환 관련 경험 공유해요', style: 'case' },
    { title: '임대차 계약서 꼼꼼히 챙기기', style: 'info' },
    { title: '월세 인상 제한 조항 활용법', style: 'info' },
    { title: '임대인과의 소통 팁', style: 'info' },
    { title: '월세 협상 꿀팁 공유합니다', style: 'info' },
    { title: '전세 전환 시 유의사항', style: 'info' },
    { title: '임대차 계약 갱신 시 주의사항', style: 'info' },
    { title: '월세 협상 어떻게 해야 함?', style: 'question' },
    { title: '집주인이랑 어떻게 대화해야 함?', style: 'question' }
  ],
  분쟁사례: [
    { title: '보증금 반환 거부 당했어요 도와주세요', style: 'question' },
    { title: '월세 인상 통보 받았는데 어떻게 해야 하나요?', style: 'question' },
    { title: '시설 고장 시 처리 방법', style: 'info' },
    { title: '입주 거부 당한 경험 있으신가요?', style: 'question' },
    { title: '계약 해지 관련 분쟁 해결 방법', style: 'info' },
    { title: '집주인과 분쟁 해결한 사례 공유해요', style: 'case' },
    { title: '보증금 분쟁 법률 상담 받은 경험', style: 'case' },
    { title: '월세 인상 분쟁 어떻게 해결하셨나요?', style: 'question' },
    { title: '보증금 안 돌려준다고 개빡쳐', style: 'dc' },
    { title: '집주인하고 싸웠는데 어떻게 해결함?', style: 'question' }
  ],
  보증금: [
    { title: '보증금 반환 받는 꿀팁 공유해요', style: 'info' },
    { title: '보증금 대출 이용해보신 분 있나요?', style: 'question' },
    { title: '보증금 적립금 활용법', style: 'info' },
    { title: '보증금 반환 시기 언제인가요?', style: 'question' },
    { title: '보증금 관련 법적 권리', style: 'info' },
    { title: '보증금 반환 거부 당했을 때 대처법', style: 'info' },
    { title: '보증금 반환 성공 사례 공유합니다', style: 'case' },
    { title: '보증금 대출 한도 얼마나 되나요?', style: 'question' },
    { title: '보증금 돌려받기 개힘들어', style: 'dc' },
    { title: '보증금 어떻게 활용함?', style: 'question' }
  ],
  월세인상: [
    { title: '월세 인상률 진짜 미쳤어요', style: 'dc' },
    { title: '월세 협상 성공 사례 공유해요', style: 'case' },
    { title: '월세 인상 통보 받았을 때 대처법', style: 'info' },
    { title: '월세 인상 제한 조항 활용하기', style: 'info' },
    { title: '월세 vs 전세 전환 고민', style: 'question' },
    { title: '월세 인상 거부할 수 있나요?', style: 'question' },
    { title: '월세 협상 꿀팁 공유합니다', style: 'info' },
    { title: '월세 인상 제한 조항 활용 사례', style: 'case' },
    { title: '월세 올린다고 갑자기 통보함 ㅡㅡ', style: 'dc' },
    { title: '월세 전세 전환 고민되네', style: 'question' }
  ],
  계약해지: [
    { title: '임대차 계약 해지 절차 알려주세요', style: 'question' },
    { title: '계약 해지 시 주의사항', style: 'info' },
    { title: '갑작스러운 계약 해지 대처법', style: 'info' },
    { title: '계약 해지 후 이사 준비', style: 'info' },
    { title: '계약 해지 관련 법적 문제', style: 'info' },
    { title: '계약 해지 시 보증금 반환은?', style: 'question' },
    { title: '계약 해지 후 이사 경험 공유해요', style: 'case' },
    { title: '갑작스러운 퇴거 요구 당한 분 있나요?', style: 'question' },
    { title: '계약 해지 절차 개복잡해', style: 'dc' },
    { title: '계약 해지하고 이사 준비 어떻게 함?', style: 'question' }
  ],
  입주체크: [
    { title: '입주 전 꼭 확인해야 할 체크리스트', style: 'info' },
    { title: '전세/월세 계약 전 필수 확인사항', style: 'info' },
    { title: '부동산 중개업소 선택 가이드', style: 'info' },
    { title: '임대차 계약서 검토 포인트', style: 'info' },
    { title: '입주 전 점검해야 할 시설들', style: 'info' },
    { title: '전세금 반환 보장 방법', style: 'info' },
    { title: '입주 시 주의사항과 팁', style: 'info' },
    { title: '계약 전 체크리스트 알려주세요', style: 'question' },
    { title: '입주할 때 뭘 확인해야 함?', style: 'question' },
    { title: '부동산 중개사 어떻게 선택함?', style: 'question' }
  ],
  집주인소통: [
    { title: '집주인과의 원활한 소통 방법', style: 'info' },
    { title: '월세 협상 시 집주인과의 대화법', style: 'info' },
    { title: '집주인과 갈등 해결하는 방법', style: 'info' },
    { title: '집주인에게 요구사항 전달하는 법', style: 'info' },
    { title: '집주인과의 관계 유지 팁', style: 'info' },
    { title: '집주인과의 소통 시 주의사항', style: 'info' },
    { title: '집주인과 친해지는 방법', style: 'info' },
    { title: '집주인이랑 어떻게 대화해야 함?', style: 'question' },
    { title: '집주인과 갈등 생겼을 때 해결법', style: 'question' },
    { title: '집주인한테 요구사항 어떻게 말함?', style: 'question' }
  ],
  투자: [
    { title: '부동산 투자 성공 전략', style: 'info' },
    { title: '소액 부동산 투자 방법', style: 'info' },
    { title: '전세 투자 시 주의사항', style: 'info' },
    { title: '부동산 투자 타이밍 분석', style: 'info' },
    { title: '투자용 부동산 선택 기준', style: 'info' },
    { title: '부동산 투자 리스크 관리', style: 'info' },
    { title: '부동산 투자 수익률 계산법', style: 'info' },
    { title: '부동산 투자 어떻게 시작함?', style: 'question' },
    { title: '소액으로도 부동산 투자 가능함?', style: 'question' },
    { title: '투자용 부동산 뭐가 좋음?', style: 'question' }
  ],
  정책: [
    { title: '청년 전세대출 지원 정책 변화', style: 'info' },
    { title: '임대차 3법 주요 개정사항', style: 'info' },
    { title: '공공임대주택 신청 조건과 절차', style: 'info' },
    { title: '전세자금대출 금리 인하 소식', style: 'info' },
    { title: '임대사업자 등록 의무화', style: 'info' },
    { title: '주거급여 신청 방법과 조건', style: 'info' },
    { title: '정부 주거 지원 정책 안내', style: 'info' },
    { title: '청년 전세대출 어떻게 신청함?', style: 'question' },
    { title: '공공임대주택 신청 조건이 뭐임?', style: 'question' },
    { title: '주거급여 받을 수 있는 조건이 뭐임?', style: 'question' }
  ]
};

// 질문 스타일 내용 생성 (답변은 댓글로)
function generateQuestionContent(title, category) {
  const questionTemplates = [
    `${title}\n\n${category} 관련해서 궁금한 점이 있어서 글 올립니다.\n\n혹시 경험이 있으신 분들 조언 부탁드려요!`,
    
    `안녕하세요. ${title}\n\n${category} 분야에서 이런 고민이 있는데 어떻게 해결하면 좋을까요?\n\n좋은 정보 있으시면 댓글로 알려주세요.`,
    
    `${title}\n\n${category} 관련해서 문의드립니다.\n\n비슷한 경험 있으신 분들 조언 부탁드려요!`,
    
    `질문드립니다. ${title}\n\n${category} 분야에서 도움이 필요합니다.\n\n댓글로 조언 부탁드려요!`
  ];
  
  return questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
}

// 정보 스타일 내용 생성
function generateInfoContent(title, category) {
  const infoTemplates = [
    `${title}\n\n${category} 관련해서 유용한 정보 공유합니다.\n\n많은 분들께 도움이 되길 바라요!`,
    
    `안녕하세요. ${title}\n\n${category} 분야에서 알아두면 좋은 정보를 정리해봤습니다.\n\n참고하시고 추가 정보 있으시면 댓글로 공유해주세요.`,
    
    `${title}\n\n${category} 관련 팁을 공유합니다.\n\n도움이 되셨으면 좋겠어요!`,
    
    `정보 공유합니다. ${title}\n\n${category} 분야에서 유용한 내용이니 참고해주세요!`
  ];
  
  return infoTemplates[Math.floor(Math.random() * infoTemplates.length)];
}

// 사례 스타일 내용 생성
function generateCaseContent(title, category) {
  const caseTemplates = [
    `${title}\n\n${category} 관련해서 제 경험을 공유합니다.\n\n비슷한 상황이신 분들께 도움이 되길 바라요!`,
    
    `안녕하세요. ${title}\n\n${category} 분야에서 겪었던 사례를 공유합니다.\n\n참고하시고 궁금한 점 있으시면 댓글로 물어보세요!`,
    
    `${title}\n\n${category} 관련해서 제 경험담을 올립니다.\n\n도움이 되셨으면 좋겠어요!`,
    
    `사례 공유합니다. ${title}\n\n${category} 분야에서 겪었던 일을 정리해봤습니다.`
  ];
  
  return caseTemplates[Math.floor(Math.random() * caseTemplates.length)];
}

// DC 스타일 내용 생성
function generateDCContent(title, category) {
  const dcTemplates = [
    `ㅇㅇ 맞네요 ${category} 관련해서 진짜 어려운 것 같아요 ㅠㅠ\n\n다른 분들도 비슷한 경험 있으시면 댓글로 공유해주세요!`,
    
    `와 이거 진짜 공감돼요...\n\n${category} 분야에서 이런 문제들 많이 겪으시는 것 같은데 저도 같은 고민 있어요. 어떻게 해결하셨는지 궁금합니다!`,
    
    `ㅋㅋㅋ 진짜 이런 일이 다 있네요\n\n${category} 관련해서는 정말 다양한 케이스가 있는 것 같아요.`,
    
    `이거 진짜 중요한 문제인 것 같아요\n\n${category} 분야에서 이런 고민들 많이 하시는 것 같은데 어떻게 해결하셨는지 궁금해요.`
  ];
  
  return dcTemplates[Math.floor(Math.random() * dcTemplates.length)];
}

// 게시글 생성 함수
async function createPost(postData) {
  try {
    const response = await fetch(`${process.env.SITE_BASE_URL || 'https://homeless-town.onrender.com'}/api/discussions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: postData.title,
        content: postData.content,
        tags: postData.tags || [postData.category],
        nickname: getRandomAuthor(),
        password: 'auto123',
        marketTrend: Math.random() > 0.5 ? 'up' : 'down'
      }),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ 게시글 생성 성공: ${postData.title}`);
      return result.id || true;
    } else {
      const errorText = await response.text();
      console.log(`❌ 게시글 생성 실패: ${postData.title} - ${errorText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ 게시글 생성 오류: ${postData.title} - ${error.message}`);
    return false;
  }
}

// 랜덤 작성자 선택
function getRandomAuthor() {
  return authorPool[Math.floor(Math.random() * authorPool.length)];
}

// 카테고리 섞기 함수
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 댓글 템플릿
const commentTemplates = [
  '공감합니다! 저도 비슷한 경험이 있어요.',
  '좋은 정보 감사합니다. 도움이 되었어요.',
  '저도 궁금했던 내용이에요. 댓글 남기고 갑니다.',
  '이런 정보가 정말 필요했어요. 감사합니다!',
  '비슷한 상황인데 어떻게 해결하셨나요?',
  '좋은 글 감사합니다. 추천드려요!',
  '저도 같은 고민이 있었는데 도움이 되네요.',
  '정보 공유 감사합니다. 잘 읽었습니다.',
  '이런 내용 정말 유용하네요. 북마크!',
  '도움이 많이 되었습니다. 감사합니다.'
];

// 랜덤 댓글 생성
function getRandomComment() {
  return commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
}

// 댓글 생성 함수
async function createComment(postId) {
  try {
    const res = await fetch(`${process.env.SITE_BASE_URL}/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: getRandomComment(),
        author: getRandomAuthor()
      }),
    });
    
    if (res.ok) {
      console.log(`💬 댓글 생성 성공 (게시글 ID: ${postId})`);
      return true;
    } else {
      const errorText = await res.text();
      console.log(`❌ 댓글 생성 실패 (게시글 ID: ${postId}): ${errorText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ 댓글 생성 오류 (게시글 ID: ${postId}):`, error.message);
    return false;
  }
}

// 개선된 자동 포스팅 함수 (뉴스 기반 업그레이드)
async function improvedAutoPosting() {
  console.log('🚀 개선된 자동 포스팅 시작 (뉴스 기반 포함)...');
  
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
        const newsPost = generateNewsBasedPost(newsItem);
        console.log(`📰 뉴스 기반 토론글 생성: ${newsPost.title}`);
        
        const success = await createPost(newsPost);
        if (success) {
          newsBasedPosts++;
          console.log(`✅ 뉴스 기반 포스팅 성공: ${newsPost.title}`);
          
          // 댓글도 생성
          await createComment(success);
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
  
  const categories = Object.keys(discussionTemplates);
  // 카테고리를 섞어서 같은 카테고리가 연속으로 나오지 않도록 함
  const shuffledCategories = shuffleArray(categories);
  
  let successCount = newsBasedPosts; // 뉴스 기반 포스팅 수를 포함
  let failCount = 0;
  let commentSuccessCount = 0;
  let commentFailCount = 0;
  
  // 이전에 사용한 카테고리 추적 (같은 카테고리가 연속으로 나오지 않도록)
  let lastCategory = null;
  
  for (const category of shuffledCategories) {
    console.log(`📝 ${category} 카테고리 포스팅 시작...`);
    
    // 이 카테고리 내에서 사용한 템플릿 추적
    const usedTemplates = [];
    
    for (let i = 0; i < 3; i++) {
      const templates = discussionTemplates[category];
      
      // 사용하지 않은 템플릿만 필터링
      const availableTemplates = templates.filter(t => !usedTemplates.includes(t.title));
      
      // 사용 가능한 템플릿이 없으면 초기화
      if (availableTemplates.length === 0) {
        usedTemplates.length = 0;
        availableTemplates.push(...templates);
      }
      
      // 사용 가능한 템플릿 중 랜덤 선택
      const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
      usedTemplates.push(template.title);
      
      const author = getRandomAuthor();
      
      // 스타일에 따라 적절한 콘텐츠 생성
      let content;
      switch(template.style) {
        case 'question':
          content = generateQuestionContent(template.title, category);
          break;
        case 'info':
          content = generateInfoContent(template.title, category);
          break;
        case 'case':
          content = generateCaseContent(template.title, category);
          break;
        case 'dc':
          content = generateDCContent(template.title, category);
          break;
        default:
          content = generateQuestionContent(template.title, category);
      }
      
      try {
        console.log(`📢 게시글 생성 시도: ${template.title} (작성자: ${author})`);
        
        const res = await fetch(`${process.env.SITE_BASE_URL}/api/admin/posts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: template.title,
            content: content,
            categorySlug: category,
            status: 'published',
            tags: ['자동작성'],
            author: author
          }),
        });
        
        const responseText = await res.text();
        console.log(`📊 응답 상태: ${res.status}`);
        console.log(`📄 응답 내용: ${responseText}`);
        
        if (res.ok) {
          console.log(`✅ 게시글 생성 성공: ${template.title}`);
          successCount++;
          
          // 게시글 생성 성공 후 댓글 생성 시도
          try {
            const responseData = JSON.parse(responseText);
            const postId = responseData.post?.id;
            
            if (postId) {
              console.log(`💬 댓글 생성 시도 (게시글 ID: ${postId})`);
              await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
              
              const commentSuccess = await createComment(postId);
              if (commentSuccess) {
                commentSuccessCount++;
              } else {
                commentFailCount++;
              }
            }
          } catch (commentError) {
            console.log(`❌ 댓글 생성 오류:`, commentError.message);
            commentFailCount++;
          }
        } else {
          console.log(`❌ 게시글 생성 실패: ${template.title} - ${res.status}`);
          failCount++;
        }
      } catch (error) {
        console.log(`❌ 게시글 생성 오류: ${template.title}`, error.message);
        failCount++;
      }
      
      // 3초 간격
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log(`🎉 자동 포스팅 완료!`);
  console.log(`📊 게시글 - 성공: ${successCount}, 실패: ${failCount}`);
  console.log(`💬 댓글 - 성공: ${commentSuccessCount}, 실패: ${commentFailCount}`);
  
  return { 
    success: successCount, 
    fail: failCount,
    comments: {
      success: commentSuccessCount,
      fail: commentFailCount
    }
  };
}

// API 엔드포인트
app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/improved-auto-posting', async (req, res) => {
  try {
    const result = await improvedAutoPosting();
    res.json({ 
      ok: true, 
      message: '개선된 자동 포스팅 완료',
      result: result
    });
  } catch (error) {
    console.error('자동 포스팅 오류:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ 개선된 Worker server is running on port ${PORT}`);
});

module.exports = { improvedAutoPosting };
