/**
 * Configuration management for Webgazer
 * Provides type-safe parameter management, validation, and persistence
 */

/**
 * Eye tracking mode configuration
 */
export type TrackEyeMode = 'left' | 'right' | 'both';

/**
 * Video facing mode for camera constraints
 */
export type VideoFacingMode = 'user' | 'environment';

/**
 * Camera constraints for video capture
 */
export interface CameraConstraints {
  video: {
    width: {
      min: number;
      ideal: number;
      max: number;
    };
    height: {
      min: number;
      ideal: number;
      max: number;
    };
    facingMode: VideoFacingMode;
  };
}

/**
 * Configuration data structure for Webgazer
 */
export interface WebgazerConfigData {
  // Timing parameters
  moveTickSize: number;
  dataTimestep: number;

  // DOM element IDs
  videoContainerId: string;
  videoElementId: string;
  videoElementCanvasId: string;
  faceOverlayId: string;
  faceFeedbackBoxId: string;
  gazeDotId: string;

  // Video viewer dimensions
  videoViewerWidth: number;
  videoViewerHeight: number;

  // Face feedback box
  faceFeedbackBoxRatio: number;

  // Display settings
  showVideo: boolean;
  mirrorVideo: boolean;
  showFaceOverlay: boolean;
  showFaceFeedbackBox: boolean;
  showGazeDot: boolean;
  showVideoPreview: boolean;

  // Camera settings
  cameraConstraints: CameraConstraints;

  // Processing settings
  applyKalmanFilter: boolean;
  trackEye: TrackEyeMode;

  // Data persistence
  saveDataAcrossSessions: boolean;
  storingPoints: boolean;
}

/**
 * Validation result for configuration
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Webgazer configuration management class
 * Handles all configuration parameters with validation and persistence
 */
export class WebgazerConfig implements WebgazerConfigData {
  // Timing parameters
  public moveTickSize: number;
  public dataTimestep: number;

  // DOM element IDs
  public videoContainerId: string;
  public videoElementId: string;
  public videoElementCanvasId: string;
  public faceOverlayId: string;
  public faceFeedbackBoxId: string;
  public gazeDotId: string;

  // Video viewer dimensions
  public videoViewerWidth: number;
  public videoViewerHeight: number;

  // Face feedback box
  public faceFeedbackBoxRatio: number;

  // Display settings
  public showVideo: boolean;
  public mirrorVideo: boolean;
  public showFaceOverlay: boolean;
  public showFaceFeedbackBox: boolean;
  public showGazeDot: boolean;
  public showVideoPreview: boolean;

  // Camera settings
  public cameraConstraints: CameraConstraints;

  // Processing settings
  public applyKalmanFilter: boolean;
  public trackEye: TrackEyeMode;

  // Data persistence
  public saveDataAcrossSessions: boolean;
  public storingPoints: boolean;

  /**
   * Default configuration values
   */
  private static readonly DEFAULT_CONFIG: WebgazerConfigData = {
    moveTickSize: 50,
    dataTimestep: 50,
    videoContainerId: 'webgazerVideoContainer',
    videoElementId: 'webgazerVideoFeed',
    videoElementCanvasId: 'webgazerVideoCanvas',
    faceOverlayId: 'webgazerFaceOverlay',
    faceFeedbackBoxId: 'webgazerFaceFeedbackBox',
    gazeDotId: 'webgazerGazeDot',
    videoViewerWidth: 320,
    videoViewerHeight: 240,
    faceFeedbackBoxRatio: 0.66,
    showVideo: true,
    mirrorVideo: true,
    showFaceOverlay: true,
    showFaceFeedbackBox: true,
    showGazeDot: true,
    showVideoPreview: true,
    cameraConstraints: {
      video: {
        width: {
          min: 320,
          ideal: 640,
          max: 1920,
        },
        height: {
          min: 240,
          ideal: 480,
          max: 1080,
        },
        facingMode: 'user',
      },
    },
    applyKalmanFilter: true,
    trackEye: 'both',
    saveDataAcrossSessions: true,
    storingPoints: false,
  };

  /**
   * Create a new Webgazer configuration
   * @param initialConfig - Optional initial configuration values
   */
  constructor(initialConfig?: Partial<WebgazerConfigData>) {
    // Initialize with defaults
    const config = { ...WebgazerConfig.DEFAULT_CONFIG, ...initialConfig };

    // Assign all properties
    this.moveTickSize = config.moveTickSize;
    this.dataTimestep = config.dataTimestep;
    this.videoContainerId = config.videoContainerId;
    this.videoElementId = config.videoElementId;
    this.videoElementCanvasId = config.videoElementCanvasId;
    this.faceOverlayId = config.faceOverlayId;
    this.faceFeedbackBoxId = config.faceFeedbackBoxId;
    this.gazeDotId = config.gazeDotId;
    this.videoViewerWidth = config.videoViewerWidth;
    this.videoViewerHeight = config.videoViewerHeight;
    this.faceFeedbackBoxRatio = config.faceFeedbackBoxRatio;
    this.showVideo = config.showVideo;
    this.mirrorVideo = config.mirrorVideo;
    this.showFaceOverlay = config.showFaceOverlay;
    this.showFaceFeedbackBox = config.showFaceFeedbackBox;
    this.showGazeDot = config.showGazeDot;
    this.showVideoPreview = config.showVideoPreview;
    this.cameraConstraints = config.cameraConstraints;
    this.applyKalmanFilter = config.applyKalmanFilter;
    this.trackEye = config.trackEye;
    this.saveDataAcrossSessions = config.saveDataAcrossSessions;
    this.storingPoints = config.storingPoints;
  }

  /**
   * Validate the current configuration
   * @returns Validation result with errors and warnings
   */
  public validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate timing parameters
    if (this.moveTickSize <= 0) {
      errors.push('moveTickSize must be greater than 0');
    }
    if (this.dataTimestep <= 0) {
      errors.push('dataTimestep must be greater than 0');
    }
    if (this.moveTickSize < 10) {
      warnings.push('moveTickSize below 10ms may cause performance issues');
    }

    // Validate video dimensions
    if (this.videoViewerWidth <= 0) {
      errors.push('videoViewerWidth must be greater than 0');
    }
    if (this.videoViewerHeight <= 0) {
      errors.push('videoViewerHeight must be greater than 0');
    }
    if (this.videoViewerWidth < 160 || this.videoViewerHeight < 120) {
      warnings.push('Video viewer dimensions are very small, may affect visibility');
    }

    // Validate face feedback box ratio
    if (this.faceFeedbackBoxRatio <= 0 || this.faceFeedbackBoxRatio > 1) {
      errors.push('faceFeedbackBoxRatio must be between 0 and 1');
    }

    // Validate DOM element IDs
    const elementIds = [
      this.videoContainerId,
      this.videoElementId,
      this.videoElementCanvasId,
      this.faceOverlayId,
      this.faceFeedbackBoxId,
      this.gazeDotId,
    ];

    for (const id of elementIds) {
      if (!id || id.trim().length === 0) {
        errors.push('DOM element IDs cannot be empty');
        break;
      }
    }

    // Validate camera constraints
    const { video } = this.cameraConstraints;
    if (video.width.min <= 0 || video.height.min <= 0) {
      errors.push('Camera minimum dimensions must be greater than 0');
    }
    if (video.width.ideal < video.width.min || video.width.ideal > video.width.max) {
      errors.push('Camera ideal width must be between min and max');
    }
    if (video.height.ideal < video.height.min || video.height.ideal > video.height.max) {
      errors.push('Camera ideal height must be between min and max');
    }
    if (video.width.min < 160 || video.height.min < 120) {
      warnings.push('Very low camera resolution may affect tracking accuracy');
    }

    // Validate track eye mode
    const validTrackEyeModes: TrackEyeMode[] = ['left', 'right', 'both'];
    if (!validTrackEyeModes.includes(this.trackEye)) {
      errors.push(`trackEye must be one of: ${validTrackEyeModes.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Reset configuration to default values
   */
  public reset(): void {
    const defaultConfig = WebgazerConfig.DEFAULT_CONFIG;
    
    this.moveTickSize = defaultConfig.moveTickSize;
    this.dataTimestep = defaultConfig.dataTimestep;
    this.videoContainerId = defaultConfig.videoContainerId;
    this.videoElementId = defaultConfig.videoElementId;
    this.videoElementCanvasId = defaultConfig.videoElementCanvasId;
    this.faceOverlayId = defaultConfig.faceOverlayId;
    this.faceFeedbackBoxId = defaultConfig.faceFeedbackBoxId;
    this.gazeDotId = defaultConfig.gazeDotId;
    this.videoViewerWidth = defaultConfig.videoViewerWidth;
    this.videoViewerHeight = defaultConfig.videoViewerHeight;
    this.faceFeedbackBoxRatio = defaultConfig.faceFeedbackBoxRatio;
    this.showVideo = defaultConfig.showVideo;
    this.mirrorVideo = defaultConfig.mirrorVideo;
    this.showFaceOverlay = defaultConfig.showFaceOverlay;
    this.showFaceFeedbackBox = defaultConfig.showFaceFeedbackBox;
    this.showGazeDot = defaultConfig.showGazeDot;
    this.showVideoPreview = defaultConfig.showVideoPreview;
    this.cameraConstraints = JSON.parse(JSON.stringify(defaultConfig.cameraConstraints));
    this.applyKalmanFilter = defaultConfig.applyKalmanFilter;
    this.trackEye = defaultConfig.trackEye;
    this.saveDataAcrossSessions = defaultConfig.saveDataAcrossSessions;
    this.storingPoints = defaultConfig.storingPoints;
  }

  /**
   * Convert configuration to JSON-serializable object
   * @returns Plain object representation of configuration
   */
  public toJSON(): WebgazerConfigData {
    return {
      moveTickSize: this.moveTickSize,
      dataTimestep: this.dataTimestep,
      videoContainerId: this.videoContainerId,
      videoElementId: this.videoElementId,
      videoElementCanvasId: this.videoElementCanvasId,
      faceOverlayId: this.faceOverlayId,
      faceFeedbackBoxId: this.faceFeedbackBoxId,
      gazeDotId: this.gazeDotId,
      videoViewerWidth: this.videoViewerWidth,
      videoViewerHeight: this.videoViewerHeight,
      faceFeedbackBoxRatio: this.faceFeedbackBoxRatio,
      showVideo: this.showVideo,
      mirrorVideo: this.mirrorVideo,
      showFaceOverlay: this.showFaceOverlay,
      showFaceFeedbackBox: this.showFaceFeedbackBox,
      showGazeDot: this.showGazeDot,
      showVideoPreview: this.showVideoPreview,
      cameraConstraints: JSON.parse(JSON.stringify(this.cameraConstraints)),
      applyKalmanFilter: this.applyKalmanFilter,
      trackEye: this.trackEye,
      saveDataAcrossSessions: this.saveDataAcrossSessions,
      storingPoints: this.storingPoints,
    };
  }

  /**
   * Create configuration from JSON object
   * @param json - JSON object to parse
   * @returns New WebgazerConfig instance
   */
  public static fromJSON(json: Partial<WebgazerConfigData>): WebgazerConfig {
    return new WebgazerConfig(json);
  }

  /**
   * Create a deep copy of this configuration
   * @returns New WebgazerConfig instance with same values
   */
  public clone(): WebgazerConfig {
    return new WebgazerConfig(this.toJSON());
  }

  /**
   * Update multiple configuration values at once
   * @param updates - Partial configuration to merge
   */
  public update(updates: Partial<WebgazerConfigData>): void {
    Object.assign(this, updates);
  }

  /**
   * Get the default configuration
   * @returns Default configuration values
   */
  public static getDefaults(): WebgazerConfigData {
    return JSON.parse(JSON.stringify(WebgazerConfig.DEFAULT_CONFIG));
  }

  /**
   * Get event types for mouse tracking
   * Used for compatibility with original API
   * @returns Array of event type strings
   */
  public getEventTypes(): string[] {
    return ['click', 'move'];
  }
}
