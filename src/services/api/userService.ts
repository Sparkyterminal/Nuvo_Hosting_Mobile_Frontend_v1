import { ENDPOINTS } from '../../constants/url';
import apiClient from '../apiClient';

export const getCurrentUser = async () => {
  const response = await apiClient.get(ENDPOINTS.AUTH.ME);

  return response.data;
};

export const completeClientProfile = async (data: {
  full_name: string;
  phone_number: string;
  city: string;
  state: string;
  country: string;
  subscription_plan?: string;
}) => {
  const response = await apiClient.post(ENDPOINTS.USERS.COMPLETE_CLIENT, data);

  return response.data;
};
