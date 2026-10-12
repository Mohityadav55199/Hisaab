/**
 * API Service Layer
 * Configured for 100% Offline-First local storage using AsyncStorage
 * All operations run on-device with zero network latency and no server dependency.
 */
export * from './storage';
import * as storage from './storage';
export default storage;
