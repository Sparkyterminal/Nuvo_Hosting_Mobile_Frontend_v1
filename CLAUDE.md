# Project Overview

**Nuvo Hosting Agency** — a React Native mobile application for a premium event hosting agency. The app allows clients to discover event themes, curate crews and uniforms, and book events through a multi-step booking flow. Staff and makeup artists have a separate portal to view their upcoming assignments.

The brand identity is "Nuvo Hosting" (previously named "Novo Hosting" — the `novohosting` npm package name reflects the old name). The app serves two distinct user personas with separate tab navigators behind a single login.

---

# Current Status

**Active development. Not production-ready.**

- Core booking flow is implemented but the Order Summary screen (step 6) contains hardcoded placeholder data.
- Payment integration is UI-only — selecting a payment method does not trigger any real payment gateway. The event is created after "payment" selection without actual payment processing.
- Employee/Staff portal is partially implemented (home screen exists but is likely thin).
- No CI/CD, no automated tests, no linting configuration.
- Two API base URLs exist in `src/app/config/api.ts` — one is commented out (old), one is active (new AWS API Gateway endpoint).

---

# Architecture

Single-repo Expo managed-to-bare workflow (bare native directories for both Android and iOS are present). The app uses:

- **React Navigation** for all navigation (native stack + bottom tabs).
- **Redux Toolkit** for global state (auth, explore/themes, uniforms, staff, events).
- **Axios** for HTTP with Bearer token auth and automatic refresh logic.
- **AsyncStorage** for token and session persistence.

Role-based routing: after login, `HomeWrapper` reads `user.role` from Redux and renders either `HomeTabsNavigator` (client) or `EmployeeTabsNavigator` (STAFF / MAKEUP_ARTIST).

---

# Folder Structure

```
/
├── App.tsx                      # Root: loads fonts, wraps Redux Provider + RootNavigator
├── index.ts                     # Expo entry point
├── app.json                     # Expo config (name: "Nuvo Hosting Agency")
├── eas.json                     # EAS Build config
├── assets/                      # Root-level icons and splash images
└── src/
    ├── app/config/api.ts        # API base URL + Google Maps key
    ├── assets/
    │   ├── fonts/               # HelveticaNowDisplay (6 weights)
    │   └── images/              # Static images used in screens
    ├── components/              # Shared UI components
    │   ├── AppBottomSheet.tsx
    │   ├── AppButton.tsx
    │   ├── AppInput.tsx
    │   ├── BaseContainer.tsx    # Root screen wrapper (SafeAreaView + background)
    │   ├── CustomText.tsx       # Typed text with font weight + variant props
    │   ├── FieldLabel.tsx
    │   ├── FooterButton.tsx     # Sticky bottom CTA
    │   ├── Loader.tsx
    │   ├── ModelCard.tsx        # Staff/model card used in crew selection
    │   └── ScreenHeader.tsx
    ├── constants/
    │   ├── locationData.ts      # Indian states + cities with lat/lng
    │   └── url.ts               # All API endpoint paths (ENDPOINTS)
    ├── features/                # Redux slices
    │   ├── auth/authSlice.ts
    │   ├── events/eventSlice.ts
    │   ├── explore/exploreSlice.ts
    │   ├── staff/staffSlice.ts
    │   └── uniform/uniformSlice.ts
    ├── hooks/useThemeColors.ts
    ├── navigation/
    │   ├── RootNavigator.tsx    # Root stack + auth session bootstrap
    │   ├── HomeTabsNavigator.tsx
    │   └── EmployeeTabsNavigator.tsx
    ├── screens/
    │   ├── Auth/                # Splash, Onboarding, Login, Register, OtpVerification
    │   ├── EmployeeScreen/      # EhomeScreen, UpcomingEventsScreen, EventHistoryScreen
    │   ├── Home/                # HomeScreen, ExploreScreen, EventsScreen, ProfileScreen, ThemeDetailsScreen
    │   │   └── BookEventFlow/   # BookEventFlowScreen, StepOneForm, SelectableCard
    │   └── HomeWrapper.tsx      # Role router
    ├── services/
    │   ├── apiClient.ts         # Axios instance with auth interceptors + token refresh
    │   ├── api/                 # Service modules per domain
    │   │   ├── authService.ts
    │   │   ├── eventService.ts
    │   │   ├── modalsService.ts
    │   │   ├── staffService.ts
    │   │   ├── themeService.ts
    │   │   ├── uniformService.ts
    │   │   ├── userService.ts
    │   │   └── validateCoupon.ts  # NEW — untracked file, just added
    │   ├── modalData.json
    │   ├── models.json
    │   └── themes.json          # Local fallback data (may be stale)
    ├── store/
    │   ├── store.ts
    │   └── hooks.ts             # useAppDispatch, useAppSelector typed wrappers
    ├── theme/
    │   ├── colors.ts            # AppColors (deep espresso clay brand)
    │   └── fonts.ts
    └── utils/
        ├── apiErrorHandler.ts
        └── storage.ts           # AsyncStorage helpers (separate from auth tokens)
```

---

# Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | React Native (Expo bare) | 0.81.5 |
| Framework | Expo | ~54.0.23 |
| Language | TypeScript | ~5.9.2 |
| Navigation | React Navigation (native stack + bottom tabs) | v7 |
| State | Redux Toolkit + react-redux | RTK ^2.11.2 |
| HTTP | Axios | ^1.13.6 |
| Storage | AsyncStorage | 2.2.0 |
| Icons | @expo/vector-icons (Ionicons, MaterialCommunityIcons) | ^15.0.3 |
| Images | expo-image | ~3.0.11 |
| Date Picker | react-native-modal-datetime-picker | ^18.0.0 |
| Dropdown | react-native-element-dropdown | ^2.12.4 |
| Google Places | react-native-google-places-autocomplete | ^2.6.4 |
| Scaling | react-native-size-matters | ^0.4.2 |
| Modals | react-native-modal | ^14.0.0-rc.1 |
| Fonts | expo-font (HelveticaNowDisplay) | ~14.0.11 |
| Build | EAS Build | CLI >= 16.28.0 |

---

# Environment Setup

```bash
npm install
npx expo start          # Metro + Expo Go / dev client
npx expo run:ios        # Native iOS build
npx expo run:android    # Native Android build
```

No `.env` file detected. API base URL and Google Maps key are hardcoded in `src/app/config/api.ts`.

**Google Maps API Key** is committed to source — `AIzaSyBuU_wrOTRDakq6oBPSj18thl15_dDkMak`. This is a security risk.

---

# Important Commands

```bash
npm start            # Start Expo dev server
npm run ios          # Run on iOS simulator
npm run android      # Run on Android emulator

# EAS builds
eas build --platform ios --profile preview
eas build --platform android --profile preview
eas build --platform all --profile production
```

No test runner scripts defined.

---

# Navigation Structure

```
RootNavigator (NativeStack)
├── Splash
├── Onboarding
├── Login
├── Register
├── OtpVerification
├── Home → HomeWrapper (role-based)
│   ├── HomeTabsNavigator (role: CLIENT)
│   │   ├── HomeScreen
│   │   ├── ExploreScreen
│   │   ├── EventsScreen
│   │   └── ProfileScreen
│   └── EmployeeTabsNavigator (role: STAFF | MAKEUP_ARTIST)
│       ├── EhomeScreen
│       ├── UpcomingEventsScreen
│       └── ProfileScreen (shared)
├── ThemeDetails         (from ExploreScreen or BookEventFlow)
├── BookEventFlow        (multi-step event booking)
└── EventHistory         (employee view)
```

**Note:** `HomeTabParamList` defines a `MyEvents` tab that is not implemented — it does not appear in the navigator.

---

# State Management

Redux store with 5 slices:

| Slice | Purpose |
|---|---|
| `auth` | Current user (`User` object: id, full_name, email, role, profile_id, subscription_plan) |
| `explore` | Themes list, modals/crew list, loading flag |
| `uniform` | Uniforms list |
| `staff` | Staff data (exact shape TBD) |
| `event` | Active event (create result) + events list (my events) |

Data is loaded on `HomeScreen` mount via `Promise.all` and dispatched into Redux. No persistence layer — Redux state resets on app restart; tokens persist via AsyncStorage.

---

# API Integration

**Base URL:** `https://i1kosm5518.execute-api.ap-south-1.amazonaws.com/api/` (AWS API Gateway, ap-south-1)

**Auth flow:** OTP-based email login. No password.

**Token storage keys (AsyncStorage):**
- `access_token` — used in every request via Bearer header
- `refresh_token` — used for silent refresh on 401
- `isLoggedIn` — `'true'` string
- `role` — user role string
- `user` — JSON-stringified user object

**Interceptors (`src/services/apiClient.ts`):**
- Request: attaches Bearer token, logs request timing start
- Response success: logs full request/response detail in DEV mode
- Response error 401: attempts silent refresh via `auth/refresh-token/`, retries original request. On refresh failure, clears all AsyncStorage.

**Endpoint catalog (`src/constants/url.ts`):**

```
AUTH: send-otp, verify-otp, refresh-token, logout, resend-otp, me
USERS: complete/client, complete/staff, complete/makeup, my-profile, update-profile, staff/upload-images, mobile/modals_list_filter
MASTER: themes, uniform/filter, crew/public, payment/config, coupons/validate
STAFF: upcoming-all, assigned, completed, online-status
EVENTS: create, get-my-events
```

**Note:** `modalsService.ts` was changed from `USERS.GET_MODALS_LIST` to `MASTER.CREW` — this reflects an API endpoint migration that may not be fully settled.

---

# Authentication and Session Management

1. User enters email on LoginScreen → `sendOtp` → navigate to `OtpVerificationScreen`
2. User enters OTP → `verifyOtp` → tokens saved to AsyncStorage → navigate to `Home`
3. On app launch, `RootNavigator` reads `isLoggedIn` from AsyncStorage, loads cached user into Redux, then silently refreshes from `GET /auth/me/`
4. Token refresh: automatic on 401 via Axios interceptor
5. On refresh failure: `AsyncStorage.clear()` — full logout, no navigation redirect implemented (user stays on screen; likely needs manual navigation to Login)

**Gap:** After `AsyncStorage.clear()` on refresh failure, the app does not navigate to Login. The user would be stuck on a screen that requires auth.

---

# Native Integrations

- **Background Location Tracking** — `expo-location` + `expo-task-manager`. Task defined in `src/tasks/locationTask.ts`, imported in `index.ts`. On Android, a foreground service keeps the process alive even when the app is killed. On iOS, the system controls background wake-ups (best-effort). POSTs to `https://nuvo-c-backend.onrender.com/api/location/update` every 5 minutes for STAFF/MAKEUP_ARTIST users while online.
- **Google Places Autocomplete** — used in `StepOneForm` for venue selection. API key hardcoded in `src/app/config/api.ts`.
- **iOS:** `NuvoHostingAgency` Xcode project, entitlements file present, Swift AppDelegate.
- **Android:** Standard Expo bare Android project, debug keystore committed.
- No push notifications, deep links, or background tasks implemented.

---

# Storage and Persistence

| Key | Storage | Purpose |
|---|---|---|
| `access_token` | AsyncStorage | JWT access token |
| `refresh_token` | AsyncStorage | JWT refresh token |
| `isLoggedIn` | AsyncStorage | Login flag (`'true'`) |
| `role` | AsyncStorage | User role |
| `user` | AsyncStorage | JSON user object |
| `userData` | AsyncStorage | Separate helper in `storage.ts` (may be unused/duplicate) |

No SecureStorage, SQLite, MMKV, or offline caching beyond AsyncStorage.

---

# Build and Release

EAS Build is configured with three profiles:

| Profile | Distribution | Android |
|---|---|---|
| development | internal (dev client) | — |
| preview | internal | APK |
| production | — | AAB (auto-increment version) |

iOS builds use the default Expo managed certificates. No Fastlane, no manual signing scripts.

---

# CI/CD

None configured. No GitHub Actions workflows or CI pipeline found.

---

# Testing

No test files or testing libraries found. No Jest, no Detox, no Testing Library setup.

---

# Known Issues

1. **Order Summary (step 6) has hardcoded data** — event name "South Indian Style Wedding", date "24 April, 2023", venue "Lock Stock & Barrel, Dubai", billing rows with static prices. These do not reflect the actual booking being created.
2. **Payment is UI-only** — no payment gateway integration. Selecting a payment method and tapping the footer CTA calls `createEvent` directly without any payment transaction.
3. **Billing amounts are static** — `baseAmount` is hardcoded as `75000`. No API call to `master/payment/config/` to fetch real pricing.
4. **After refresh token failure**, the app clears storage but does not redirect to Login.
5. **`storage.ts` `userData` key** is separate from the auth `user` key — potential confusion and data duplication.
6. **`HomeTabParamList` defines `MyEvents`** tab that is never registered in the navigator.
7. **Google Maps API key is committed** to source code — security risk.
8. **`DEFAULT_DURATION_HOURS` is declared twice** in `BookEventFlowScreen.tsx` (lines 127 and 320) — the file-scoped constant is shadowed by the one inside the component.

---

# Technical Debt

- `BookEventFlowScreen.tsx` is a 1600-line monolith. Steps 0–8 are all rendered inside a single component with all state co-located. Should be split into individual step components.
- Commented-out `handleConfirm` implementation still in source (lines 374–419 of BookEventFlowScreen).
- Old API base URL commented out in `api.ts` — should be removed once confirmed stable.
- `modalsService.ts` changed endpoint from `USERS.GET_MODALS_LIST` to `MASTER.CREW` — the old endpoint is still defined in `url.ts` and may be removed.
- No TypeScript strict mode; many `any` types throughout slices and service files.
- `HomeWrapper.tsx` uses `useSelector` with `(state: any)` cast instead of typed `useAppSelector`.

---

# Unfinished Features

## Real Payment Integration

**Status:** Partially Implemented

**Purpose:** Collect payment from client before event confirmation.

**Current Implementation:** Payment method is selected via radio buttons (Paytm, PhonePe, GPay, Cards, Cash). Tapping the footer CTA on step 7 calls `createEvent` directly. No gateway SDK integrated.

**Missing Pieces:** Actual payment gateway SDK (Razorpay is common for India), order creation API call, payment success/failure handling, `master/payment/config/` endpoint consumption for dynamic pricing.

**Files Involved:** `BookEventFlowScreen.tsx` (step 7 and `handleCreateEvent`)

## Order Summary with Real Data

**Status:** Partially Implemented

**Purpose:** Show a summary of the event being booked with real details.

**Current Implementation:** Step 6 renders hardcoded event name, date, venue, and pricing rows.

**Missing Pieces:** Bind `eventAbout`, `startDate`, `venueDetails`, `selectedThemeId`, dynamic pricing from API.

**Files Involved:** `BookEventFlowScreen.tsx` step 6 block

## Employee Home Screen

**Status:** Unknown / Likely Thin

**Purpose:** Dashboard for staff/makeup artists.

**Files Involved:** `src/screens/EmployeeScreen/EhomeScreen.tsx`

## Subscription / Upgrade Plan

**Status:** Placeholder

**Purpose:** Locked packages prompt "Subscribe" — the navigation to a subscription screen is commented out with `// navigation.navigate('Subscription')`.

**Missing Pieces:** Subscription screen, plan upgrade API, payment flow for subscriptions.

**Files Involved:** `BookEventFlowScreen.tsx` package info modal

---

# Current Sprint / Active Work

Based on git status (branch: `main`):

- `app.json` — modified (likely name/logo update per recent commit "updated the name and logo")
- `src/app/config/api.ts` — modified (API base URL switch)
- `src/constants/url.ts` — modified (endpoint changes)
- `src/screens/Home/BookEventFlow/BookEventFlowScreen.tsx` — modified (active development)
- `src/screens/Home/ExploreScreen.tsx` — modified
- `src/screens/Home/HomeScreen.tsx` — modified
- `src/services/api/modalsService.ts` — modified (endpoint switch from user modals to master crew)
- `src/services/api/validateCoupon.ts` — **new untracked file** (coupon validation service just added)

---

# Pending Tasks

- Wire Order Summary (step 6) to real booking data
- Integrate actual payment gateway (Razorpay recommended for India)
- Consume `master/payment/config/` for dynamic pricing
- Implement post-auth-failure navigation to Login
- Build out Employee Home Screen
- Implement Subscription/Upgrade screen
- Remove Google Maps API key from source; use environment variable or EAS secrets
- Split `BookEventFlowScreen.tsx` into per-step components
- Add TypeScript strict mode and fix `any` types

---

# Debugging Notes

- API responses are fully logged in DEV mode via the Axios interceptor — check Metro console for `📦 API LOG:` output to trace request/response cycles.
- `HomeWrapper` logs `HOME WRAPPER ROLE:` on every render — useful for confirming role routing.
- `HomeScreen` logs `USER API RESPONSE:` — note the double-nested check `userRes?.data?.data` (the API wraps data twice).
- `modalsService` switched from `USERS.GET_MODALS_LIST` to `MASTER.CREW` — if the crew list is empty/wrong, check this endpoint.

---

# Architectural Decisions

- **OTP-only auth** — no password-based login. Email → OTP → JWT tokens.
- **Two-step user hydration on startup** — load from AsyncStorage first (instant UI), then refresh from API (latest data). This prevents a blank screen on cold start.
- **Role-based tab navigator swap** — `HomeWrapper` selects between client and employee tab navigators rather than using conditional tab screens. Clean but means any shared screen (e.g. ProfileScreen) must be registered in both navigators.
- **Redux for remote data** — themes, uniforms, crew (modals) are stored in Redux after API fetch. No normalization library.
- **`react-native-size-matters`** used throughout for responsive scaling (`scale`, `verticalScale`, `moderateScale`).

---

# Dependencies

- **AWS API Gateway** (ap-south-1) — all backend requests
- **Google Maps / Places API** — venue autocomplete in booking flow
- **Expo EAS** — build and distribution infrastructure

---

# Risks

1. **Hardcoded Google Maps API key** — key is committed to source and is restricted only at the API console level. A git leak would expose it.
2. **No payment gateway** — app cannot collect real money. Booking is created without payment verification.
3. **No auth redirect on session expiry** — users may reach broken states after token refresh failure.
4. **Single-environment API URL** — switching between staging/production requires code change. No `.env` setup.
5. **No tests** — regressions in core booking flow have no automated safety net.

---

# Future Improvements

- Move API URLs and secrets to EAS environment variables / `.env`
- Integrate Razorpay or similar for actual payment processing
- Add React Navigation deep link support for OTP email links
- Set up Jest + React Native Testing Library
- Add ESLint + Prettier configuration
- Split `BookEventFlowScreen.tsx` into step-specific components
- Add CodePush or EAS Update for OTA updates
- Implement push notifications for booking confirmations (staff assignment alerts)

---

# Change Log

| Date | Summary |
|---|---|
| 2026-06-13 | Initial CLAUDE.md created from codebase audit. Identified hardcoded payment, Order Summary placeholder data, missing auth redirect, API endpoint migration in modalsService, and new validateCoupon service file. |
| 2026-06-13 | Implemented background location tracking for staff. Added expo-location + expo-task-manager. Task fires every 5 min, POSTs to nuvo-c-backend.onrender.com. Starts/stops with online toggle. Android: foreground service (survives app kill). iOS: best-effort background. |
