import { readJsonFile, writeJsonFile } from '../../../../../../lib/data'

// POST: 토론글 좋아요/좋아요 취소
export async function POST(request, { params }) {
  try {
    const { id } = params
    const data = readJsonFile('discussions.json')
    
    if (!data) {
      return Response.json({ error: '데이터를 불러올 수 없습니다.' }, { status: 500 })
    }
    
    const discussion = data.discussions.find(d => d.id === id)
    
    if (!discussion) {
      return Response.json({ error: '토론글을 찾을 수 없습니다.' }, { status: 404 })
    }
    
    // 간단한 좋아요 토글 (실제로는 사용자별 좋아요 상태를 추적해야 함)
    // 여기서는 단순히 좋아요 수만 증가시킴
    discussion.likes += 1
    
    writeJsonFile('discussions.json', data)
    
    return Response.json({ 
      success: true, 
      likes: discussion.likes 
    })
  } catch (error) {
    console.error('Error liking discussion:', error)
    return Response.json({ error: '좋아요 처리 중 오류가 발생했습니다.' }, { status: 500 })
  }
} 