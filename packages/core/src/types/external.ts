/**
 * External library type augmentations and definitions
 * Provides proper typing for third-party libraries used by Webgazer
 */

/**
 * Type definitions for @tensorflow-models/face-landmarks-detection
 * These types provide better compatibility across different versions
 */
// declare module '@tensorflow-models/face-landmarks-detection' {
//   export interface FaceLandmarksDetector {
//     estimateFaces(
//       input: HTMLVideoElement | HTMLCanvasElement | ImageData,
//       options?: EstimationConfig
//     ): Promise<Face[]>;
//   }

//   export interface EstimationConfig {
//     flipHorizontal?: boolean;
//     staticImageMode?: boolean;
//   }

//   export interface Face {
//     keypoints: Keypoint[];
//     box: FaceBoundingBox;
//   }

//   export interface Keypoint {
//     x: number;
//     y: number;
//     z?: number;
//     name?: string;
//   }

//   export interface FaceBoundingBox {
//     xMin: number;
//     yMin: number;
//     xMax: number;
//     yMax: number;
//     width: number;
//     height: number;
//   }

//   export interface MediaPipeFaceMeshMediaPipeModelConfig {
//     runtime: 'mediapipe';
//     solutionPath?: string;
//     maxFaces?: number;
//     refineLandmarks?: boolean;
//   }

//   export interface MediaPipeFaceMeshTfjsModelConfig {
//     runtime: 'tfjs';
//     maxFaces?: number;
//     refineLandmarks?: boolean;
//   }

//   export type MediaPipeFaceMeshModelConfig =
//     | MediaPipeFaceMeshMediaPipeModelConfig
//     | MediaPipeFaceMeshTfjsModelConfig;

//   export function createDetector(
//     model: unknown,
//     config?: MediaPipeFaceMeshModelConfig
//   ): Promise<FaceLandmarksDetector>;
// }

/**
 * Augment the regression module types
 */
// declare module 'regression' {
//   export interface DataPoint {
//     0: number;
//     1: number;
//   }

//   export interface Result {
//     equation: number[];
//     points: DataPoint[];
//     string: string;
//     r2: number;
//     predict(x: number): [number, number];
//   }

//   export function linear(
//     data: DataPoint[],
//     options?: { order?: number; precision?: number }
//   ): Result;

//   export function polynomial(
//     data: DataPoint[],
//     options?: { order?: number; precision?: number }
//   ): Result;
// }

/**
 * Browser API type extensions
 */
declare global {
  interface Window {
    webkitRequestAnimationFrame?: typeof requestAnimationFrame;
    mozRequestAnimationFrame?: typeof requestAnimationFrame;
    oRequestAnimationFrame?: typeof requestAnimationFrame;
    msRequestAnimationFrame?: typeof requestAnimationFrame;
    webkitCancelRequestAnimationFrame?: typeof cancelAnimationFrame;
    mozCancelRequestAnimationFrame?: typeof cancelAnimationFrame;
    oCancelRequestAnimationFrame?: typeof cancelAnimationFrame;
    msCancelRequestAnimationFrame?: typeof cancelAnimationFrame;
  }

  interface Navigator {
    webkitGetUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: (stream: MediaStream) => void,
      errorCallback: (error: Error) => void
    ) => void;
    mozGetUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: (stream: MediaStream) => void,
      errorCallback: (error: Error) => void
    ) => void;
  }
}

export {};
