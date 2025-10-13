/**
 * Event Manager
 * Central coordination of all WebGazer events
 */

import type {
  EventManagerConfig,
  EventType,
  EventListener,
  WebGazerEventData,
} from './types';

/**
 * EventManager class
 * Manages event listeners and dispatching for all WebGazer events
 */
export class EventManager {
  private config: EventManagerConfig;
  private listeners: Map<string, Set<EventListener>> = new Map();

  /**
   * Create a new EventManager
   * @param config - Event manager configuration
   */
  constructor(config: EventManagerConfig) {
    this.config = { ...config };
  }

  /**
   * Add event listener
   * @param eventType - Type of event to listen for
   * @param listener - Listener function
   */
  public addEventListener(
    eventType: EventType | string,
    listener: EventListener
  ): void {
    const eventKey = String(eventType);

    if (!this.listeners.has(eventKey)) {
      this.listeners.set(eventKey, new Set());
    }

    const listenersSet = this.listeners.get(eventKey);
    if (listenersSet) {
      listenersSet.add(listener);
    }
  }

  /**
   * Remove event listener
   * @param eventType - Type of event
   * @param listener - Listener function to remove
   */
  public removeEventListener(
    eventType: EventType | string,
    listener: EventListener
  ): void {
    const eventKey = String(eventType);
    const listenersSet = this.listeners.get(eventKey);

    if (listenersSet) {
      listenersSet.delete(listener);

      // Clean up empty sets
      if (listenersSet.size === 0) {
        this.listeners.delete(eventKey);
      }
    }
  }

  /**
   * Remove all listeners for an event type
   * @param eventType - Type of event (optional, clears all if not provided)
   */
  public removeAllListeners(eventType?: EventType | string): void {
    if (eventType !== undefined) {
      const eventKey = String(eventType);
      this.listeners.delete(eventKey);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Emit event to all registered listeners
   * @param eventType - Type of event
   * @param data - Event data
   */
  public emit(
    eventType: EventType | string,
    data: WebGazerEventData
  ): void {
    const eventKey = String(eventType);
    const listenersSet = this.listeners.get(eventKey);

    if (!listenersSet || listenersSet.size === 0) {
      return;
    }

    // Convert set to array to avoid issues if listeners modify the set
    const listenerArray = Array.from(listenersSet);

    for (const listener of listenerArray) {
      try {
        listener(data);
      } catch (error) {
        console.error(
          `Error in event listener for ${eventKey}:`,
          error
        );
      }
    }
  }

  /**
   * Check if event has listeners
   * @param eventType - Type of event
   * @returns True if event has listeners
   */
  public hasListeners(eventType: EventType | string): boolean {
    const eventKey = String(eventType);
    const listenersSet = this.listeners.get(eventKey);
    return listenersSet !== undefined && listenersSet.size > 0;
  }

  /**
   * Get listener count for an event
   * @param eventType - Type of event
   * @returns Number of listeners
   */
  public getListenerCount(eventType: EventType | string): number {
    const eventKey = String(eventType);
    const listenersSet = this.listeners.get(eventKey);
    return listenersSet ? listenersSet.size : 0;
  }

  /**
   * Get all registered event types
   * @returns Array of event type keys
   */
  public getEventTypes(): string[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Update configuration
   * @param config - Partial configuration to update
   */
  public updateConfig(config: Partial<EventManagerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   * @returns Current configuration
   */
  public getConfig(): EventManagerConfig {
    return { ...this.config };
  }

  /**
   * Get total listener count across all events
   * @returns Total number of listeners
   */
  public getTotalListenerCount(): number {
    let total = 0;
    for (const listenersSet of this.listeners.values()) {
      total += listenersSet.size;
    }
    return total;
  }

  /**
   * Destroy the event manager
   */
  public destroy(): void {
    this.removeAllListeners();
  }
}
