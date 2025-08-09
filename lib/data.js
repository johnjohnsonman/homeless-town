import fs from 'fs'
import path from 'path'

// 퍼시스턴트 데이터 디렉터리: 환경변수 우선, 없으면 프로젝트의 data 폴더 사용
const persistentDataDirectory = process.env.DATA_DIR
  ? process.env.DATA_DIR
  : path.join(process.cwd(), 'data')

const defaultDataDirectory = path.join(process.cwd(), 'data')

function ensureDirectoryExists(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
  } catch (error) {
    console.error('Failed to create data directory:', dirPath, error)
  }
}

function bootstrapDataFilesIfMissing() {
  ensureDirectoryExists(persistentDataDirectory)

  // 기본 JSON 파일 목록
  const defaultFiles = ['users.json', 'housing-posts.json', 'discussions.json']

  for (const file of defaultFiles) {
    const target = path.join(persistentDataDirectory, file)
    if (!fs.existsSync(target)) {
      const source = path.join(defaultDataDirectory, file)
      try {
        if (fs.existsSync(source)) {
          fs.copyFileSync(source, target)
        } else {
          // 소스가 없으면 최소 형태로 생성
          const emptyPayload = file === 'users.json'
            ? { users: [] }
            : file === 'housing-posts.json'
            ? { posts: [] }
            : { discussions: [], comments: [] }
          fs.writeFileSync(target, JSON.stringify(emptyPayload, null, 2))
        }
      } catch (error) {
        console.error('Failed to initialize data file:', file, error)
      }
    }
  }
}

// 애플리케이션 시작 시 1회 초기화
bootstrapDataFilesIfMissing()

// JSON 파일 읽기
export function readJsonFile(filename) {
  const filePath = path.join(persistentDataDirectory, filename)
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return null
  }
}

// JSON 파일 쓰기
export function writeJsonFile(filename, data) {
  const filePath = path.join(persistentDataDirectory, filename)
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    return false
  }
}

// ID 생성 (간단한 방법)
export function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// 현재 시간을 ISO 문자열로 반환
export function getCurrentTime() {
  return new Date().toISOString()
}

// 사용자 인증 (간단한 버전)
export function authenticateUser(email, password) {
  const data = readJsonFile('users.json')
  if (!data) return null
  
  const user = data.users.find(u => u.email === email && u.password === password)
  return user || null
}

// 사용자 ID로 사용자 찾기
export function findUserById(userId) {
  const data = readJsonFile('users.json')
  if (!data) return null
  
  return data.users.find(u => u.id === userId) || null
}

// 게시글 목록 가져오기
export function getHousingPosts() {
  const data = readJsonFile('housing-posts.json')
  return data ? data.posts : []
}

// 토론글 목록 가져오기
export function getDiscussions() {
  const data = readJsonFile('discussions.json')
  return data ? data.discussions : []
}

// 댓글 목록 가져오기
export function getComments() {
  const data = readJsonFile('discussions.json')
  return data ? data.comments : []
} 