/**
 * 4D Kalman Filter Implementation
 * 
 * This is a full 4-dimensional Kalman filter that tracks position (x, y) and velocity (vx, vy).
 * This matches the original Webgazer.js implementation for accurate smoothing behavior.
 * 
 * State vector: [x, y, vx, vy]
 * - x, y: Position coordinates
 * - vx, vy: Velocity in x and y directions
 * 
 * The filter predicts future positions based on velocity and updates with measurements.
 */

/**
 * 4D Kalman Filter Implementation
 * 
 * This is a full 4-dimensional Kalman filter that tracks position (x, y) and velocity (vx, vy).
 * This matches the original Webgazer.js implementation for accurate smoothing behavior.
 * 
 * State vector: [x, y, vx, vy]
 * - x, y: Position coordinates
 * - vx, vy: Velocity in x and y directions
 * 
 * The filter predicts future positions based on velocity and updates with measurements.
 */

import { Matrix } from '../math/Matrix';
import type { IKalmanFilter, KalmanFilter4DConfig, KalmanFilter4DState } from './types';

/**
 * KalmanFilter4D - Full 4-dimensional Kalman filter
 * 
 * Tracks 2D position (x, y) and velocity (vx, vy) using a constant velocity model.
 * This provides superior smoothing compared to independent 1D filters.
 * 
 * State Model:
 * ```
 * x(k) = F * x(k-1) + w(k)
 * z(k) = H * x(k) + v(k)
 * 
 * where:
 * - x(k) = [x, y, vx, vy]ᵀ  (state vector)
 * - z(k) = [x, y]ᵀ          (measurement vector)
 * - w(k) ~ N(0, Q)          (process noise)
 * - v(k) ~ N(0, R)          (measurement noise)
 * ```
 * 
 * @example
 * ```typescript
 * const filter = new KalmanFilter4D({
 *   processNoise: 1.0,
 *   measurementNoise: 25.0,
 *   deltaTime: 1.0
 * });
 * 
 * // Update with measurements
 * const smoothed = filter.update([100, 200]);
 * console.log(`Position: (${smoothed[0]}, ${smoothed[1]})`);
 * 
 * // Get velocity estimate
 * const state = filter.getState();
 * console.log(`Velocity: (${state.state[2]}, ${state.state[3]})`);
 * ```
 */
export class KalmanFilter4D implements IKalmanFilter {
  // Filter parameters
  private readonly measurementNoise: number;
  private readonly initialErrorCovariance: number;
  private readonly deltaTime: number;
  
  // Filter state
  private state: number[]; // [x, y, vx, vy]
  private errorCovariance: number[][]; // P (4×4 matrix)
  private initialized: boolean;
  
  // State transition matrix F (4×4)
  // Constant velocity model: position += velocity * dt
  private readonly F: number[][];
  
  // Process noise covariance Q (4×4)
  private readonly Q: number[][];
  
  // Measurement matrix H (2×4)
  // We only measure position, not velocity
  private readonly H: number[][];
  
  // Measurement noise covariance R (2×2)
  private readonly R: number[][];
  
  /**
   * Create a new 4D Kalman Filter
   * 
   * @param config - Configuration options
   */
  constructor(config: KalmanFilter4DConfig = {}) {
    const {
      measurementNoise = 47.0,      // pixel_error from original
      initialErrorCovariance = 0.0001,  // P_initial from original
      deltaTime = 0.1                // delta_t from original (1/10)
    } = config;
    
    this.measurementNoise = measurementNoise;
    this.initialErrorCovariance = initialErrorCovariance;
    this.deltaTime = deltaTime;
    
    // Initialize state vector [x, y, vx, vy]
    this.state = [0, 0, 0, 0];
    
    // Initialize error covariance matrix (4×4 identity scaled by initial error)
    this.errorCovariance = [
      [initialErrorCovariance, 0, 0, 0],
      [0, initialErrorCovariance, 0, 0],
      [0, 0, initialErrorCovariance, 0],
      [0, 0, 0, initialErrorCovariance]
    ];
    
    this.initialized = false;
    
    // State transition matrix F (constant velocity model)
    // [x_new]   [1  0  dt  0] [x]
    // [y_new] = [0  1  0  dt] [y]
    // [vx_new]  [0  0  1   0] [vx]
    // [vy_new]  [0  0  0   1] [vy]
    const dt = this.deltaTime;
    this.F = [
      [1, 0, dt, 0],
      [0, 1, 0, dt],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
    
    // Process noise covariance Q
    // Models uncertainty in the motion model
    // From original Webgazer.js (matches exactly):
    // Q_base = [ [1/4, 0,   1/2, 0],
    //            [0,   1/4, 0,   1/2],
    //            [1/2, 0,   1,   0],
    //            [0,   1/2, 0,   1] ]
    // Q = Q_base * delta_t
    // This is NOT the standard kinematic Q matrix!
    this.Q = [
      [0.25 * dt, 0, 0.5 * dt, 0],
      [0, 0.25 * dt, 0, 0.5 * dt],
      [0.5 * dt, 0, 1.0 * dt, 0],
      [0, 0.5 * dt, 0, 1.0 * dt]
    ];
    
    // Measurement matrix H (we observe position only)
    // [z_x]   [1  0  0  0] [x]
    // [z_y] = [0  1  0  0] [y]
    //                      [vx]
    //                      [vy]
    this.H = [
      [1, 0, 0, 0],
      [0, 1, 0, 0]
    ];
    
    // Measurement noise covariance R (2×2)
    // Represents uncertainty in position measurements
    this.R = [
      [measurementNoise, 0],
      [0, measurementNoise]
    ];
  }
  
  /**
   * Update filter with new measurement
   * 
   * Implements the standard Kalman filter algorithm:
   * 1. Prediction step (predict next state and error covariance)
   * 2. Update step (correct prediction with measurement)
   * 
   * @param measurement - Measured 2D point [x, y]
   * @returns Filtered estimate [x, y]
   */
  update(measurement: [number, number]): [number, number] {
    // Initialize on first measurement
    if (!this.initialized) {
      this.state = [measurement[0], measurement[1], 0, 0]; // Position with zero velocity
      this.initialized = true;
      return measurement; // Return measurement directly on first update
    }
    
    // ========================================================================
    // PREDICTION STEP
    // ========================================================================
    
    // Predict state: x̂(k|k-1) = F * x̂(k-1|k-1)
    const predictedState = this.matrixVectorMultiply(this.F, this.state);
    
    // Predict error covariance: P(k|k-1) = F * P(k-1|k-1) * F^T + Q
    const FP = this.matrixMultiply(this.F, this.errorCovariance);
    const FPFt = this.matrixMultiplyTranspose(FP, this.F);
    const predictedErrorCovariance = this.matrixAdd(FPFt, this.Q);
    
    // ========================================================================
    // UPDATE STEP
    // ========================================================================
    
    // Innovation (measurement residual): y(k) = z(k) - H * x̂(k|k-1)
    const Hx = this.matrixVectorMultiply(this.H, predictedState);
    const innovation = [
      measurement[0] - Hx[0],
      measurement[1] - Hx[1]
    ];
    
    // Innovation covariance: S(k) = H * P(k|k-1) * H^T + R
    const HP = this.matrixMultiply(this.H, predictedErrorCovariance);
    const HPHt = this.matrixMultiplyTranspose(HP, this.H);
    const innovationCovariance = this.matrixAdd(HPHt, this.R);
    
    // Kalman gain: K(k) = P(k|k-1) * H^T * S(k)^(-1)
    const Ht = this.transposeMatrix(this.H);
    const PHt = this.matrixMultiply(predictedErrorCovariance, Ht);
    const innovationCovarianceInv = this.invertMatrix2x2(innovationCovariance);
    const kalmanGain = this.matrixMultiply(PHt, innovationCovarianceInv);
    
    // Updated state estimate: x̂(k|k) = x̂(k|k-1) + K(k) * y(k)
    const Ky = this.matrixVectorMultiply(kalmanGain, innovation);
    this.state = [
      predictedState[0] + Ky[0],
      predictedState[1] + Ky[1],
      predictedState[2] + Ky[2],
      predictedState[3] + Ky[3]
    ];
    
    // Updated error covariance: P(k|k) = (I - K(k) * H) * P(k|k-1)
    const KH = this.matrixMultiply(kalmanGain, this.H);
    const I_minus_KH = this.matrixSubtract(this.identityMatrix(4), KH);
    this.errorCovariance = this.matrixMultiply(I_minus_KH, predictedErrorCovariance);
    
    // Return filtered position [x, y]
    return [this.state[0], this.state[1]];
  }
  
  /**
   * Get current filter state
   * 
   * @returns Current state including position and velocity
   */
  getState(): KalmanFilter4DState {
    return {
      state: [...this.state], // [x, y, vx, vy]
      errorCovariance: this.errorCovariance.map(row => [...row]),
      initialized: this.initialized,
      lastUpdate: Date.now()
    };
  }
  
  /**
   * Get current position estimate
   * 
   * @returns Current position [x, y]
   */
  getPosition(): [number, number] {
    return [this.state[0], this.state[1]];
  }
  
  /**
   * Get current velocity estimate
   * 
   * @returns Current velocity [vx, vy] in pixels per time unit
   */
  getVelocity(): [number, number] {
    return [this.state[2], this.state[3]];
  }
  
  /**
   * Predict future position without updating filter state
   * 
   * @param steps - Number of time steps into the future
   * @returns Predicted position [x, y]
   */
  predict(steps: number = 1): [number, number] {
    if (!this.initialized) {
      return [0, 0];
    }
    
    const dt = this.deltaTime * steps;
    const predictedX = this.state[0] + this.state[2] * dt;
    const predictedY = this.state[1] + this.state[3] * dt;
    
    return [predictedX, predictedY];
  }
  
  /**
   * Reset filter to initial state
   * 
   * @param config - Optional new configuration
   */
  reset(config?: KalmanFilter4DConfig): void {
    if (config) {
      // Reinitialize with new config
      Object.assign(this, new KalmanFilter4D(config));
    } else {
      // Reset to current config
      this.state = [0, 0, 0, 0];
      this.errorCovariance = [
        [this.initialErrorCovariance, 0, 0, 0],
        [0, this.initialErrorCovariance, 0, 0],
        [0, 0, this.initialErrorCovariance, 0],
        [0, 0, 0, this.initialErrorCovariance]
      ];
      this.initialized = false;
    }
  }
  
  /**
   * Check if filter is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
  
  // ========================================================================
  // Matrix Operations (Lightweight implementations)
  // ========================================================================
  
  /**
   * Matrix-vector multiplication
   */
  private matrixVectorMultiply(matrix: number[][], vector: number[]): number[] {
    const result: number[] = [];
    for (let i = 0; i < matrix.length; i++) {
      let sum = 0;
      for (let j = 0; j < vector.length; j++) {
        sum += matrix[i][j] * vector[j];
      }
      result.push(sum);
    }
    return result;
  }
  
  /**
   * Matrix multiplication: A * B
   */
  private matrixMultiply(A: number[][], B: number[][]): number[][] {
    const rowsA = A.length;
    const colsA = A[0].length;
    const colsB = B[0].length;
    
    const result: number[][] = [];
    for (let i = 0; i < rowsA; i++) {
      result[i] = [];
      for (let j = 0; j < colsB; j++) {
        let sum = 0;
        for (let k = 0; k < colsA; k++) {
          sum += A[i][k] * B[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }
  
  /**
   * Matrix multiplication with transpose: A * B^T
   */
  private matrixMultiplyTranspose(A: number[][], B: number[][]): number[][] {
    const Bt = this.transposeMatrix(B);
    return this.matrixMultiply(A, Bt);
  }
  
  /**
   * Matrix addition: A + B
   */
  private matrixAdd(A: number[][], B: number[][]): number[][] {
    const result: number[][] = [];
    for (let i = 0; i < A.length; i++) {
      result[i] = [];
      for (let j = 0; j < A[0].length; j++) {
        result[i][j] = A[i][j] + B[i][j];
      }
    }
    return result;
  }
  
  /**
   * Matrix subtraction: A - B
   */
  private matrixSubtract(A: number[][], B: number[][]): number[][] {
    const result: number[][] = [];
    for (let i = 0; i < A.length; i++) {
      result[i] = [];
      for (let j = 0; j < A[0].length; j++) {
        result[i][j] = A[i][j] - B[i][j];
      }
    }
    return result;
  }
  
  /**
   * Matrix transpose
   */
  private transposeMatrix(matrix: number[][]): number[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result: number[][] = [];
    
    for (let j = 0; j < cols; j++) {
      result[j] = [];
      for (let i = 0; i < rows; i++) {
        result[j][i] = matrix[i][j];
      }
    }
    return result;
  }
  
  /**
   * Identity matrix of size n×n
   */
  private identityMatrix(n: number): number[][] {
    const result: number[][] = [];
    for (let i = 0; i < n; i++) {
      result[i] = [];
      for (let j = 0; j < n; j++) {
        result[i][j] = (i === j) ? 1 : 0;
      }
    }
    return result;
  }
  
  /**
   * Invert a 2×2 matrix
   * For larger matrices, use Matrix.inverse() from math utilities
   */
  private invertMatrix2x2(matrix: number[][]): number[][] {
    const [[a, b], [c, d]] = matrix;
    const det = a * d - b * c;
    
    if (Math.abs(det) < 1e-10) {
      // Matrix is singular, return identity
      console.warn('KalmanFilter4D: Singular matrix in innovation covariance, using identity');
      return this.identityMatrix(2);
    }
    
    const invDet = 1 / det;
    return [
      [d * invDet, -b * invDet],
      [-c * invDet, a * invDet]
    ];
  }
}

export default KalmanFilter4D;
