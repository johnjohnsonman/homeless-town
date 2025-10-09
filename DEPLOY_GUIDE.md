# Render 배포 가이드

## 📋 배포 전 체크리스트

### 1. Git 저장소 준비
프로젝트를 GitHub에 푸시해야 합니다:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/homeless-town.git
git push -u origin main
```

### 2. Render 배포 단계

#### 방법 1: render.yaml 사용 (자동 설정) ⭐ 추천

1. [Render](https://render.com)에 로그인
2. Dashboard → "New" → "Blueprint" 선택
3. GitHub 저장소 연결
4. `render.yaml` 파일이 자동으로 감지됨
5. "Apply" 클릭

#### 방법 2: 수동 설정

**Step 1: PostgreSQL 데이터베이스 생성**
1. Render Dashboard → "New" → "PostgreSQL"
2. 이름: `homeless-town-db`
3. Database: `homeless_town`
4. User: `homeless_town_user`
5. Region: Oregon (또는 선호하는 지역)
6. Plan: Free
7. "Create Database" 클릭
8. **Internal Database URL 복사** (나중에 사용)

**Step 2: Web Service 생성**
1. Render Dashboard → "New" → "Web Service"
2. GitHub 저장소 연결
3. 다음 설정 입력:

```
Name: homeless-town
Runtime: Node
Region: Oregon (데이터베이스와 동일한 지역)
Branch: main
Root Directory: (비워둠)
Build Command: npm install && npm run db:generate && npm run build
Start Command: npm start
Plan: Free
```

4. **환경 변수 설정** (Environment 탭):
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: (앞서 복사한 PostgreSQL Internal Database URL 붙여넣기)

5. "Create Web Service" 클릭

**Step 3: 데이터베이스 마이그레이션**
1. Web Service가 배포된 후, Render Shell에 접속
2. 다음 명령 실행:
```bash
npx prisma migrate deploy
```

### 3. 배포 후 확인사항

✅ 웹사이트가 정상적으로 로드되는지 확인
✅ 데이터베이스 연결 확인
✅ 게시글 작성/조회 테스트
✅ 이미지 업로드 테스트

### 4. 환경 변수 (추가 설정)

필요에 따라 다음 환경 변수를 추가할 수 있습니다:

```
NEXT_PUBLIC_APP_URL=https://your-app.onrender.com
```

### 5. 자동 배포 설정

Render는 기본적으로 main 브랜치에 푸시할 때마다 자동으로 재배포됩니다.

비활성화하려면:
- Web Service 설정 → Settings → Build & Deploy → Auto-Deploy 끄기

### 6. 로컬에서 프로덕션 모드 테스트

배포 전에 로컬에서 테스트:

```bash
# PostgreSQL 설치 및 실행 후
npm run build
npm start
```

### 7. 문제 해결

**빌드 실패 시:**
- Render 로그 확인 (Logs 탭)
- `package.json`의 `engines` 필드 확인
- Node 버전이 20.x인지 확인

**데이터베이스 연결 오류:**
- `DATABASE_URL` 환경 변수 확인
- PostgreSQL이 실행 중인지 확인
- Migration이 실행되었는지 확인

**이미지 업로드 문제:**
- Render의 임시 파일 시스템 특성상, 이미지는 재배포 시 사라질 수 있음
- 프로덕션 환경에서는 S3/Cloudinary 같은 외부 스토리지 사용 권장

### 8. 성능 최적화 팁

1. **캐싱 설정**: `next.config.js`에서 이미지 최적화 설정
2. **데이터베이스 인덱싱**: Prisma schema의 `@@index` 활용 (이미 설정됨)
3. **환경별 설정**: 개발/프로덕션 환경 분리

### 9. 무료 플랜 제한사항

- **웹 서비스**: 15분 동안 요청이 없으면 슬립 모드 진입
- **데이터베이스**: 90일 후 만료 (무료 플랜)
- **빌드 시간**: 월 500분 제한

### 10. 도메인 연결 (선택사항)

커스텀 도메인 연결:
1. Render Dashboard → Web Service 선택
2. Settings → Custom Domains
3. 도메인 추가 및 DNS 설정

---

## 📞 지원

문제가 발생하면:
- [Render 문서](https://render.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)

