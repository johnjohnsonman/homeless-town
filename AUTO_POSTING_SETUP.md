# 자동 포스팅 크론 설정 가이드

## 1. Render 환경변수 설정

Render 대시보드에서 다음 환경변수들을 설정해주세요:

### 메인 앱 (homeless-town)
- `DATABASE_URL`: PostgreSQL 데이터베이스 URL
- `ADMIN_TOKEN`: 자동 포스팅용 관리자 토큰 (예: "auto-post-secret-2024")
- `SITE_BASE_URL`: 사이트 URL (예: "https://homeless-town.onrender.com")
- `REDIS_URL`: Redis URL (예: "redis://homeless-town-redis:6379")
- `CRON_KEY`: 크론 작업용 시크릿 키 (예: "cron-secret-2024")

### Worker 앱 (homeless-town-worker)
- `REDIS_URL`: Redis URL (메인 앱과 동일)
- `SITE_BASE_URL`: 사이트 URL (메인 앱과 동일)
- `ADMIN_TOKEN`: 관리자 토큰 (메인 앱과 동일)
- `CRON_KEY`: 크론 작업용 시크릿 키 (메인 앱과 동일)

## 2. 외부 크론 서비스 설정

### cron-job.org 사용 예시:
1. https://cron-job.org 에서 계정 생성
2. 새 크론 작업 생성:
   - URL: `https://homeless-town-worker.onrender.com/cron/enqueue?key=YOUR_CRON_KEY`
   - 스케줄: `0 0 * * *` (매일 자정)
   - HTTP Method: GET

### GitHub Actions 사용 예시:
```yaml
name: Auto Post Scheduler
on:
  schedule:
    - cron: '0 0 * * *'  # 매일 자정
  workflow_dispatch:  # 수동 실행 가능

jobs:
  schedule-posts:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Auto Posts
        run: |
          curl -X GET "https://homeless-town-worker.onrender.com/cron/enqueue?key=${{ secrets.CRON_KEY }}"
```

## 3. 자동 포스팅 설정

현재 설정:
- 총 게시글 수: 160개/일 (카테고리당 20개)
- 카테고리: 자유, 시황, 부동산시장, 임대시장, 분쟁사례, 보증금, 월세인상, 계약해지
- 배치 시간: 24시간에 걸쳐 균등 분산
- 재시도: 3회 (지수 백오프)

## 4. 모니터링

### Worker 상태 확인:
```bash
curl https://homeless-town-worker.onrender.com/health
```

### 자동 포스팅 통계 확인:
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     https://homeless-town.onrender.com/api/admin/posts
```

## 5. 문제 해결

### Worker 배포 실패 시:
1. Render 로그 확인
2. 환경변수 설정 확인
3. Redis 연결 상태 확인
4. API 엔드포인트 접근 가능 여부 확인

### 자동 포스팅이 안 될 때:
1. 크론 작업이 실행되었는지 확인
2. Redis 큐에 작업이 등록되었는지 확인
3. API 인증 토큰이 올바른지 확인
4. 데이터베이스 연결 상태 확인
