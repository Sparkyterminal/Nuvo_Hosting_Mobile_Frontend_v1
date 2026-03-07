// import apiClient from '../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../../constants/url';
import apiClient from '../apiClient';
// import { ENDPOINTS } from '../config/endpoints';

export const sendOtp = async (data: {
  email: string;
  phone_number?: string;
  role?: string;
}) => {
  const response = await apiClient.post(ENDPOINTS.AUTH.SEND_OTP, data);

  return response.data;
};

export const verifyOtp = async (data: {
  email: string;
  phone_number?: string;
  role?: string;
  otp: string;
}) => {
  const response = await apiClient.post(ENDPOINTS.AUTH.VERIFY_OTP, data);

  const { access_token, refresh_token } = response.data.data;

  await AsyncStorage.setItem('access_token', access_token);
  await AsyncStorage.setItem('refresh_token', refresh_token);

  return response.data;
};

export const resendOtp = async (email: string) => {
  const response = await apiClient.post(ENDPOINTS.AUTH.RESEND_OTP, { email });

  return response.data;
};

export const logout = async () => {
  const refreshToken = await AsyncStorage.getItem('refresh_token');

  await apiClient.post(ENDPOINTS.AUTH.LOGOUT, {
    refresh_token: refreshToken,
  });

  await AsyncStorage.clear();
};
