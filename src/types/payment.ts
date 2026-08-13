export type PaymentStatus =
  | 'unpaid'
  | 'advance'
  | 'paid_fully'
  | 'refund_pending';

export type PaymentMethod = 'CASH' | 'ONLINE';
export type AdvanceType = 'FULL' | 'HALF';

// Payment block returned on an event (both the list and detail serializers).
export interface PaymentInfo {
  total_amount: number;
  gst_amount?: number;
  tax_amount?: number;
  paid_amount: number;
  balance_due?: number;
  payment_status: PaymentStatus | string;
  payment_method?: PaymentMethod;
  advance_type?: AdvanceType;
  phonepay_transaction_id?: string;
  phonepay_order_id?: string;
  last_updated?: string | null;
}

// Response from POST /events/<id>/payment/create-order/ (native SDK flow).
export interface SdkOrder {
  order_id: string;
  token: string;
  merchant_order_id: string;
  merchant_id: string;
  environment: 'SANDBOX' | 'PRODUCTION' | string;
}
