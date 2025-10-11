// worker/index.js
const { Queue, Worker, QueueScheduler } = require('bullmq');
const IORedis = require('ioredis');

// Redis 연결
const connection = new IORedis(process.env.REDIS_URL);

// 큐 생성
const queueName = 'postQueue';
const postQueue = new Queue(queueName, { connection });
new QueueScheduler(queueName, { connection });

// 실제 작업자 로직
new Worker(
  queueName,
  async (job) => {
    const { title, content, categorySlug } = job.data;

    console.log(`📢 게시글 생성 중: ${title}`);

    const res = await fetch(`${process.env.SITE_BASE_URL}/api/admin/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        categorySlug,
        status: 'published',
        tags: ['자동작성'],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`❌ POST 실패: ${res.status} ${text}`);
    }

    await new Promise((r) => setTimeout(r, 1000)); // 게시 간격 (1초)
  },
  { connection, concurrency: 1 }
);

// 오늘 자동 글 등록
async function enqueueToday() {
  const categories = [
    '자유', '시황', '부동산시장', '임대시장',
    '분쟁사례', '보증금', '월세인상', '계약해제'
  ];

  const TARGET_PER_CAT = 20;

  for (const cat of categories) {
    for (let i = 0; i < TARGET_PER_CAT; i++) {
      const title = `[${cat}] ${new Date().toLocaleDateString()} 자동 생성 #${i + 1}`;
      const content = `
        <h2>${cat} 주제 자동 포스팅</h2>
        <p>이 포스팅은 시스템이 자동으로 작성한 예시입니다.</p>
      `;
      const delayMs = i * 60 * 1000; // 1분 간격

      await postQueue.add(
        'post',
        { title, content, categorySlug: cat },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 30_000 },
          delay: delayMs,
          removeOnComplete: true,
        }
      );
    }
  }

  console.log('✅ 오늘 작업 등록 완료');
}

module.exports = { enqueueToday };
