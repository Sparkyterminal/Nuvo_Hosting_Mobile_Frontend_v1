// Shared payment-status helpers.
//
// The booking flow, the Events list, and the Event Details screen all need to
// know whether an event counts as "paid/booked". Keeping that rule in one place
// avoids the logic drifting apart across screens.

export type { PaymentStatus } from '../types/payment';

/**
 * True once any confirmed payment exists — a paid advance (HALF plan) or a full
 * payment. Anything else (unpaid / missing) is still pending.
 */
export const isPaidStatus = (status?: string | null): boolean =>
  status === 'advance' || status === 'paid_fully';
