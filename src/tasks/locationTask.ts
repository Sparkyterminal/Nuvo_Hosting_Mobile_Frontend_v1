import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { uploadLocation } from '../services/locationService';

export const LOCATION_TASK_NAME = 'nuvo-background-location';

// defineTask must be called at module scope before the React tree mounts.
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.log('[LocationTask] error:', error.message);
    return;
  }

  if (!data) {
    console.log('[LocationTask] no data received');
    return;
  }

  const { locations } = data as { locations: Location.LocationObject[] };
  const location = locations?.[0];
  if (!location) {
    console.log('[LocationTask] empty locations array');
    return;
  }

  console.log('[LocationTask] tick — lat:', location.coords.latitude, 'lng:', location.coords.longitude);

  try {
    await uploadLocation(
      location.coords.latitude,
      location.coords.longitude,
      new Date(location.timestamp).toISOString(),
    );
  } catch (err) {
    console.log('[LocationTask] upload failed:', err);
  }
});
