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
        
        // API 호출로 댓글 추가 (2-5개)
        const commentCount = Math.floor(Math.random() * 4) + 2 // 2-5개
        const comments = generateComments(postData.title, commentCount)
        
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

function generateComments(postTitle: string, count: number): Array<{
  content: string
  nickname: string
  upvotes: number
  downvotes: number
}> {
  const comments = []
  
  for (let i = 0; i < count; i++) {
    const commentTemplates = [
      { content: "좋은 글이네요! 공감합니다.", nickname: "공감러", upvotes: 2, downvotes: 0 },
      { content: "저도 같은 생각이에요 ㅎㅎ", nickname: "동감이", upvotes: 1, downvotes: 0 },
      { content: "정보 감사합니다! 도움이 되었어요.", nickname: "정보러", upvotes: 3, downvotes: 0 },
      { content: "추천해주신 거 한번 해볼게요!", nickname: "시도러", upvotes: 1, downvotes: 0 },
      { content: "저도 비슷한 경험이 있어요", nickname: "경험자", upvotes: 2, downvotes: 0 },
      { content: "좋은 팁 감사해요~", nickname: "팁러버", upvotes: 1, downvotes: 0 },
      { content: "완전 공감합니다 ㅋㅋ", nickname: "공감왕", upvotes: 4, downvotes: 0 },
      { content: "저도 궁금했는데 덕분에 알겠어요!", nickname: "궁금이", upvotes: 2, downvotes: 0 },
      { content: "좋은 글 잘 봤습니다!", nickname: "독자", upvotes: 1, downvotes: 0 },
      { content: "다음에도 이런 글 올려주세요!", nickname: "팔로워", upvotes: 3, downvotes: 0 }
    ]
    
    const randomComment = commentTemplates[Math.floor(Math.random() * commentTemplates.length)]
    comments.push(randomComment)
  }
  
  return comments
}

addFreeBoardPosts()