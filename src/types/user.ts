export type UserRole = 'ADMIN' | 'CLIENT' | 'STAFF' | 'MAKEUP_ARTIST';

export interface User {
  id?: string;
  full_name?: string;
  email?: string;
  role?: UserRole | string;
  profile_picture?: string;
  phone_number?: string;
  subscription_plan?: string;
  profile_id?: string;
}
