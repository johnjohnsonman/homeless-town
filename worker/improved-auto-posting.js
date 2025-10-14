// 개선된 자동 포스팅 시스템
const express = require('express');

const app = express();

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

// 자연스러운 토론 주제 템플릿
const discussionTemplates = {
  자유: [
    { title: '오늘 하루도 고생했어요 ㅠㅠ', style: 'dc' },
    { title: '무주택촌에서 살아가는 팁 좀 알려주세요', style: 'normal' },
    { title: '아 진짜 힘들다... 누군가 들어줄 사람 없나요?', style: 'dc' },
    { title: '무료 식당 정보 공유합니다!', style: 'normal' },
    { title: '오늘 뭐 먹지? ㅋㅋㅋ', style: 'dc' }
  ],
  시황: [
    { title: '요즘 부동산 시장 진짜 미친 것 같아요', style: 'dc' },
    { title: '전세 시장 동향 어떻게 보시나요?', style: 'normal' },
    { title: '월세 상승세 언제 끝날까요?', style: 'normal' },
    { title: '부동산 정책 변화 전망 좀 알려주세요', style: 'normal' },
    { title: '지역별 임대시장 현황 공유해요', style: 'normal' }
  ],
  부동산시장: [
    { title: '아파트 vs 오피스텔 진짜 고민이에요', style: 'dc' },
    { title: '신축 vs 리모델링 어느게 나을까요?', style: 'normal' },
    { title: '부동산 중개비 절약하는 방법', style: 'normal' },
    { title: '매물 정보 어디서 구하시나요?', style: 'normal' },
    { title: '부동산 계약 전 체크리스트 알려주세요', style: 'normal' }
  ],
  임대시장: [
    { title: '월세 협상 성공했어요! 후기 올려요', style: 'dc' },
    { title: '보증금 반환 관련 경험 공유해요', style: 'normal' },
    { title: '임대차 계약서 꼼꼼히 챙기기', style: 'normal' },
    { title: '월세 인상 제한 조항 활용법', style: 'normal' },
    { title: '임대인과의 소통 팁', style: 'normal' }
  ],
  분쟁사례: [
    { title: '보증금 반환 거부 당했어요 도와주세요', style: 'dc' },
    { title: '월세 인상 통보 받았는데 어떻게 해야 하나요?', style: 'normal' },
    { title: '시설 고장 시 처리 방법', style: 'normal' },
    { title: '입주 거부 당한 경험 있으신가요?', style: 'normal' },
    { title: '계약 해지 관련 분쟁 해결 방법', style: 'normal' }
  ],
  보증금: [
    { title: '보증금 반환 받는 꿀팁 공유해요', style: 'dc' },
    { title: '보증금 대출 이용해보신 분 있나요?', style: 'normal' },
    { title: '보증금 적립금 활용법', style: 'normal' },
    { title: '보증금 반환 시기 언제인가요?', style: 'normal' },
    { title: '보증금 관련 법적 권리', style: 'normal' }
  ],
  월세인상: [
    { title: '월세 인상률 진짜 미쳤어요', style: 'dc' },
    { title: '월세 협상 성공 사례 공유해요', style: 'normal' },
    { title: '월세 인상 통보 받았을 때 대처법', style: 'normal' },
    { title: '월세 인상 제한 조항 활용하기', style: 'normal' },
    { title: '월세 vs 전세 전환 고민', style: 'normal' }
  ],
  계약해지: [
    { title: '임대차 계약 해지 절차 알려주세요', style: 'normal' },
    { title: '계약 해지 시 주의사항', style: 'normal' },
    { title: '갑작스러운 계약 해지 대처법', style: 'normal' },
    { title: '계약 해지 후 이사 준비', style: 'normal' },
    { title: '계약 해지 관련 법적 문제', style: 'normal' }
  ]
};

// DC 스타일 내용 생성
function generateDCContent(title, category) {
  const dcTemplates = [
    `ㅇㅇ 맞네요 ${category} 관련해서 진짜 어려운 것 같아요 ㅠㅠ\n\n저도 비슷한 경험이 있는데 정말 답답했어요. 다른 분들도 비슷한 경험 있으시면 댓글로 공유해주세요!\n\n혹시 좋은 해결방법 아시는 분 있으면 알려주시면 감사하겠습니다.`,
    
    `와 이거 진짜 공감돼요...\n\n${category} 분야에서 이런 문제들 많이 겪으시는 것 같은데 저도 같은 고민 있어요. 어떻게 해결하셨는지 궁금합니다!\n\n정보 공유해주시면 정말 감사할 것 같아요 ㅠㅠ`,
    
    `ㅋㅋㅋ 진짜 이런 일이 다 있네요\n\n${category} 관련해서는 정말 다양한 케이스가 있는 것 같아요. 저도 비슷한 상황 겪어봤는데 정말 답답했어요.\n\n혹시 좋은 팁이나 경험담 있으시면 댓글로 알려주세요!`,
    
    `이거 진짜 중요한 문제인 것 같아요\n\n${category} 분야에서 이런 고민들 많이 하시는 것 같은데 저도 같은 상황이에요. 어떻게 해결하셨는지 궁금해요.\n\n정보 공유해주시면 정말 도움이 될 것 같습니다!`
  ];
  
  return dcTemplates[Math.floor(Math.random() * dcTemplates.length)];
}

// 일반 스타일 내용 생성
function generateNormalContent(title, category) {
  const normalTemplates = [
    `안녕하세요. ${category} 관련해서 질문드립니다.\n\n${title}에 대해 알고 싶은데 혹시 경험이 있으신 분들이 계시나요?\n\n좋은 정보나 팁 있으시면 댓글로 공유해주시면 감사하겠습니다.`,
    
    `${category} 분야에서 ${title}에 대해 문의드립니다.\n\n비슷한 경험을 하신 분들이나 좋은 해결방법을 알고 계신 분들의 조언을 구하고 싶습니다.\n\n정보 공유해주시면 정말 도움이 될 것 같습니다.`,
    
    `${title}에 대해 궁금한 점이 있어서 글 올립니다.\n\n${category} 관련해서 이런 고민들이 많으신 것 같은데 어떻게 해결하셨는지 궁금합니다.\n\n좋은 정보 있으시면 댓글로 알려주세요.`
  ];
  
  return normalTemplates[Math.floor(Math.random() * normalTemplates.length)];
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

// 개선된 자동 포스팅 함수
async function improvedAutoPosting() {
  console.log('🚀 개선된 자동 포스팅 시작...');
  
  const categories = Object.keys(discussionTemplates);
  // 카테고리를 섞어서 같은 카테고리가 연속으로 나오지 않도록 함
  const shuffledCategories = shuffleArray(categories);
  
  let successCount = 0;
  let failCount = 0;
  let commentSuccessCount = 0;
  let commentFailCount = 0;
  
  for (const category of shuffledCategories) {
    console.log(`📝 ${category} 카테고리 포스팅 시작...`);
    
    for (let i = 0; i < 3; i++) {
      const templates = discussionTemplates[category];
      const template = templates[Math.floor(Math.random() * templates.length)];
      
      const author = getRandomAuthor();
      const content = template.style === 'dc' 
        ? generateDCContent(template.title, category)
        : generateNormalContent(template.title, category);
      
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
