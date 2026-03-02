import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
// import { TokenService } from './token.service';

export const sendOtp = async (payload: {
  email: string;
  phone_number: string;
  role: string;
}) => {
  const res = await apiClient.post(ENDPOINTS.AUTH.SEND_OTP, payload);
  return res.data;
};

export const verifyOtp = async (payload: {
  email: string;
  phone_number: string;
  role: string;
  otp: string;
}) => {
  const res = await apiClient.post(ENDPOINTS.AUTH.VERIFY_OTP, payload);

  return res.data;
};

// export const logout = async () => {
//   // const refresh = await TokenService.getRefreshToken();

//   await apiClient.post(ENDPOINTS.AUTH.LOGOUT, {
//     refresh_token: refresh,
//   });
// };

export const getMe = async () => {
  const res = await apiClient.get(ENDPOINTS.AUTH.ME);
  return res.data;
};
