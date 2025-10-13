/**
 * Workers module exports
 */

export type {
  WorkerInitConfig,
  WorkerTrainingPoint,
  WorkerMessage,
  WorkerResponse,
  InitializeWorkerMessage,
  TrainWorkerMessage,
  PredictWorkerMessage,
  SetDataWorkerMessage,
  GetDataWorkerMessage,
  ClearWorkerMessage,
  TerminateWorkerMessage,
  ReadyWorkerResponse,
  TrainingCompleteResponse,
  PredictionResultResponse,
  DataResultResponse,
  ErrorWorkerResponse,
} from './types';

export {
  WorkerMessageType,
  WorkerResponseType,
} from './types';

// Note: RegressionWorker.ts is a Web Worker script and should be loaded via new Worker()
// It's not directly exported from this module
