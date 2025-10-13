/**
 * Type definitions for rendering system
 */

/**
 * Video renderer configuration
 */
export interface VideoRendererConfig {
  containerId: string;
  videoElementId: string;
  canvasId: string;
  width: number;
  height: number;
  mirror: boolean;
  visible: boolean;
}

/**
 * Overlay renderer configuration
 */
export interface OverlayRendererConfig {
  containerId: string;
  canvasId: string;
  width: number;
  height: number;
  zIndex: number;
  showLandmarks: boolean;
  showEyeRegions: boolean;
  showFaceBox: boolean;
  landmarkColor: string;
  landmarkRadius: number;
  eyeRegionColor: string;
  eyeRegionLineWidth: number;
  faceBoxColor: string;
  faceBoxLineWidth: number;
}

/**
 * Gaze dot renderer configuration
 */
export interface GazeDotRendererConfig {
  dotId: string;
  color: string;
  size: number;
  visible: boolean;
  smooth: boolean;
}

/**
 * Canvas renderer configuration
 */
export interface CanvasRendererConfig {
  canvasId: string;
  width: number;
  height: number;
  clearBeforeDraw: boolean;
}

/**
 * Validation box configuration
 */
export interface ValidationBoxConfig {
  boxId: string;
  ratio: number;
  visible: boolean;
  colors: {
    valid: string;
    invalid: string;
  };
}
