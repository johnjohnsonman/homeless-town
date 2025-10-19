# 🏠 Homeless Town

주거 불안정자들을 위한 커뮤니티 플랫폼 - 정보 공유, 토론, 계약 가이드 제공

## 🤖 자동 포스팅 시스템
- BullMQ와 Redis를 사용한 백그라운드 작업
- 매일 20개의 토론 게시글 자동 생성
- 12개 카테고리별 다양한 콘텐츠
- **실시간 부동산 뉴스 기반 토론글 생성** (NEW!)

## 📖 프로젝트 소개

Homeless Town은 주거 불안정을 겪고 있는 분들을 위한 종합 커뮤니티 플랫폼입니다. 임대차 정보 공유, 계약 가이드, 커뮤니티 토론 등 다양한 기능을 제공합니다.

## ✨ 주요 기능

### 1. 커뮤니티 포럼
- DC인사이드 스타일의 익명 게시판
- 게시글 작성, 댓글, 좋아요/싫어요
- 인기글, 최신글 자동 분류
- 태그 시스템

### 2. 주거 게시판
- 임대/주거 정보 공유
- 급구 표시 기능
- 시장 동향 정보 (상승/하락 표시)

### 3. 토론 게시판
- 심도 있는 주제 토론
- 대댓글 시스템
- 투표 기능

### 4. 계약 가이드
- 임대차 계약 기초부터 고급까지
- 카테고리별 정리 (기초, 서류, 보증금, 권리, 분쟁)
- 난이도 및 예상 읽기 시간 표시
- 다운로드 및 평가 기능

### 5. 사용자 시스템
- 회원가입 및 로그인
- 프로필 관리
- 북마크 기능
- 알림 시스템
- 활동 통계

### 6. 관리자 기능
- 통계 대시보드
- 게시글 관리
- 사용자 관리
- 시스템 설정
- 공지사항 관리

## 🛠️ 기술 스택

- **프론트엔드**: Next.js 14 (App Router), React 18, TypeScript
- **스타일링**: Tailwind CSS, Headless UI
- **백엔드**: Next.js API Routes
- **데이터베이스**: PostgreSQL (프로덕션), SQLite (개발)
- **ORM**: Prisma
- **인증**: bcryptjs
- **아이콘**: Heroicons, Lucide React

## 🚀 시작하기

### 필수 요구사항

- Node.js 20.x 이상
- npm 또는 yarn
- PostgreSQL (프로덕션) 또는 SQLite (개발)

### 로컬 개발 환경 설정

1. **저장소 클론**
```bash
git clone https://github.com/your-username/homeless-town.git
cd homeless-town
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 수정 (필요에 따라)
# DATABASE_URL="file:./prisma/dev.db"  # 개발용 SQLite
# OPENAI_API_KEY="your-openai-api-key"  # AI 게시글 생성용
# NEWS_API_KEY="your-news-api-key"  # 실시간 뉴스 기반 토론글 생성용 (선택사항)
# CRON_SECRET="your-secure-secret"  # 자동 스케줄링용
```

4. **데이터베이스 설정**
```bash
# Prisma 마이그레이션 실행
npm run db:push

# (선택) 시드 데이터 생성
npm run db:seed
```

5. **개발 서버 실행**
```bash
npm run dev
```

6. **브라우저에서 열기**
```
http://localhost:3000
```

## 📦 주요 스크립트

```bash
npm run dev          # 개발 서버 시작
npm run build        # 프로덕션 빌드
npm start            # 프로덕션 서버 시작
npm run lint         # ESLint 실행
npm run db:generate  # Prisma 클라이언트 생성
npm run db:push      # 데이터베이스 스키마 동기화
npm run db:migrate   # 마이그레이션 배포
npm run db:seed      # 시드 데이터 생성
npm run db:studio    # Prisma Studio 실행
```

## 🌐 배포

### Render.com 배포

자세한 배포 가이드는 [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)를 참조하세요.

**빠른 배포:**

1. GitHub에 코드 푸시
2. [Render](https://render.com) 로그인
3. "New Blueprint" 선택
4. GitHub 저장소 연결
5. `render.yaml` 자동 감지 및 배포

### 환경 변수

프로덕션 환경에서 필요한 환경 변수:

```
DATABASE_URL=postgresql://...
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.onrender.com
```

## 📁 프로젝트 구조

```
homeless-town/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   ├── admin/             # 관리자 페이지
│   ├── forum/             # 포럼 페이지
│   ├── discussions/       # 토론 게시판
│   ├── housing-board/     # 주거 게시판
│   ├── contract-guide/    # 계약 가이드
│   └── ...
├── components/            # React 컴포넌트
├── contexts/              # React Context
├── lib/                   # 유틸리티 함수
├── prisma/                # Prisma 스키마 및 마이그레이션
│   ├── schema.prisma     # 데이터베이스 스키마
│   ├── migrations/       # 마이그레이션 파일
│   └── seed.ts           # 시드 데이터
├── public/                # 정적 파일
├── render.yaml            # Render 배포 설정
└── package.json
```

## 🗄️ 데이터베이스 스키마

주요 모델:
- `User` - 사용자
- `Post` - 게시글
- `Comment` - 댓글
- `Like/Dislike` - 좋아요/싫어요
- `Bookmark` - 북마크
- `Tag` - 태그
- `ContractGuide` - 계약 가이드
- `Admin` - 관리자
- `UserProfile` - 사용자 프로필
- `UserNotification` - 알림
- `FileUpload` - 파일 업로드
- `SystemSetting` - 시스템 설정
- `Announcement` - 공지사항

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

This project is licensed under the MIT License.

## 📞 문의

프로젝트 관련 문의나 제안사항이 있으시면 Issue를 등록해주세요.

## 🙏 감사의 말

이 프로젝트는 주거 불안정을 겪고 있는 모든 분들을 위해 만들어졌습니다.
