import { readJsonFile, writeJsonFile, generateId, getCurrentTime, findUserById } from '@/lib/data'

// GET: 토론글 목록 조회
export async function GET() {
  try {
    const data = readJsonFile('discussions.json')
    if (!data) {
      return Response.json({ error: '데이터를 불러올 수 없습니다.' }, { status: 500 })
    }
    
    // 최신순으로 정렬
    const sortedDiscussions = data.discussions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    return Response.json(sortedDiscussions)
  } catch (error) {
    console.error('Error fetching discussions:', error)
    return Response.json({ error: '토론글을 불러오는 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

// POST: 새 토론글 작성
export async function POST(request) {
  try {
    const body = await request.json()
    const { title, content, category, authorId } = body
    
    // 필수 필드 검증
    if (!title || !content || !category || !authorId) {
      return Response.json({ error: '모든 필수 필드를 입력해주세요.' }, { status: 400 })
    }
    
    // 작성자 정보 가져오기
    const author = findUserById(authorId)
    if (!author) {
      return Response.json({ error: '사용자 정보를 찾을 수 없습니다.' }, { status: 404 })
    }
    
    const data = readJsonFile('discussions.json') || { discussions: [], comments: [] }
    
    const newDiscussion = {
      id: generateId(),
      title,
      content,
      authorId,
      authorName: author.name,
      category,
      views: 0,
      likes: 0,
      comments: 0,
      status: 'active',
      createdAt: getCurrentTime(),
      updatedAt: getCurrentTime()
    }
    
    data.discussions.push(newDiscussion)
    writeJsonFile('discussions.json', data)
    
    return Response.json(newDiscussion, { status: 201 })
  } catch (error) {
    console.error('Error creating discussion:', error)
    return Response.json({ error: '토론글 작성에 실패했습니다.' }, { status: 500 })
  }
} 