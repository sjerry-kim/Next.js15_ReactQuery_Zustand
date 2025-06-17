import type { NextConfig } from "next";
const path = require('path');

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  env: {
    PUBLIC_URL: isDevelopment ? "http://localhost:3001" : "배포URL",
  },
  // Webpack 설정을 추가하여 Turbopack 비활성화
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.modules.push('src'); // 클라이언트에서 'src' 폴더를 모듈 경로로 추가
    }
    return config;
  },
};

export default nextConfig;
