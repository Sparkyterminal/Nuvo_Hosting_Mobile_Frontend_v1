import axios from 'axios';

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Server responded with error
    if (error.response) {
      return (
        error.response.data?.message ||
        error.response.data?.detail ||
        'Something went wrong. Please try again.'
      );
    }

    // Request sent but no response (network issue)
    if (error.request) {
      return 'Network error. Please check your internet connection.';
    }
  }

  // Unknown error
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error occurred.';
};
