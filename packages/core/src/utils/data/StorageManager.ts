/**
 * Storage manager for persisting Webgazer data using LocalForage
 * Provides type-safe wrapper around browser storage
 */

import localforage from 'localforage';
import type { IStorageProvider } from '../../core/types';

/**
 * StorageManager - Handles persistent storage of calibration data and settings
 * Uses IndexedDB, WebSQL, or localStorage as fallback
 */
export class StorageManager implements IStorageProvider {
  private readonly storageInstance: LocalForage;
  private availabilityCheck: Promise<boolean> | null = null;

  /**
   * Create a new StorageManager
   * @param storeName - Name of the storage instance (for namespacing)
   */
  constructor(storeName: string = 'webgazer') {
    this.storageInstance = localforage.createInstance({
      name: storeName,
      driver: [
        localforage.INDEXEDDB,
        localforage.WEBSQL,
        localforage.LOCALSTORAGE
      ],
      description: 'Webgazer calibration and settings storage'
    });
  }

  /**
   * Save data to storage
   * @param key - Storage key
   * @param value - Data to store (will be serialized)
   * @throws Error if storage fails
   */
  async save<T>(key: string, value: T): Promise<void> {
    try {
      await this.storageInstance.setItem(key, value);
    } catch (error) {
      throw new Error(
        `Failed to save data for key '${key}': ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Load data from storage
   * @param key - Storage key
   * @returns Stored data or null if not found
   * @throws Error if retrieval fails
   */
  async load<T>(key: string): Promise<T | null> {
    try {
      const value = await this.storageInstance.getItem<T>(key);
      return value;
    } catch (error) {
      throw new Error(
        `Failed to load data for key '${key}': ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Check if a key exists in storage
   * @param key - Storage key
   * @returns True if key exists, false otherwise
   */
  async exists(key: string): Promise<boolean> {
    try {
      const value = await this.storageInstance.getItem(key);
      return value !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Remove a specific key from storage
   * @param key - Storage key to remove
   * @throws Error if removal fails
   */
  async remove(key: string): Promise<void> {
    try {
      await this.storageInstance.removeItem(key);
    } catch (error) {
      throw new Error(
        `Failed to remove key '${key}': ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Clear all data from storage
   * @throws Error if clearing fails
   */
  async clear(): Promise<void> {
    try {
      await this.storageInstance.clear();
    } catch (error) {
      throw new Error(
        `Failed to clear storage: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get all keys in storage
   * @returns Array of storage keys
   */
  async keys(): Promise<string[]> {
    try {
      return await this.storageInstance.keys();
    } catch (error) {
      throw new Error(
        `Failed to retrieve storage keys: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get the number of items in storage
   * @returns Number of stored items
   */
  async length(): Promise<number> {
    try {
      return await this.storageInstance.length();
    } catch (error) {
      throw new Error(
        `Failed to get storage length: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Iterate over all key-value pairs
   * @param iterator - Function called for each key-value pair
   */
  async iterate<T>(
    iterator: (value: T, key: string, iterationNumber: number) => void
  ): Promise<void> {
    try {
      await this.storageInstance.iterate<T, void>(iterator);
    } catch (error) {
      throw new Error(
        `Failed to iterate storage: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get the current storage driver name
   * @returns Driver name (e.g., 'asyncStorage', 'localStorageWrapper')
   */
  driverName(): string {
    return this.storageInstance.driver();
  }

  /**
   * Check whether a usable storage backend is available in the current runtime.
   * In jsdom/SSR this can legitimately be unavailable, and callers can use this
   * to skip persistence without treating it as a runtime failure.
   */
  async isAvailable(): Promise<boolean> {
    if (!this.availabilityCheck) {
      this.availabilityCheck = this.storageInstance.ready()
        .then(() => true)
        .catch(() => false);
    }

    return this.availabilityCheck;
  }
}

export default StorageManager;
