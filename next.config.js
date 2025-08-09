/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = require('path').join(__dirname);
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
module.exports = nextConfig;
