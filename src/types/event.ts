import { PaymentInfo } from './payment';

export type EventStatus =
  | 'created'
  | 'planning_started'
  | 'staff_allocated'
  | 'completed'
  | 'cancelled';

export type CrewPackage = 'LUXURY' | 'PREMIUM' | 'BOTH';

export interface Venue {
  venue_name?: string;
  formatted_address?: string;
  latitude?: number;
  longitude?: number;
  place_id?: string;
  google_maps_url?: string;
}

export interface EventClient {
  profile_id: string;
  full_name: string;
  city: string;
  email?: string;
  phone_number?: string;
  user_id?: string;
}

// Compact item returned by GET /events/get-my-events/ (the Events list).
export interface MyEventListItem {
  event_id: string;
  event_name: string;
  event_type?: string | null;
  city?: string | null;
  state?: string | null;
  venue_name?: string | null;
  event_start_datetime?: string | null;
  no_of_days?: number;
  package_type?: CrewPackage | null;
  order_id?: string;
  payment_details?: Partial<PaymentInfo>;
  status: EventStatus | string;
}

// Full event returned by GET /events/<id>/ (the details screen).
export interface EventDetail {
  id: string;
  event_name: string;
  event_type?: string | null;
  city?: string;
  state?: string;
  venue?: Venue | null;
  event_start_datetime?: string | null;
  event_end_datetime?: string | null;
  no_of_days?: number;
  working_hours?: number;
  crew_count?: number;
  package_type?: CrewPackage | null;
  client?: EventClient | null;
  payment?: PaymentInfo | null;
  status: EventStatus | string;
  cancelled_reason?: string | null;
  created_at?: string;
  updated_at?: string;
}
