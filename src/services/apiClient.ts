import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../app/config/api';
import { ENDPOINTS } from '../constants/url';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ⏱️ Track start time
    (config as any).metadata = { startTime: new Date() };

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    const { config } = response;

    const endTime = new Date();
    const startTime = (config as any).metadata?.startTime;
    const duration = startTime ? endTime.getTime() - startTime.getTime() : 0;

    const log = {
      type: 'SUCCESS',
      url: (config.baseURL || '') + (config.url || ''),
      method: config.method?.toUpperCase(),
      status: response.status,
      duration: `${duration}ms`,
      request: {
        headers: config.headers,
        body: config.data,
      },
      response: {
        headers: response.headers,
        data: response.data,
      },
    };

    if (__DEV__) {
      try {
        console.log('📦 API LOG:', JSON.stringify(log, null, 2));
      } catch {
        console.log('📦 API LOG:', log);
      }
    }

    return response;
  },

  async (error) => {
    const originalRequest = error.config || {};

    // 🔁 HANDLE REFRESH FIRST
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const res = await axios.post(
          `${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`,
          {
            refresh_token: refreshToken,
          },
        );

        const newAccessToken = res.data.data.access_token;

        await AsyncStorage.setItem('access_token', newAccessToken);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        await AsyncStorage.clear();
        return Promise.reject(refreshError);
      }
    }

    // ⏱️ timing
    const endTime = new Date();
    const startTime = (originalRequest as any)?.metadata?.startTime;
    const duration = startTime ? endTime.getTime() - startTime.getTime() : 0;

    const log = {
      type: 'ERROR',
      url: (originalRequest.baseURL || '') + (originalRequest.url || ''),
      method: originalRequest.method?.toUpperCase(),
      status: error?.response?.status || 'NETWORK_ERROR',
      duration: `${duration}ms`,
      request: {
        headers: originalRequest.headers,
        body: originalRequest.data,
      },
      response: {
        headers: error?.response?.headers,
        data: error?.response?.data,
      },
      message: error.message,
    };

    if (__DEV__) {
      try {
        console.log('📦 API LOG:', JSON.stringify(log, null, 2));
      } catch {
        console.log('📦 API LOG:', log);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
