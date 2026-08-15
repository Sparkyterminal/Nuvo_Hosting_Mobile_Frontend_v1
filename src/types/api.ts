// The envelope every backend endpoint returns via `api_response(...)`.
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

// Shape of paginated list payloads (e.g. get-my-events).
export interface Paginated<T> {
  results: T[];
  pagination?: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}
