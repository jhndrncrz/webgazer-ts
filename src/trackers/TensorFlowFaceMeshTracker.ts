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
import * as tf from '@tensorflow/tfjs';

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
      // Ensure TensorFlow.js is ready with a backend
      await tf.ready();
      
      // Set backend if not already set (prefer WebGL for performance)
      if (!tf.getBackend()) {
        try {
          await tf.setBackend('webgl');
          await tf.ready(); // Wait for backend to be ready
        } catch (e) {
          // Fallback to CPU backend if WebGL fails
          console.warn('WebGL backend failed, falling back to CPU:', e);
          await tf.setBackend('cpu');
          await tf.ready();
        }
      }

      console.log('TensorFlow backend ready:', tf.getBackend());

      const api = faceLandmarksDetection;

      // Create detector with proper configuration
      if (api.createDetector && api.SupportedModels) {
        const model = api.SupportedModels.MediaPipeFaceMesh;
        
        console.log('Creating MediaPipeFaceMesh detector...');
        
        // Configuration for MediaPipeFaceMesh
        // See: https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection
        const detectorConfig = {
          runtime: 'tfjs' as const,
          maxFaces: 1,
          refineLandmarks: true, // Better eye landmarks
        };
        
        this.detector = await api.createDetector(model, detectorConfig);
        console.log('MediaPipeFaceMesh detector created successfully');
      } else {
        throw new Error('face-landmarks-detection API not available');
      }

      this.setState(TrackerState.Ready);
      console.log('TensorFlowFaceMesh tracker initialized and ready');
    } catch (error) {
      this.setState(TrackerState.Error);
      console.error('Failed to initialize TensorFlow FaceMesh:', error);
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
    // Validate inputs
    if (!video || !(video instanceof HTMLVideoElement)) {
      console.error('Invalid video element passed to getEyePatches:', typeof video);
      return null;
    }

    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      console.error('Invalid canvas element passed to getEyePatches:', typeof canvas);
      return null;
    }

    if (canvas.width === 0 || !this.detector) {
      console.warn('Cannot get eye patches: canvas width is 0 or detector not ready');
      return null;
    }

    // CRITICAL: Wait for video to be fully ready (like TensorFlow demo does)
    // Reference: TensorFlow face-landmarks-detection demo renderResult()
    if (video.readyState < 2) {
      await new Promise<void>((resolve) => {
        const onLoadedData = () => {
          video.removeEventListener('loadeddata', onLoadedData);
          resolve();
        };
        video.addEventListener('loadeddata', onLoadedData);
        
        // Timeout after 5 seconds to prevent hanging
        setTimeout(() => {
          video.removeEventListener('loadeddata', onLoadedData);
          resolve();
        }, 5000);
      });
    }

    // Re-check after waiting
    if (video.readyState < 2) {
      // Only log occasionally to avoid spam
      if (Date.now() % 5000 < 50) {
        console.warn('Video still not ready after waiting, readyState:', video.readyState);
      }
      return null;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      if (Date.now() % 5000 < 50) {
        console.warn('Video dimensions are 0:', video.videoWidth, 'x', video.videoHeight);
      }
      return null;
    }

    // Log video element details on first call (for debugging)
    if (!video.dataset.trackerValidated) {
      console.log('📹 Video element received by tracker:', {
        tagName: video.tagName,
        readyState: video.readyState,
        readyStateText: ['HAVE_NOTHING', 'HAVE_METADATA', 'HAVE_CURRENT_DATA', 'HAVE_FUTURE_DATA', 'HAVE_ENOUGH_DATA'][video.readyState],
        dimensions: `${video.videoWidth}x${video.videoHeight}`,
        attributes: `width=${video.width}, height=${video.height}`,
        paused: video.paused,
        ended: video.ended,
        seeking: video.seeking,
        currentTime: video.currentTime.toFixed(2),
        duration: video.duration,
        srcObject: video.srcObject ? 'MediaStream present' : 'No srcObject'
      });
      video.dataset.trackerValidated = 'true';
    }

    const startTime = performance.now();

    try {
      // Estimate faces from video using the detector
      let predictions: Face[] = [];

      // console.log('🔍 Calling estimateFaces with video element...');

      // The newer TensorFlow face-landmarks-detection API uses estimateFaces
      try {
        predictions = await this.detector.estimateFaces(video, {
          flipHorizontal: true,
        });
        
        // console.log('✅ estimateFaces completed. Predictions:', predictions.length);
      } catch (error) {
        console.error('❌ Error calling estimateFaces:', error);
        
        // Try without options as fallback
        try {
          console.log('Trying estimateFaces without options...');
          predictions = await this.detector.estimateFaces(video);
          console.log('✅ Fallback estimateFaces completed. Predictions:', predictions.length);
        } catch (fallbackError) {
          console.error('❌ Fallback estimateFaces also failed:', fallbackError);
          return null;
        }
      }

      const faceDetectionTime = performance.now() - startTime;

      // No face detected
      if (predictions.length === 0) {
        this.currentPositions = null;
        this.predictionReady = false;
        this.updateMetrics(faceDetectionTime, 0);
        
        // Log occasionally to help debug
        if (Date.now() % 3000 < 50) {
          console.warn('⚠️ No face detected in video frame');
          console.log('Video state at detection time:', {
            readyState: video.readyState,
            width: video.videoWidth,
            height: video.videoHeight,
            paused: video.paused,
            currentTime: video.currentTime
          });
        }
        
        return null;
      }

      // console.log('✅ Face detected! Predictions:', predictions.length);

      // Extract eye patches
      const eyeExtractionStart = performance.now();
      const prediction = predictions[0];

      // The face prediction structure from TensorFlow face-landmarks-detection
      // For MediaPipeFaceMesh, we get keypoints array instead of annotations
      // Try to get positions from keypoints or scaledMesh
      let positions: number[][] | undefined;
      
      if ('keypoints' in prediction && Array.isArray(prediction.keypoints)) {
        // Newer API: keypoints is an array of {x, y, z?, name?} objects
        positions = prediction.keypoints.map((kp: any) => [kp.x, kp.y]);
      } else if ('scaledMesh' in prediction) {
        positions = prediction.scaledMesh as number[][];
      }
      
      // Store positions for overlay
      this.currentPositions = positions ?? null;

      // Try to get eye regions from keypoints or annotations
      let leftEyeUpper: number[][];
      let leftEyeLower: number[][];
      let rightEyeUpper: number[][];
      let rightEyeLower: number[][];

      // Check if we have annotations (older API)
      const predWithAnnotations = prediction as FacePrediction;
      if (predWithAnnotations.annotations) {
        leftEyeUpper = predWithAnnotations.annotations.leftEyeUpper0;
        leftEyeLower = predWithAnnotations.annotations.leftEyeLower0;
        rightEyeUpper = predWithAnnotations.annotations.rightEyeUpper0;
        rightEyeLower = predWithAnnotations.annotations.rightEyeLower0;
      } else if (positions && positions.length >= 468) {
        // MediaPipeFaceMesh has 468 landmarks with known indices for eyes
        // Left eye: indices 33, 133, 159, 145, 246, etc.
        // Right eye: indices 362, 263, 386, 374, 466, etc.
        // Using simplified eye contours
        const leftEyeIndices = [33, 7, 163, 144, 145, 153, 154, 155, 133];
        const rightEyeIndices = [362, 382, 381, 380, 374, 373, 390, 249, 263];
        
        leftEyeUpper = leftEyeIndices.map(i => positions![i]);
        leftEyeLower = leftEyeIndices.map(i => positions![i]);
        rightEyeUpper = rightEyeIndices.map(i => positions![i]);
        rightEyeLower = rightEyeIndices.map(i => positions![i]);
      } else {
        console.error('Cannot extract eye regions from face prediction');
        this.updateMetrics(faceDetectionTime, performance.now() - eyeExtractionStart);
        return null;
      }

      // Get eye bounding boxes
      const leftBBox = this.calculateEyeBoundingBox(leftEyeUpper, leftEyeLower);
      const rightBBox = this.calculateEyeBoundingBox(rightEyeUpper, rightEyeLower);

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
