import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// 데이터베이스 마이그레이션 실행 API
export async function POST(request: NextRequest) {
  try {
    console.log('데이터베이스 마이그레이션 시작...')

    // Prisma 마이그레이션 실행
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy')
    
    console.log('마이그레이션 출력:', stdout)
    if (stderr) {
      console.error('마이그레이션 오류:', stderr)
    }

    return NextResponse.json({
      success: true,
      message: '데이터베이스 마이그레이션이 완료되었습니다.',
      output: stdout,
      error: stderr || null
    })

  } catch (error) {
    console.error('마이그레이션 오류:', error)
    
    let errorMessage = '마이그레이션 실행 중 오류가 발생했습니다.'
    
    if (error instanceof Error) {
      errorMessage = `마이그레이션 오류: ${error.message}`
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// 마이그레이션 상태 확인
export async function GET() {
  try {
    // Prisma 상태 확인
    const { stdout } = await execAsync('npx prisma migrate status')
    
    return NextResponse.json({
      success: true,
      status: stdout
    })

  } catch (error) {
    console.error('상태 확인 오류:', error)
    
    return NextResponse.json(
      { 
        error: '마이그레이션 상태 확인 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
