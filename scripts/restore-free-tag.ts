import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function restoreFreeTag() {
  try {
    console.log('자유 태그 복원 시작...')
    
    // 자유 태그 생성
    const freeTag = await prisma.tag.create({
      data: { name: '자유' }
    })
    console.log('자유 태그가 생성되었습니다.')
    
    // 태그가 없는 게시글들 찾기 (또는 모든 게시글)
    const postsWithoutTags = await prisma.post.findMany({
      where: {
        tags: {
          none: {}
        }
      }
    })
    
    console.log(`태그가 없는 게시글 ${postsWithoutTags.length}개를 찾았습니다.`)
    
    // 모든 게시글에 자유 태그 연결
    let successCount = 0
    
    for (const post of postsWithoutTags) {
      try {
        await prisma.postTag.create({
          data: {
            postId: post.id,
            tagId: freeTag.id
          }
        })
        successCount++
        console.log(`게시글 "${post.title}"에 자유 태그 연결됨`)
      } catch (error) {
        console.error(`게시글 "${post.title}" 태그 연결 실패:`, error)
      }
    }
    
    console.log(`\n자유 태그 복원 완료!`)
    console.log(`${successCount}개의 게시글에 자유 태그가 연결되었습니다.`)
    
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
    console.error('자유 태그 복원 중 오류 발생:', error)
  } finally {
    await prisma.$disconnect()
  }
}

restoreFreeTag()
