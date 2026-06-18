import { registerRootComponent } from 'expo';

// Must be imported before registerRootComponent so expo-task-manager
// registers the background location task before the React tree mounts.
import './src/tasks/locationTask';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
