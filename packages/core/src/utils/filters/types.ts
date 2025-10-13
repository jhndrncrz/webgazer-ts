/**
 * Type definitions for filter implementations
 */

export interface FilterConfig {
  /** Whether the filter is enabled */
  enabled: boolean;
}

export interface FilterState<T> {
  /** Current filtered value */
  value: T;
  
  /** Timestamp of last update */
  timestamp: number;
  
  /** Number of updates processed */
  updateCount: number;
}

/**
 * Common interface for all Kalman filters
 */
export interface IKalmanFilter {
  /**
   * Update filter with new measurement
   * @param measurement - Measured 2D point [x, y]
   * @returns Filtered estimate [x, y]
   */
  update(measurement: [number, number]): [number, number];
  
  /**
   * Reset filter to initial state
   * @param config - Optional new configuration
   */
  reset(config?: any): void;
  
  /**
   * Check if filter is initialized
   */
  isInitialized?(): boolean;
}

/**
 * Configuration for Kalman Filter (1D per coordinate)
 */
export interface KalmanFilterConfig {
  /** Process noise covariance (how much we expect the true value to change) */
  processNoise?: number;
  
  /** Measurement noise covariance (how much we trust measurements) */
  measurementNoise?: number;
  
  /** Initial error covariance */
  errorCovariance?: number;
}

/**
 * Configuration for 4D Kalman Filter (position + velocity)
 */
export interface KalmanFilter4DConfig {
  /** Process noise covariance */
  processNoise?: number;
  
  /** Measurement noise covariance in pixels */
  measurementNoise?: number;
  
  /** Initial error covariance */
  initialErrorCovariance?: number;
  
  /** Time delta between updates in seconds */
  deltaTime?: number;
}

/**
 * State of 4D Kalman filter
 */
export interface KalmanFilter4DState {
  /** State vector [x, y, vx, vy] */
  state: number[];
  
  /** Error covariance matrix (4×4) */
  errorCovariance: number[][];
  
  /** Whether the filter has been initialized */
  initialized: boolean;
  
  /** Last update timestamp */
  lastUpdate: number;
}
