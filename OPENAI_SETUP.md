# OpenAI API 설정 가이드

## 환경 변수 추가

Worker 앱에 다음 환경 변수를 추가해야 합니다:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## OpenAI API 키 발급 방법

1. https://platform.openai.com/ 접속
2. 계정 생성 또는 로그인
3. API Keys 메뉴에서 새 API 키 생성
4. 생성된 키를 `OPENAI_API_KEY` 환경 변수에 설정

## 비용 고려사항

- GPT-3.5-turbo 모델 사용 (비용 효율적)
- 각 게시글당 약 400 토큰 사용 예상
- 월 20개 게시글 × 30일 = 600개 게시글
- 예상 비용: 월 $3-5 정도

## 폴백 시스템

OpenAI API 호출 실패 시 기존 템플릿 시스템으로 자동 전환됩니다.
