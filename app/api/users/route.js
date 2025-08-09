import { readJsonFile } from '../../../lib/data'

// GET: 사용자 목록 조회 (관리자용)
export async function GET() {
  try {
    const data = readJsonFile('users.json')
    if (!data) {
      return Response.json({ error: '데이터를 불러올 수 없습니다.' }, { status: 500 })
    }
    
    // 비밀번호는 제외하고 반환
    const usersWithoutPassword = data.users.map(user => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })
    
    return Response.json(usersWithoutPassword)
  } catch (error) {
    console.error('Error fetching users:', error)
    return Response.json({ error: '사용자 목록을 불러오는 중 오류가 발생했습니다.' }, { status: 500 })
  }
} 