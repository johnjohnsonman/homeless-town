import { readJsonFile, writeJsonFile } from '../../../../lib/data'

// GET: 특정 토론글 상세 조회
export async function GET(request, { params }) {
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
    
    // 조회수 증가
    discussion.views += 1
    writeJsonFile('discussions.json', data)
    
    return Response.json(discussion)
  } catch (error) {
    console.error('Error fetching discussion:', error)
    return Response.json({ error: '토론글을 불러오는 중 오류가 발생했습니다.' }, { status: 500 })
  }
} 