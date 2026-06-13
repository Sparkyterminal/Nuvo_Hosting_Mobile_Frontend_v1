import { ENDPOINTS } from '../../constants/url';
import apiClient from '../apiClient';

export const validateCoupon = async (code: string) => {
  const response = await apiClient.post(ENDPOINTS.MASTER.VALIDATE_COUPON, {
    code,
  });

  return response.data;
};
