/**
 * Type definitions for Web Workers
 */

import type { EyeFeatures } from '../types/prediction';

/**
 * Worker message types
 */
export enum WorkerMessageType {
  Initialize = 'initialize',
  Train = 'train',
  Predict = 'predict',
  SetData = 'set_data',
  GetData = 'get_data',
  Clear = 'clear',
  Terminate = 'terminate',
}

/**
 * Worker response types
 */
export enum WorkerResponseType {
  Ready = 'ready',
  TrainingComplete = 'training_complete',
  PredictionResult = 'prediction_result',
  DataResult = 'data_result',
  Error = 'error',
}

/**
 * Training data point for worker
 */
export interface WorkerTrainingPoint {
  eyeFeatures: EyeFeatures;
  screenPosition: [number, number];
  eventType: 'click' | 'move';
  timestamp: number;
}

/**
 * Worker initialization configuration
 */
export interface WorkerInitConfig {
  ridgeParameter: number;
  dataWindowSize: number;
  trailDataWindowSize: number;
  trailTimeWindow: number;
}

/**
 * Worker message base
 */
export interface WorkerMessageBase {
  type: WorkerMessageType;
  id: string; // Message ID for tracking responses
}

/**
 * Initialize worker message
 */
export interface InitializeWorkerMessage extends WorkerMessageBase {
  type: WorkerMessageType.Initialize;
  config: WorkerInitConfig;
}

/**
 * Train worker message
 */
export interface TrainWorkerMessage extends WorkerMessageBase {
  type: WorkerMessageType.Train;
  data: WorkerTrainingPoint[];
}

/**
 * Predict worker message
 */
export interface PredictWorkerMessage extends WorkerMessageBase {
  type: WorkerMessageType.Predict;
  eyeFeatures: EyeFeatures;
}

/**
 * Set data worker message
 */
export interface SetDataWorkerMessage extends WorkerMessageBase {
  type: WorkerMessageType.SetData;
  data: WorkerTrainingPoint[];
}

/**
 * Get data worker message
 */
export interface GetDataWorkerMessage extends WorkerMessageBase {
  type: WorkerMessageType.GetData;
}

/**
 * Clear worker message
 */
export interface ClearWorkerMessage extends WorkerMessageBase {
  type: WorkerMessageType.Clear;
}

/**
 * Terminate worker message
 */
export interface TerminateWorkerMessage extends WorkerMessageBase {
  type: WorkerMessageType.Terminate;
}

/**
 * Union of all worker messages
 */
export type WorkerMessage =
  | InitializeWorkerMessage
  | TrainWorkerMessage
  | PredictWorkerMessage
  | SetDataWorkerMessage
  | GetDataWorkerMessage
  | ClearWorkerMessage
  | TerminateWorkerMessage;

/**
 * Worker response base
 */
export interface WorkerResponseBase {
  type: WorkerResponseType;
  id: string; // Matches message ID
}

/**
 * Ready response
 */
export interface ReadyWorkerResponse extends WorkerResponseBase {
  type: WorkerResponseType.Ready;
}

/**
 * Training complete response
 */
export interface TrainingCompleteResponse extends WorkerResponseBase {
  type: WorkerResponseType.TrainingComplete;
  duration: number; // milliseconds
}

/**
 * Prediction result response
 */
export interface PredictionResultResponse extends WorkerResponseBase {
  type: WorkerResponseType.PredictionResult;
  prediction: [number, number] | null;
}

/**
 * Data result response
 */
export interface DataResultResponse extends WorkerResponseBase {
  type: WorkerResponseType.DataResult;
  data: WorkerTrainingPoint[];
}

/**
 * Error response
 */
export interface ErrorWorkerResponse extends WorkerResponseBase {
  type: WorkerResponseType.Error;
  error: string;
}

/**
 * Union of all worker responses
 */
export type WorkerResponse =
  | ReadyWorkerResponse
  | TrainingCompleteResponse
  | PredictionResultResponse
  | DataResultResponse
  | ErrorWorkerResponse;
