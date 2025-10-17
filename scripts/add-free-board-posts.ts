import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const freeBoardPosts = [
  {
    title: "오늘 날씨가 너무 좋아서 산책했는데 정말 기분 좋았어요",
    content: `오늘 아침에 일어나니까 창밖으로 따뜻한 햇살이 들어오더라구요. 
    
어제까지 비가 와서 우울했는데, 오늘은 정말 날씨가 좋네요. 

집 근처 공원에 산책 나갔는데 사람들도 많고 아이들이 놀고 있더라구요.
꽃도 피기 시작했고 새소리도 들리고... 정말 봄이 온 것 같아요.

다들 오늘 같은 좋은 날씨에 뭐 하고 계신가요?`,
    tags: ["자유"],
    nickname: "산책러버",
    upvotes: 12,
    downvotes: 0
  },
  {
    title: "정치 이야기 - 다음 대선 어떻게 생각하세요?",
    content: `요즘 정치 뉴스 보면서 생각이 많아지네요.

경제도 어렵고 부동산 문제도 심각하고...
정말 나라가 어디로 가고 있는지 걱정이 됩니다.

개인적으로는 좀 더 젊은 세대가 나서서 새로운 아이디어로 
나라를 이끌어갔으면 좋겠어요.

여러분은 어떻게 생각하시나요?
정치에 대해서 솔직한 의견 나눠봐요.`,
    tags: ["자유"],
    nickname: "정치관심러",
    upvotes: 8,
    downvotes: 3
  },
  {
    title: "요즘 유행하는 패션 트렌드 알려주세요",
    content: `안녕하세요! 패션에 관심이 많은 20대 여성입니다.

요즘 봄 패션 트렌드가 궁금해요. 
어떤 색깔이 유행하고 있는지, 
어떤 스타일이 핫한지 알고 싶어요.

특히 데일리룩으로 입기 좋은 아이템들 추천해주세요!
가격대는 중간 정도로 생각하고 있어요.

패션 고수님들 도움 부탁드려요~`,
    tags: ["자유"],
    nickname: "패션러버",
    upvotes: 15,
    downvotes: 1
  },
  {
    title: "게임 추천해주세요! 요즘 심심해요",
    content: `안녕하세요. 요즘 시간 날 때 할 게임이 없어서 심심하네요.

좋은 게임 추천해주세요!
장르는 상관없고, 혼자서도 재미있게 할 수 있는 거요.

최근에 했던 게임들:
- LOL (너무 스트레스 받아서 그만둠)
- 스타듀밸리 (완주함)
- 엘든링 (어려워서 포기함)

쉽고 재미있는 게임 없을까요?`,
    tags: ["자유"],
    nickname: "게임러버",
    upvotes: 23,
    downvotes: 2
  },
  {
    title: "맛집 추천 부탁드려요 - 서울 강남구",
    content: `안녕하세요! 강남구에서 맛있는 식당 찾고 있어요.

내일 친구들과 점심 약속이 있는데 어디 가면 좋을지 모르겠어요.

선호사항:
- 한식이나 일식
- 1인당 2만원 이하
- 강남역 근처

혹시 좋은 곳 아시면 추천해주세요!
리뷰도 함께 달아주시면 더욱 감사하겠어요.`,
    tags: ["자유"],
    nickname: "맛집탐방러",
    upvotes: 18,
    downvotes: 0
  },
  {
    title: "영화 추천해주세요! 이번 주말에 볼 영화",
    content: `이번 주말에 집에서 영화 보고 싶어요.

최근에 본 영화들:
- 오펜하이머 (너무 길어서 졸았음)
- 바비 (재미있었음)
- 타겟 (무서웠음)

장르는 상관없고, 2시간 이내로 볼 수 있는 영화면 좋겠어요.
넷플릭스나 왓챠에 있는 영화면 더욱 좋고요!

감동적인 영화나 웃긴 영화 추천해주세요.`,
    tags: ["자유"],
    nickname: "영화매니아",
    upvotes: 14,
    downvotes: 1
  },
  {
    title: "운동 시작하려는데 헬스장 vs 홈트레이닝",
    content: `안녕하세요. 요즘 살이 쪄서 운동을 시작하려고 해요.

헬스장을 다닐지, 집에서 홈트레이닝을 할지 고민이에요.

헬스장 장점: 기구가 많고 분위기가 좋음
헬스장 단점: 비싸고 사람들이 많음

홈트레이닝 장점: 편하고 비용이 적음
홈트레이닝 단점: 의지력이 필요하고 기구가 제한적

어떻게 하시는지 조언 부탁드려요!`,
    tags: ["자유"],
    nickname: "운동초보",
    upvotes: 21,
    downvotes: 0
  },
  {
    title: "반려동물 키우는 분들 모여요! 강아지 훈련법",
    content: `안녕하세요. 6개월 된 골든리트리버를 키우고 있어요.

요즘 배변 훈련과 기본 명령어 훈련을 하고 있는데
잘 안 되네요... ㅠㅠ

특히 '앉아', '기다려' 같은 명령어를 가르치고 싶은데
어떤 방법이 좋을까요?

반려동물 키우는 선배님들의 조언 부탁드려요!
사진도 올려주시면 더욱 좋겠어요.`,
    tags: ["자유"],
    nickname: "강아지맘",
    upvotes: 35,
    downvotes: 0
  },
  {
    title: "여행 계획 세우는 중인데 추천해주세요",
    content: `5월에 3박 4일 여행 계획 세우고 있어요.

예산은 2인 기준 100만원 정도이고,
국내 여행 생각하고 있어요.

가고 싶은 곳들:
- 제주도 (너무 비쌀 것 같음)
- 부산 (바다 보고 싶음)
- 강릉 (바다 + 산)

여행 고수님들 추천해주세요!
숙소나 맛집 정보도 함께 주시면 감사하겠어요.`,
    tags: ["자유"],
    nickname: "여행러",
    upvotes: 19,
    downvotes: 1
  },
  {
    title: "독서 모임 만들어요! 함께 책 읽어요",
    content: `안녕하세요. 독서를 좋아하는 사람들끼리 모임 만들어요!

매주 한 권씩 책을 정해서 읽고,
주말에 온라인으로 모여서 토론하는 모임이에요.

이번 달 추천 도서:
- 마음의 평화 (에크하르트 톨레)
- 생각에 관한 생각 (다니엘 카너먼)
- 마법의 설탕 두 스푼 (이외수)

관심 있으신 분들 댓글로 신청해주세요!
온라인 모임이니까 어디든 참여 가능해요.`,
    tags: ["자유"],
    nickname: "책벌레",
    upvotes: 27,
    downvotes: 2
  },
  {
    title: "요리 초보인데 간단한 요리법 알려주세요",
    content: `안녕하세요. 요리 초보입니다.

혼자 살면서 밥 해먹는데 너무 어려워요... ㅠㅠ
라면과 김치찌개만 만들 수 있어요.

간단하고 맛있는 요리법 알려주세요!
재료도 복잡하지 않고, 조리 시간도 30분 이내면 좋겠어요.

특히 고기 요리나 파스타 같은 거 궁금해요.
레시피 자세히 알려주시면 감사하겠습니다!`,
    tags: ["자유"],
    nickname: "요리초보",
    upvotes: 31,
    downvotes: 0
  },
  {
    title: "주식 투자 시작하려는데 조언 부탁드려요",
    content: `안녕하세요. 주식 투자를 시작하려고 하는 20대입니다.

예산은 100만원 정도이고, 장기 투자를 생각하고 있어요.
하지만 주식에 대해서 전혀 모르겠어요...

초보자에게 좋은 주식이나 투자 방법이 있을까요?
아니면 일단 적금부터 시작하는 게 나을까요?

주식 고수님들의 조언 부탁드려요!
위험성도 함께 알려주시면 감사하겠습니다.`,
    tags: ["자유"],
    nickname: "투자초보",
    upvotes: 16,
    downvotes: 4
  },
  {
    title: "힐링 영상 추천해주세요! 스트레스 받을 때",
    content: `요즘 회사 일로 스트레스가 심해요.
집에 와서 힐링할 수 있는 영상이나 콘텐츠 찾고 있어요.

보통 이런 거 좋아해요:
- 아름다운 자연 풍경
- 귀여운 동물들
- ASMR
- 요리 영상

유튜브나 넷플릭스에서 볼 수 있는 거면 좋겠어요.
스트레스 해소 방법도 함께 알려주세요!`,
    tags: ["자유"],
    nickname: "힐링러버",
    upvotes: 22,
    downvotes: 0
  },
  {
    title: "인테리어 고민이에요. 작은 원룸 꾸미기",
    content: `안녕하세요. 20평 원룸에서 혼자 살고 있어요.

인테리어를 새롭게 꾸미고 싶은데 어떻게 해야 할지 모르겠어요.
예산은 50만원 정도이고요.

현재 상황:
- 침대, 책상, 옷장 있음
- 벽은 흰색
- 바닥은 나무 마루

깔끔하고 모던한 느낌으로 꾸미고 싶어요.
인테리어 고수님들 조언 부탁드려요!
사진도 올려주시면 더욱 좋겠어요.`,
    tags: ["자유"],
    nickname: "인테리어러버",
    upvotes: 28,
    downvotes: 1
  },
  {
    title: "새로운 취미 찾고 있어요. 뭐가 좋을까요?",
    content: `안녕하세요. 요즘 새로운 취미를 찾고 있어요.

현재 하고 있는 것들:
- 독서 (하지만 집중이 안 됨)
- 게임 (너무 오래 하면 눈이 아픔)
- 산책 (날씨가 안 좋으면 못 함)

새로운 취미 추천해주세요!
조건:
- 집에서도 할 수 있는 것
- 비용이 많이 들지 않는 것
- 혼자서도 할 수 있는 것

뭔가 창작적인 활동이나 배우는 게 있는 걸 선호해요.`,
    tags: ["자유"],
    nickname: "취미탐구러",
    upvotes: 25,
    downvotes: 0
  }
]

async function addFreeBoardPosts() {
  try {
    console.log('자유게시판 글 추가 시작...')
    
    // 자유 태그 찾기
    const freeTag = await prisma.tag.findUnique({
      where: { name: '자유' }
    })
    
    if (!freeTag) {
      console.error('자유 태그를 찾을 수 없습니다.')
      return
    }
    
    let successCount = 0
    let failCount = 0
    
    for (const postData of freeBoardPosts) {
      try {
        // 게시글 생성
        const post = await prisma.post.create({
          data: {
            title: postData.title,
            content: postData.content,
            slug: postData.title
              .toLowerCase()
              .replace(/[^a-z0-9가-힣\s]/g, '')
              .replace(/\s+/g, '-')
              .substring(0, 50) + `-${Date.now()}`,
            upvotes: postData.upvotes,
            downvotes: postData.downvotes,
            nickname: postData.nickname,
            password: "1234", // 기본 비밀번호
            commentCount: 0
          }
        })
        
        // 태그 연결
        await prisma.postTag.create({
          data: {
            postId: post.id,
            tagId: freeTag.id
          }
        })
        
        successCount++
        console.log(`게시글 추가됨: ${postData.title}`)
        
        // API 호출로 댓글 추가 (최대 3개)
        const commentCount = Math.floor(Math.random() * 3) + 1 // 1-3개
        const comments = generateComments(postData.title, postData.content, commentCount)
        
        for (const comment of comments) {
          await prisma.comment.create({
            data: {
              content: comment.content,
              author: comment.nickname,
              upvotes: comment.upvotes,
              downvotes: comment.downvotes,
              postId: post.id
            }
          })
        }
        
        // 댓글 수 업데이트
        await prisma.post.update({
          where: { id: post.id },
          data: { 
            commentCount: commentCount
          }
        })
        
        console.log(`${commentCount}개의 댓글이 추가되었습니다.`)
        
      } catch (error) {
        failCount++
        console.error(`게시글 추가 실패: ${postData.title}`, error)
      }
    }
    
    console.log(`\n자유게시판 글 추가 완료!`)
    console.log(`성공: ${successCount}개, 실패: ${failCount}개`)
    
    // 태그 카운트 확인
    const tagCounts = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        posts: {
          _count: 'desc'
        }
      }
    })
    
    console.log('\n현재 태그별 게시글 수:')
    tagCounts.forEach(tag => {
      console.log(`- ${tag.name}: ${tag._count.posts}개 게시글`)
    })
    
  } catch (error) {
    console.error('자유게시판 글 추가 중 오류 발생:', error)
  } finally {
    await prisma.$disconnect()
  }
}

function generateComments(postTitle: string, postContent: string, count: number): Array<{
  content: string
  nickname: string
  upvotes: number
  downvotes: number
}> {
  const comments = []
  
  // 제목과 내용을 기반으로 주제 파악
  const topic = getPostTopic(postTitle, postContent)
  const relevantComments = getRelevantComments(topic)
  
  // 최대 3개까지, 관련성 높은 댓글만 선택
  const selectedComments = relevantComments.slice(0, Math.min(count, 3))
  
  for (const comment of selectedComments) {
    comments.push(comment)
  }
  
  return comments
}

function getPostTopic(title: string, content: string): string {
  const text = (title + ' ' + content).toLowerCase()
  
  if (text.includes('날씨') || text.includes('산책') || text.includes('봄')) return 'weather'
  if (text.includes('정치') || text.includes('대선') || text.includes('경제')) return 'politics'
  if (text.includes('패션') || text.includes('옷') || text.includes('스타일')) return 'fashion'
  if (text.includes('게임') || text.includes('lol') || text.includes('엘든링')) return 'games'
  if (text.includes('맛집') || text.includes('식당') || text.includes('음식')) return 'food'
  if (text.includes('영화') || text.includes('넷플릭스') || text.includes('왓챠')) return 'movies'
  if (text.includes('운동') || text.includes('헬스장') || text.includes('홈트레이닝')) return 'exercise'
  if (text.includes('강아지') || text.includes('반려동물') || text.includes('훈련')) return 'pets'
  if (text.includes('여행') || text.includes('제주도') || text.includes('부산')) return 'travel'
  if (text.includes('독서') || text.includes('책') || text.includes('도서')) return 'books'
  if (text.includes('요리') || text.includes('레시피') || text.includes('파스타')) return 'cooking'
  if (text.includes('주식') || text.includes('투자') || text.includes('적금')) return 'investment'
  if (text.includes('힐링') || text.includes('스트레스') || text.includes('asmr')) return 'healing'
  if (text.includes('인테리어') || text.includes('원룸') || text.includes('꾸미기')) return 'interior'
  if (text.includes('취미') || text.includes('활동') || text.includes('창작')) return 'hobbies'
  
  return 'general'
}

function getRelevantComments(topic: string): Array<{
  content: string
  nickname: string
  upvotes: number
  downvotes: number
}> {
  const commentMap: Record<string, Array<{
    content: string
    nickname: string
    upvotes: number
    downvotes: number
  }>> = {
    weather: [
      { content: "오늘 정말 날씨가 좋네요! 저도 산책 나가고 싶어요", nickname: "산책러버", upvotes: 3, downvotes: 0 },
      { content: "요즘 꽃도 피고 새소리도 들려서 기분이 좋아요", nickname: "봄사랑", upvotes: 2, downvotes: 0 },
      { content: "저도 어제 공원 갔는데 사람들 많더라구요", nickname: "공원맘", upvotes: 1, downvotes: 0 }
    ],
    politics: [
      { content: "저도 정치에 관심이 많은데 걱정이 많이 되네요", nickname: "정치관심자", upvotes: 2, downvotes: 1 },
      { content: "경제 문제가 정말 심각한 것 같아요", nickname: "경제걱정", upvotes: 3, downvotes: 0 },
      { content: "젊은 세대의 목소리가 더 많이 들렸으면 좋겠어요", nickname: "청년의소리", upvotes: 4, downvotes: 0 }
    ],
    fashion: [
      { content: "요즘 베이지, 화이트 톤이 유행이에요!", nickname: "패션스타일리스트", upvotes: 5, downvotes: 0 },
      { content: "데일리룩으로는 블라우스나 니트 추천해요", nickname: "데일리패션", upvotes: 3, downvotes: 0 },
      { content: "온라인 쇼핑몰에서 가성비 좋은 옷 많아요", nickname: "쇼핑러버", upvotes: 2, downvotes: 0 }
    ],
    games: [
      { content: "스타듀밸리 완주하셨다니 대단해요! 저는 아직 진행중이에요", nickname: "농부지망생", upvotes: 4, downvotes: 0 },
      { content: "쉬운 게임으로는 마인크래프트나 테트리스 추천해요", nickname: "게임추천러", upvotes: 3, downvotes: 0 },
      { content: "LOL은 정말 스트레스 받죠 ㅠㅠ 저도 그만뒀어요", nickname: "게임포기러", upvotes: 2, downvotes: 0 }
    ],
    food: [
      { content: "강남역 근처에 좋은 한식당 많이 있어요!", nickname: "강남맛집러", upvotes: 4, downvotes: 0 },
      { content: "일식으로는 스시나 라멘집 추천해요", nickname: "일식러버", upvotes: 3, downvotes: 0 },
      { content: "2만원 이하면 김치찌개나 된장찌개 집이 좋을 것 같아요", nickname: "찌개러버", upvotes: 2, downvotes: 0 }
    ],
    movies: [
      { content: "오펜하이머 너무 길어서 저도 졸았어요 ㅋㅋ", nickname: "영화졸린이", upvotes: 3, downvotes: 0 },
      { content: "넷플릭스에서 '더 킬러' 추천해요! 액션 영화인데 재밌어요", nickname: "액션러버", upvotes: 4, downvotes: 0 },
      { content: "왓챠에서 '기생충' 다시 보는 것도 좋을 것 같아요", nickname: "영화리뷰어", upvotes: 2, downvotes: 0 }
    ],
    exercise: [
      { content: "헬스장 초보라면 PT 한 달 받아보는 것 추천해요!", nickname: "헬스초보", upvotes: 3, downvotes: 0 },
      { content: "홈트레이닝은 유튜브 '빅씨스' 추천해요", nickname: "홈트러버", upvotes: 4, downvotes: 0 },
      { content: "저도 요즘 살 찌고 있는데 같이 운동해요!", nickname: "다이어터", upvotes: 2, downvotes: 0 }
    ],
    pets: [
      { content: "6개월이면 아직 어려서 천천히 훈련하시면 돼요", nickname: "강아지맘", upvotes: 4, downvotes: 0 },
      { content: "'앉아'는 간식으로 유도하면서 하시면 잘 돼요", nickname: "훈련전문가", upvotes: 3, downvotes: 0 },
      { content: "골든리트리버 너무 귀여워요! 사진 올려주세요", nickname: "강아지러버", upvotes: 5, downvotes: 0 }
    ],
    travel: [
      { content: "5월에 제주도 가기 좋은 시기예요! 하지만 비쌀 수 있어요", nickname: "제주러버", upvotes: 3, downvotes: 0 },
      { content: "부산 바다 정말 예뻐요! 해운대나 광안리 추천", nickname: "부산맘", upvotes: 4, downvotes: 0 },
      { content: "강릉은 바다도 보고 산도 보고 좋을 것 같아요", nickname: "강릉러버", upvotes: 2, downvotes: 0 }
    ],
    books: [
      { content: "에크하르트 톨레 책 정말 좋아요! 마음의 평화 추천", nickname: "독서러버", upvotes: 4, downvotes: 0 },
      { content: "독서 모임에 참여하고 싶어요! 온라인으로도 가능한가요?", nickname: "책벌레", upvotes: 3, downvotes: 0 },
      { content: "다니엘 카너먼 책은 읽기 어려운데 정말 좋은 책이에요", nickname: "심리학러버", upvotes: 2, downvotes: 0 }
    ],
    cooking: [
      { content: "초보라면 파스타부터 시작하세요! 간단해요", nickname: "파스타마스터", upvotes: 3, downvotes: 0 },
      { content: "고기 요리는 소고기 미역국부터 추천해요", nickname: "국물러버", upvotes: 2, downvotes: 0 },
      { content: "유튜브 '백종원의 요리비책' 보시면 도움 많이 돼요", nickname: "요리학생", upvotes: 4, downvotes: 0 }
    ],
    investment: [
      { content: "초보라면 ETF나 적금부터 시작하세요! 위험도 낮아요", nickname: "투자조언가", upvotes: 3, downvotes: 0 },
      { content: "주식은 공부 많이 하고 시작하세요. 손실 위험이 있어요", nickname: "경험자", upvotes: 2, downvotes: 1 },
      { content: "100만원이면 인덱스 펀드 추천해요", nickname: "펀드러버", upvotes: 4, downvotes: 0 }
    ],
    healing: [
      { content: "ASMR 영상 정말 힐링되죠! 잠들기 전에 자주 봐요", nickname: "ASMR러버", upvotes: 4, downvotes: 0 },
      { content: "자연 풍경 영상도 좋아요! 특히 바다나 산 영상", nickname: "자연러버", upvotes: 3, downvotes: 0 },
      { content: "요리 영상 보면서 요리하는 것도 스트레스 해소 돼요", nickname: "요리힐링", upvotes: 2, downvotes: 0 }
    ],
    interior: [
      { content: "50만원이면 이케아 가구 몇 개 살 수 있어요!", nickname: "이케아러버", upvotes: 3, downvotes: 0 },
      { content: "원룸은 수납이 중요해요! 침대 밑 서랍 추천", nickname: "수납전문가", upvotes: 4, downvotes: 0 },
      { content: "벽지나 스티커로도 분위기 바꿀 수 있어요", nickname: "인테리어러버", upvotes: 2, downvotes: 0 }
    ],
    hobbies: [
      { content: "그림 그리기 어때요? 물감이나 색연필로 시작하면 좋아요", nickname: "화가지망생", upvotes: 3, downvotes: 0 },
      { content: "악기 배우는 것도 좋아요! 우쿨렐레 추천", nickname: "음악러버", upvotes: 4, downvotes: 0 },
      { content: "퍼즐이나 레고도 집에서 하기 좋은 취미예요", nickname: "퍼즐러버", upvotes: 2, downvotes: 0 }
    ],
    general: [
      { content: "좋은 글 감사해요! 도움이 되었어요", nickname: "독자", upvotes: 2, downvotes: 0 },
      { content: "저도 같은 고민이 있었는데 좋은 정보네요", nickname: "공감러", upvotes: 1, downvotes: 0 }
    ]
  }
  
  return commentMap[topic] || commentMap.general
}

addFreeBoardPosts()