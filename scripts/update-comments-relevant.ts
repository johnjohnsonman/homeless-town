import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
  if (text.includes('월세') || text.includes('전세') || text.includes('부동산') || text.includes('계약') || text.includes('보증금') || text.includes('분쟁') || text.includes('시황') || text.includes('법적') || text.includes('투자') || text.includes('소통') || text.includes('법률') || text.includes('입주') || text.includes('주거') || text.includes('부동산시장') || text.includes('안전') || text.includes('정책')) return 'housing'
  
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
    housing: [
      { content: "부동산 시장 정말 어렵네요... 저도 같은 고민이에요", nickname: "집구하기어려워", upvotes: 4, downvotes: 0 },
      { content: "보증금 문제로 고민이 많으시군요. 저도 비슷해요", nickname: "보증금걱정", upvotes: 3, downvotes: 0 },
      { content: "계약서 꼼꼼히 확인하시는 게 좋을 것 같아요", nickname: "계약주의", upvotes: 2, downvotes: 0 },
      { content: "월세 인상에 대해 미리 대비책을 세워야겠어요", nickname: "월세걱정", upvotes: 3, downvotes: 0 },
      { content: "분쟁 사례를 보니 정말 조심해야겠네요", nickname: "분쟁조심", upvotes: 2, downvotes: 0 },
      { content: "법적 권리에 대해 더 알아봐야겠어요", nickname: "법률공부", upvotes: 2, downvotes: 0 }
    ],
    general: [
      { content: "좋은 글 감사해요! 도움이 되었어요", nickname: "독자", upvotes: 2, downvotes: 0 },
      { content: "저도 같은 고민이 있었는데 좋은 정보네요", nickname: "공감러", upvotes: 1, downvotes: 0 }
    ]
  }
  
  return commentMap[topic] || commentMap.general
}

async function updateCommentsToRelevant() {
  try {
    console.log('기존 댓글을 관련성 높은 댓글로 업데이트 시작...')
    
    // 모든 게시글 가져오기
    const posts = await prisma.post.findMany({
      include: {
        comments: true
      }
    })
    
    let updatedPosts = 0
    
    for (const post of posts) {
      try {
        // 기존 댓글 삭제
        await prisma.comment.deleteMany({
          where: { postId: post.id }
        })
        
        // 주제 파악
        const topic = getPostTopic(post.title, post.content)
        const relevantComments = getRelevantComments(topic)
        
        // 관련성 높은 댓글 추가 (최대 3개)
        const commentCount = Math.floor(Math.random() * 3) + 1 // 1-3개
        const selectedComments = relevantComments.slice(0, commentCount)
        
        for (const comment of selectedComments) {
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
        
        console.log(`게시글 "${post.title}" - ${commentCount}개의 관련 댓글 추가 (주제: ${topic})`)
        updatedPosts++
        
      } catch (error) {
        console.error(`게시글 "${post.title}" 댓글 업데이트 실패:`, error)
      }
    }
    
    console.log(`\n댓글 업데이트 완료!`)
    console.log(`${updatedPosts}개의 게시글 댓글이 업데이트되었습니다.`)
    
  } catch (error) {
    console.error('댓글 업데이트 중 오류 발생:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateCommentsToRelevant()
