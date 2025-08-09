/** @type {import('next').NextConfig} */
const nextConfig = {
  // 기본 설정만 유지
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;