import * as Location from 'expo-location';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCATION_TASK_NAME } from '../tasks/locationTask';

export const INTERVAL_MS = 1 * 60 * 1000; // 1 minute

const LOCATION_API_URL =
  'https://nuvo-c-backend.onrender.com/api/location/update';

// ─── Foreground timer ────────────────────────────────────────────────────────
// setInterval gives us exact 1-minute ticks while the JS runtime is alive
// (app in foreground). The background task takes over when the app is killed.

let foregroundTimer: ReturnType<typeof setInterval> | null = null;
let appStateListener: { remove: () => void } | null = null;

const startForegroundTimer = () => {
  if (foregroundTimer) return; // already running

  foregroundTimer = setInterval(async () => {
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      await uploadLocation(
        position.coords.latitude,
        position.coords.longitude,
        new Date(position.timestamp).toISOString(),
      );
    } catch (err) {
      console.log('[Location] interval tick failed:', err);
    }
  }, INTERVAL_MS);

  console.log('[Location] foreground timer started — every', INTERVAL_MS / 1000, 's');
};

const stopForegroundTimer = () => {
  if (foregroundTimer) {
    clearInterval(foregroundTimer);
    foregroundTimer = null;
    console.log('[Location] foreground timer stopped');
  }
};

// Pause the foreground timer while the app is backgrounded (the background
// task takes over), and resume it when the app comes back to foreground.
const attachAppStateListener = () => {
  if (appStateListener) return;

  appStateListener = AppState.addEventListener(
    'change',
    (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        startForegroundTimer();
      } else {
        stopForegroundTimer();
      }
    },
  );
};

const detachAppStateListener = () => {
  if (appStateListener) {
    appStateListener.remove();
    appStateListener = null;
  }
};

// ─── Shared upload ───────────────────────────────────────────────────────────

export const uploadLocation = async (
  lat: number,
  lng: number,
  timestamp: string,
): Promise<void> => {
  // Try the standalone key first; fall back to parsing the full user object.
  let profileId = await AsyncStorage.getItem('profile_id');

  if (!profileId) {
    const userRaw = await AsyncStorage.getItem('user');
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        profileId = user?.profile_id ? String(user.profile_id) : null;
      } catch {
        profileId = null;
      }
    }
  }

  if (!profileId) {
    console.log('[Location] profile_id not found in storage — skipping upload');
    return;
  }

  const token = await AsyncStorage.getItem('access_token');

  const body = { Employee: profileId, lat, lng, timestamp };

  console.log('[Location] uploading →', JSON.stringify(body));

  const res = await fetch(LOCATION_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  console.log('[Location] response:', res.status, text);
};

// ─── Public API ──────────────────────────────────────────────────────────────

export const startLocationTracking = async (): Promise<boolean> => {
  const { status: fgStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (fgStatus !== 'granted') {
    console.log('[Location] foreground permission denied');
    return false;
  }

  const { status: bgStatus } =
    await Location.requestBackgroundPermissionsAsync();
  if (bgStatus !== 'granted') {
    console.log('[Location] background permission denied');
    return false;
  }

  // Immediate upload — visible in Metro right away.
  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    await uploadLocation(
      position.coords.latitude,
      position.coords.longitude,
      new Date(position.timestamp).toISOString(),
    );
  } catch (err) {
    console.log('[Location] immediate upload failed:', err);
  }

  // Start the exact 1-minute foreground timer.
  startForegroundTimer();

  // Listen for app state changes to pause/resume the timer.
  attachAppStateListener();

  // Register the background task (for when app is killed on Android).
  const alreadyRunning =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (!alreadyRunning) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: INTERVAL_MS,
      distanceInterval: 0,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'Nuvo Hosting — Location Active',
        notificationBody: 'Your location is being shared for assigned events.',
        notificationColor: '#5B4C3A',
      },
    });
    console.log('[Location] background task registered');
  }

  return true;
};

export const stopLocationTracking = async (): Promise<void> => {
  stopForegroundTimer();
  detachAppStateListener();

  const isRunning =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isRunning) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }

  console.log('[Location] tracking fully stopped');
};

export const isLocationTracking = async (): Promise<boolean> => {
  return Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
};
