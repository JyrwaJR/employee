import { TokenStoreManager } from '@/src/libs/stores/auth';
import axios from 'axios';
// import https from 'https';

// const httpsAgent = new https.Agent({
//   keepAlive: true,
//   rejectUnauthorized: true, // NEVER disable
//   minVersion: 'TLSv1.2',
// });

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  // httpsAgent,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await TokenStoreManager.getToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
