import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../app/config/api';
import { ENDPOINTS } from '../constants/url';
// import { API_BASE_URL } from '../config/api';
// import { ENDPOINTS } from '../config/endpoints';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR (TOKEN REFRESH)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired
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

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        await AsyncStorage.clear();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
