import apiClient from '../apiClient';
import { ENDPOINTS } from '../../constants/url';

export const getUniforms = async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.MASTER.UNIFORMS);
    return response.data;
  } catch (error) {
    console.log('Uniform API Error:', error);
    throw error;
  }
};
