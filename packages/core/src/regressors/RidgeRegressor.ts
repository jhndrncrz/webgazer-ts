/**
 * Standard Ridge Regression implementation for gaze prediction
 * Uses ridge regression (L2 regularization) to predict gaze from eye features
 */

import { Regressor } from './base/Regressor';
import { RegressorState } from './base/types';
import type { EyeFeatures, GazePrediction } from '../types/index';
import { Matrix } from '../utils/math/Matrix';
import { KalmanFilter } from '../utils/filters/KalmanFilter';
import { EyeExtractor } from '../utils/image/EyeExtractor';

/**
 * Ridge Regression implementation
 * Predicts gaze coordinates using ridge regression on eye features
 */
export class RidgeRegressor extends Regressor {
  public readonly name = 'ridge';

  private eyeExtractor: EyeExtractor;

  /**
   * Create a new Ridge Regressor
   */
  constructor() {
    super({
      ridgeParameter: Math.pow(10, -5),
      dataWindowSize: 500, // Increased from 50 to allow more calibration points
      trailDataWindowSize: 10,
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
    // Initialize 1D Kalman filter for prediction smoothing (better performance than 4D)
    const kalmanFilter = new KalmanFilter({
      processNoise: 0.5,  // Lower process noise for smoother tracking
      measurementNoise: 10.0,  // Lower measurement noise for more responsive tracking
      errorCovariance: 50.0,  // Initial error covariance
    });

    this.setKalmanFilter(kalmanFilter);
    this.setState(RegressorState.Ready);
  }

  /**
   * Predict gaze location from eye features
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

      // Combine click and trail data
      const screenXArray = this.screenXClicksArray.toArray().concat(trailX);
      const screenYArray = this.screenYClicksArray.toArray().concat(trailY);
      const eyeFeaturesArray = this.eyeFeaturesClicks.toArray().concat(trailFeatures);

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
      console.error('Ridge regression prediction failed:', error);
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
          `Ridge regression solve failed, increasing ridge parameter to ${currentRidgeParameter}`
        );

        // Prevent infinite loop
        if (currentRidgeParameter > 1e10) {
          console.error('Ridge regression failed with maximum ridge parameter');
          break;
        }
      }
    }

    return coefficients;
  }
}
