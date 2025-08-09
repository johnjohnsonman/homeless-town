/** @type {import('next').NextConfig} */
const nextConfig = {
  // 기본 설정만 유지
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 정적 내보내기 명시적 차단
  trailingSlash: false,
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // 정적 내보내기 경로 맵 비활성화
  exportPathMap: async function () {
    return {};
  },
};

module.exports = nextConfig;