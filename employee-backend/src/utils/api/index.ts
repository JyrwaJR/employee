import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 20000, // 20 seconds
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
