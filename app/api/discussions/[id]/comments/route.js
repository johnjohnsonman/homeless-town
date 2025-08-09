import { readJsonFile, writeJsonFile, getCurrentTime } from '@/lib/data'
// GET: 특정 토론글의 댓글 목록 조회
export async function GET(request, { params }) {
  try {
    const { id } = params
    const data = readJsonFile('discussions.json')
    
    if (!data) {
      return Response.json({ error: '데이터를 불러올 수 없습니다.' }, { status: 500 })
    }
    
    // 해당 토론글의 댓글만 필터링
    const comments = data.comments.filter(c => c.discussionId === id)
    
    // 최신순으로 정렬
    const sortedComments = comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    return Response.json(sortedComments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return Response.json({ error: '댓글을 불러오는 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

// POST: 새 댓글 작성
export async function POST(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { content, authorId } = body
    
    // 필수 필드 검증
    if (!content || !authorId) {
      return Response.json({ error: '댓글 내용과 작성자 정보가 필요합니다.' }, { status: 400 })
    }
    
    // 작성자 정보 가져오기
    const author = findUserById(authorId)
    if (!author) {
      return Response.json({ error: '사용자 정보를 찾을 수 없습니다.' }, { status: 404 })
    }
    
    const data = readJsonFile('discussions.json')
    if (!data) {
      return Response.json({ error: '데이터를 불러올 수 없습니다.' }, { status: 500 })
    }
    
    const newComment = {
      id: generateId(),
      discussionId: id,
      authorId,
      authorName: author.name,
      content,
      createdAt: getCurrentTime()
    }
    
    // 댓글 추가
    data.comments.push(newComment)
    
    // 토론글의 댓글 수 증가
    const discussion = data.discussions.find(d => d.id === id)
    if (discussion) {
      discussion.comments += 1
    }
    
    writeJsonFile('discussions.json', data)
    
    return Response.json(newComment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return Response.json({ error: '댓글 작성에 실패했습니다.' }, { status: 500 })
  }
} 