import { ENDPOINTS } from '../../constants/url';
import apiClient from '../apiClient';

export const getModalsList = async (params?: any) => {
  try {
    const res = await apiClient.get(ENDPOINTS.USERS.GET_MODALS_LIST, {
      params,
    });

    return res.data;
  } catch (error) {
    console.log('Staff API Error:', error);
    throw error;
  }
};
