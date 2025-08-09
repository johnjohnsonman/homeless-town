import { readJsonFile, writeJsonFile, getCurrentTime } from '../../../../../../lib/data'

// PUT: 댓글 수정
export async function PUT(request, { params }) {
  try {
    const { id: discussionId, commentId } = params
    const body = await request.json()
    const { content, authorId } = body
    
    if (!content || !authorId) {
      return Response.json({ error: '댓글 내용과 작성자 정보가 필요합니다.' }, { status: 400 })
    }
    
    const data = readJsonFile('discussions.json')
    if (!data) {
      return Response.json({ error: '데이터를 불러올 수 없습니다.' }, { status: 500 })
    }
    
    // 댓글 찾기
    const comment = data.comments.find(c => c.id === commentId && c.discussionId === discussionId)
    if (!comment) {
      return Response.json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 })
    }
    
    // 작성자 확인
    if (comment.authorId !== authorId) {
      return Response.json({ error: '댓글을 수정할 권한이 없습니다.' }, { status: 403 })
    }
    
    // 댓글 수정
    comment.content = content
    comment.updatedAt = getCurrentTime()
    
    writeJsonFile('discussions.json', data)
    
    return Response.json(comment)
  } catch (error) {
    console.error('Error updating comment:', error)
    return Response.json({ error: '댓글 수정에 실패했습니다.' }, { status: 500 })
  }
}

// DELETE: 댓글 삭제
export async function DELETE(request, { params }) {
  try {
    const { id: discussionId, commentId } = params
    const { searchParams } = new URL(request.url)
    const authorId = searchParams.get('authorId')
    
    if (!authorId) {
      return Response.json({ error: '작성자 정보가 필요합니다.' }, { status: 400 })
    }
    
    const data = readJsonFile('discussions.json')
    if (!data) {
      return Response.json({ error: '데이터를 불러올 수 없습니다.' }, { status: 500 })
    }
    
    // 댓글 찾기
    const commentIndex = data.comments.findIndex(c => c.id === commentId && c.discussionId === discussionId)
    if (commentIndex === -1) {
      return Response.json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 })
    }
    
    const comment = data.comments[commentIndex]
    
    // 작성자 확인
    if (comment.authorId !== authorId) {
      return Response.json({ error: '댓글을 삭제할 권한이 없습니다.' }, { status: 403 })
    }
    
    // 댓글 삭제
    data.comments.splice(commentIndex, 1)
    
    // 토론글의 댓글 수 감소
    const discussion = data.discussions.find(d => d.id === discussionId)
    if (discussion) {
      discussion.comments = Math.max(0, discussion.comments - 1)
    }
    
    writeJsonFile('discussions.json', data)
    
    return Response.json({ success: true, message: '댓글이 삭제되었습니다.' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return Response.json({ error: '댓글 삭제에 실패했습니다.' }, { status: 500 })
  }
} 