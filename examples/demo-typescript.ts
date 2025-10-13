/**
 * WebGazer TypeScript Example
 * 
 * This example demonstrates how to use WebGazer in a TypeScript project
 * with full type safety and modern async/await patterns.
 */

import webgazer, {
  type GazePrediction,
  type Point2D,
  WebGazerState,
} from '../src/index';

/**
 * Main application class demonstrating WebGazer usage
 */
class EyeTrackingApp {
  private isInitialized: boolean = false;
  private predictionCount: number = 0;
  private gazeHistory: GazePrediction[] = [];
  private readonly maxHistorySize: number = 100;

  /**
   * Initialize the eye tracking application
   */
  async initialize(): Promise<void> {
    console.log('🚀 Initializing Eye Tracking App...');

    // Step 1: Check browser compatibility
    if (!this.checkCompatibility()) {
      throw new Error('Browser not compatible with WebGazer');
    }

    // Step 2: Configure WebGazer
    this.configureWebGazer();

    // Step 3: Start WebGazer
    await this.startTracking();

    // Step 4: Set up event listeners
    this.setupEventListeners();

    this.isInitialized = true;
    console.log('✅ Eye Tracking App initialized successfully');
  }

  /**
   * Check if the browser is compatible with WebGazer
   */
  private checkCompatibility(): boolean {
    console.log('🔍 Checking browser compatibility...');

    const isCompatible = webgazer.detectCompatibility();

    if (!isCompatible) {
      const warnings = webgazer.getCompatibilityWarnings();
      console.error('❌ Compatibility issues:', warnings);
      return false;
    }

    console.log('✅ Browser is compatible');
    webgazer.logCompatibilityInfo();
    return true;
  }

  /**
   * Configure WebGazer settings
   */
  private configureWebGazer(): void {
    console.log('⚙️ Configuring WebGazer...');

    // Show/hide UI elements
    webgazer.showVideoPreview(true);
    webgazer.showFaceOverlay(true);
    webgazer.showFaceFeedbackBox(true);
    webgazer.showPredictionPoints(true);

    // Enable data persistence across sessions
    webgazer.saveDataAcrossSessions(true);

    // Enable Kalman filter for smoother predictions
    webgazer.applyKalmanFilter(true);

    // Set camera constraints (optional)
    // webgazer.setCameraConstraints({
    //   video: {
    //     width: { ideal: 640 },
    //     height: { ideal: 480 },
    //     frameRate: { ideal: 30 }
    //   }
    // });

    console.log('✅ WebGazer configured');
  }

  /**
   * Start eye tracking
   */
  private async startTracking(): Promise<void> {
    console.log('👁️ Starting eye tracking...');

    try {
      await webgazer.begin();
      console.log('✅ Eye tracking started');
    } catch (error) {
      console.error('❌ Failed to start eye tracking:', error);
      throw error;
    }
  }

  /**
   * Set up event listeners for gaze predictions and mouse events
   */
  private setupEventListeners(): void {
    console.log('📡 Setting up event listeners...');

    // Set gaze prediction listener
    webgazer.setGazeListener((data: GazePrediction | null, elapsedTime: number) => {
      if (data) {
        this.handleGazePrediction(data, elapsedTime);
      }
    });

    // Enable mouse event listeners for training
    webgazer.addMouseEventListeners();

    console.log('✅ Event listeners set up');
  }

  /**
   * Handle gaze prediction data
   */
  private handleGazePrediction(data: GazePrediction, elapsedTime: number): void {
    this.predictionCount++;

    // Add to history
    this.gazeHistory.push(data);
    if (this.gazeHistory.length > this.maxHistorySize) {
      this.gazeHistory.shift();
    }

    // Log every 100th prediction
    if (this.predictionCount % 100 === 0) {
      console.log(`📊 Prediction #${this.predictionCount}:`, {
        x: Math.round(data.x),
        y: Math.round(data.y),
        elapsedTime: Math.round(elapsedTime),
      });
    }

    // You can use the gaze data here for your application
    // For example: highlight elements, trigger actions, etc.
    this.onGazeUpdate(data);
  }

  /**
   * Custom gaze update handler (override in subclass or modify for your needs)
   */
  protected onGazeUpdate(data: GazePrediction): void {
    // Example: Update UI with gaze position
    const gazeElement = document.getElementById('gaze-position');
    if (gazeElement) {
      gazeElement.textContent = `Gaze: (${Math.round(data.x)}, ${Math.round(data.y)})`;
    }

    // Example: Check if user is looking at a specific element
    const targetElement = document.getElementById('target-element');
    if (targetElement) {
      const isLookingAt = this.isLookingAt(data, targetElement);
      if (isLookingAt) {
        console.log('👀 User is looking at target element!');
        targetElement.classList.add('gazed-at');
      } else {
        targetElement.classList.remove('gazed-at');
      }
    }
  }

  /**
   * Check if the user is looking at a specific element
   */
  private isLookingAt(gaze: GazePrediction, element: HTMLElement, threshold: number = 50): boolean {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = Math.sqrt(
      Math.pow(gaze.x - centerX, 2) + Math.pow(gaze.y - centerY, 2)
    );

    return distance < threshold;
  }

  /**
   * Run manual calibration
   * This creates calibration points and records user clicks
   */
  async calibrate(pointCount: number = 9): Promise<{ success: boolean; message: string }> {
    console.log('🎯 Starting manual calibration...');

    return new Promise((resolve) => {
      let clicksRecorded = 0;
      const points: Point2D[] = this.generateCalibrationPoints(pointCount);
      let currentPointIndex = 0;

      // Create calibration overlay
      const overlay = document.createElement('div');
      overlay.id = 'calibration-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      // Create calibration point
      const point = document.createElement('div');
      point.style.cssText = `
        width: 20px;
        height: 20px;
        background: #2196F3;
        border-radius: 50%;
        position: absolute;
        cursor: pointer;
        box-shadow: 0 0 20px rgba(33, 150, 243, 0.8);
      `;

      overlay.appendChild(point);
      document.body.appendChild(overlay);

      const showNextPoint = () => {
        if (currentPointIndex >= points.length) {
          document.body.removeChild(overlay);
          const message = `Calibration complete! Recorded ${clicksRecorded} points.`;
          console.log('✅ ' + message);
          resolve({ success: true, message });
          return;
        }

        const currentPoint = points[currentPointIndex];
        point.style.left = `${currentPoint.x}px`;
        point.style.top = `${currentPoint.y}px`;
      };

      // Handle calibration clicks
      point.addEventListener('click', (e) => {
        const rect = point.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        webgazer.recordScreenPosition(x, y, 'click');
        clicksRecorded++;
        currentPointIndex++;
        
        console.log(`📍 Calibration point ${currentPointIndex}/${pointCount} recorded`);
        
        showNextPoint();
      });

      showNextPoint();
    });
  }

  /**
   * Generate evenly distributed calibration points
   */
  private generateCalibrationPoints(count: number): Point2D[] {
    const points: Point2D[] = [];
    const margin = 100;
    const width = window.innerWidth - 2 * margin;
    const height = window.innerHeight - 2 * margin;

    // For 9 points, create a 3x3 grid
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = margin + (col * width) / (cols - 1);
      const y = margin + (row * height) / (rows - 1);

      points.push({ x, y });
    }

    return points;
  }

  /**
   * Pause eye tracking
   */
  pause(): void {
    console.log('⏸️ Pausing eye tracking...');
    webgazer.pause();
  }

  /**
   * Resume eye tracking
   */
  async resume(): Promise<void> {
    console.log('▶️ Resuming eye tracking...');
    await webgazer.resume();
  }

  /**
   * Stop eye tracking and clean up
   */
  stop(): void {
    console.log('🛑 Stopping eye tracking...');
    webgazer.end();
    this.isInitialized = false;
    console.log('✅ Eye tracking stopped');
  }

  /**
   * Clear all calibration data
   */
  async clearCalibrationData(): Promise<void> {
    console.log('🗑️ Clearing calibration data...');
    await webgazer.clearData();
    this.gazeHistory = [];
    this.predictionCount = 0;
    console.log('✅ Calibration data cleared');
  }

  /**
   * Get statistics about the current session
   */
  getStatistics() {
    const avgX =
      this.gazeHistory.reduce((sum, gaze) => sum + gaze.x, 0) / this.gazeHistory.length || 0;
    const avgY =
      this.gazeHistory.reduce((sum, gaze) => sum + gaze.y, 0) / this.gazeHistory.length || 0;

    return {
      totalPredictions: this.predictionCount,
      historySize: this.gazeHistory.length,
      averageGaze: { x: Math.round(avgX), y: Math.round(avgY) },
      isInitialized: this.isInitialized,
    };
  }

  /**
   * Switch regression algorithm
   */
  setRegressionAlgorithm(algorithm: 'ridge' | 'weightedRidge' | 'threadedRidge'): void {
    console.log(`🔄 Switching to ${algorithm} regression...`);
    webgazer.setRegression(algorithm);
  }

  /**
   * Get current prediction manually
   */
  async getCurrentPrediction(): Promise<GazePrediction | null> {
    return await webgazer.getCurrentPrediction();
  }
}

// ============================================================================
// Usage Examples
// ============================================================================

/**
 * Example 1: Basic Usage
 */
async function example1_BasicUsage() {
  console.log('\n=== Example 1: Basic Usage ===\n');

  const app = new EyeTrackingApp();

  try {
    // Initialize the app
    await app.initialize();

    // Wait a moment for tracking to stabilize
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Run calibration
    await app.calibrate();

    // Let it run for a while
    console.log('Eye tracking running... (will run for 10 seconds)');
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Get statistics
    const stats = app.getStatistics();
    console.log('Session statistics:', stats);

    // Clean up
    app.stop();
  } catch (error) {
    console.error('Error in example 1:', error);
  }
}

/**
 * Example 2: Custom Calibration
 */
async function example2_CustomCalibration() {
  console.log('\n=== Example 2: Custom Calibration ===\n');

  const app = new EyeTrackingApp();

  try {
    await app.initialize();

    // Custom calibration with 5 points
    const result = await app.calibrate(5);

    console.log('Calibration result:', result);

    app.stop();
  } catch (error) {
    console.error('Error in example 2:', error);
  }
}

/**
 * Example 3: Switch Regression Algorithms
 */
async function example3_SwitchRegression() {
  console.log('\n=== Example 3: Switch Regression Algorithms ===\n');

  const app = new EyeTrackingApp();

  try {
    await app.initialize();
    await app.calibrate();

    // Try standard ridge regression
    console.log('Using standard ridge regression...');
    app.setRegressionAlgorithm('ridge');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Switch to weighted ridge regression
    console.log('Switching to weighted ridge regression...');
    app.setRegressionAlgorithm('weightedRidge');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Switch to threaded ridge regression
    console.log('Switching to threaded ridge regression...');
    app.setRegressionAlgorithm('threadedRidge');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    app.stop();
  } catch (error) {
    console.error('Error in example 3:', error);
  }
}

/**
 * Example 4: Pause and Resume
 */
async function example4_PauseResume() {
  console.log('\n=== Example 4: Pause and Resume ===\n');

  const app = new EyeTrackingApp();

  try {
    await app.initialize();

    console.log('Tracking for 3 seconds...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log('Pausing...');
    app.pause();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Resuming...');
    await app.resume();
    await new Promise((resolve) => setTimeout(resolve, 3000));

    app.stop();
  } catch (error) {
    console.error('Error in example 4:', error);
  }
}

// ============================================================================
// Run Examples (uncomment to run)
// ============================================================================

// Uncomment the example you want to run:
// example1_BasicUsage();
// example2_CustomCalibration();
// example3_SwitchRegression();
// example4_PauseResume();

// Export the class for use in other modules
export default EyeTrackingApp;
