import { ENDPOINTS } from '../../constants/url';
import apiClient from '../apiClient';

export const getThemes = async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.MASTER.THEMES);

    return response.data; // { success, message, data }
  } catch (error: any) {
    console.log('Get Themes Error:', error?.response?.data || error.message);
    throw error;
  }
};
