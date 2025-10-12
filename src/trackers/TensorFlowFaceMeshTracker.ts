/**
 * TensorFlow FaceMesh Tracker Implementation
 * Uses @tensorflow-models/face-landmarks-detection for face and eye tracking
 */

import type {
  FaceLandmarksDetector,
  Face,
} from '@tensorflow-models/face-landmarks-detection';
import type { EyeFeatures, EyePatch } from '../types/index';
import { Tracker } from './base/Tracker';
import { TrackerState } from './base/types';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

/**
 * Face annotation structure from TensorFlow FaceMesh
 */
interface FaceAnnotations {
  leftEyeUpper0: number[][];
  leftEyeLower0: number[][];
  rightEyeUpper0: number[][];
  rightEyeLower0: number[][];
}

/**
 * Face prediction from TensorFlow with annotations
 */
interface FacePrediction extends Face {
  annotations: FaceAnnotations;
  scaledMesh?: number[][];
}

/**
 * Bounding box for eye region
 */
interface EyeBoundingBox {
  origin: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
}

/**
 * TensorFlow FaceMesh tracker implementation
 * Detects faces and extracts eye patches for gaze prediction
 */
export class TensorFlowFaceMeshTracker extends Tracker {
  private detector: FaceLandmarksDetector | null = null;
  private detectorPromise: Promise<FaceLandmarksDetector> | null = null;
  private currentPositions: number[][] | null = null;
  private predictionReady: boolean = false;

  public readonly name = 'TFFaceMesh';

  /**
   * Create a new TensorFlow FaceMesh tracker
   */
  constructor() {
    super({
      enableOverlay: true,
      overlayColor: '#32EEDB',
      overlayLineWidth: 0.5,
      extractEyePatches: true,
      trackingQuality: 'medium',
    });
  }

  /**
   * Initialize the FaceMesh model
   * Handles different versions of the face-landmarks-detection API
   */
  public async initialize(): Promise<void> {
    this.setState(TrackerState.Initializing);

    try {
      const api = faceLandmarksDetection;

      // Try different API versions
      if (api.createDetector && api.SupportedModels) {
        // Newer API
        const modelType =
          api.SupportedModels.MediaPipeFaceMesh ??
          'MediaPipeFaceMesh';
        this.detectorPromise = api.createDetector(modelType, { runtime: 'tfjs', refineLandmarks: true, maxFaces: 1 });
      } else {
        throw new Error('face-landmarks-detection API not available');
      }

      this.detector = await this.detectorPromise;
      this.setState(TrackerState.Ready);
    } catch (error) {
      this.setState(TrackerState.Error);
      throw new Error(
        `Failed to initialize TensorFlow FaceMesh: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get eye patches from video frame
   * @param video - Video element containing the frame
   * @param canvas - Canvas for processing
   * @param width - Canvas width
   * @param height - Canvas height
   * @returns Eye features with patches, or null if no face detected
   */
  public async getEyePatches(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ): Promise<EyeFeatures | null> {
    if (canvas.width === 0 || !this.detector) {
      return null;
    }

    const startTime = performance.now();

    try {
      // Estimate faces from video
      const model = this.detector as FaceLandmarksDetector & {
        estimateFaces?: (
          input: HTMLVideoElement,
          options?: { flipHorizontal?: boolean; predictIrises?: boolean }
        ) => Promise<Face[]>;
      };

      let predictions: Face[] = [];

      // Handle different API signatures
      if (model.estimateFaces) {
        // Try newer API first
        try {
          predictions = await model.estimateFaces(video, {
            flipHorizontal: false,
            predictIrises: false,
          });
        } catch {
          // Fallback to simpler call
          predictions = await model.estimateFaces(video);
        }
      }

      const faceDetectionTime = performance.now() - startTime;

      // No face detected
      if (predictions.length === 0) {
        this.currentPositions = null;
        this.predictionReady = false;
        this.updateMetrics(faceDetectionTime, 0);
        return null;
      }

      // Extract eye patches
      const eyeExtractionStart = performance.now();
      const prediction = predictions[0] as FacePrediction;

      // Store positions for overlay
      this.currentPositions = prediction.scaledMesh ?? null;

      // Get eye bounding boxes
      const leftBBox = this.calculateEyeBoundingBox(
        prediction.annotations.leftEyeUpper0,
        prediction.annotations.leftEyeLower0
      );
      const rightBBox = this.calculateEyeBoundingBox(
        prediction.annotations.rightEyeUpper0,
        prediction.annotations.rightEyeLower0
      );

      // Validate bounding boxes
      if (
        leftBBox.width === 0 ||
        leftBBox.height === 0 ||
        rightBBox.width === 0 ||
        rightBBox.height === 0
      ) {
        this.updateMetrics(faceDetectionTime, performance.now() - eyeExtractionStart);
        return null;
      }

      // Extract image data for eyes
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        throw new Error('Could not get 2D context from canvas');
      }

      const leftImageData = context.getImageData(
        leftBBox.origin.x,
        leftBBox.origin.y,
        leftBBox.width,
        leftBBox.height
      );

      const rightImageData = context.getImageData(
        rightBBox.origin.x,
        rightBBox.origin.y,
        rightBBox.width,
        rightBBox.height
      );

      const leftPatch: EyePatch = {
        patch: leftImageData,
        imageX: leftBBox.origin.x,
        imageY: leftBBox.origin.y,
        width: leftBBox.width,
        height: leftBBox.height,
      };

      const rightPatch: EyePatch = {
        patch: rightImageData,
        imageX: rightBBox.origin.x,
        imageY: rightBBox.origin.y,
        width: rightBBox.width,
        height: rightBBox.height,
      };

      this.predictionReady = true;
      const eyeExtractionTime = performance.now() - eyeExtractionStart;
      this.updateMetrics(faceDetectionTime, eyeExtractionTime);

      return {
        left: leftPatch,
        right: rightPatch,
      };
    } catch (error) {
      throw new Error(
        `Failed to get eye patches: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Draw face landmark overlay
   * @param context - Canvas 2D rendering context
   * @param positions - Face landmark positions (not used, uses internal currentPositions)
   */
  public drawOverlay(context: CanvasRenderingContext2D, positions: number[]): void {
    // Use current positions if available, fallback to provided positions
    const keypoints = this.currentPositions || this.convertPositionsToKeypoints(positions);

    if (!keypoints) {
      return;
    }

    context.fillStyle = this.configuration.overlayColor;
    context.strokeStyle = this.configuration.overlayColor;
    context.lineWidth = this.configuration.overlayLineWidth;

    for (let i = 0; i < keypoints.length; i++) {
      const x = keypoints[i][0];
      const y = keypoints[i][1];

      context.beginPath();
      context.arc(x, y, 1, 0, Math.PI * 2);
      context.closePath();
      context.fill();
    }
  }

  /**
   * Get current face landmark positions
   * @returns Array of landmark positions or null if no face detected
   */
  public getPositions(): number[][] | null {
    return this.currentPositions;
  }

  /**
   * Reset tracker state
   */
  public reset(): void {
    super.reset();
    this.currentPositions = null;
    this.predictionReady = false;
  }

  /**
   * Check if predictions are ready
   * @returns True if face has been detected and predictions are available
   */
  public isPredictionReady(): boolean {
    return this.predictionReady;
  }

  /**
   * Calculate bounding box for eye region
   * @param upperArc - Upper eyelid landmark points
   * @param lowerArc - Lower eyelid landmark points
   * @returns Bounding box for the eye
   */
  private calculateEyeBoundingBox(
    upperArc: number[][],
    lowerArc: number[][]
  ): EyeBoundingBox {
    const topLeftX = Math.round(Math.min(...upperArc.map((point) => point[0])));
    const topLeftY = Math.round(Math.min(...upperArc.map((point) => point[1])));
    const bottomRightX = Math.round(Math.max(...lowerArc.map((point) => point[0])));
    const bottomRightY = Math.round(Math.max(...lowerArc.map((point) => point[1])));

    return {
      origin: {
        x: topLeftX,
        y: topLeftY,
      },
      width: bottomRightX - topLeftX,
      height: bottomRightY - topLeftY,
    };
  }

  /**
   * Convert flat position array to keypoints format
   * Helper for compatibility with external position data
   * @param positions - Flat array of positions
   * @returns 2D array of keypoints
   */
  private convertPositionsToKeypoints(positions: number[]): number[][] | null {
    if (!positions || positions.length === 0) {
      return null;
    }

    // Assuming positions come in pairs [x, y, x, y, ...]
    const keypoints: number[][] = [];
    for (let i = 0; i < positions.length; i += 2) {
      if (i + 1 < positions.length) {
        keypoints.push([positions[i], positions[i + 1]]);
      }
    }

    return keypoints.length > 0 ? keypoints : null;
  }
}
