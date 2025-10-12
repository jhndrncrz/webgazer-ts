/**
 * Threaded Ridge Regression implementation for gaze prediction
 * Uses Web Worker for asynchronous training to avoid blocking the main thread
 */

import { Regressor } from './base/Regressor';
import { RegressorState } from './base/types';
import type { EyeFeatures, GazePrediction } from '../types/index';
import { Matrix } from '../utils/math/Matrix';
import { KalmanFilter4D } from '../utils/filters/KalmanFilter4D';
import { EyeExtractor } from '../utils/image/EyeExtractor';
import type {
  WorkerMessage,
  WorkerResponse,
  WorkerTrainingPoint,
  WorkerInitConfig,
} from '../workers/types';
import {
  WorkerMessageType,
  WorkerResponseType,
} from '../workers/types';

/**
 * Threaded Ridge Regression implementation
 * Performs regression calculations in a Web Worker for better performance
 */
export class RidgeThreadedRegressor extends Regressor {
  public readonly name = 'ridgeThreaded';

  private eyeExtractor: EyeExtractor;
  private worker: Worker | null = null;
  private workerReady: boolean = false;
  private messageIdCounter: number = 0;
  private pendingMessages: Map<string, {
    resolve: (value: WorkerResponse) => void;
    reject: (reason: Error) => void;
  }> = new Map();
  private useWorker: boolean = false; // Disabled by default due to worker path complexity

  /**
   * Create a new Threaded Ridge Regressor
   */
  constructor() {
    super({
      ridgeParameter: Math.pow(10, -5),
      dataWindowSize: 50,
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
   * Sets up Kalman filter and Web Worker
   */
  public initialize(): void {
    // Initialize 4D Kalman filter for prediction smoothing (matches original WebGazer.js)
    const kalmanFilter = new KalmanFilter4D({
      processNoise: 1.0,
      measurementNoise: 25.0,
      initialErrorCovariance: 100.0,
      deltaTime: 1.0,
    });

    this.setKalmanFilter(kalmanFilter);
    this.setState(RegressorState.Ready);

    // Initialize Web Worker if enabled
    if (this.useWorker) {
      this.initializeWorker();
    }
  }

  /**
   * Predict gaze location from eye features
   * Uses Web Worker if available, falls back to synchronous calculation
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

      // For now, always use synchronous computation
      // Worker implementation would be async and require Promise handling
      return this.predictSynchronous(eyeFeatures, currentFeatures, startTime);
    } catch (error) {
      console.error('Threaded ridge regression prediction failed:', error);
      return null;
    }
  }

  /**
   * Predict using synchronous computation
   */
  private predictSynchronous(
    eyeFeatures: EyeFeatures,
    currentFeatures: number[],
    startTime: number
  ): GazePrediction | null {
    try {
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
      console.error('Synchronous ridge regression prediction failed:', error);
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
          `Threaded ridge regression solve failed, increasing ridge parameter to ${currentRidgeParameter}`
        );

        // Prevent infinite loop
        if (currentRidgeParameter > 1e10) {
          console.error('Threaded ridge regression failed with maximum ridge parameter');
          break;
        }
      }
    }

    return coefficients;
  }

  // ============================================================================
  // Web Worker Methods
  // ============================================================================

  /**
   * Initialize Web Worker
   */
  private initializeWorker(): void {
    try {
      // Note: Worker path needs to be configured based on build system
      // For now, we keep worker disabled by default
      const workerPath = './workers/RegressionWorker.js';
      
      this.worker = new Worker(workerPath, { type: 'module' });
      this.worker.addEventListener('message', this.handleWorkerMessage.bind(this));
      this.worker.addEventListener('error', this.handleWorkerError.bind(this));

      // Send initialize message
      const config: WorkerInitConfig = {
        ridgeParameter: this.configuration.ridgeParameter,
        dataWindowSize: this.configuration.dataWindowSize,
        trailDataWindowSize: this.configuration.trailDataWindowSize,
        trailTimeWindow: this.configuration.trailTimeWindow,
      };

      this.postToWorker({
        type: WorkerMessageType.Initialize,
        id: this.generateMessageId(),
        config,
      });
    } catch (error) {
      console.error('Failed to initialize worker:', error);
      this.useWorker = false;
    }
  }

  /**
   * Post message to worker
   */
  private postToWorker(message: WorkerMessage): Promise<WorkerResponse> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not initialized'));
        return;
      }

      this.pendingMessages.set(message.id, { resolve, reject });
      this.worker.postMessage(message);

      // Set timeout for response
      setTimeout(() => {
        if (this.pendingMessages.has(message.id)) {
          this.pendingMessages.delete(message.id);
          reject(new Error('Worker response timeout'));
        }
      }, 5000);
    });
  }

  /**
   * Handle worker message
   */
  private handleWorkerMessage(event: MessageEvent<WorkerResponse>): void {
    const response = event.data;
    const pending = this.pendingMessages.get(response.id);

    if (!pending) {
      return;
    }

    this.pendingMessages.delete(response.id);

    if (response.type === WorkerResponseType.Error) {
      pending.reject(new Error(response.error));
    } else if (response.type === WorkerResponseType.Ready) {
      this.workerReady = true;
      pending.resolve(response);
    } else {
      pending.resolve(response);
    }
  }

  /**
   * Handle worker error
   */
  private handleWorkerError(error: ErrorEvent): void {
    console.error('Worker error:', error);
    this.useWorker = false;
    this.workerReady = false;
  }

  /**
   * Predict using worker
   */
  private async predictWithWorker(eyeFeatures: EyeFeatures): Promise<[number, number] | null> {
    if (!this.worker || !this.workerReady) {
      return null;
    }

    try {
      const response = await this.postToWorker({
        type: WorkerMessageType.Predict,
        id: this.generateMessageId(),
        eyeFeatures,
      });

      if (response.type === WorkerResponseType.PredictionResult) {
        return response.prediction;
      }

      return null;
    } catch (error) {
      console.error('Worker prediction failed:', error);
      return null;
    }
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${++this.messageIdCounter}_${Date.now()}`;
  }

  /**
   * Cleanup and terminate worker
   */
  public destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.workerReady = false;
    this.pendingMessages.clear();
  }
}
