/**
 * Calibration Manager
 * Coordinates the calibration workflow for gaze prediction
 */

import type {
  CalibrationConfiguration,
  CalibrationPointConfig,
  CalibrationPointData,
  CalibrationResult,
  CalibrationProgress,
  CalibrationCallback,
  CalibrationEventData,
} from './types';
import { CalibrationState, CalibrationEventType } from './types';
import type { Point2D } from '../types/geometry';
import type { EyeFeatures } from '../types/prediction';
import type { IRegressor } from '../core/types';
import { DOMManager } from '../utils/browser/DOMManager';

/**
 * CalibrationManager class
 * Manages calibration point display and data collection
 */
export class CalibrationManager {
  private config: CalibrationConfiguration;
  private state: CalibrationState = CalibrationState.NotStarted;
  private points: CalibrationPointConfig[] = [];
  private collectedData: CalibrationPointData[] = [];
  private currentPointIndex: number = 0;
  private pointElement: HTMLDivElement | null = null;
  private containerElement: HTMLDivElement | null = null;
  private callbacks: CalibrationCallback[] = [];
  private pointStartTime: number = 0;
  private dataCollectionInterval: number | null = null;

  /**
   * Create a new CalibrationManager
   * @param config - Calibration configuration
   */
  constructor(config: CalibrationConfiguration) {
    this.config = { ...config };
  }

  /**
   * Start calibration process
   * @returns Promise that resolves when calibration starts
   */
  public async start(): Promise<void> {
    if (this.state === CalibrationState.InProgress) {
      console.warn('Calibration already in progress');
      return;
    }

    this.state = CalibrationState.InProgress;
    this.currentPointIndex = 0;
    this.collectedData = [];

    // Generate calibration points
    this.generateCalibrationPoints();

    // Create calibration UI
    this.createCalibrationUI();

    // Emit started event
    this.emitEvent({
      type: CalibrationEventType.Started,
      progress: this.getProgress(),
    });

    // Show first point
    await this.showNextPoint();
  }

  /**
   * Cancel calibration
   */
  public cancel(): void {
    this.cleanup();
    this.state = CalibrationState.NotStarted;
    this.emitEvent({
      type: CalibrationEventType.Cancelled,
    });
  }

  /**
   * Complete calibration and apply collected data
   * @param regressors - Regressors to apply calibration data to
   * @returns Calibration result
   */
  public complete(regressors: IRegressor[]): CalibrationResult {
    if (this.state !== CalibrationState.InProgress) {
      return {
        success: false,
        pointsCollected: this.collectedData.length,
        message: 'Calibration not in progress',
      };
    }

    // Apply calibration data to regressors
    let appliedDataPoints = 0;
    
    for (const dataPoint of this.collectedData) {
      // Convert Point2D to [number, number] tuple for regressor
      const screenPosition: [number, number] = [
        dataPoint.screenPosition.x,
        dataPoint.screenPosition.y
      ];

      // Add data to all regressors
      for (const regressor of regressors) {
        try {
          regressor.addData(
            dataPoint.eyeFeatures,
            screenPosition,
            'click' // Calibration data is treated as click events
          );
        } catch (error) {
          console.error('Failed to add calibration data to regressor:', error);
        }
      }
      
      appliedDataPoints++;
    }

    const result: CalibrationResult = {
      success: appliedDataPoints > 0,
      pointsCollected: this.collectedData.length,
      message: appliedDataPoints > 0
        ? `Calibration completed with ${appliedDataPoints} data points applied to ${regressors.length} regressor(s)`
        : 'Calibration completed but no data points were collected',
    };

    this.cleanup();
    this.state = CalibrationState.Completed;

    this.emitEvent({
      type: CalibrationEventType.Completed,
      result,
    });

    return result;
  }

  /**
   * Record calibration data point
   * @param screenPosition - Screen position
   * @param eyeFeatures - Eye features (with left/right patches)
   */
  public recordDataPoint(screenPosition: Point2D, eyeFeatures: EyeFeatures): void {
    if (this.state !== CalibrationState.InProgress) {
      return;
    }

    const dataPoint: CalibrationPointData = {
      screenPosition,
      eyeFeatures,
      timestamp: Date.now(),
    };

    this.collectedData.push(dataPoint);
  }

  /**
   * Start data collection for current point
   * @param getEyeFeatures - Function to get current eye features (with left/right patches)
   */
  public startDataCollection(getEyeFeatures: () => EyeFeatures | null): void {
    if (this.state !== CalibrationState.InProgress || this.currentPointIndex >= this.points.length) {
      return;
    }

    const currentPoint = this.points[this.currentPointIndex];
    this.pointStartTime = Date.now();

    // Collect data at intervals
    this.dataCollectionInterval = window.setInterval(() => {
      const eyeFeatures = getEyeFeatures();
      if (eyeFeatures) {
        this.recordDataPoint(
          { x: currentPoint.x, y: currentPoint.y },
          eyeFeatures
        );
      }

      // Check if point duration elapsed
      const elapsed = Date.now() - this.pointStartTime;
      if (elapsed >= currentPoint.duration) {
        this.completeCurrentPoint();
      }
    }, 100); // Collect every 100ms
  }

  /**
   * Complete current calibration point
   */
  private async completeCurrentPoint(): Promise<void> {
    if (this.dataCollectionInterval !== null) {
      clearInterval(this.dataCollectionInterval);
      this.dataCollectionInterval = null;
    }

    this.emitEvent({
      type: CalibrationEventType.PointCompleted,
      progress: this.getProgress(),
    });

    this.currentPointIndex++;

    if (this.currentPointIndex < this.points.length) {
      // Show next point after a brief delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      await this.showNextPoint();
    } else {
      // All points completed - but don't auto-complete, wait for explicit complete() call
      this.hidePointElement();
    }
  }

  /**
   * Show next calibration point
   */
  private async showNextPoint(): Promise<void> {
    if (this.currentPointIndex >= this.points.length) {
      return;
    }

    const point = this.points[this.currentPointIndex];

    if (!this.pointElement) {
      return;
    }

    // Position point element
    DOMManager.applyStyles(this.pointElement, {
      left: `${point.x}px`,
      top: `${point.y}px`,
      display: 'block',
    });

    this.emitEvent({
      type: CalibrationEventType.PointStarted,
      progress: this.getProgress(),
    });

    // If not requiring click, auto-start data collection
    if (!point.clickRequired && !this.config.requireClick) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Note: startDataCollection should be called externally with eye feature getter
    }
  }

  /**
   * Hide point element
   */
  private hidePointElement(): void {
    if (this.pointElement) {
      DOMManager.setVisible(this.pointElement, false);
    }
  }

  /**
   * Generate calibration points based on configuration
   */
  private generateCalibrationPoints(): void {
    this.points = [];

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const margin = 100; // pixels from edge

    // Standard calibration patterns based on point count
    if (this.config.pointCount === 5) {
      // 5-point pattern: corners + center
      const positions: Point2D[] = [
        { x: margin, y: margin }, // Top-left
        { x: screenWidth - margin, y: margin }, // Top-right
        { x: screenWidth / 2, y: screenHeight / 2 }, // Center
        { x: margin, y: screenHeight - margin }, // Bottom-left
        { x: screenWidth - margin, y: screenHeight - margin }, // Bottom-right
      ];
      this.points = positions.map((pos) => this.createPointConfig(pos));
    } else if (this.config.pointCount === 9) {
      // 9-point grid
      const cols = 3;
      const rows = 3;
      const stepX = (screenWidth - 2 * margin) / (cols - 1);
      const stepY = (screenHeight - 2 * margin) / (rows - 1);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = margin + col * stepX;
          const y = margin + row * stepY;
          this.points.push(this.createPointConfig({ x, y }));
        }
      }
    } else {
      // Custom point count - distribute evenly
      const cols = Math.ceil(Math.sqrt(this.config.pointCount));
      const rows = Math.ceil(this.config.pointCount / cols);
      const stepX = cols > 1 ? (screenWidth - 2 * margin) / (cols - 1) : 0;
      const stepY = rows > 1 ? (screenHeight - 2 * margin) / (rows - 1) : 0;

      for (let i = 0; i < this.config.pointCount; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = margin + col * stepX;
        const y = margin + row * stepY;
        this.points.push(this.createPointConfig({ x, y }));
      }
    }
  }

  /**
   * Create point configuration
   * @param position - Point position
   * @returns Point configuration
   */
  private createPointConfig(position: Point2D): CalibrationPointConfig {
    return {
      x: position.x,
      y: position.y,
      duration: this.config.pointDuration,
      clickRequired: this.config.requireClick,
    };
  }

  /**
   * Create calibration UI elements
   */
  private createCalibrationUI(): void {
    // Create container
    this.containerElement = DOMManager.createElement('div', {
      id: 'webgazer-calibration-container',
      styles: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: '999998',
        pointerEvents: 'auto',
      },
    });

    // Create calibration point
    this.pointElement = DOMManager.createElement('div', {
      id: 'webgazer-calibration-point',
      styles: {
        position: 'fixed',
        width: `${this.config.pointSize}px`,
        height: `${this.config.pointSize}px`,
        backgroundColor: this.config.pointColor,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        cursor: this.config.requireClick ? 'pointer' : 'default',
        zIndex: '999999',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        display: 'none',
      },
    });

    // Add click handler if required
    if (this.config.requireClick) {
      this.pointElement.addEventListener('click', () => {
        this.completeCurrentPoint();
      });
    }

    DOMManager.appendToBody(this.containerElement);
    DOMManager.appendToBody(this.pointElement);
  }

  /**
   * Get current calibration progress
   * @returns Calibration progress
   */
  public getProgress(): CalibrationProgress {
    return {
      currentPoint: this.currentPointIndex,
      totalPoints: this.points.length,
      percentage: this.points.length > 0 
        ? (this.currentPointIndex / this.points.length) * 100
        : 0,
      state: this.state,
    };
  }

  /**
   * Get current state
   * @returns Current calibration state
   */
  public getState(): CalibrationState {
    return this.state;
  }

  /**
   * Get collected calibration data
   * @returns Array of collected calibration data points
   */
  public getCollectedData(): CalibrationPointData[] {
    return [...this.collectedData];
  }

  /**
   * Add calibration event listener
   * @param callback - Callback function
   */
  public addEventListener(callback: CalibrationCallback): void {
    this.callbacks.push(callback);
  }

  /**
   * Remove calibration event listener
   * @param callback - Callback function to remove
   */
  public removeEventListener(callback: CalibrationCallback): void {
    const index = this.callbacks.indexOf(callback);
    if (index !== -1) {
      this.callbacks.splice(index, 1);
    }
  }

  /**
   * Emit calibration event
   * @param data - Event data
   */
  private emitEvent(data: CalibrationEventData): void {
    for (const callback of this.callbacks) {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in calibration callback:', error);
      }
    }
  }

  /**
   * Cleanup calibration UI and state
   */
  private cleanup(): void {
    if (this.dataCollectionInterval !== null) {
      clearInterval(this.dataCollectionInterval);
      this.dataCollectionInterval = null;
    }

    if (this.containerElement && this.containerElement.parentNode) {
      DOMManager.removeElement(this.containerElement);
    }

    if (this.pointElement && this.pointElement.parentNode) {
      DOMManager.removeElement(this.pointElement);
    }

    this.containerElement = null;
    this.pointElement = null;
  }

  /**
   * Update configuration
   * @param config - Partial configuration to update
   */
  public updateConfig(config: Partial<CalibrationConfiguration>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Destroy calibration manager
   */
  public destroy(): void {
    this.cancel();
    this.callbacks = [];
    this.collectedData = [];
    this.points = [];
  }
}
