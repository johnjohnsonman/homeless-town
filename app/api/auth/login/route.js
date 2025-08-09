import { authenticateUser, findUserById } from '../../../lib/data'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return Response.json({ error: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 })
    }
    
    const user = authenticateUser(email, password)
    
    if (!user) {
      return Response.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
    }
    
    // 비밀번호는 제외하고 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = user
    
    return Response.json({
      user: userWithoutPassword,
      message: '로그인 성공'
    })
    
  } catch (error) {
    console.error('Login error:', error)
    return Response.json({ error: '로그인 중 오류가 발생했습니다.' }, { status: 500 })
  }
} 