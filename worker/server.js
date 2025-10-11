// worker/server.js
const express = require('express');
const { enqueueToday } = require('./index');

const app = express();

// 헬스체크 (Render 상태 확인용)
app.get('/health', (req, res) => res.json({ ok: true }));

// 크론 트리거 (매일 자동 포스팅 등록용)
app.get('/cron/enqueue', async (req, res) => {
  try {
    const key = req.query.key || '';
    if (!process.env.CRON_KEY || key !== process.env.CRON_KEY) {
      return res.status(401).json({ ok: false, error: 'invalid key' });
    }

    await enqueueToday();
    res.json({ ok: true, message: '오늘 작업 등록 완료' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Worker server is running on port ${PORT}`);
});
