/**
 * Mouse Event Handler
 * Captures and processes mouse click and move events
 */

import type { MouseEventHandlerConfig, MouseEventData } from './types';
import type { Point2D } from '../types/geometry';

/**
 * MouseEventHandler class
 * Manages mouse event capture with throttling and filtering
 */
export class MouseEventHandler {
  private config: MouseEventHandlerConfig;
  private clickListeners: Array<(data: MouseEventData) => void> = [];
  private moveListeners: Array<(data: MouseEventData) => void> = [];
  private isActive: boolean = false;
  private lastMoveTime: number = 0;
  private boundClickHandler: ((event: MouseEvent) => void) | null = null;
  private boundMoveHandler: ((event: MouseEvent) => void) | null = null;

  /**
   * Create a new MouseEventHandler
   * @param config - Mouse event handler configuration
   */
  constructor(config: MouseEventHandlerConfig) {
    this.config = { ...config };
  }

  /**
   * Start capturing mouse events
   */
  public start(): void {
    if (this.isActive) {
      return;
    }

    this.boundClickHandler = this.handleClick.bind(this);
    this.boundMoveHandler = this.handleMove.bind(this);

    if (this.config.captureClicks) {
      document.addEventListener('click', this.boundClickHandler, true);
    }

    if (this.config.captureMoves) {
      document.addEventListener('mousemove', this.boundMoveHandler, true);
    }

    this.isActive = true;
  }

  /**
   * Stop capturing mouse events
   */
  public stop(): void {
    if (!this.isActive) {
      return;
    }

    if (this.boundClickHandler) {
      document.removeEventListener('click', this.boundClickHandler, true);
      this.boundClickHandler = null;
    }

    if (this.boundMoveHandler) {
      document.removeEventListener('mousemove', this.boundMoveHandler, true);
      this.boundMoveHandler = null;
    }

    this.isActive = false;
  }

  /**
   * Add click event listener
   * @param listener - Click event listener function
   */
  public addClickListener(listener: (data: MouseEventData) => void): void {
    this.clickListeners.push(listener);
  }

  /**
   * Remove click event listener
   * @param listener - Click event listener function to remove
   */
  public removeClickListener(listener: (data: MouseEventData) => void): void {
    const index = this.clickListeners.indexOf(listener);
    if (index !== -1) {
      this.clickListeners.splice(index, 1);
    }
  }

  /**
   * Add move event listener
   * @param listener - Move event listener function
   */
  public addMoveListener(listener: (data: MouseEventData) => void): void {
    this.moveListeners.push(listener);
  }

  /**
   * Remove move event listener
   * @param listener - Move event listener function to remove
   */
  public removeMoveListener(listener: (data: MouseEventData) => void): void {
    const index = this.moveListeners.indexOf(listener);
    if (index !== -1) {
      this.moveListeners.splice(index, 1);
    }
  }

  /**
   * Clear all listeners
   */
  public clearListeners(): void {
    this.clickListeners = [];
    this.moveListeners = [];
  }

  /**
   * Handle click event
   * @param event - Mouse event
   */
  private handleClick(event: MouseEvent): void {
    // Check if target should be ignored
    if (this.shouldIgnoreTarget(event.target)) {
      return;
    }

    const eventData = this.createEventData(event, 'click');
    this.emitToListeners(this.clickListeners, eventData);
  }

  /**
   * Handle move event with throttling
   * @param event - Mouse event
   */
  private handleMove(event: MouseEvent): void {
    // Throttle move events
    const now = Date.now();
    if (now - this.lastMoveTime < this.config.moveThrottle) {
      return;
    }

    // Check if target should be ignored
    if (this.shouldIgnoreTarget(event.target)) {
      return;
    }

    this.lastMoveTime = now;
    const eventData = this.createEventData(event, 'move');
    this.emitToListeners(this.moveListeners, eventData);
  }

  /**
   * Create event data from mouse event
   * @param event - Mouse event
   * @param eventType - Event type
   * @returns Mouse event data
   */
  private createEventData(
    event: MouseEvent,
    eventType: 'click' | 'move'
  ): MouseEventData {
    const position: Point2D = {
      x: event.clientX,
      y: event.clientY,
    };

    return {
      position,
      timestamp: Date.now(),
      eventType,
      target: event.target,
    };
  }

  /**
   * Check if event target should be ignored
   * @param target - Event target
   * @returns True if target should be ignored
   */
  private shouldIgnoreTarget(target: EventTarget | null): boolean {
    if (!target || !(target instanceof Element)) {
      return false;
    }

    // Check against ignored selectors
    for (const selector of this.config.ignoredSelectors) {
      if (target.matches(selector)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Emit event to listeners
   * @param listeners - Array of listener functions
   * @param data - Event data
   */
  private emitToListeners(
    listeners: Array<(data: MouseEventData) => void>,
    data: MouseEventData
  ): void {
    for (const listener of listeners) {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in mouse event listener:', error);
      }
    }
  }

  /**
   * Get active state
   * @returns True if handler is active
   */
  public isHandlerActive(): boolean {
    return this.isActive;
  }

  /**
   * Update configuration
   * @param config - Partial configuration to update
   */
  public updateConfig(config: Partial<MouseEventHandlerConfig>): void {
    const wasActive = this.isActive;

    if (wasActive) {
      this.stop();
    }

    this.config = { ...this.config, ...config };

    if (wasActive) {
      this.start();
    }
  }

  /**
   * Get current configuration
   * @returns Current configuration
   */
  public getConfig(): MouseEventHandlerConfig {
    return { ...this.config };
  }

  /**
   * Destroy the event handler
   */
  public destroy(): void {
    this.stop();
    this.clearListeners();
  }
}
