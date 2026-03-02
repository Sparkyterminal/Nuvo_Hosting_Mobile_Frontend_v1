export const ENDPOINTS = {
  AUTH: {
    SEND_OTP: 'auth/send-otp/',
    VERIFY_OTP: 'auth/verify-otp/',
    REFRESH: 'auth/refresh-token/',
    LOGOUT: 'auth/logout/',
    RESEND_OTP: 'auth/resend-otp/',
    ME: 'auth/me/',
  },

  USERS: {
    COMPLETE_CLIENT: 'users/complete/client/',
    COMPLETE_STAFF: 'users/complete/staff/',
    COMPLETE_MAKEUP: 'users/complete/makeup/',
    MY_PROFILE: 'users/my-profile/',
    UPDATE_PROFILE: 'users/update-profile/',
    UPLOAD_STAFF_IMAGES: 'users/staff/upload-images/',
  },
};
