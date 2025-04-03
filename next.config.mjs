/** @type {import('next').NextConfig} */

import dotenv from "dotenv";
import path from "path";

// 根据环境加载不同的 .env 文件
const envPath =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: path.resolve(process.cwd(), envPath) });

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  env: {
    API_URL: process.env.API_URL, // 请求API
    FEATURE_TOGGLE: process.env.FEATURE_TOGGLE === "true",
  },
};

export default nextConfig;
