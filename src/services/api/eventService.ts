import { ENDPOINTS } from "../../constants/url";
import apiClient from "../apiClient";


export const createEventAPI = async (payload: any) => {
  const response = await apiClient.post(ENDPOINTS.EVENTS.CREATE, payload);
  return response.data;
};
