import apiClient from '../apiClient';
import { ENDPOINTS } from '../../constants/url';

export const getThemes = async () => {
  const res = await apiClient.get(ENDPOINTS.MASTER.THEMES);

  return res.data;
};
