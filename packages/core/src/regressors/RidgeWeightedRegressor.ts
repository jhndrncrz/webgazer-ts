/**
 * Weighted Ridge Regression implementati  public initialize(): void {
    // Initialize 4D Kalman filter (reduced noise for better responsiveness)
    const kalmanFilter = new KalmanFilter4D({
      measurementNoise: 25.0,          // Reduced from 47 for better responsiveness
      initialErrorCovariance: 0.0001,
      deltaTime: 0.1,
    });

    this.setKalmanFilter(kalmanFilter);
    this.setState(RegressorState.Ready);
  } prediction
 * Uses time-based weighting to give more importance to recent calibration data
 */

import { Regressor } from './base/Regressor';
import { RegressorState } from './base/types';
import type { EyeFeatures, GazePrediction } from '../types/index';
import { Matrix } from '../utils/math/Matrix';
import { KalmanFilter4D } from '../utils/filters/KalmanFilter4D';
import { EyeExtractor } from '../utils/image/EyeExtractor';

/**
 * Weighted Ridge Regression implementation
 * Applies weights to training samples based on their age (newer = higher weight)
 */
export class RidgeWeightedRegressor extends Regressor {
  public readonly name = 'ridgeWeighted';

  private eyeExtractor: EyeExtractor;

  /**
   * Create a new Weighted Ridge Regressor
   */
  constructor() {
    super({
      ridgeParameter: Math.pow(10, -5),
      dataWindowSize: 500, // Increased from 50 to allow more calibration points
      trailDataWindowSize: 20, // 1000ms / 50ms = 20 samples (matches original)
      trailTimeWindow: 1000,
      useKalmanFilter: true,
    });

    this.eyeExtractor = new EyeExtractor({
      resizeWidth: 10,
      resizeHeight: 6,
      histogramStep: 5,
      trackEye: 'both',
    });
  }

  /**
   * Initialize the regressor
   * Sets up Kalman filter and prepares for training
   */
  public initialize(): void {
    // Initialize 4D Kalman filter (matches original webgazer.js exactly)
    const kalmanFilter = new KalmanFilter4D({
      measurementNoise: 47.0,
      initialErrorCovariance: 0.0001,
      deltaTime: 0.1,
    });

    this.setKalmanFilter(kalmanFilter);
    this.setState(RegressorState.Ready);
  }

  /**
   * Predict gaze location from eye features with weighted regression
   * @param eyeFeatures - Current eye features
   * @returns Predicted gaze point or null if unable to predict
   */
  public predict(eyeFeatures: EyeFeatures): GazePrediction | null {
    // Check if we have training data
    if (this.eyeFeaturesClicks.length === 0) {
      return null;
    }

    const startTime = performance.now();

    try {
      // Get current eye feature vector
      const currentFeatures = this.extractFeatureVector(eyeFeatures);

      // Filter trail data by time window
      const acceptTime = performance.now() - this.configuration.trailTimeWindow;
      const trailX: number[] = [];
      const trailY: number[] = [];
      const trailFeatures: number[][] = [];

      for (let i = 0; i < this.trailTimes.length; i++) {
        const time = this.trailTimes.get(i);
        if (time > acceptTime) {
          trailX.push(this.screenXTrailArray.get(i));
          trailY.push(this.screenYTrailArray.get(i));
          trailFeatures.push(this.eyeFeaturesTrail.get(i));
        }
      }

      // Apply time-based weights to click data
      const clickCount = this.eyeFeaturesClicks.length;
      const weightedEyeFeatures: number[][] = [];
      const weightedXArray: number[] = [];
      const weightedYArray: number[] = [];

      for (let i = 0; i < clickCount; i++) {
        // Calculate weight: more recent samples get higher weight
        // Weight = sqrt(1 / (age))
        const weight = Math.sqrt(1 / (clickCount - i));

        // Apply weight to eye features
        const features = this.eyeFeaturesClicks.get(i);
        const weightedFeatures = features.map((feature) => feature * weight);
        weightedEyeFeatures.push(weightedFeatures);

        // Apply weight to screen coordinates
        weightedXArray.push(this.screenXClicksArray.get(i) * weight);
        weightedYArray.push(this.screenYClicksArray.get(i) * weight);
      }

      // Combine weighted click data with trail data
      const screenXArray = weightedXArray.concat(trailX);
      const screenYArray = weightedYArray.concat(trailY);
      const eyeFeaturesArray = weightedEyeFeatures.concat(trailFeatures);

      // Compute ridge regression coefficients for X and Y
      const coefficientsX = this.computeRidgeCoefficients(
        screenXArray,
        eyeFeaturesArray,
        this.configuration.ridgeParameter
      );

      const coefficientsY = this.computeRidgeCoefficients(
        screenYArray,
        eyeFeaturesArray,
        this.configuration.ridgeParameter
      );

      // Predict gaze coordinates
      let predictedX = 0;
      let predictedY = 0;

      for (let i = 0; i < currentFeatures.length; i++) {
        predictedX += currentFeatures[i] * coefficientsX[i];
        predictedY += currentFeatures[i] * coefficientsY[i];
      }

      // Round to integers
      predictedX = Math.floor(predictedX);
      predictedY = Math.floor(predictedY);

      const prediction: GazePrediction = {
        x: predictedX,
        y: predictedY,
      };

      // Apply Kalman filter if enabled
      const filteredPrediction = this.applyKalmanFilter(prediction);

      // Update metrics
      const predictionTime = performance.now() - startTime;
      this.updateMetrics(predictionTime);

      return filteredPrediction;
    } catch (error) {
      console.error('Weighted ridge regression prediction failed:', error);
      return null;
    }
  }

  /**
   * Extract feature vector from eye features
   * @param eyeFeatures - Eye features from tracker
   * @returns Flattened feature vector
   */
  protected extractFeatureVector(eyeFeatures: EyeFeatures): number[] {
    return this.eyeExtractor.extractFeatures(eyeFeatures);
  }

  /**
   * Compute ridge regression coefficients
   * @param targetValues - Target values (screen coordinates)
   * @param featureVectors - Feature vectors from eye patches
   * @param ridgeParameter - Ridge regularization parameter (lambda)
   * @returns Regression coefficients
   */
  private computeRidgeCoefficients(
    targetValues: number[],
    featureVectors: number[][],
    ridgeParameter: number
  ): number[] {
    const numFeatures = featureVectors[0].length;
    const coefficients = new Array(numFeatures).fill(0);

    // Convert target values to column matrix
    const y: number[][] = targetValues.map((value) => [value]);

    // Feature matrix X (rows = samples, columns = features)
    const X: number[][] = featureVectors;

    // Compute X^T (transpose of X)
    const xTranspose = Matrix.transpose(X);

    let success = false;
    let currentRidgeParameter = ridgeParameter;

    // Try to solve with increasing ridge parameter if needed
    while (!success) {
      try {
        // Compute X^T * X
        const xTransposeX = Matrix.multiply(xTranspose, X);

        // Add ridge parameter to diagonal: X^T * X + λI
        for (let i = 0; i < numFeatures; i++) {
          xTransposeX[i][i] += currentRidgeParameter;
        }

        // Compute X^T * y
        const xTransposeY = Matrix.multiply(xTranspose, y);

        // Solve: (X^T * X + λI) * coefficients = X^T * y
        const solution = Matrix.solve(xTransposeX, xTransposeY);

        // Extract coefficients from solution matrix
        for (let i = 0; i < numFeatures; i++) {
          coefficients[i] = solution[i][0];
        }

        success = true;
      } catch (error) {
        // If solving fails, increase ridge parameter and try again
        currentRidgeParameter *= 10;
        console.warn(
          `Weighted ridge regression solve failed, increasing ridge parameter to ${currentRidgeParameter}`
        );

        // Prevent infinite loop
        if (currentRidgeParameter > 1e10) {
          console.error('Weighted ridge regression failed with maximum ridge parameter');
          break;
        }
      }
    }

    return coefficients;
  }
}
