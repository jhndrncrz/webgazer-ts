/**
 * Kalman Filter implementation for smoothing gaze predictions
 * Reduces jitter and noise in eye tracking data
 */

import type { IKalmanFilter, KalmanFilterConfig } from './types';

/**
 * Kalman Filter state for 2D point tracking
 */
export interface KalmanFilterState {
  /** Current estimate */
  estimate: [number, number];
  
  /** Error covariance */
  errorCovariance: number;
  
  /** Process noise */
  processNoise: number;
  
  /** Measurement noise */
  measurementNoise: number;
}

/**
 * KalmanFilter - Implements 1D Kalman filter for each coordinate
 * Provides optimal estimation of gaze point by combining predictions and measurements
 */
export class KalmanFilter implements IKalmanFilter {
  private xState: SingleDimensionKalmanFilter;
  private yState: SingleDimensionKalmanFilter;

  /**
   * Create a new Kalman Filter for 2D point tracking
   * @param config - Configuration options
   */
  constructor(config: KalmanFilterConfig = {}) {
    const {
      processNoise = 1,
      measurementNoise = 25,
      errorCovariance = 100
    } = config;

    this.xState = new SingleDimensionKalmanFilter(
      processNoise,
      measurementNoise,
      errorCovariance
    );
    
    this.yState = new SingleDimensionKalmanFilter(
      processNoise,
      measurementNoise,
      errorCovariance
    );
  }

  /**
   * Update filter with new measurement
   * @param measurement - Measured 2D point [x, y]
   * @returns Filtered estimate [x, y]
   */
  update(measurement: [number, number]): [number, number] {
    const filteredX = this.xState.update(measurement[0]);
    const filteredY = this.yState.update(measurement[1]);
    
    return [filteredX, filteredY];
  }

  /**
   * Reset filter state to initial conditions
   * @param config - Optional new configuration
   */
  reset(config?: KalmanFilterConfig): void {
    const {
      processNoise = 1,
      measurementNoise = 25,
      errorCovariance = 100
    } = config || {};

    this.xState = new SingleDimensionKalmanFilter(
      processNoise,
      measurementNoise,
      errorCovariance
    );
    
    this.yState = new SingleDimensionKalmanFilter(
      processNoise,
      measurementNoise,
      errorCovariance
    );
  }

  /**
   * Get current filter state
   * @returns Current state of both x and y filters
   */
  getState(): {
    x: { estimate: number; errorCovariance: number };
    y: { estimate: number; errorCovariance: number };
  } {
    return {
      x: {
        estimate: this.xState.getCurrentEstimate(),
        errorCovariance: this.xState.getErrorCovariance()
      },
      y: {
        estimate: this.yState.getCurrentEstimate(),
        errorCovariance: this.yState.getErrorCovariance()
      }
    };
  }
  
  /**
   * Check if filter is initialized
   */
  isInitialized(): boolean {
    return this.xState['isInitialized'] && this.yState['isInitialized'];
  }
}

/**
 * Single dimension Kalman filter implementation
 * Tracks a single scalar value over time
 */
class SingleDimensionKalmanFilter {
  private estimate: number;
  private errorCovariance: number;
  private readonly processNoise: number;
  private readonly measurementNoise: number;
  private isInitialized: boolean;

  /**
   * Create a new 1D Kalman filter
   * @param processNoise - Process noise covariance Q
   * @param measurementNoise - Measurement noise covariance R
   * @param initialErrorCovariance - Initial error covariance P
   */
  constructor(
    processNoise: number,
    measurementNoise: number,
    initialErrorCovariance: number
  ) {
    this.estimate = 0;
    this.errorCovariance = initialErrorCovariance;
    this.processNoise = processNoise;
    this.measurementNoise = measurementNoise;
    this.isInitialized = false;
  }

  /**
   * Update filter with new measurement
   * @param measurement - New measured value
   * @returns Filtered estimate
   */
  update(measurement: number): number {
    // Initialize on first measurement
    if (!this.isInitialized) {
      this.estimate = measurement;
      this.isInitialized = true;
      return this.estimate;
    }

    // Prediction step
    // Predicted state estimate: x̂(k|k-1) = x̂(k-1|k-1)
    // (Assuming constant state, no control input)
    const predictedEstimate = this.estimate;
    
    // Predicted error covariance: P(k|k-1) = P(k-1|k-1) + Q
    const predictedErrorCovariance = this.errorCovariance + this.processNoise;

    // Update step
    // Innovation (measurement residual): y(k) = z(k) - x̂(k|k-1)
    const innovation = measurement - predictedEstimate;
    
    // Innovation covariance: S(k) = P(k|k-1) + R
    const innovationCovariance = predictedErrorCovariance + this.measurementNoise;
    
    // Kalman gain: K(k) = P(k|k-1) / S(k)
    const kalmanGain = predictedErrorCovariance / innovationCovariance;
    
    // Updated state estimate: x̂(k|k) = x̂(k|k-1) + K(k) * y(k)
    this.estimate = predictedEstimate + kalmanGain * innovation;
    
    // Updated error covariance: P(k|k) = (1 - K(k)) * P(k|k-1)
    this.errorCovariance = (1 - kalmanGain) * predictedErrorCovariance;
    
    return this.estimate;
  }

  /**
   * Get current estimate
   */
  getCurrentEstimate(): number {
    return this.estimate;
  }

  /**
   * Get current error covariance
   */
  getErrorCovariance(): number {
    return this.errorCovariance;
  }
}

export default KalmanFilter;
