// worker/test-simple.js
const express = require('express');

const app = express();

// 헬스체크
app.get('/health', (req, res) => res.json({ ok: true }));

// 간단한 테스트 엔드포인트
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Worker is working!',
    timestamp: new Date().toISOString(),
    env: {
      hasRedisUrl: !!process.env.REDIS_URL,
      hasSiteBaseUrl: !!process.env.SITE_BASE_URL,
      hasAdminToken: !!process.env.ADMIN_TOKEN,
      hasCronKey: !!process.env.CRON_KEY
    }
  });
});

// 크론 테스트 (Redis 없이)
app.get('/cron/test', (req, res) => {
  const key = req.query.key || '';
  if (!process.env.CRON_KEY || key !== process.env.CRON_KEY) {
    return res.status(401).json({ ok: false, error: 'invalid key' });
  }
  
  res.json({ 
    ok: true, 
    message: '크론 키 인증 성공!',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Simple Worker server is running on port ${PORT}`);
});
