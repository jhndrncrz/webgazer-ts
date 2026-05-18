/**
 * Webgazer - Main Eye Tracking Class
 * 
 * Singleton class that orchestrates all Webgazer modules including:
 * - Face/eye tracking (TensorFlowFaceMeshTracker)
 * - Gaze prediction (Ridge regressors)
 * - Video rendering and visualization
 * - Calibration and validation
 * - Event handling and data collection
 * - Data persistence
 * 
 * Maintains 100% backward API compatibility with original Webgazer.
 */

import { WebgazerConfig, WebgazerConfigData, LogLevel, SmoothingType } from './WebgazerConfig';
import type { ITracker, IRegressor, IRenderer } from './types';
import type { 
  GazePrediction, 
  EyeFeatures, 
  Point2D,
  TrackingData 
} from '../types/index';
import { EventManager } from '../events/EventManager';
import { EventType } from '../events/types';
import { MouseEventHandler } from '../events/MouseEventHandler';
import { VideoRenderer } from '../rendering/VideoRenderer';
import { OverlayRenderer } from '../rendering/OverlayRenderer';
import { GazeDotRenderer } from '../rendering/GazeDotRenderer';
import { CalibrationManager } from '../calibration/CalibrationManager';
import { ValidationBox } from '../calibration/ValidationBox';
import { StorageManager } from '../utils/data/StorageManager';
import { MediaDeviceManager } from '../utils/browser/MediaDeviceManager';
import { DOMManager } from '../utils/browser/DOMManager';
import { BrowserCompatibility } from '../utils/browser/BrowserCompatibility';
import { DataWindow } from '../utils/data/DataWindow';
import { boundToScreen } from '../utils/image/EyeExtractor';

/**
 * Webgazer state enum
 */
export enum WebgazerState {
  NotInitialized = 'not_initialized',
  Initializing = 'initializing',
  Ready = 'ready',
  Running = 'running',
  Paused = 'paused',
  Stopped = 'stopped',
  Error = 'error'
}

/**
 * Type for gaze prediction callback
 */
export type GazeCallback = (prediction: GazePrediction | null, timestamp: number) => void;

/**
 * Type for tracker constructor
 */
export type TrackerConstructor = new (...args: unknown[]) => ITracker;

/**
 * Type for regressor constructor
 */
export type RegressorConstructor = new (...args: unknown[]) => IRegressor;

/**
 * Main Webgazer class - Singleton pattern
 */
export class Webgazer {
  // Singleton instance
  private static instance: Webgazer | null = null;

  // Static registries for trackers and regressors
  private static trackerRegistry: Map<string, TrackerConstructor> = new Map();
  private static regressorRegistry: Map<string, RegressorConstructor> = new Map();

  // Core components
  private config: WebgazerConfig;
  private tracker: ITracker | null = null;
  private regressors: IRegressor[] = [];
  private currentTrackerName: string = '';
  private currentRegressionNames: string[] = [];
  
  // Event handling
  private eventManager: EventManager;
  private mouseEventHandler: MouseEventHandler;
  
  // Rendering components
  private videoRenderer: VideoRenderer | null = null;
  private overlayRenderer: OverlayRenderer | null = null;
  private gazeDotRenderer: GazeDotRenderer | null = null;
  
  // Calibration components
  private calibrationManager: CalibrationManager | null = null;
  private validationBox: ValidationBox | null = null;
  
  // Storage
  private storageManager: StorageManager;
  
  // Media device management
  private mediaDeviceManager: MediaDeviceManager;
  
  // State management
  private state: WebgazerState = WebgazerState.NotInitialized;
  private mediaStream: MediaStream | null = null;
  private gazeCallback: GazeCallback | null = null;
  private predictionLoop: number | null = null;
  
  // New: Throttling and state for QoL/Performance
  private lastFrameTime: number = 0;
  private visibilityListener: (() => void) | null = null;
  private lastEmaPrediction: GazePrediction | null = null;
  private faceDetectionCounter: number = 0;
  private lastEyeFeatures: EyeFeatures | null = null;
  
  // Smoothing buffer for predictions (matches original webgazer.js)
  // Original: smoothingVals = new util.DataWindow(4)
  private smoothingBuffer: DataWindow<GazePrediction>;

  // Circular buffer for last 50 predictions (storePoints/getStoredPoints API)
  // Matches original: xPast50[k] / yPast50[k]
  private xPast50: number[] = new Array(50).fill(0);
  private yPast50: number[] = new Array(50).fill(0);
  private storedPointsIndex: number = 0;
  
  // Video elements
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;

  /**
   * Private constructor (Singleton pattern)
   */
  private constructor() {
    this.config = new WebgazerConfig();
    this.eventManager = new EventManager({
      enableEventCapture: true,
      enableGazePrediction: true
    });
    this.mouseEventHandler = new MouseEventHandler({
      captureClicks: true,
      captureMoves: true,  // Enable mouse movement tracking (matches original webgazer.js)
      moveThrottle: 50,    // Throttle to 50ms between move events
      ignoredSelectors: []
    });
    this.storageManager = new StorageManager();
    this.mediaDeviceManager = new MediaDeviceManager();
    
    // Initialize smoothing buffer (4 predictions, matches original)
    this.smoothingBuffer = new DataWindow<GazePrediction>(4);
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): Webgazer {
    if (!Webgazer.instance) {
      Webgazer.instance = new Webgazer();
    }
    return Webgazer.instance;
  }

  /**
   * Register a tracker module
   */
  public static addTrackerModule(name: string, constructor: TrackerConstructor): void {
    Webgazer.trackerRegistry.set(name, constructor);
  }

  /**
   * Register a regressor module
   */
  public static addRegressionModule(name: string, constructor: RegressorConstructor): void {
    Webgazer.regressorRegistry.set(name, constructor);
  }

  // ============================================================================
  // Lifecycle Methods
  // ============================================================================

  /**
   * Begin eye tracking
   * @param onFail - Optional callback if initialization fails
   * @returns Promise that resolves to Webgazer instance for chaining
   */
  public async begin(onFail?: () => void): Promise<Webgazer> {
    if (this.state === WebgazerState.Running || this.state === WebgazerState.Initializing) {
      return this;
    }

    try {
      this.state = WebgazerState.Initializing;

      // 1. Validate configuration
      const validation = this.config.validate();
      if (validation.errors.length > 0) {
        console.error('Webgazer configuration errors:', validation.errors);
        throw new Error('Invalid configuration: ' + validation.errors.join(', '));
      }

      // 2. Initialize camera
      await this.initializeCamera();

      // 3. Create video renderer
      await this.initializeVideoRenderer();

      // 4. Initialize tracker
      await this.initializeTracker();

      // 5. Initialize regressors
      await this.initializeRegressors();

      // 6. Initialize renderers
      this.initializeOverlayRenderer();
      this.initializeGazeDotRenderer();

      // 7. Initialize calibration system
      this.initializeCalibration();

      // 8. Load saved data if enabled
      if (this.config.saveDataAcrossSessions) {
        await this.loadSavedData();
      }

      // 9. Start mouse event listeners for continuous calibration (matches original Webgazer API)
      // In the original Webgazer, this is called automatically in begin()
      this.addMouseEventListeners();

      // 10. Start prediction loop
      this.state = WebgazerState.Ready;
      this.startPredictionLoop();

      // 11. Setup auto-pause if enabled
      this.setupVisibilityListener();

      this.log('info', 'Webgazer components initialized, waiting for tracking data...');
      return this;
    } catch (error) {
      console.error('Webgazer initialization failed:', error);
      this.state = WebgazerState.Error;
      
      if (onFail) {
        onFail();
      }
      
      throw error;
    }
  }

  /**
   * Pause eye tracking (keeps camera running)
   */
  public pause(): Webgazer {
    if (this.state === WebgazerState.Running) {
      this.stopPredictionLoop();
      this.mouseEventHandler.stop();
      this.state = WebgazerState.Paused;
      console.log('Webgazer paused');
    }
    return this;
  }

  /**
   * Resume eye tracking
   */
  public async resume(): Promise<Webgazer> {
    if (this.state === WebgazerState.Paused) {
      this.state = WebgazerState.Running;
      this.startPredictionLoop();
      
      // Restart mouse handlers if previously enabled (check storingPoints)
      if (this.config.storingPoints) {
        this.mouseEventHandler.start();
      }
      
      console.log('Webgazer resumed');
    }
    return this;
  }

  /**
   * End eye tracking and clean up resources
   */
  public end(): Webgazer {
    // Stop prediction loop
    this.stopPredictionLoop();

    // Stop mouse event handlers
    this.mouseEventHandler.stop();

    // Remove visibility listener if it exists
    this.removeVisibilityListener();

    // Save data if enabled (background fire-and-forget; error handling is internal)
    if (this.config.saveDataAcrossSessions) {
      this.saveDataAcrossSessions(true);
    }

    // Clean up renderers first (before stopping video)
    if (this.videoRenderer) {
      this.videoRenderer.destroy(); // This will also stop the stream
      this.videoRenderer = null;
    }

    if (this.overlayRenderer) {
      this.overlayRenderer.destroy();
      this.overlayRenderer = null;
    }

    if (this.gazeDotRenderer) {
      this.gazeDotRenderer.destroy();
      this.gazeDotRenderer = null;
    }

    if (this.validationBox) {
      this.validationBox.destroy();
      this.validationBox = null;
    }

    // Clean up tracker
    if (this.tracker) {
      // Tracker cleanup if needed
      this.tracker = null;
    }

    // Reset state
    this.state = WebgazerState.Stopped;
    if (this.mediaStream) {
      this.mediaDeviceManager.stopVideoStream();
    }
    this.mediaStream = null;
    this.videoElement = null;
    this.canvasElement = null;

    console.log('Webgazer ended');
    return this;
  }

  /**
   * Check if Webgazer is ready (initialized and waiting or running)
   */
  public isReady(): boolean {
    return [WebgazerState.Running, WebgazerState.Paused, WebgazerState.Ready].includes(this.state);
  }

  // ============================================================================
  // Initialization Methods
  // ============================================================================

  /**
   * Initialize camera access
   */
  private async initializeCamera(): Promise<void> {
    const constraints = this.config.cameraConstraints;
    
    try {
      this.mediaStream = await this.mediaDeviceManager.requestCameraAccess(constraints);
      console.log('Camera initialized');
    } catch (error) {
      console.error('Failed to access camera:', error);
      throw new Error('Camera access denied or unavailable');
    }
  }

  /**
   * Initialize video renderer
   */
  private async initializeVideoRenderer(): Promise<void> {
    if (!this.mediaStream) {
      throw new Error('Media stream not initialized');
    }

    this.videoRenderer = new VideoRenderer({
      containerId: this.config.videoContainerId,
      videoElementId: this.config.videoElementId,
      canvasId: this.config.videoElementCanvasId,
      width: this.config.videoViewerWidth,
      height: this.config.videoViewerHeight,
      mirror: this.config.mirrorVideo,
      visible: this.config.showVideo
    });

    await this.videoRenderer.initialize();
    this.videoRenderer.setStream(this.mediaStream);

    // Store references to video and canvas elements
    this.videoElement = this.videoRenderer.getVideoElement();
    this.canvasElement = this.videoRenderer.getCanvas();

    console.log('Video renderer initialized');
  }

  /**
   * Initialize tracker
   */
  private async initializeTracker(): Promise<void> {
    if (!this.currentTrackerName) {
      throw new Error('No tracker set. Call setTracker() first.');
    }

    // Recreate tracker if it was cleaned up (e.g., after end() was called)
    if (!this.tracker) {
      const TrackerClass = Webgazer.trackerRegistry.get(this.currentTrackerName);
      
      if (!TrackerClass) {
        throw new Error(`Tracker "${this.currentTrackerName}" not found in registry`);
      }
      
      this.tracker = new TrackerClass();
      console.log(`Tracker ${this.currentTrackerName} recreated after cleanup`);
    }

    if (!this.videoElement || !this.canvasElement) {
      throw new Error('Video elements not initialized');
    }

    // Tracker needs to have video/canvas set before initialization
    // Set them as properties if tracker supports it
    if ('videoElement' in this.tracker) {
      (this.tracker as any).videoElement = this.videoElement;
    }
    if ('canvas' in this.tracker) {
      (this.tracker as any).canvas = this.canvasElement;
    }

    await this.tracker.initialize();

    console.log(`Tracker ${this.currentTrackerName} initialized`);
  }

  /**
   * Initialize regressors
   */
  private async initializeRegressors(): Promise<void> {
    if (this.regressors.length === 0) {
      throw new Error('No regressors set. Call setRegression() first.');
    }

    for (const regressor of this.regressors) {
      await regressor.initialize();
    }

    console.log(`${this.regressors.length} regressor(s) initialized`);
  }

  /**
   * Initialize overlay renderer
   */
  private initializeOverlayRenderer(): void {
    if (!this.videoElement) {
      return;
    }

    // Use actual video dimensions for canvas width/height (actual pixels)
    const videoWidth = this.videoElement.videoWidth;
    const videoHeight = this.videoElement.videoHeight;
    
    // Use video viewer dimensions for CSS styling (display size)
    const viewerWidth = this.config.videoViewerWidth;
    const viewerHeight = this.config.videoViewerHeight;

    this.overlayRenderer = new OverlayRenderer({
      containerId: this.config.videoContainerId,
      canvasId: this.config.faceOverlayId,
      width: videoWidth,  // Canvas pixel dimensions
      height: videoHeight,
      zIndex: 998,
      showLandmarks: true,
      showEyeRegions: true,
      showFaceBox: true,
      landmarkColor: '#32EEDB', // Cyan color to match legacy
      landmarkRadius: 1, // Smaller points for cleaner mesh
      eyeRegionColor: '#ff0000',
      eyeRegionLineWidth: 2,
      faceBoxColor: '#ffff00',
      faceBoxLineWidth: 2
    });

    this.overlayRenderer.initialize();
    
    // Set CSS dimensions to match video viewer size (scaling)
    this.overlayRenderer.setStyleDimensions(viewerWidth, viewerHeight);
    
    // Set initial visibility based on config
    this.overlayRenderer.setVisible(this.config.showFaceOverlay);
    
    console.log('✅ Overlay renderer initialized:');
    console.log('   Canvas dimensions:', videoWidth, 'x', videoHeight, '(actual pixels)');
    console.log('   CSS dimensions:', viewerWidth, 'x', viewerHeight, '(display size)');
  }

  /**
   * Initialize gaze dot renderer
   */
  private initializeGazeDotRenderer(): void {
    this.gazeDotRenderer = new GazeDotRenderer({
      dotId: this.config.gazeDotId,
      size: 10,
      color: 'red',
      visible: this.config.showGazeDot,
      smooth: this.config.applyKalmanFilter
    });

    this.gazeDotRenderer.initialize();
    console.log('Gaze dot renderer initialized');
  }

  /**
   * Initialize calibration system
   */
  private initializeCalibration(): void {
    this.calibrationManager = new CalibrationManager({
      pointCount: 5,
      pointDuration: 1000,
      pointSize: 20,
      pointColor: '#ff0000',
      requireClick: false,
      showProgress: true,
      autoAdvance: true
    });

    if (this.config.showFaceFeedbackBox) {
      this.validationBox = new ValidationBox({
        containerId: this.config.videoContainerId,
        boxId: this.config.faceFeedbackBoxId,
        ratio: this.config.faceFeedbackBoxRatio,
        colors: {
          valid: '#00ff00',      // Green when face is properly positioned
          invalid: '#ff0000',    // Red when face not detected or badly positioned
          warning: '#ffff00'     // Yellow when face needs adjustment
        },
        showInstructions: true,
        instructionText: 'Position your face inside the box'
      });

      this.validationBox.initialize();
      console.log('✅ Face feedback box initialized (ratio:', this.config.faceFeedbackBoxRatio, ')');
    }

    console.log('Calibration system initialized');
  }

  // ============================================================================
  // Prediction Loop
  // ============================================================================

  /**
   * Start the prediction loop
   */
  private startPredictionLoop(): void {
    if (this.predictionLoop !== null) {
      return; // Already running
    }

    const predict = async (now: number): Promise<void> => {
      if (this.state !== WebgazerState.Running && this.state !== WebgazerState.Ready) {
        return;
      }

      // Performance: Throttling based on maxFPS
      const frameInterval = 1000 / this.config.maxFPS;
      const elapsed = now - this.lastFrameTime;

      if (elapsed < frameInterval) {
        this.schedulePrediction(predict);
        return;
      }

      this.lastFrameTime = now;

      try {
        // Performance: Optimization by skipping tracker calls
        let eyeFeatures: EyeFeatures | null = null;
        
        if (this.faceDetectionCounter % this.config.faceDetectionInterval === 0) {
          eyeFeatures = await this.getEyeFeatures();
          this.lastEyeFeatures = eyeFeatures;
        } else {
          eyeFeatures = this.lastEyeFeatures;
        }
        
        this.faceDetectionCounter++;

        if (eyeFeatures) {
          // Transition to Running state on first successful tracking data
          if (this.state === WebgazerState.Ready) {
            this.state = WebgazerState.Running;
            this.log('info', '✅ Webgazer is now fully operational and tracking!');
            
            // Emit start event (EventEmitter style)
            this.eventManager.emit('start', { timestamp: Date.now() });
          }

          // Update overlay and validation box (rest of the logic remains same...)
          this.updateVisualComponents();

          // Get predictions from regressors
          const predictions = await this.getPredictions(eyeFeatures);

          if (predictions.length > 0) {
            let prediction = predictions[0]; // Use first regressor's prediction
            let smoothedPrediction: GazePrediction;

            // Feature: Enhanced Smoothing Types
            if (this.config.smoothingType === 'ema') {
              // Exponential Moving Average
              if (!this.lastEmaPrediction) {
                this.lastEmaPrediction = prediction;
              } else {
                const alpha = this.config.emaAlpha;
                this.lastEmaPrediction = {
                  x: alpha * prediction.x + (1 - alpha) * this.lastEmaPrediction.x,
                  y: alpha * prediction.y + (1 - alpha) * this.lastEmaPrediction.y
                };
              }
              smoothedPrediction = { ...this.lastEmaPrediction };
            } else {
              // Default: Moving Average (matches original webgazer.js)
              this.smoothingBuffer.push(prediction);
              
              let smoothedX = 0;
              let smoothedY = 0;
              const bufferLength = this.smoothingBuffer.length;
              
              for (let i = 0; i < bufferLength; i++) {
                const pred = this.smoothingBuffer.get(i);
                smoothedX += pred.x;
                smoothedY += pred.y;
              }
              
              smoothedPrediction = {
                x: smoothedX / bufferLength,
                y: smoothedY / bufferLength
              };
            }

            // Constrain to viewport
            smoothedPrediction.x = Math.max(0, Math.min(smoothedPrediction.x, window.innerWidth));
            smoothedPrediction.y = Math.max(0, Math.min(smoothedPrediction.y, window.innerHeight));

            // Call user callback and update renderers
            if (this.gazeCallback) {
              this.gazeCallback(smoothedPrediction, Date.now());
            }

            if (this.gazeDotRenderer && this.config.showGazeDot) {
              this.gazeDotRenderer.setPosition(smoothedPrediction);
            }

            this.eventManager.emit(EventType.GazePrediction, {
              prediction: smoothedPrediction,
              timestamp: Date.now()
            });
          }
        }
      } catch (error) {
        this.log('error', 'Prediction loop error:', error);
      }

      // Schedule next prediction
      this.schedulePrediction(predict);
    };

    // Start the loop
    this.schedulePrediction(predict);
    this.log('info', 'Prediction loop started');
  }

  /**
   * Helper to update visual components (overlay, validation box)
   */
  private updateVisualComponents(): void {
    if (!this.tracker || !this.videoElement) return;
    
    const positions = this.tracker.getPositions();
    if (!positions || positions.length === 0) {
      if (this.validationBox && this.config.showFaceFeedbackBox) {
        this.validationBox.updateFromFaceBox(undefined);
      }
      return;
    }

    const landmarks = positions.map(pos => ({ x: pos[0], y: pos[1] }));
    const xs = positions.map(p => p[0]);
    const ys = positions.map(p => p[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const faceBox = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };

    if (this.overlayRenderer && this.config.showFaceOverlay) {
      this.overlayRenderer.drawLandmarks(landmarks);
      if (this.config.showFaceFeedbackBox) {
        this.overlayRenderer.drawFaceBox(faceBox);
      }
    }

    if (this.validationBox && this.config.showFaceFeedbackBox) {
      this.validationBox.updateFromFaceBox(faceBox);
    }
  }

  /**
   * Stop the prediction loop
   */
  private stopPredictionLoop(): void {
    if (this.predictionLoop !== null) {
      window.cancelAnimationFrame(this.predictionLoop);
      this.predictionLoop = null;
      console.log('Prediction loop stopped');
    }
  }

  /**
   * Schedule next prediction
   */
  private schedulePrediction(callback: FrameRequestCallback): void {
    this.predictionLoop = window.requestAnimationFrame(callback);
  }

  /**
   * Get eye features from tracker
   */
  private async getEyeFeatures(): Promise<EyeFeatures | null> {
    if (!this.tracker || !this.videoElement || !this.canvasElement) {
      console.warn('Cannot get eye features: missing tracker, video, or canvas');
      return null;
    }

    try {
      // Validate video element before passing to tracker
      if (!(this.videoElement instanceof HTMLVideoElement)) {
        console.error('videoElement is not an HTMLVideoElement:', typeof this.videoElement);
        return null;
      }

      if (!this.videoElement.srcObject) {
        console.warn('Video element has no srcObject (stream)');
        return null;
      }

      // Check if video is actually playing
      if (this.videoElement.readyState < 2) {
        // Video not ready yet - this is normal during startup
        return null;
      }

      // Validate video dimensions
      if (this.videoElement.videoWidth === 0 || this.videoElement.videoHeight === 0) {
        console.warn('Video has no dimensions yet:', 
          this.videoElement.videoWidth, 'x', this.videoElement.videoHeight);
        return null;
      }

      // Log video state on first successful check (for debugging)
      if (!this.videoElement.dataset.validated) {
        console.log('✅ Video element validated:', {
          type: this.videoElement.constructor.name,
          readyState: this.videoElement.readyState,
          dimensions: `${this.videoElement.videoWidth}x${this.videoElement.videoHeight}`,
          paused: this.videoElement.paused,
          muted: this.videoElement.muted,
          currentTime: this.videoElement.currentTime,
          srcObject: !!this.videoElement.srcObject
        });
        this.videoElement.dataset.validated = 'true';
      }

      // Update canvas with current video frame
      if (this.videoRenderer) {
        this.videoRenderer.update();
      }

      // Get eye patches from tracker
      // TensorFlowFaceMeshTracker requires 4 parameters: video, canvas, width, height
      const eyeFeatures = await this.tracker.getEyePatches(
        this.videoElement,
        this.canvasElement,
        this.canvasElement.width,
        this.canvasElement.height
      );

      return eyeFeatures;
    } catch (error) {
      console.error('Failed to get eye features:', error);
      return null;
    }
  }

  /**
   * Get tracking data from tracker (legacy method, kept for compatibility)
   */
  private async getTrackingData(): Promise<TrackingData | null> {
    const eyeFeatures = await this.getEyeFeatures();
    
    if (!eyeFeatures) {
      return null;
    }

    return {
      timestamp: Date.now(),
      eyeFeatures: eyeFeatures
    };
  }

  /**
   * Get predictions from all regressors
   */
  private async getPredictions(eyeFeatures: EyeFeatures): Promise<GazePrediction[]> {
    const predictions: GazePrediction[] = [];

    for (const regressor of this.regressors) {
      try {
        const prediction = await regressor.predict(eyeFeatures);
        if (prediction) {
          predictions.push(prediction);
        }
      } catch (error) {
        console.error('Regressor prediction failed:', error);
      }
    }

    // Log if no predictions (likely due to no training data)
    if (predictions.length === 0 && this.regressors.length > 0) {
      // Check if we have any training data
      const data = this.regressors[0].getData() as any;
      if (data && data.dataClicks && data.dataClicks.length === 0) {
        // Only log this warning occasionally to avoid spam
        if (Date.now() % 5000 < 50) {
          console.warn('⚠️ No gaze predictions - need calibration data. Click around the screen to calibrate!');
        }
      }
    }

    return predictions;
  }

  // ============================================================================
  // Tracker Management
  // ============================================================================

  /**
   * Set the tracker to use
   * @param nameOrConstructor - Name of a registered tracker or a tracker constructor
   */
  public setTracker(nameOrConstructor: string | TrackerConstructor): Webgazer {
    if (typeof nameOrConstructor === 'string') {
      const TrackerClass = Webgazer.trackerRegistry.get(nameOrConstructor);

      if (!TrackerClass) {
        console.error(`Tracker "${nameOrConstructor}" not found in registry`);
        throw new Error(`Tracker "${nameOrConstructor}" not registered. Available trackers: ${Array.from(Webgazer.trackerRegistry.keys()).join(', ')}`);
      }

      this.currentTrackerName = nameOrConstructor;
      this.tracker = new TrackerClass();
      console.log(`Tracker set to: ${nameOrConstructor}`);
    } else {
      this.currentTrackerName = nameOrConstructor.name || 'custom';
      this.tracker = new nameOrConstructor();
      console.log('Custom tracker constructor set');
    }

    return this;
  }
  /**
   * Get current tracker
   */
  public getTracker(): ITracker | null {
    return this.tracker;
  }

  // ============================================================================
  // Regressor Management
  // ============================================================================

  /**
   * Set the regression algorithm (replaces all existing regressors)
   * @param nameOrConstructor - Name of a registered regressor or a regressor constructor
   */
  public setRegression(nameOrConstructor: string | RegressorConstructor): Webgazer {
    let RegressorClass: RegressorConstructor | undefined;

    if (typeof nameOrConstructor === 'string') {
      RegressorClass = Webgazer.regressorRegistry.get(nameOrConstructor);
      
      if (!RegressorClass) {
        console.error(`Regressor "${nameOrConstructor}" not found in registry`);
        throw new Error(`Regressor "${nameOrConstructor}" not registered. Available regressors: ${Array.from(Webgazer.regressorRegistry.keys()).join(', ')}`);
      }
      this.currentRegressionNames = [nameOrConstructor];
      console.log(`Regressor set to: ${nameOrConstructor}`);
    } else {
      RegressorClass = nameOrConstructor;
      this.currentRegressionNames = [nameOrConstructor.name || 'custom'];
      console.log('Custom regressor constructor set');
    }

    // Clear existing regressors
    this.regressors = [];
    
    // Create new regressor
    const regressor = new RegressorClass();
    this.regressors.push(regressor);
    
    return this;
  }

  /**
   * Add a regression algorithm (keeps existing regressors)
   * @param nameOrConstructor - Name of a registered regressor or a regressor constructor
   */
  public addRegression(nameOrConstructor: string | RegressorConstructor): Webgazer {
    let RegressorClass: RegressorConstructor | undefined;

    if (typeof nameOrConstructor === 'string') {
      RegressorClass = Webgazer.regressorRegistry.get(nameOrConstructor);
      
      if (!RegressorClass) {
        console.error(`Regressor "${nameOrConstructor}" not found in registry`);
        throw new Error(`Regressor "${nameOrConstructor}" not registered`);
      }
      this.currentRegressionNames.push(nameOrConstructor);
      console.log(`Regressor added: ${nameOrConstructor}`);
    } else {
      RegressorClass = nameOrConstructor;
      this.currentRegressionNames.push(nameOrConstructor.name || 'custom');
      console.log('Custom regressor constructor added');
    }

    const regressor = new RegressorClass();
    this.regressors.push(regressor);
    
    return this;
  }

  /**
   * Get all regressors
   */
  public getRegression(): IRegressor[] {
    return this.regressors;
  }

  // ============================================================================
  // Prediction Methods
  // ============================================================================

  /**
   * Get current gaze prediction
   */
  public async getCurrentPrediction(regressorIndex: number = 0): Promise<GazePrediction | null> {
    if (!this.isReady()) {
      console.warn('Webgazer not ready');
      return null;
    }

    if (regressorIndex >= this.regressors.length) {
      console.warn(`Regressor index ${regressorIndex} out of bounds`);
      return null;
    }

    const trackingData = await this.getTrackingData();
    
    if (!trackingData || !trackingData.eyeFeatures) {
      return null;
    }

    const predictions: GazePrediction[] = [];

    for (const regressor of this.regressors) {
      const prediction = await regressor.predict(trackingData.eyeFeatures);
      if (prediction) {
        predictions.push(prediction);
      }
    }

    const selectedPrediction = predictions[regressorIndex];
    if (!selectedPrediction) {
      return null;
    }

    return {
      x: selectedPrediction.x,
      y: selectedPrediction.y,
      eyeFeatures: trackingData.eyeFeatures,
      all: predictions,
    };
  }

  /**
   * Set gaze prediction callback
   */
  public setGazeListener(callback: GazeCallback): Webgazer {
    this.gazeCallback = callback;
    return this;
  }

  /**
   * Clear gaze prediction callback
   */
  public clearGazeListener(): Webgazer {
    this.gazeCallback = null;
    return this;
  }

  // ============================================================================
  // Data Recording Methods
  // ============================================================================

  /**
   * Record screen position for training
   */
  public recordScreenPosition(x: number, y: number, eventType: 'click' | 'move' = 'click'): Webgazer {
    if (!this.isReady()) {
      return this;
    }

    // Get current tracking data asynchronously
    this.getTrackingData().then(trackingData => {
      if (trackingData && trackingData.eyeFeatures) {
        // Add data to all regressors
        for (const regressor of this.regressors) {
          regressor.addData(trackingData.eyeFeatures, [x, y], eventType);
        }
      }
    }).catch(() => {
      // Silent fail - recording position is not critical
    });

    return this;
  }

  /**
   * Store a recent prediction point in the circular buffer (original API).
   * Matches original: webgazer.storePoints(x, y, k) stores into xPast50[k] / yPast50[k]
   * @param x - x coordinate
   * @param y - y coordinate
   * @param k - circular buffer index (0-49)
   */
  public storePoints(x: number, y: number, k: number): void {
    const index = k % 50;
    this.xPast50[index] = x;
    this.yPast50[index] = y;
  }

  /**
   * Add mouse event listeners for automatic data collection
   */
  public addMouseEventListeners(): Webgazer {
    this.config.storingPoints = true;

    // Clear previously bound listeners to avoid duplications
    this.mouseEventHandler.clearListeners();

    // Add click listener
    this.mouseEventHandler.addClickListener((data) => {
      this.recordScreenPosition(data.position.x, data.position.y, 'click');
    });

    // Add move listener for continuous calibration (matches original webgazer.js)
    this.mouseEventHandler.addMoveListener((data) => {
      this.recordScreenPosition(data.position.x, data.position.y, 'move');
    });

    this.mouseEventHandler.start();
    
    return this;
  }

  /**
   * Remove mouse event listeners
   */
  public removeMouseEventListeners(): Webgazer {
    this.config.storingPoints = false;
    this.mouseEventHandler.stop();
    console.log('Mouse event listeners removed');
    return this;
  }

  // ============================================================================
  // Video & Display Methods
  // ============================================================================

  /**
   * Show/hide video preview (alias for showVideo)
   */
  public showVideoPreview(show: boolean): Webgazer {
    this.config.showVideoPreview = show;
    this.showVideo(show && this.config.showVideo);
    this.showFaceOverlay(show && this.config.showFaceOverlay);
    this.showFaceFeedbackBox(show && this.config.showFaceFeedbackBox);
    return this;
  }

  /**
   * Show/hide video element
   */
  public showVideo(show: boolean): Webgazer {
    this.config.showVideo = show;
    
    if (this.videoRenderer) {
      this.videoRenderer.setVisible(show);
    }
    
    return this;
  }

  /**
   * Show/hide face overlay
   */
  public showFaceOverlay(show: boolean): Webgazer {
    this.config.showFaceOverlay = show;
    
    if (this.overlayRenderer) {
      this.overlayRenderer.setVisible(show);
    }
    
    return this;
  }

  /**
   * Show/hide face feedback box
   */
  public showFaceFeedbackBox(show: boolean): Webgazer {
    this.config.showFaceFeedbackBox = show;
    
    if (this.validationBox) {
      this.validationBox.setVisible(show);
    }
    
    return this;
  }

  /**
   * Show/hide prediction points
   */
  public showPredictionPoints(show: boolean): Webgazer {
    this.config.showGazeDot = show;
    
    if (this.gazeDotRenderer) {
      this.gazeDotRenderer.setVisible(show);
    }
    
    return this;
  }

  /**
   * Set video viewer size
   */
  public setVideoViewerSize(width: number, height: number): void {
    this.config.videoViewerWidth = width;
    this.config.videoViewerHeight = height;
    
    if (this.videoRenderer) {
      this.videoRenderer.setDimensions(width, height);
    }
  }

  /**
   * Stop video stream
   */
  public stopVideo(): Webgazer {
    if (this.mediaStream) {
      // Stop all tracks in the stream
      const tracks = this.mediaStream.getTracks();
      for (const track of tracks) {
        track.stop();
      }
      this.mediaStream = null;
    }
    
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
    
    return this;
  }

  /**
   * Set static video source
   */
  public setStaticVideo(videoLocation: string): Webgazer {
    if (this.videoElement) {
      this.videoElement.src = videoLocation;
    }
    return this;
  }

  /**
   * Set camera constraints
   */
  public async setCameraConstraints(constraints: MediaStreamConstraints): Promise<void> {
    this.config.cameraConstraints = constraints as any;
    
    // If already running, restart camera
    if (this.state === WebgazerState.Running || this.state === WebgazerState.Paused) {
      this.stopVideo();
      await this.initializeCamera();
      
      if (this.videoRenderer) {
        this.videoRenderer.setStream(this.mediaStream!);
      }

      if (this.videoElement && this.canvasElement) {
        this.canvasElement.width = this.videoElement.videoWidth || this.canvasElement.width;
        this.canvasElement.height = this.videoElement.videoHeight || this.canvasElement.height;
      }

      this.tracker?.reset();
    }
  }

  /**
   * Get video element canvas
   */
  public getVideoElementCanvas(): HTMLCanvasElement | null {
    return this.canvasElement;
  }

  /**
   * Set video element canvas
   */
  public setVideoElementCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
    this.canvasElement = canvas;
    return canvas;
  }

  /**
   * Get video preview to camera resolution ratio
   */
  public getVideoPreviewToCameraResolutionRatio(): [number, number] {
    if (this.videoRenderer) {
      const ratio = this.videoRenderer.getResolutionRatio();
      return ratio !== null ? ratio : [1, 1];
    }
    return [1, 1];
  }

  // ============================================================================
  // Data Management Methods
  // ============================================================================

  /**
   * Enable/disable data persistence across sessions.
   * Synchronous (returns this for chaining), matching original WebGazer API.
   * Actual save to storage happens asynchronously in the background when enabled.
   * @param save - whether to save data across sessions
   * @returns this (for chaining)
   */
  public saveDataAcrossSessions(save: boolean): Webgazer {
    this.config.saveDataAcrossSessions = save;
    
    if (save && this.regressors.length > 0) {
      // Save current regressor data in the background (fire-and-forget)
      void this.persistDataAcrossSessions();
    }
    
    return this;
  }

  private async persistDataAcrossSessions(): Promise<void> {
    try {
      if (!(await this.storageManager.isAvailable())) {
        return;
      }

      await Promise.all(
        this.regressors.map((reg, i) =>
          this.storageManager.save(`regressor_${i}_data`, reg.getData())
        )
      );
      console.log('Data saved across sessions');
    } catch (error) {
      console.error('Failed to save data across sessions:', error);
    }
  }

  /**
   * Load saved data from storage
   */
  private async loadSavedData(): Promise<void> {
    if (!this.config.saveDataAcrossSessions) {
      return;
    }

    try {
      if (!(await this.storageManager.isAvailable())) {
        return;
      }

      for (let i = 0; i < this.regressors.length; i++) {
        const data = await this.storageManager.load(`regressor_${i}_data`);
        if (data) {
          this.regressors[i].setData(data);
          console.log(`Loaded data for regressor ${i}`);
        }
      }
    } catch (error) {
      console.error('Failed to load saved data:', error);
    }
  }

  /**
   * Clear all stored data
   */
  public async clearData(): Promise<void> {
    // Clear regressor data (using internal methods - may need adjustment)
    for (const regressor of this.regressors) {
      // Reset regressor state by setting empty data
      regressor.setData({ clickData: [], trailData: [] });
    }

    // Clear stored data when a backend exists
    if (await this.storageManager.isAvailable()) {
      await this.storageManager.clear();
    }
    
    console.log('All data cleared');
  }

  /**
   * Get the fifty most recent gaze prediction points.
   * Matches original: webgazer.getStoredPoints() returns [xPast50, yPast50]
   * @returns Tuple of [xCoordinates, yCoordinates], each up to 50 entries
   */
  public getStoredPoints(): [number[], number[]] {
    return [this.xPast50.slice(), this.yPast50.slice()];
  }

  /**
   * Get calibration data count
   * @returns Number of calibration points recorded
   */
  public getCalibrationDataCount(): number {
    if (this.regressors.length === 0) {
      return 0;
    }

    const data = this.regressors[0].getData() as any;
    return (data && data.dataClicks) ? data.dataClicks.length : 0;
  }

  // ============================================================================
  // Configuration Methods
  // ============================================================================

  /**
   * Enable/disable Kalman filter
   */
  public applyKalmanFilter(apply: boolean): Webgazer {
    this.config.applyKalmanFilter = apply;
    
    // Update all regressors to enable/disable Kalman filter
    for (const regressor of this.regressors) {
      regressor.updateConfiguration({ useKalmanFilter: apply });
    }
    
    // Update gaze dot renderer
    if (this.gazeDotRenderer) {
      this.gazeDotRenderer.setSmooth(apply);
    }
    
    return this;
  }

  /**
   * Get configuration object (for backward compatibility)
   */
  public get params(): WebgazerConfig {
    return this.config;
  }

  /**
   * Get utility object (for backward compatibility)
   */
  public get util(): any {
    return {
      DataWindow: DataWindow,
      bound: boundToScreen
    };
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Compute validation box size
   */
  public computeValidationBoxSize(): [number, number, number, number] {
    if (!this.validationBox) {
      return [0, 0, 0, 0];
    }

    // Return [left, top, width, height]
    const container = this.validationBox['container'];
    if (container) {
      const rect = container.getBoundingClientRect();
      return [rect.left, rect.top, rect.width, rect.height];
    }

    return [0, 0, 200, 200];
  }

  /**
   * Check the current camera permission state without requesting it.
   * Useful for UI to show permission prompts before calling begin().
   * @returns 'granted' | 'denied' | 'prompt' | 'unsupported'
   */
  public async checkCameraPermission(): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      return 'unsupported';
    }
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return result.state as 'granted' | 'denied' | 'prompt';
    } catch {
      // Some browsers (Firefox) don't support querying camera permissions
      return 'unsupported';
    }
  }

  /**
   * Detect browser compatibility
   */
  public detectCompatibility(): boolean {
    return BrowserCompatibility.isWebgazerCompatible();
  }

  /**
   * Get compatibility warnings
   */
  public getCompatibilityWarnings(): string[] {
    return BrowserCompatibility.getCompatibilityWarnings();
  }

  /**
   * Log browser and feature information
   */
  public logCompatibilityInfo(): void {
    BrowserCompatibility.logCompatibilityInfo();
  }

  /**
   * Get current state
   */
  public getState(): WebgazerState {
    return this.state;
  }

  /**
   * Get event manager (for advanced usage)
   */
  public getEventManager(): EventManager {
    return this.eventManager;
  }

  /**
   * Get calibration manager (for advanced usage)
   */
  public getCalibrationManager(): CalibrationManager | null {
    return this.calibrationManager;
  }

  // ============================================================================
  // Original WebGazer Instance-Level Module Registration
  // These delegate to the static registry so callers can use
  // webgazer.addRegressionModule(...) and webgazer.addTrackerModule(...)
  // in addition to Webgazer.addRegressionModule(...)
  // ============================================================================

  /**
   * Register a new regression module (instance-level, matching original WebGazer API).
   * Equivalent to the static Webgazer.addRegressionModule().
   * @param name - name to register under (used in setRegression/addRegression)
   * @param constructor - class constructor implementing IRegressor
   * @returns this (for chaining)
   */
  public addRegressionModule(name: string, constructor: RegressorConstructor): Webgazer {
    Webgazer.addRegressionModule(name, constructor);
    return this;
  }

  /**
   * Register a new tracker module (instance-level, matching original WebGazer API).
   * Equivalent to the static Webgazer.addTrackerModule().
   * @param name - name to register under (used in setTracker)
   * @param constructor - class constructor implementing ITracker
   * @returns this (for chaining)
   */
  public addTrackerModule(name: string, constructor: TrackerConstructor): Webgazer {
    Webgazer.addTrackerModule(name, constructor);
    return this;
  }

  // ============================================================================
  // Convenience Hide Methods (matching original WebGazer paired show/hide API)
  // ============================================================================

  /**
   * Hide the camera video preview (equivalent to showVideo(false)).
   * @returns this (for chaining)
   */
  public hideVideo(): Webgazer {
    return this.showVideo(false);
  }

  /**
   * Hide the face overlay canvas (equivalent to showFaceOverlay(false)).
   * @returns this (for chaining)
   */
  public hideFaceOverlay(): Webgazer {
    return this.showFaceOverlay(false);
  }

  /**
   * Hide the face feedback box (equivalent to showFaceFeedbackBox(false)).
   * @returns this (for chaining)
   */
  public hideFaceFeedbackBox(): Webgazer {
    return this.showFaceFeedbackBox(false);
  }

  /**
   * Hide the gaze prediction dot (equivalent to showPredictionPoints(false)).
   * @returns this (for chaining)
   */
  public hidePredictionPoints(): Webgazer {
    return this.showPredictionPoints(false);
  }

  // ============================================================================
  // New Features & QoL Methods
  // ============================================================================

  /**
   * Set the log level
   */
  public setLogLevel(level: LogLevel): Webgazer {
    this.config.logLevel = level;
    return this;
  }

  /**
   * Enable/disable debug mode (alias for setLogLevel('debug'))
   */
  public setDebugMode(enabled: boolean): Webgazer {
    return this.setLogLevel(enabled ? 'debug' : 'info');
  }

  /**
   * Set maximum FPS for tracking (battery saver / performance)
   */
  public setMaxFPS(fps: number): Webgazer {
    this.config.maxFPS = fps;
    return this;
  }

  /**
   * Set prediction interval in ms (updates maxFPS)
   */
  public setPredictionInterval(ms: number): Webgazer {
    return this.setMaxFPS(1000 / ms);
  }

  /**
   * Set face detection interval (skip frames for performance)
   * @param skip - Call tracker every X frames (1 = every frame)
   */
  public setFaceDetectionInterval(skip: number): Webgazer {
    this.config.faceDetectionInterval = Math.max(1, skip);
    return this;
  }

  /**
   * Automatically pause tracking when the page is not visible
   */
  public setAutoPauseOnBlur(enabled: boolean): Webgazer {
    this.config.autoPauseOnBlur = enabled;
    if (enabled) {
      this.setupVisibilityListener();
    } else {
      this.removeVisibilityListener();
    }
    return this;
  }

  /**
   * Set smoothing type
   */
  public setSmoothingType(type: SmoothingType): Webgazer {
    this.config.smoothingType = type;
    return this;
  }

  /**
   * Set EMA alpha (smoothing factor, 0-1)
   */
  public setEMAAlpha(alpha: number): Webgazer {
    this.config.emaAlpha = alpha;
    return this;
  }

  /**
   * Set Kalman filter smoothing strength (legacy compatibility)
   */
  public setKalmanFilterStrength(strength: number): Webgazer {
    // This is a simplified implementation for compatibility
    this.config.applyKalmanFilter = strength > 0;
    return this;
  }

  /**
   * Get current configuration as plain object
   */
  public getConfig(): WebgazerConfigData {
    return this.config.toJSON();
  }

  /**
   * Get stored training data
   */
  public getStoredData(): any {
    if (this.regressors.length > 0) {
      return this.regressors[0].getData();
    }
    return null;
  }

  /**
   * Add event listener (alias for addEventListener)
   */
  public on(eventType: EventType | string, listener: (data: any) => void): Webgazer {
    this.eventManager.addEventListener(eventType, listener);
    return this;
  }

  /**
   * Remove event listener (alias for removeEventListener)
   */
  public off(eventType: EventType | string, listener: (data: any) => void): Webgazer {
    this.eventManager.removeEventListener(eventType, listener);
    return this;
  }

  /**
   * Internal logging helper
   */
  private log(level: LogLevel, message: string, ...args: any[]): void {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'none'];
    const configLevelIdx = levels.indexOf(this.config.logLevel);
    const messageLevelIdx = levels.indexOf(level);

    if (messageLevelIdx >= configLevelIdx && configLevelIdx !== 4) {
      const prefix = `[Webgazer:${level}]`;
      if (level === 'error') console.error(prefix, message, ...args);
      else if (level === 'warn') console.warn(prefix, message, ...args);
      else if (level === 'info') console.log(prefix, message, ...args);
      else if (level === 'debug') console.debug(prefix, message, ...args);
    }
  }

  /**
   * Setup visibility change listener for auto-pause
   */
  private setupVisibilityListener(): void {
    if (!this.config.autoPauseOnBlur || typeof document === 'undefined') return;

    if (!this.visibilityListener) {
      this.visibilityListener = () => {
        if (document.hidden) {
          if (this.state === WebgazerState.Running) {
            this.log('info', 'Page hidden, auto-pausing tracking');
            this.pause();
            // Mark that we were auto-paused
            (this as any)._autoPaused = true;
          }
        } else {
          if (this.state === WebgazerState.Paused && (this as any)._autoPaused) {
            this.log('info', 'Page visible, auto-resuming tracking');
            this.resume();
            (this as any)._autoPaused = false;
          }
        }
      };
      document.addEventListener('visibilitychange', this.visibilityListener);
    }
  }

  /**
   * Remove visibility change listener
   */
  private removeVisibilityListener(): void {
    if (this.visibilityListener && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityListener);
      this.visibilityListener = null;
    }
  }
}

// Export singleton instance as default
export default Webgazer.getInstance();
