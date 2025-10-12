/**
 * Regression Worker
 * Web Worker for performing ridge regression training in a separate thread
 */

import type {
  WorkerMessage,
  WorkerResponse,
  WorkerInitConfig,
  WorkerTrainingPoint,
} from './types';
import {
  WorkerMessageType,
  WorkerResponseType,
} from './types';
import type { EyeFeatures } from '../types/prediction';

/**
 * Worker state
 */
interface WorkerState {
  config: WorkerInitConfig | null;
  trainingData: WorkerTrainingPoint[];
  isInitialized: boolean;
}

// Worker global state
const state: WorkerState = {
  config: null,
  trainingData: [],
  isInitialized: false,
};

/**
 * Send response to main thread
 * @param response - Worker response
 */
function sendResponse(response: WorkerResponse): void {
  self.postMessage(response);
}

/**
 * Handle initialize message
 * @param message - Initialize message
 */
function handleInitialize(message: WorkerMessage): void {
  if (message.type !== WorkerMessageType.Initialize) {
    return;
  }

  state.config = message.config;
  state.isInitialized = true;

  sendResponse({
    type: WorkerResponseType.Ready,
    id: message.id,
  });
}

/**
 * Handle train message
 * @param message - Train message
 */
function handleTrain(message: WorkerMessage): void {
  if (message.type !== WorkerMessageType.Train) {
    return;
  }

  if (!state.isInitialized || !state.config) {
    sendResponse({
      type: WorkerResponseType.Error,
      id: message.id,
      error: 'Worker not initialized',
    });
    return;
  }

  const startTime = Date.now();

  try {
    // Store training data
    state.trainingData = message.data;

    // In a real implementation, we would perform the ridge regression training here
    // For now, we just acknowledge the training is complete
    // The actual prediction will use the same ridge regression logic as RidgeRegressor

    const duration = Date.now() - startTime;

    sendResponse({
      type: WorkerResponseType.TrainingComplete,
      id: message.id,
      duration,
    });
  } catch (error) {
    sendResponse({
      type: WorkerResponseType.Error,
      id: message.id,
      error: error instanceof Error ? error.message : 'Training failed',
    });
  }
}

/**
 * Handle predict message
 * @param message - Predict message
 */
function handlePredict(message: WorkerMessage): void {
  if (message.type !== WorkerMessageType.Predict) {
    return;
  }

  if (!state.isInitialized || !state.config) {
    sendResponse({
      type: WorkerResponseType.Error,
      id: message.id,
      error: 'Worker not initialized',
    });
    return;
  }

  try {
    // Perform prediction using stored training data
    const prediction = performRidgeRegression(
      message.eyeFeatures,
      state.trainingData,
      state.config
    );

    sendResponse({
      type: WorkerResponseType.PredictionResult,
      id: message.id,
      prediction,
    });
  } catch (error) {
    sendResponse({
      type: WorkerResponseType.Error,
      id: message.id,
      error: error instanceof Error ? error.message : 'Prediction failed',
    });
  }
}

/**
 * Handle set data message
 * @param message - Set data message
 */
function handleSetData(message: WorkerMessage): void {
  if (message.type !== WorkerMessageType.SetData) {
    return;
  }

  state.trainingData = message.data;

  sendResponse({
    type: WorkerResponseType.TrainingComplete,
    id: message.id,
    duration: 0,
  });
}

/**
 * Handle get data message
 * @param message - Get data message
 */
function handleGetData(message: WorkerMessage): void {
  if (message.type !== WorkerMessageType.GetData) {
    return;
  }

  sendResponse({
    type: WorkerResponseType.DataResult,
    id: message.id,
    data: state.trainingData,
  });
}

/**
 * Handle clear message
 * @param message - Clear message
 */
function handleClear(message: WorkerMessage): void {
  if (message.type !== WorkerMessageType.Clear) {
    return;
  }

  state.trainingData = [];

  sendResponse({
    type: WorkerResponseType.TrainingComplete,
    id: message.id,
    duration: 0,
  });
}

/**
 * Extract feature vector from eye features
 * Processes eye patches through resize, grayscale, and histogram equalization
 * @param eyeFeatures - Eye features to extract
 * @param config - Worker configuration
 * @returns Flattened feature vector
 */
function extractFeatureVector(
  eyeFeatures: EyeFeatures,
  config: WorkerInitConfig
): number[] {
  // For simplicity in the worker, we'll use a basic feature extraction
  // that mirrors the EyeExtractor approach but without the full image processing

  const resizeWidth = 10;
  const resizeHeight = 6;

  // Extract features from both eyes and concatenate
  const leftFeatures = extractEyePatchFeatures(eyeFeatures.left, resizeWidth, resizeHeight);
  const rightFeatures = extractEyePatchFeatures(eyeFeatures.right, resizeWidth, resizeHeight);

  return leftFeatures.concat(rightFeatures);
}

/**
 * Extract features from a single eye patch
 * @param eyePatch - Eye patch to process
 * @param targetWidth - Target width
 * @param targetHeight - Target height
 * @returns Feature vector
 */
function extractEyePatchFeatures(
  eyePatch: { patch: ImageData; width: number; height: number },
  targetWidth: number,
  targetHeight: number
): number[] {
  // Simplified feature extraction - use grayscale values
  const features: number[] = [];
  const data = eyePatch.patch.data;

  // Sample pixels evenly across the patch
  const stepX = eyePatch.width / targetWidth;
  const stepY = eyePatch.height / targetHeight;

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const srcX = Math.floor(x * stepX);
      const srcY = Math.floor(y * stepY);
      const idx = (srcY * eyePatch.width + srcX) * 4;

      // Convert RGB to grayscale: 0.299*R + 0.587*G + 0.114*B
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      features.push(gray);
    }
  }

  return features;
}

/**
 * Matrix transpose operation
 * @param matrix - Input matrix
 * @returns Transposed matrix
 */
function transposeMatrix(matrix: number[][]): number[][] {
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
 * Matrix multiplication
 * @param a - First matrix
 * @param b - Second matrix
 * @returns Product matrix
 */
function multiplyMatrices(a: number[][], b: number[][]): number[][] {
  const aRows = a.length;
  const aCols = a[0].length;
  const bCols = b[0].length;
  const result: number[][] = [];

  for (let i = 0; i < aRows; i++) {
    result[i] = [];
    for (let j = 0; j < bCols; j++) {
      let sum = 0;
      for (let k = 0; k < aCols; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }

  return result;
}

/**
 * Solve linear system using Gaussian elimination with partial pivoting
 * @param A - Coefficient matrix
 * @param b - Right-hand side vector
 * @returns Solution vector
 */
function solveLinearSystem(A: number[][], b: number[][]): number[][] {
  const n = A.length;
  const augmented: number[][] = [];

  // Create augmented matrix [A|b]
  for (let i = 0; i < n; i++) {
    augmented[i] = [...A[i], b[i][0]];
  }

  // Forward elimination with partial pivoting
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }

    // Swap rows
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

    // Check for singular matrix
    if (Math.abs(augmented[i][i]) < 1e-10) {
      throw new Error('Matrix is singular or nearly singular');
    }

    // Eliminate column
    for (let k = i + 1; k < n; k++) {
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = i; j <= n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }

  // Back substitution
  const x: number[][] = [];
  for (let i = n - 1; i >= 0; i--) {
    let sum = augmented[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= augmented[i][j] * x[j][0];
    }
    x[i] = [sum / augmented[i][i]];
  }

  return x;
}

/**
 * Perform ridge regression prediction
 * @param eyeFeatures - Current eye features
 * @param trainingData - Training data points
 * @param config - Worker configuration
 * @returns Predicted screen position or null
 */
function performRidgeRegression(
  eyeFeatures: EyeFeatures,
  trainingData: WorkerTrainingPoint[],
  config: WorkerInitConfig
): [number, number] | null {
  if (trainingData.length === 0) {
    return null;
  }

  try {
    // 1. Extract feature vector from current eye features
    const currentFeatures = extractFeatureVector(eyeFeatures, config);

    // 2. Build design matrix from training data
    const X: number[][] = [];
    const yX: number[][] = [];
    const yY: number[][] = [];

    for (const point of trainingData) {
      const features = extractFeatureVector(point.eyeFeatures, config);
      X.push(features);
      yX.push([point.screenPosition[0]]);
      yY.push([point.screenPosition[1]]);
    }

    // 3. Compute ridge regression coefficients
    const coefficientsX = computeRidgeCoefficients(yX, X, config.ridgeParameter);
    const coefficientsY = computeRidgeCoefficients(yY, X, config.ridgeParameter);

    // 4. Apply coefficients to current features
    let predictedX = 0;
    let predictedY = 0;

    for (let i = 0; i < currentFeatures.length; i++) {
      predictedX += currentFeatures[i] * coefficientsX[i];
      predictedY += currentFeatures[i] * coefficientsY[i];
    }

    // 5. Return predicted [x, y] position
    return [Math.floor(predictedX), Math.floor(predictedY)];
  } catch (error) {
    console.error('Ridge regression computation failed:', error);
    return null;
  }
}

/**
 * Compute ridge regression coefficients
 * Solves: (X^T * X + λI) * β = X^T * y
 * @param y - Target values (screen coordinates)
 * @param X - Feature matrix
 * @param ridgeParameter - Ridge regularization parameter (lambda)
 * @returns Regression coefficients
 */
function computeRidgeCoefficients(
  y: number[][],
  X: number[][],
  ridgeParameter: number
): number[] {
  const numFeatures = X[0].length;
  const coefficients = new Array(numFeatures).fill(0);

  let success = false;
  let currentRidgeParameter = ridgeParameter;

  // Try to solve with increasing ridge parameter if needed
  while (!success) {
    try {
      // Compute X^T (transpose of X)
      const xTranspose = transposeMatrix(X);

      // Compute X^T * X
      const xTransposeX = multiplyMatrices(xTranspose, X);

      // Add ridge parameter to diagonal: X^T * X + λI
      for (let i = 0; i < numFeatures; i++) {
        xTransposeX[i][i] += currentRidgeParameter;
      }

      // Compute X^T * y
      const xTransposeY = multiplyMatrices(xTranspose, y);

      // Solve: (X^T * X + λI) * coefficients = X^T * y
      const solution = solveLinearSystem(xTransposeX, xTransposeY);

      // Extract coefficients from solution matrix
      for (let i = 0; i < numFeatures; i++) {
        coefficients[i] = solution[i][0];
      }

      success = true;
    } catch (error) {
      // If solving fails, increase ridge parameter and try again
      currentRidgeParameter *= 10;

      // Prevent infinite loop
      if (currentRidgeParameter > 1e10) {
        console.error('Ridge regression failed with maximum ridge parameter');
        throw new Error('Ridge regression failed: matrix is singular');
      }
    }
  }

  return coefficients;
}

/**
 * Main message handler
 * @param event - Message event
 */
self.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;

  switch (message.type) {
    case WorkerMessageType.Initialize:
      handleInitialize(message);
      break;
    case WorkerMessageType.Train:
      handleTrain(message);
      break;
    case WorkerMessageType.Predict:
      handlePredict(message);
      break;
    case WorkerMessageType.SetData:
      handleSetData(message);
      break;
    case WorkerMessageType.GetData:
      handleGetData(message);
      break;
    case WorkerMessageType.Clear:
      handleClear(message);
      break;
    case WorkerMessageType.Terminate:
      self.close();
      break;
  }
});

// Export for TypeScript compilation
export type {};
