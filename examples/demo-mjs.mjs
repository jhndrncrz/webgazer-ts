/**
 * Example usage of webgazer-ts after npm installation
 * 
 * To use this after publishing:
 * 1. npm install webgazer-ts
 * 2. Copy this file to your project
 * 3. Run with: node example-usage.mjs (or use in browser)
 */

// ============================================================================
// ES Module Import (Recommended)
// ============================================================================

import webgazer from 'webgazer-ts';

// ============================================================================
// Basic Setup
// ============================================================================

async function initializeWebGazer() {
  console.log('🎥 Initializing WebGazer-TS...');
  
  try {
    // Set tracker and regressor
    await webgazer
      .setTracker('TFFacemesh')        // Use TensorFlow FaceMesh
      .setRegression('ridge')          // Use Ridge Regression
      .begin();                        // Start eye tracking
    
    console.log('✅ WebGazer initialized!');
    
    // Show video preview
    webgazer.showVideoPreview(true);
    webgazer.showFaceOverlay(true);
    webgazer.showFaceFeedbackBox(true);
    
  } catch (error) {
    console.error('❌ Failed to initialize:', error);
  }
}

// ============================================================================
// Gaze Prediction
// ============================================================================

function setupGazeListener() {
  webgazer.setGazeListener((data, timestamp) => {
    if (data) {
      console.log(`👁️ Gaze at: (${Math.round(data.x)}, ${Math.round(data.y)})`);
      
      // You can use the gaze data here
      // Example: Move an element, trigger actions, etc.
    }
  });
}

// ============================================================================
// Calibration
// ============================================================================

async function runCalibration() {
  console.log('🎯 Starting calibration...');
  
  // Enable mouse event listeners for calibration
  webgazer.addMouseEventListeners();
  
  // Or manually add calibration points
  const points = [
    { x: 100, y: 100 },
    { x: window.innerWidth - 100, y: 100 },
    { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    { x: 100, y: window.innerHeight - 100 },
    { x: window.innerWidth - 100, y: window.innerHeight - 100 }
  ];
  
  for (const point of points) {
    console.log(`Adding calibration point at (${point.x}, ${point.y})`);
    // In a real app, show a dot for user to click
    // Then call: webgazer.recordScreenPosition(point.x, point.y);
  }
  
  console.log('✅ Calibration complete!');
}

// ============================================================================
// Validation
// ============================================================================

async function validateAccuracy() {
  console.log('📊 Validating accuracy...');
  
  const testPoints = [
    { x: 200, y: 200 },
    { x: window.innerWidth - 200, y: 200 },
    { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  ];
  
  for (const point of testPoints) {
    // User looks at point
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get prediction
    const prediction = webgazer.getCurrentPrediction();
    if (prediction) {
      const error = Math.sqrt(
        Math.pow(prediction.x - point.x, 2) + 
        Math.pow(prediction.y - point.y, 2)
      );
      console.log(`📏 Error at (${point.x}, ${point.y}): ${Math.round(error)}px`);
    }
  }
}

// ============================================================================
// Data Management
// ============================================================================

function dataManagement() {
  // Get calibration data count
  const count = webgazer.getCalibrationDataCount();
  console.log(`📦 Calibration points collected: ${count}`);
  
  // Get stored points
  const points = webgazer.getStoredPoints();
  console.log(`💾 Stored points: ${points?.length || 0}`);
  
  // Clear data
  webgazer.clearData();
  console.log('🗑️ Data cleared');
}

// ============================================================================
// Cleanup
// ============================================================================

function cleanup() {
  console.log('🧹 Cleaning up...');
  
  webgazer.end();
  console.log('✅ WebGazer stopped');
}

// ============================================================================
// React Example
// ============================================================================

/**
 * Example React component using webgazer-ts
 */
/*
import { useEffect, useState } from 'react';
import webgazer from 'webgazer-ts';

function EyeTrackingComponent() {
  const [gazePoint, setGazePoint] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Initialize
    const init = async () => {
      await webgazer
        .setTracker('TFFacemesh')
        .setRegression('ridge')
        .begin();
      
      webgazer.setGazeListener((data) => {
        if (data) {
          setGazePoint({ x: data.x, y: data.y });
        }
      });
      
      setIsReady(true);
    };
    
    init();
    
    // Cleanup
    return () => {
      webgazer.end();
    };
  }, []);
  
  return (
    <div>
      <h1>Eye Tracking Active</h1>
      {isReady && (
        <div>
          <p>Gaze: ({Math.round(gazePoint.x)}, {Math.round(gazePoint.y)})</p>
          <div 
            style={{
              position: 'absolute',
              left: gazePoint.x,
              top: gazePoint.y,
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: 'red',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          />
        </div>
      )}
    </div>
  );
}
*/

// ============================================================================
// TypeScript Example
// ============================================================================

/**
 * TypeScript usage with full type safety
 */
/*
import webgazer, { 
  GazePrediction, 
  Point2D,
  CalibrationResult,
  CalibrationState,
  EventType
} from 'webgazer-ts';

async function typedExample(): Promise<void> {
  // Initialize with full type checking
  await webgazer
    .setTracker('TFFacemesh')
    .setRegression('ridge')
    .begin();
  
  // Typed gaze listener
  webgazer.setGazeListener((data: GazePrediction | null, timestamp: number) => {
    if (data) {
      const point: Point2D = { x: data.x, y: data.y };
      console.log(`Gaze: ${point.x}, ${point.y}`);
    }
  });
  
  // Type-safe calibration
  const result: CalibrationResult = await webgazer.startCalibration();
  console.log(`Calibration: ${result.state === CalibrationState.COMPLETE ? 'success' : 'failed'}`);
}
*/

// ============================================================================
// Run Examples (Browser Environment)
// ============================================================================

if (typeof window !== 'undefined') {
  // In browser
  console.log('🌐 Browser environment detected');
  console.log('Run these functions to test:');
  console.log('  - initializeWebGazer()');
  console.log('  - setupGazeListener()');
  console.log('  - runCalibration()');
  console.log('  - validateAccuracy()');
  console.log('  - dataManagement()');
  console.log('  - cleanup()');
  
  // Auto-initialize (uncomment to auto-start)
  // initializeWebGazer();
  
} else {
  // In Node.js
  console.log('⚠️ WebGazer requires a browser environment');
  console.log('Copy this file to a browser-based project to use');
}

// Export for use in other modules
export {
  initializeWebGazer,
  setupGazeListener,
  runCalibration,
  validateAccuracy,
  dataManagement,
  cleanup
};
