import axios from "axios";
const API_URL = process.env.API_URL;

// 创建 axios 实例
const request = axios.create({
  // baseURL: "http://lkkhyy_s.lkkxwj.shop:5502",
  baseURL: API_URL,
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在这里可以添加全局请求头或 Token
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data; // 只返回数据部分
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export default request;
