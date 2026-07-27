import { ENDPOINTS } from '../../constants/url';
import apiClient from '../apiClient';

export const createEventAPI = async (payload: any) => {
  const response = await apiClient.post(ENDPOINTS.EVENTS.CREATE, payload);
  return response.data;
};

export const getMyEventsAPI = async () => {
  const response = await apiClient.get(ENDPOINTS.EVENTS.GET_MY_EVENTS);
  return response.data;
};

export const getEventByIdAPI = async (eventId: string) => {
  const response = await apiClient.get(ENDPOINTS.EVENTS.GET_EVENT(eventId));
  return response.data;
};

export const initiatePaymentAPI = async (
  eventId: string,
  amount: number,
  redirectUrl: string,
) => {
  const response = await apiClient.post(ENDPOINTS.EVENTS.PAYMENT_INITIATE(eventId), {
    amount,
    redirect_url: redirectUrl,
  });
  return response.data;
};

// Native PhonePe SDK flow: create an order and get back the order token +
// merchant id + environment that PhonePePaymentSDK.init/startTransaction need.
export const createSdkOrderAPI = async (eventId: string, amount: number) => {
  const response = await apiClient.post(
    ENDPOINTS.EVENTS.PAYMENT_CREATE_ORDER(eventId),
    { amount },
  );
  return response.data;
};

export const checkPaymentStatusAPI = async (merchantOrderId: string) => {
  const response = await apiClient.get(ENDPOINTS.EVENTS.PAYMENT_STATUS, {
    params: { merchantOrderId },
  });
  return response.data;
};
