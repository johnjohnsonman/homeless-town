// worker/server.js
const express = require('express');

const app = express();

// 헬스체크 (Render 상태 확인용)
app.get('/health', (req, res) => res.json({ ok: true }));

// 간단한 테스트 엔드포인트
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Worker is working!',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Worker server is running on port ${PORT}`);
});
