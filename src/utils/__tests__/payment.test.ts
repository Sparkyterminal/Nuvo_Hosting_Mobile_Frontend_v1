import { isPaidStatus } from '../payment';

describe('isPaidStatus', () => {
  it('treats a full payment as paid', () => {
    expect(isPaidStatus('paid_fully')).toBe(true);
  });

  it('treats a paid advance as paid', () => {
    expect(isPaidStatus('advance')).toBe(true);
  });

  it('treats unpaid as not paid', () => {
    expect(isPaidStatus('unpaid')).toBe(false);
  });

  it('treats refund_pending as not paid', () => {
    expect(isPaidStatus('refund_pending')).toBe(false);
  });

  it('handles undefined / null / empty gracefully', () => {
    expect(isPaidStatus(undefined)).toBe(false);
    expect(isPaidStatus(null)).toBe(false);
    expect(isPaidStatus('')).toBe(false);
  });
});
