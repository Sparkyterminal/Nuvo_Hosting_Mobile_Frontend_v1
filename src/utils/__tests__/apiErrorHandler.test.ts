// Mock axios so we don't load its real fetch adapter (which crashes under the
// jest test environment) — handleApiError only needs `isAxiosError`.
jest.mock('axios', () => ({
  __esModule: true,
  default: { isAxiosError: (e: any) => !!e?.isAxiosError },
  isAxiosError: (e: any) => !!e?.isAxiosError,
}));

import type { AxiosError } from 'axios';
import { handleApiError } from '../apiErrorHandler';

const makeAxiosError = (partial: Partial<AxiosError>): AxiosError => {
  const err = new Error('axios') as AxiosError;
  err.isAxiosError = true;
  Object.assign(err, partial);
  return err;
};

describe('handleApiError', () => {
  it('returns the server message when present', () => {
    const err = makeAxiosError({
      response: { data: { message: 'Email already exists' } } as any,
    });
    expect(handleApiError(err)).toBe('Email already exists');
  });

  it('falls back to `detail` when there is no message', () => {
    const err = makeAxiosError({
      response: { data: { detail: 'Not found' } } as any,
    });
    expect(handleApiError(err)).toBe('Not found');
  });

  it('returns a generic message for an empty server response body', () => {
    const err = makeAxiosError({ response: { data: {} } as any });
    expect(handleApiError(err)).toBe('Something went wrong. Please try again.');
  });

  it('returns a network message when the request was sent but no response came', () => {
    const err = makeAxiosError({ request: {} as any });
    expect(handleApiError(err)).toBe(
      'Network error. Please check your internet connection.',
    );
  });

  it('returns the message of a plain Error', () => {
    expect(handleApiError(new Error('boom'))).toBe('boom');
  });

  it('returns a fallback for a non-error value', () => {
    expect(handleApiError('weird')).toBe('Unexpected error occurred.');
  });
});
