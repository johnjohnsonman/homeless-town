import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeFreeTags() {
  try {
    console.log('불필요한 "자유" 태그 제거 시작...')
    
    // "자유" 태그 찾기
    const freeTag = await prisma.tag.findUnique({
      where: { name: '자유' }
    })
    
    if (!freeTag) {
      console.log('자유 태그를 찾을 수 없습니다.')
      return
    }
    
    console.log(`자유 태그 ID: ${freeTag.id}`)
    
    // "자유" 태그가 연결된 모든 PostTag 관계 삭제
    const deletedRelations = await prisma.postTag.deleteMany({
      where: {
        tagId: freeTag.id
      }
    })
    
    console.log(`${deletedRelations.count}개의 게시글에서 자유 태그가 제거되었습니다.`)
    
    // "자유" 태그 자체 삭제 (더 이상 사용되지 않으므로)
    await prisma.tag.delete({
      where: { id: freeTag.id }
    })
    
    console.log('자유 태그가 완전히 삭제되었습니다.')
    
    // 결과 확인
    const remainingTags = await prisma.tag.findMany({
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
    
    console.log('\n남은 태그들:')
    remainingTags.forEach(tag => {
      console.log(`- ${tag.name}: ${tag._count.posts}개 게시글`)
    })
    
  } catch (error) {
    console.error('오류 발생:', error)
  } finally {
    await prisma.$disconnect()
  }
}

removeFreeTags()
