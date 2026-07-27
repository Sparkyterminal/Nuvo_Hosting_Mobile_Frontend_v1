import PhonePePaymentSDK from 'react-native-phonepe-pg';
import { createSdkOrderAPI } from './api/eventService';

// iOS URL scheme registered in Info.plist (CFBundleURLSchemes). Ignored on Android.
const APP_SCHEMA = 'com.rudreshac.novohosting';

export type PhonePeResult = {
  status: 'SUCCESS' | 'FAILURE' | 'INTERRUPTED' | string;
  merchantOrderId: string | null;
};

/**
 * Runs the full native PhonePe payment for an event:
 *   1. asks our backend to create an SDK order (returns token + merchant info)
 *   2. inits the SDK and starts the transaction (opens PhonePe / UPI app)
 *
 * The returned `status` is the SDK's client-side result — the caller MUST still
 * confirm server-side via checkPaymentStatusAPI(merchantOrderId) before treating
 * the payment as done.
 */
export async function payWithPhonePe(
  eventId: string,
  amount: number,
  flowId: string = 'nuvo-client',
): Promise<PhonePeResult> {
  // 1. Backend creates the order and returns the token the SDK needs.
  const res = await createSdkOrderAPI(eventId, amount);
  const data = res?.data ?? {};
  const orderId = data.order_id;
  const token = data.token;
  const merchantId = data.merchant_id;
  const environment = data.environment || 'SANDBOX';
  const merchantOrderId = data.merchant_order_id ?? null;

  if (!res?.success || !orderId || !token || !merchantId) {
    throw new Error(res?.message || 'Could not create the payment order.');
  }

  // The native module is only present in a native build (not Expo Go / JS-only
  // reload). Fail with a clear message instead of "Cannot read property 'init'".
  if (!PhonePePaymentSDK) {
    throw new Error(
      'PhonePe payment is unavailable in this build. Rebuild the app natively (npx expo run:ios / run:android) — it cannot run in Expo Go.',
    );
  }

  // 2. Init the SDK (safe to call before every transaction).
  await PhonePePaymentSDK.init(environment, merchantId, flowId, __DEV__);

  // 3. Start the transaction — opens PhonePe / a UPI app and returns control.
  const request = JSON.stringify({
    orderId,
    merchantId,
    token,
    paymentMode: { type: 'PAY_PAGE' },
  });

  const result = await PhonePePaymentSDK.startTransaction(request, APP_SCHEMA);

  return {
    status: result?.status ?? 'FAILURE',
    merchantOrderId,
  };
}
