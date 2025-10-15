// 댓글 수를 실제 댓글 개수로 업데이트하는 스크립트
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixCommentCount() {
  console.log('🔧 댓글 수 수정 시작...');
  
  try {
    // 모든 게시글 조회
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        commentCount: true
      }
    });
    
    console.log(`📊 총 ${posts.length}개의 게시글 발견`);
    
    let updatedCount = 0;
    
    for (const post of posts) {
      // 실제 댓글 수 세기
      const actualCommentCount = await prisma.comment.count({
        where: {
          postId: post.id,
          parentId: null // 대댓글이 아닌 최상위 댓글만
        }
      });
      
      // commentCount가 실제 댓글 수와 다르면 업데이트
      if (post.commentCount !== actualCommentCount) {
        await prisma.post.update({
          where: { id: post.id },
          data: { commentCount: actualCommentCount }
        });
        
        console.log(`✅ 게시글 "${post.title.substring(0, 30)}..." 댓글 수 업데이트: ${post.commentCount} → ${actualCommentCount}`);
        updatedCount++;
      }
    }
    
    console.log(`\n🎉 완료! ${updatedCount}개의 게시글 댓글 수가 수정되었습니다.`);
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCommentCount();

