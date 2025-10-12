/**
 * Abstract base class for gaze prediction regressors
 * All regressor implementations must extend this class
 */

import type { IRegressor } from '../../core/types';
import type { EyeFeatures, GazePrediction } from '../../types/index';
import type { KalmanFilter } from '../../utils/filters/KalmanFilter';
import {
  RegressorState,
  type RegressorConfiguration,
  type RegressorData,
  type RegressorMetrics,
  type TrainingDataPoint,
} from './types';
import { DataWindow } from '../../utils/data/DataWindow';

/**
 * Abstract Regressor base class
 * Provides common functionality for gaze prediction
 */
export abstract class Regressor implements IRegressor {
  protected state: RegressorState;
  protected configuration: RegressorConfiguration;
  protected metrics: RegressorMetrics;

  // Training data storage
  protected screenXClicksArray: DataWindow<number>;
  protected screenYClicksArray: DataWindow<number>;
  protected eyeFeaturesClicks: DataWindow<number[]>;

  protected screenXTrailArray: DataWindow<number>;
  protected screenYTrailArray: DataWindow<number>;
  protected eyeFeaturesTrail: DataWindow<number[]>;
  protected trailTimes: DataWindow<number>;

  protected dataClicks: DataWindow<TrainingDataPoint>;
  protected dataTrail: DataWindow<TrainingDataPoint>;

  // Kalman filter for smoothing
  protected kalmanFilter: KalmanFilter | null = null;

  /**
   * Create a new Regressor instance
   * @param config - Optional regressor configuration
   */
  constructor(config?: Partial<RegressorConfiguration>) {
    this.configuration = {
      ridgeParameter: Math.pow(10, -5),
      dataWindowSize: 50,
      trailDataWindowSize: 10,
      trailTimeWindow: 1000,
      useKalmanFilter: true,
      ...config,
    };

    this.state = RegressorState.NotInitialized;

    // Initialize data windows
    const dataWindowSize = this.configuration.dataWindowSize;
    const trailDataWindowSize = this.configuration.trailDataWindowSize;

    this.screenXClicksArray = new DataWindow<number>(dataWindowSize);
    this.screenYClicksArray = new DataWindow<number>(dataWindowSize);
    this.eyeFeaturesClicks = new DataWindow<number[]>(dataWindowSize);

    this.screenXTrailArray = new DataWindow<number>(trailDataWindowSize);
    this.screenYTrailArray = new DataWindow<number>(trailDataWindowSize);
    this.eyeFeaturesTrail = new DataWindow<number[]>(trailDataWindowSize);
    this.trailTimes = new DataWindow<number>(trailDataWindowSize);

    this.dataClicks = new DataWindow<TrainingDataPoint>(dataWindowSize);
    this.dataTrail = new DataWindow<TrainingDataPoint>(trailDataWindowSize);

    this.metrics = {
      totalPredictions: 0,
      averagePredictionTime: 0,
      lastPredictionTime: 0,
      totalTrainingPoints: 0,
      clickPoints: 0,
      movePoints: 0,
    };
  }

  /**
   * Initialize the regressor
   */
  public abstract initialize(): void;

  /**
   * Add training data point
   * @param eyeFeatures - Eye features from tracker
   * @param screenPosition - Screen coordinates where user looked
   * @param eventType - Type of event (click or move)
   */
  public addData(
    eyeFeatures: EyeFeatures,
    screenPosition: [number, number],
    eventType: 'click' | 'move'
  ): void {
    const [screenX, screenY] = screenPosition;
    const features = this.extractFeatureVector(eyeFeatures);
    const timestamp = performance.now();

    const dataPoint: TrainingDataPoint = {
      eyeFeatures: features,
      screenX,
      screenY,
      timestamp,
      eventType,
    };

    if (eventType === 'click') {
      this.screenXClicksArray.push(screenX);
      this.screenYClicksArray.push(screenY);
      this.eyeFeaturesClicks.push(features);
      this.dataClicks.push(dataPoint);
      this.metrics.clickPoints++;
    } else {
      this.screenXTrailArray.push(screenX);
      this.screenYTrailArray.push(screenY);
      this.eyeFeaturesTrail.push(features);
      this.trailTimes.push(timestamp);
      this.dataTrail.push(dataPoint);
      this.metrics.movePoints++;
    }

    this.metrics.totalTrainingPoints++;
  }

  /**
   * Predict gaze location from eye features
   * @param eyeFeatures - Current eye features
   * @returns Predicted gaze point or null if unable to predict
   */
  public abstract predict(eyeFeatures: EyeFeatures): GazePrediction | null;

  /**
   * Set bulk training data
   * @param data - Previously saved training data
   */
  public setData(data: RegressorData): void {
    // Clear existing data
    this.clearData();

    // Restore click data
    for (const point of data.dataClicks) {
      this.screenXClicksArray.push(point.screenX);
      this.screenYClicksArray.push(point.screenY);
      this.eyeFeaturesClicks.push(point.eyeFeatures);
      this.dataClicks.push(point);
      this.metrics.clickPoints++;
    }

    // Restore trail data
    for (const point of data.dataTrail) {
      this.screenXTrailArray.push(point.screenX);
      this.screenYTrailArray.push(point.screenY);
      this.eyeFeaturesTrail.push(point.eyeFeatures);
      this.trailTimes.push(point.timestamp);
      this.dataTrail.push(point);
      this.metrics.movePoints++;
    }

    this.metrics.totalTrainingPoints = this.metrics.clickPoints + this.metrics.movePoints;
  }

  /**
   * Get current training data
   * @returns Training data for persistence
   */
  public getData(): RegressorData {
    return {
      dataClicks: this.dataClicks.toArray(),
      dataTrail: this.dataTrail.toArray(),
    };
  }

  /**
   * Get regressor state
   * @returns Current state
   */
  public getState(): RegressorState {
    return this.state;
  }

  /**
   * Check if regressor is ready
   * @returns True if ready to predict
   */
  public isReady(): boolean {
    return this.state === RegressorState.Ready && this.eyeFeaturesClicks.length > 0;
  }

  /**
   * Get regressor configuration
   * @returns Current configuration
   */
  public getConfiguration(): RegressorConfiguration {
    return { ...this.configuration };
  }

  /**
   * Update regressor configuration
   * @param config - Partial configuration to update
   */
  public updateConfiguration(config: Partial<RegressorConfiguration>): void {
    this.configuration = { ...this.configuration, ...config };
  }

  /**
   * Get regressor performance metrics
   * @returns Current metrics
   */
  public getMetrics(): RegressorMetrics {
    return { ...this.metrics };
  }

  /**
   * Clear all training data
   */
  protected clearData(): void {
    this.screenXClicksArray.clear();
    this.screenYClicksArray.clear();
    this.eyeFeaturesClicks.clear();
    this.screenXTrailArray.clear();
    this.screenYTrailArray.clear();
    this.eyeFeaturesTrail.clear();
    this.trailTimes.clear();
    this.dataClicks.clear();
    this.dataTrail.clear();

    this.metrics.clickPoints = 0;
    this.metrics.movePoints = 0;
    this.metrics.totalTrainingPoints = 0;
  }

  /**
   * Extract feature vector from eye features
   * @param eyeFeatures - Eye features from tracker
   * @returns Flattened feature vector
   */
  protected abstract extractFeatureVector(eyeFeatures: EyeFeatures): number[];

  /**
   * Set Kalman filter for prediction smoothing
   * @param kalmanFilter - Kalman filter instance
   */
  protected setKalmanFilter(kalmanFilter: KalmanFilter): void {
    this.kalmanFilter = kalmanFilter;
  }

  /**
   * Apply Kalman filter to prediction if enabled
   * @param prediction - Raw prediction
   * @returns Filtered prediction
   */
  protected applyKalmanFilter(prediction: GazePrediction): GazePrediction {
    if (this.configuration.useKalmanFilter && this.kalmanFilter) {
      const filtered = this.kalmanFilter.update([prediction.x, prediction.y]);
      return { x: filtered[0], y: filtered[1] };
    }
    return prediction;
  }

  /**
   * Update metrics after making a prediction
   * @param predictionTime - Time taken for prediction (ms)
   */
  protected updateMetrics(predictionTime: number): void {
    this.metrics.lastPredictionTime = predictionTime;
    this.metrics.totalPredictions++;

    // Calculate rolling average
    this.metrics.averagePredictionTime =
      (this.metrics.averagePredictionTime * (this.metrics.totalPredictions - 1) +
        predictionTime) /
      this.metrics.totalPredictions;
  }

  /**
   * Set regressor state
   * @param state - New state
   */
  protected setState(state: RegressorState): void {
    this.state = state;
  }

  /**
   * Regressor name identifier (IRegressor interface implementation)
   */
  public abstract readonly name: string;
}
