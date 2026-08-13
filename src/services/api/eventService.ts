import { ENDPOINTS } from '../../constants/url';
import apiClient from '../apiClient';
import {
  ApiResponse,
  EventDetail,
  MyEventListItem,
  Paginated,
  SdkOrder,
} from '../../types';

export const createEventAPI = async (
  payload: Record<string, unknown>,
): Promise<ApiResponse<EventDetail>> => {
  const response = await apiClient.post(ENDPOINTS.EVENTS.CREATE, payload);
  return response.data;
};

export const getMyEventsAPI = async (): Promise<
  ApiResponse<Paginated<MyEventListItem>>
> => {
  const response = await apiClient.get(ENDPOINTS.EVENTS.GET_MY_EVENTS);
  return response.data;
};

export const getEventByIdAPI = async (
  eventId: string,
): Promise<ApiResponse<EventDetail>> => {
  const response = await apiClient.get(ENDPOINTS.EVENTS.GET_EVENT(eventId));
  return response.data;
};

export const initiatePaymentAPI = async (
  eventId: string,
  amount: number,
  redirectUrl: string,
): Promise<ApiResponse<{ redirect_url?: string; merchant_order_id?: string }>> => {
  const response = await apiClient.post(ENDPOINTS.EVENTS.PAYMENT_INITIATE(eventId), {
    amount,
    redirect_url: redirectUrl,
  });
  return response.data;
};

// Native PhonePe SDK flow: create an order and get back the order token +
// merchant id + environment that PhonePePaymentSDK.init/startTransaction need.
export const createSdkOrderAPI = async (
  eventId: string,
  amount: number,
): Promise<ApiResponse<SdkOrder>> => {
  const response = await apiClient.post(
    ENDPOINTS.EVENTS.PAYMENT_CREATE_ORDER(eventId),
    { amount },
  );
  return response.data;
};

export const checkPaymentStatusAPI = async (
  merchantOrderId: string,
): Promise<ApiResponse<{ payment_status?: string; paid_amount?: number }>> => {
  const response = await apiClient.get(ENDPOINTS.EVENTS.PAYMENT_STATUS, {
    params: { merchantOrderId },
  });
  return response.data;
};
