import apiClient from '../apiClient';
import { ENDPOINTS } from '../../constants/url';

// 🔹 Upcoming events
export const getUpcomingEvents = async (params?: any) => {
  const res = await apiClient.get(ENDPOINTS.STAFF.UPCOMING, { params });
  return res.data.data; // results + total
};

// 🔹 Assigned events
export const getAssignedEvents = async (params?: any) => {
  const res = await apiClient.get(ENDPOINTS.STAFF.ASSIGNED, { params });
  return res.data.data;
};

// 🔹 Completed events
export const getCompletedEvents = async (params?: any) => {
  const res = await apiClient.get(ENDPOINTS.STAFF.COMPLETED, { params });
  return res.data.data;
};

// 🔹 Online status
export const updateOnlineStatus = async (isOnline: boolean) => {
  const res = await apiClient.put(ENDPOINTS.STAFF.ONLINE_STATUS, {
    is_online: isOnline,
  });
  return res.data;
};
