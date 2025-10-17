import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function redistributeTags() {
  try {
    console.log('태그 재분배 시작...')
    
    // 모든 게시글 가져오기
    const posts = await prisma.post.findMany({
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    })
    
    console.log(`총 ${posts.length}개의 게시글을 찾았습니다.`)
    
    // 모든 태그 가져오기
    const allTags = await prisma.tag.findMany()
    console.log(`사용 가능한 태그: ${allTags.map(t => t.name).join(', ')}`)
    
    // 기존 태그 연결 삭제
    await prisma.postTag.deleteMany({})
    console.log('기존 태그 연결을 모두 삭제했습니다.')
    
    // 각 게시글에 적절한 태그 할당
    let successCount = 0
    
    for (const post of posts) {
      try {
        // 게시글 제목과 내용을 기반으로 적절한 태그 선택
        const appropriateTag = selectAppropriateTag(post.title, post.content, allTags)
        
        if (appropriateTag) {
          await prisma.postTag.create({
            data: {
              postId: post.id,
              tagId: appropriateTag.id
            }
          })
          
          console.log(`게시글 "${post.title}"에 "${appropriateTag.name}" 태그 할당`)
          successCount++
        } else {
          // 적절한 태그가 없으면 자유 태그 할당
          const freeTag = allTags.find(t => t.name === '자유')
          if (freeTag) {
            await prisma.postTag.create({
              data: {
                postId: post.id,
                tagId: freeTag.id
              }
            })
            console.log(`게시글 "${post.title}"에 "자유" 태그 할당`)
            successCount++
          }
        }
        
      } catch (error) {
        console.error(`게시글 "${post.title}" 태그 할당 실패:`, error)
      }
    }
    
    console.log(`\n태그 재분배 완료!`)
    console.log(`${successCount}개의 게시글에 태그가 할당되었습니다.`)
    
    // 태그별 카운트 확인
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
    
    console.log('\n태그별 게시글 수:')
    tagCounts.forEach(tag => {
      console.log(`- ${tag.name}: ${tag._count.posts}개 게시글`)
    })
    
  } catch (error) {
    console.error('태그 재분배 중 오류 발생:', error)
  } finally {
    await prisma.$disconnect()
  }
}

function selectAppropriateTag(title: string, content: string, allTags: any[]): any | null {
  const text = (title + ' ' + content).toLowerCase()
  
  // 부동산 관련 키워드들
  const housingKeywords = {
    '월세인상': ['월세', '인상', '올린다', '올려', '협상', '적정'],
    '분쟁사례': ['분쟁', '싸움', '갈등', '문제', '해결', '대처'],
    '계약': ['계약', '서명', '갱신', '해지', '종료'],
    '보증금': ['보증금', '반환', '돌려', '환불', '활용'],
    '부동산': ['부동산', '아파트', '빌라', '원룸', '투룸'],
    '계약해지': ['해지', '종료', '끊', '그만'],
    '시황': ['시장', '시황', '동향', '전망', '분석'],
    '법적권리': ['법적', '권리', '법률', '소송', '고소'],
    '투자': ['투자', '수익', '매매', '전세', '임대'],
    '집주인소통': ['집주인', '소통', '대화', '협의', '상담'],
    '법률': ['법률', '법', '조항', '규정', '위반'],
    '입주체크': ['입주', '체크', '확인', '점검', '검사'],
    '주거': ['주거', '거주', '살', '이사', '이전'],
    '부동산시장': ['부동산시장', '시장', '동향', '전망'],
    '안전수칙': ['안전', '수칙', '주의', '조심', '위험'],
    '정책': ['정책', '제도', '법안', '규제', '지원']
  }
  
  // 각 태그별로 키워드 매칭 점수 계산
  let bestTag = null
  let bestScore = 0
  
  for (const [tagName, keywords] of Object.entries(housingKeywords)) {
    const tag = allTags.find(t => t.name === tagName)
    if (!tag) continue
    
    let score = 0
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        score += 1
      }
    }
    
    if (score > bestScore) {
      bestScore = score
      bestTag = tag
    }
  }
  
  // 점수가 1 이상이면 해당 태그 반환, 아니면 null
  return bestScore >= 1 ? bestTag : null
}

redistributeTags()
