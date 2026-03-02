import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';

export const completeClientProfile = async (payload: {
  full_name: string;
  city: string;
  state: string;
  country: string;
  subscription_plan: string;
}) => {
  const res = await apiClient.post(ENDPOINTS.USERS.COMPLETE_CLIENT, payload);
  return res.data;
};
