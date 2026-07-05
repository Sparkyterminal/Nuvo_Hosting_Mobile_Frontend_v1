# Project Overview

**Nuvo Hosting Agency** — a React Native mobile application for a premium event hosting agency. The app allows clients to select a Luxury/Premium/Both crew package, curate crews and uniforms, and book events through a multi-step booking flow. Staff and makeup artists have a separate portal to view their upcoming assignments. (Theme browsing/"discovery" was previously a dedicated Explore tab — removed app-wide 2026-07-03; see Change Log.)

The brand identity is "Nuvo Hosting" (previously named "Novo Hosting" — the `novohosting` npm package name reflects the old name). The app serves two distinct user personas with separate tab navigators behind a single login.

---

# Current Status

**Active development. Not production-ready.**

- Core booking flow was reworked 2026-07-03 per a client requirement doc: new Luxury/Premium/Both crew-package model, package-scoped uniform selection (with a Custom Uniform toggle for Luxury), real-data Invoice Summary (no longer hardcoded), and days-until-event-based payment timing. See Known Issues and Change Log for details and open questions.
- Payment integration is still UI-only — selecting Cash or Online Payment does not trigger any real payment gateway. The event is created after "payment" selection without actual payment processing.
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
    │   ├── Home/                # HomeScreen, EventsScreen, ProfileScreen, ThemeDetailsScreen (ExploreScreen removed 2026-07-03)
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
│   │   ├── EventsScreen
│   │   └── ProfileScreen
│   └── EmployeeTabsNavigator (role: STAFF | MAKEUP_ARTIST)
│       ├── EhomeScreen
│       ├── UpcomingEventsScreen
│       └── ProfileScreen (shared)
├── ThemeDetails         (from BookEventFlow's uniform "View" button only — was also reachable from ExploreScreen before it was removed 2026-07-03)
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

1. ~~Order Summary (step 6) has hardcoded data~~ — **Fixed 2026-07-03.** The renamed "Invoice Summary" step (index 4 in the new 7-step flow) now renders real event name, date, venue, and a computed crew-package billing breakdown instead of the old "South Indian Style Wedding" placeholder.
2. **Payment is still UI-only** — no payment gateway integration. Payment methods are now just Cash/Online (down from 5 options); selecting either and tapping the footer CTA calls `createEvent` directly without any real transaction. This is a deliberate, documented simplification (see Change Log 2026-07-03), not an oversight.
3. ~~Billing amounts are static~~ — **Fixed 2026-07-03.** Pricing is now computed from the new Luxury (₹20,000/person)/Premium (₹10,000/person) crew-package model plus extra-hour surcharges, instead of a hardcoded `baseAmount = 75000`. `master/payment/config/` is still not called — the new rates are hardcoded per the client's requirement doc, not fetched dynamically.
4. **After refresh token failure**, the app clears storage but does not redirect to Login.
5. **`storage.ts` `userData` key** is separate from the auth `user` key — potential confusion and data duplication.
6. **`HomeTabParamList` defines `MyEvents`** tab that is never registered in the navigator.
7. **Google Maps API key is committed** to source code — security risk.
8. **`DEFAULT_DURATION_HOURS` is declared twice** in `BookEventFlowScreen.tsx` (lines 59 and 257 as of 2026-07-03 — line numbers shift as the file changes) — the file-scoped constant is shadowed by the one inside the component. Still present, not addressed by the 2026-07-03 booking-flow rework.
9. **GST rate is unspecified** — the Invoice Summary step shows a GST line (when GST details are filled in) as informational text only ("TBD"), excluded from the Grand Total, pending a rate from the client. See `BookEventFlowScreen.tsx` Invoice Summary block.
10. **Payment timing for 8–12 days before an event is unspecified** — the client's requirement doc only defines rules for ≤7 days (full payment only) and >12 days (50% advance or full allowed). The code defaults 8–12 days to the more permissive ">12 days" behavior (`paymentTiming` memo in `BookEventFlowScreen.tsx`) as an assumption pending client confirmation.
11. **New `handleCreateEvent` payload fields are unconfirmed against the backend** — `crew_package`, `luxury_crew_count`, `premium_crew_count`, `total_crew_count`, `pricing`, `payment_method`, `payment_plan`, `message` were added 2026-07-03 based on naming convention guesses; no backend API spec was available to confirm exact expected keys.

---

# Technical Debt

- `BookEventFlowScreen.tsx` is still a ~1500-line monolith (7 steps as of 2026-07-03, down from 9). All steps are still rendered inline inside a single component with all state co-located — the 2026-07-03 rework deliberately kept this pattern (see Change Log) rather than partially extracting just the new step, to avoid inconsistency. Should still be split into individual step components eventually.
- Commented-out `handleConfirm` implementation still in source (around lines 311–356 of `BookEventFlowScreen.tsx` as of 2026-07-03 — shifted after the booking-flow rework, not itself touched).
- Old API base URL commented out in `api.ts` — should be removed once confirmed stable.
- `modalsService.ts` changed endpoint from `USERS.GET_MODALS_LIST` to `MASTER.CREW` — the old endpoint is still defined in `url.ts` and may be removed. **As of 2026-07-03, `modalsService.ts`/`getModalsList()` has zero remaining consumers anywhere in the app** — `BookEventFlowScreen.tsx` stopped using it earlier the same day, and `ExploreScreen.tsx` (its last consumer) was deleted in a follow-up request. `HomeScreen.tsx`'s `fetchData()` no longer calls it either. The file was left in place (not deleted) since deleting service-layer files wasn't explicitly requested — candidate for removal in a follow-up cleanup pass, along with `themeService.ts` (also now unused for the same reason: `getThemes()`/`setThemes` were only ever consumed by the removed theme-selection booking step and `ExploreScreen`).
- No TypeScript strict mode; many `any` types throughout slices and service files.
- `HomeWrapper.tsx` uses `useSelector` with `(state: any)` cast instead of typed `useAppSelector`.
- **`src/components/ModelCard.tsx` is still dead code** (2026-07-03) — its only consumer (the booking flow's individual crew-member picker step) was removed earlier the same day. Remains undeleted after the Explore-screen removal too (its other candidate consumer, `ExploreScreen.tsx`'s `TinderModalViewer`, actually never imported `ModelCard` — it had its own inline rendering, per the original investigation). Candidate for a follow-up cleanup pass.
- **`state.explore.themes` and `state.explore.modals` are now unused Redux state** (2026-07-03) — the `exploreSlice.ts` shape (themes/modals/loading) was left untouched to minimize blast radius, but nothing populates or reads `themes`/`modals` anymore now that `ExploreScreen.tsx` is deleted and `HomeScreen.tsx` no longer fetches them. `state.explore.loading` is still live — it's read by `BookEventFlowScreen.tsx`'s footer button label (`loading ? 'Creating Event...' : footerLabel`), which is itself a pre-existing naming mismatch (that flag reflects the Home screen's initial data fetch, not event-creation submission) — not fixed here, flagged for a future look.
- **"Custom Uniform" is a UI toggle, not a catalog item** (2026-07-03, revised twice same day) — the requirement doc's table lists Custom Uniform as "shown as first option" inside the uniform grid, but per product direction this was implemented instead as a single "Custom Uniform" toggle button (`isLuxuryCustomUniform` in `BookEventFlowScreen.tsx`, tap to switch on/off — there's no separate "Standard Uniforms" button), shown only in the Luxury-crew uniform section (never Premium, per the doc). Toggling to Custom hides the predefined uniform grid and shows an animated "Our team will contact you soon." notice (`CustomUniformNotice`); no predefined uniform needs to be picked in that state, and `luxury_uniform_id` is omitted from the payload in favor of `luxury_uniform_type: 'custom'`. `predefinedUniforms` in `BookEventFlowScreen.tsx` still excludes any uniform whose `category_name` contains "custom" (case-insensitive) from the normal grid, since no backend field distinguishes custom vs. predefined uniforms — a real (non-custom) uniform named with "custom" in it would be mis-filtered out of the grid entirely (with no toggle-based way to select it, since the toggle doesn't reference actual catalog data). The uniform step (index 2) shows two independently-scoped sections per the requirement doc's table when package is "Both": "Uniform for Luxury Crew" (predefined grid + Custom toggle, bound to `selectedLuxuryUniformId`) and "Uniform for Premium Crew" (predefined grid only, bound to `selectedPremiumUniformId`).

---

# Unfinished Features

## Real Payment Integration

**Status:** Partially Implemented

**Purpose:** Collect payment from client before event confirmation.

**Current Implementation (updated 2026-07-03):** Payment method is now just Cash Payment or Online Payment (radio buttons, down from 5 options — Paytm/PhonePe/GPay/Cards were removed per client requirement doc). A new payment-timing rule is enforced: events within 7 days require full payment; events more than 12 days out let the user choose 50% Advance or Full Amount (8–12 days defaults to the more permissive >12-day behavior — undocumented gap, see Known Issues #10). Tapping the footer CTA on the Payment step (index 5) still calls `createEvent` directly for both Cash and Online — no gateway SDK integrated, "Online Payment" is intentionally still UI-only.

**Missing Pieces:** Actual payment gateway SDK (Razorpay is common for India) for the "Online Payment" path, order creation API call, payment success/failure handling, `master/payment/config/` endpoint consumption for dynamic pricing (rates are now hardcoded per the requirement doc: Luxury ₹20,000/person, Premium ₹10,000/person), backend support for the new `payment_plan` (50% advance vs full) concept and its "remaining balance due 7 days before event" reminder (no reminder infra exists client-side).

**Files Involved:** `BookEventFlowScreen.tsx` (Payment step, index 5, and `handleCreateEvent`)

## Invoice Generation

**Status:** UI Shell Only (added 2026-07-03)

**Purpose:** Per client requirement doc — after successful payment, generate an invoice, email it to the customer, and let them view/download it as a PDF in-app.

**Current Implementation:** Success step (index 6) shows "Invoice will be sent to your email" messaging and a "View / Download Invoice" button. The button is an explicit no-op (`alert('Invoice download coming soon')`) since no invoice endpoint exists in `src/constants/url.ts`.

**Missing Pieces:** Backend invoice generation, an invoice-fetch/download endpoint, email delivery, wiring the button to that endpoint once it exists.

**Files Involved:** `BookEventFlowScreen.tsx` Success step block

## Employee Home Screen

**Status:** Unknown / Likely Thin

**Purpose:** Dashboard for staff/makeup artists.

**Files Involved:** `src/screens/EmployeeScreen/EhomeScreen.tsx`

## Subscription / Upgrade Plan

**Status:** Removed from booking flow (2026-07-03), unresolved elsewhere

**Purpose:** Previously, locked packages in the booking flow's "Curate Your Crew" step prompted "Subscribe" — the navigation to a subscription screen was commented out with `// navigation.navigate('Subscription');`.

**Current Implementation:** The entire old 5-tier (Diamond/Platinum/Gold/Silver/Bronze) subscription-locked package step, `PLAN_HIERARCHY`/`PACKAGE_PLAN_MAP` logic, and the "Subscribe" upsell modal were deleted from `BookEventFlowScreen.tsx` as part of the 2026-07-03 booking-flow rework (replaced by the new Luxury/Premium/Both crew-package model, which has no subscription gating). This was scoped as "remove the old package step being replaced," not a full app-wide removal of the subscription concept per the client's broader (out-of-scope for that pass) request to "remove all subscription-related flows."

**Missing Pieces:** The client's requirement doc also asks to remove the Subscription feature app-wide — this was explicitly deferred (see Change Log 2026-07-03) since no Subscription screen is actually registered in `RootNavigator.tsx` today (the navigate call was already commented out) and any remaining subscription-plan references (e.g. `user?.subscription_plan` elsewhere in the app, `ProfileScreen`, etc.) were not audited in this pass.

**Files Involved:** Previously `BookEventFlowScreen.tsx` package info modal (now deleted); any remaining app-wide subscription references are un-audited.

---

# Current Sprint / Active Work

As of 2026-07-03, working locally (uncommitted) on a client requirement-change document ("Requirement & Change Document for Nuvo Hosting", v1.0, June 2026) implementing a booking-flow overhaul:

- `src/screens/Home/BookEventFlow/BookEventFlowScreen.tsx` — reworked: new Luxury/Premium/Both crew-package step replaces the old 5-tier subscription-locked package step and the individual crew-member picker; theme ("Select Your Mood") in-flow selection step removed; uniform selection now filtered by chosen crew package; Invoice Summary (renamed from Order Summary) now shows real computed data instead of hardcoded placeholders; Payment step reduced to Cash/Online with days-until-event-based advance/full payment timing; Success step shows real values plus an invoice UI shell. See Known Issues, Technical Debt, and Unfinished Features for the details and open questions this introduced.
- `src/screens/Home/BookEventFlow/StepOneForm.tsx` — reworked: removed the "Crew Count" field per the requirement doc.
- **The Explore tab was later removed app-wide** (2026-07-03, follow-up request) — see its own Change Log entry below. Remaining explicitly out of scope: removing the Subscription feature app-wide, removing the STAFF role/`EmployeeTabsNavigator`.
- Not yet committed — verify further in a running simulator before merging (this pass was verified via a clean TypeScript check and a successful Metro bundle build only; no simulator/device walkthrough was performed).

Previously landed and merged (background, unrelated to the above): PR #38 "location_implementation" (`da5b9c4`) — background location tracking for staff; `d93d3b2` "updated the name and logo" branding update.

`src/services/api/validateCoupon.ts` is now a tracked file (added 2026-06-13), no longer untracked. No open local changes as of this writing — next work should start from a fresh branch off `nuvo-01`/`main`.

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
| 2026-07-03 | Doc sync: confirmed location-tracking work (PR #38) and branding update merged into `nuvo-01`/`main`; working tree clean, no pending local changes. `validateCoupon.ts` confirmed tracked (no longer a new/untracked file). No code changes this session — audit only. |
| 2026-07-03 | Implemented booking-flow changes from client requirement doc ("Requirement & Change Document for Nuvo Hosting" v1.0). Scoped to `BookEventFlowScreen.tsx`/`StepOneForm.tsx` only (app-wide Explore/Subscription/STAFF removal explicitly deferred). Removed: theme selection step, old 5-tier subscription-locked package step, individual crew-member picker step, "Crew Count" field. Added: Luxury/Premium/Both crew-package step with live pricing (₹20,000/₹10,000 per person, extra-hour surcharge at rate÷8), package-filtered uniform list (custom uniform detected via `category_name` string match — no backend flag exists), optional Message field, real-data Invoice Summary (was hardcoded Order Summary), Cash/Online-only payment with days-until-event-based advance/full payment timing, invoice UI shell on Success step (no-op "coming soon" download button, no backend endpoint exists). `handleCreateEvent` payload gained new fields (`crew_package`, `luxury_crew_count`, `premium_crew_count`, `total_crew_count`, `pricing`, `payment_method`, `payment_plan`, `message`) whose backend-expected names are unconfirmed. Open questions: GST rate unspecified (shown as "TBD", excluded from total), 8–12 day payment-timing gap defaults to permissive behavior. Verified via clean `tsc --noEmit` (2 pre-existing, unrelated errors only) and a successful Metro bundle build containing the new step labels — not yet verified in a running simulator. |
| 2026-07-03 | Follow-up fixes to the booking-flow rework, same session: (1) Added temporary hardcoded "quick pick" venue chips to `StepOneForm.tsx` (`DUMMY_VENUES`) to unblock testing while the Google Places API key's GCP project has billing disabled — clearly marked for removal once billing is enabled. (2) Moved "Working Hours" from the Basic Details step to the Select Crew Package step (now shown alongside the live extra-hour pricing preview it feeds); default changed from 6 to 8 hours to match `STANDARD_SHIFT_HOURS`. (3) Corrected the uniform step: the initial implementation used one merged, package-filtered uniform list for all package types, but the requirement doc's table actually calls for two *independently scoped* selections when "Both" is chosen — a Luxury-crew uniform (custom + all predefined, `selectedLuxuryUniformId`) and a separate Premium-crew uniform (predefined only, `selectedPremiumUniformId`). Renamed the old single `selectedUniformId`/`filteredUniforms` accordingly; payload now sends `luxury_uniform_id`/`premium_uniform_id` instead of a single `uniform_id`. |
| 2026-07-03 | Reworked "Custom Uniform" per product direction: instead of showing it as a selectable grid item (as the requirement doc's table literally depicts), it's now a "Standard Uniforms"/"Custom Uniform" toggle (`isLuxuryCustomUniform`) in the Luxury-crew uniform section only. Toggling to Custom hides the predefined uniform grid and shows an animated (looping opacity) "Our team will contact you soon." notice (`CustomUniformNotice`), and the user can proceed to the next step without picking a predefined uniform. Payload gained `luxury_uniform_type: 'custom' \| 'predefined'`; `luxury_uniform_id` is omitted when custom is chosen. Premium-crew section is unaffected (still predefined-only, no toggle, per the doc). Package-switch handler now also resets uniform selections/toggle state when switching away from Luxury or Premium. Verified via clean `tsc --noEmit` and a forced Metro bundle rebuild confirming the new strings compiled. |
| 2026-07-03 | Simplified the Custom Uniform control to a single toggle button (removed the separate "Standard Uniforms" button per user feedback) — tapping "Custom Uniform" now flips `isLuxuryCustomUniform` on/off directly instead of choosing between two `RadioRow`s. Also fixed a pre-existing bug surfaced while testing this screen: `SelectableCard.tsx` used `{price && (...)}` to conditionally render the price label — when `price` is the number `0` (not `undefined`), `0 && (...)` evaluates to `0`, and React Native tried to render that bare number as a text node outside a `<Text>`, throwing "Text strings must be rendered within a `<Text>` component." Changed to `{!!price && (...)}` so falsy numeric prices render nothing instead of a stray `0`. This bug was pre-existing (not introduced by the booking-flow rework) but only surfaced now because the uniform step is being exercised more thoroughly with real/test catalog data that includes zero-priced items. |
| 2026-07-03 | Added an informational note under the Working Hours field on the Select Crew Package step, shown only when `pricingBreakdown.extraHours > 0` (i.e. working hours entered above the standard 8-hour shift). It states the extra-hour count and the applicable per-person hourly rate(s) — ₹2,500/hr for Luxury, ₹1,250/hr for Premium, or both when package is "Both" — so the price jump visible in the Price Preview below has an explanation right where the user causes it. |
| 2026-07-03 | Two follow-up changes, same session: (1) The Working Hours field (and its extra-hour note) on the Select Crew Package step now only renders after a package is selected (`{selectedCrewPackage && (...)}`), instead of showing unconditionally on step load — matches the Luxury/Premium Crew Count inputs' existing conditional pattern. (2) Removed the Explore tab/screen from the app entirely per user request: deleted `src/screens/Home/ExploreScreen.tsx`, removed its registration from `HomeTabsNavigator.tsx` (import, `Tab.Screen`, tab icon branch, `Explore` entry in `HomeTabParamList`). `HomeScreen.tsx`'s `fetchData()` no longer calls `getThemes()`/`getModalsList()` or dispatches `setThemes`/`setModals`, since that data had no remaining consumer after the screen removal — `setLoading` calls were kept since `BookEventFlowScreen.tsx` still reads `state.explore.loading` for its footer button label. `themeService.ts`, `modalsService.ts`, `exploreSlice.ts`'s `themes`/`modals` fields, and `src/components/ModelCard.tsx` are now fully unused but were left in place (not deleted) — flagged as cleanup candidates, not removed, since deleting service/slice files wasn't explicitly requested. Verified via clean `tsc --noEmit` (same 2 pre-existing, unrelated errors) and a forced Metro bundle rebuild confirming `"ExploreScreen"` no longer appears anywhere in the compiled bundle. |
| 2026-07-03 | Added animation to the booking flow (`BookEventFlowScreen.tsx`), using React Native's `Animated` API (no new dependency): (1) **Progress bar** — the header progress fill (`styles.progressFill`) is now an `Animated.View` driven by a `progressAnim` value, smoothly tweening width (`useNativeDriver: false`, required since width isn't supported by the native driver) instead of snapping instantly on every step change. (2) **Step transitions** — the entire step-content area (all `{step === N && (...)}` blocks) is wrapped in one `Animated.View` bound to `contentOpacity`/`contentTranslateX`; a `useEffect` keyed on `step` resets and re-animates opacity 0→1 and translateX from ±24px→0 on every step change, sliding in from the right when moving forward (Next) and from the left when moving back (Back), determined via a `prevStepRef` comparison. (3) **Success checkmark** — extracted the static checkmark circle on the Success step into a new `SuccessCheckmark` component that spring-animates its scale from 0→1 on mount (`Animated.spring`), giving the final confirmation a "pop in" moment; since it's only rendered inside `{step === 6 && (...)}`, it naturally re-mounts (and re-triggers the animation) each time the user reaches Success. Verified via clean `tsc --noEmit` and a forced Metro bundle rebuild confirming the new animation code compiled (`SuccessCheckmark`/`contentOpacity`/`progressAnim` all present in the bundle) — not yet visually verified in a running simulator. |
