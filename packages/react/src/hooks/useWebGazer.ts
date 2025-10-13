/**
 * useWebgazer Hook
 * Main hook for initializing and controlling Webgazer eye tracking
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import webgazer from '@webgazer-ts/core';
import type { 
  UseWebgazerOptions, 
  UseWebgazerReturn, 
  GazePrediction,
  WebgazerInstance,
  GazeCallback
} from '../types';

export function useWebgazer(options: UseWebgazerOptions = {}): UseWebgazerReturn {
  const {
    autoStart = false,
    tracker = 'TFFacemesh',
    regression = 'ridge',
    saveDataAcrossSessions = true,
    showVideoPreview = false,
    showFaceOverlay = false,
    showFaceFeedbackBox = false,
    showGazeDot = false,
    applyKalmanFilter: useKalmanFilter = true,
    onGaze,
  } = options;

  const [gazeData, setGazeData] = useState<GazePrediction | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [calibrationCount, setCalibrationCount] = useState(0);
  const webgazerRef = useRef<WebgazerInstance | null>(null);
  const gazeListenerRef = useRef<GazeCallback | null>(null);

  // Initialize Webgazer
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        if (!mounted) return;

        webgazerRef.current = webgazer;

        // Configure Webgazer
        webgazer
          .setTracker(tracker)
          .setRegression(regression)
          .saveDataAcrossSessions(saveDataAcrossSessions);

        if (useKalmanFilter) {
          webgazer.applyKalmanFilter(true);
        }

        // Set up gaze listener
        gazeListenerRef.current = (data: GazePrediction | null, timestamp: number) => {
          if (mounted) {
            setGazeData(data);
            if (onGaze) {
              onGaze(data, timestamp);
            }
          }
        };

        webgazer.setGazeListener(gazeListenerRef.current);

        // Update calibration count periodically
        const intervalId = setInterval(() => {
          if (mounted && webgazerRef.current) {
            const points = webgazer.getStoredPoints();
            // getStoredPoints returns [xArray, yArray], so count is length of either array
            setCalibrationCount(points && points[0] ? points[0].length : 0);
          }
        }, 1000);

        // Auto-start if requested
        if (autoStart) {
          await webgazer.begin();
          setIsRunning(true);

          // Apply video preview settings
          if (showVideoPreview) {
            webgazer.showVideoPreview(true);
          }
          if (showFaceOverlay) {
            webgazer.showFaceOverlay(true);
          }
          if (showFaceFeedbackBox) {
            webgazer.showFaceFeedbackBox(true);
          }
          if (showGazeDot) {
            webgazer.showPredictionPoints(true);
          }
        }

        return () => {
          clearInterval(intervalId);
        };
      } catch (error) {
        console.error('Failed to initialize Webgazer:', error);
      }
    }

    initialize();

    return () => {
      mounted = false;
      if (webgazerRef.current) {
        webgazerRef.current.end();
      }
    };
  }, []); // Only run once on mount

  // Start tracking
  const start = useCallback(async () => {
    if (!webgazerRef.current) return;
    
    try {
      await webgazerRef.current.begin();
      setIsRunning(true);

      if (showVideoPreview) {
        webgazerRef.current.showVideoPreview(true);
      }
      if (showFaceOverlay) {
        webgazerRef.current.showFaceOverlay(true);
      }
      if (showFaceFeedbackBox) {
        webgazerRef.current.showFaceFeedbackBox(true);
      }
      if (showGazeDot) {
        webgazerRef.current.showPredictionPoints(true);
      }
    } catch (error) {
      console.error('Failed to start Webgazer:', error);
    }
  }, [showVideoPreview, showFaceOverlay, showFaceFeedbackBox, showGazeDot]);

  // Stop tracking
  const stop = useCallback(async () => {
    if (!webgazerRef.current) return;
    
    try {
      await webgazerRef.current.end();
      setIsRunning(false);
      setGazeData(null);
    } catch (error) {
      console.error('Failed to stop Webgazer:', error);
    }
  }, []);

  // Pause tracking
  const pause = useCallback(async () => {
    if (!webgazerRef.current) return;
    
    try {
      await webgazerRef.current.pause();
      setIsRunning(false);
    } catch (error) {
      console.error('Failed to pause Webgazer:', error);
    }
  }, []);

  // Resume tracking
  const resume = useCallback(async () => {
    if (!webgazerRef.current) return;
    
    try {
      await webgazerRef.current.resume();
      setIsRunning(true);
    } catch (error) {
      console.error('Failed to resume Webgazer:', error);
    }
  }, []);

  // Clear calibration data
  const clearData = useCallback(() => {
    if (!webgazerRef.current) return;
    
    try {
      webgazerRef.current.clearData();
      setCalibrationCount(0);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }, []);

  // Show video preview
  const showVideo = useCallback(() => {
    if (!webgazerRef.current) return;
    
    try {
      webgazerRef.current.showVideoPreview(true);
    } catch (error) {
      console.error('Failed to show video:', error);
    }
  }, []);

  // Hide video preview
  const hideVideo = useCallback(() => {
    if (!webgazerRef.current) return;
    
    try {
      webgazerRef.current.showVideoPreview(false);
    } catch (error) {
      console.error('Failed to hide video:', error);
    }
  }, []);

  // Configuration methods - expose Webgazer configuration API
  const setTracker = useCallback((trackerName: string) => {
    if (!webgazerRef.current) return;
    try {
      webgazerRef.current.setTracker(trackerName);
    } catch (error) {
      console.error('Failed to set tracker:', error);
    }
  }, []);

  const setRegression = useCallback((regressionName: string) => {
    if (!webgazerRef.current) return;
    try {
      webgazerRef.current.setRegression(regressionName);
    } catch (error) {
      console.error('Failed to set regression:', error);
    }
  }, []);

  const showFaceOverlayToggle = useCallback((show: boolean) => {
    if (!webgazerRef.current) return;
    try {
      webgazerRef.current.showFaceOverlay(show);
    } catch (error) {
      console.error('Failed to toggle face overlay:', error);
    }
  }, []);

  const showFaceFeedbackBoxToggle = useCallback((show: boolean) => {
    if (!webgazerRef.current) return;
    try {
      webgazerRef.current.showFaceFeedbackBox(show);
    } catch (error) {
      console.error('Failed to toggle face feedback box:', error);
    }
  }, []);

  const showPredictionPoints = useCallback((show: boolean) => {
    if (!webgazerRef.current) return;
    try {
      webgazerRef.current.showPredictionPoints(show);
    } catch (error) {
      console.error('Failed to toggle prediction points:', error);
    }
  }, []);

  const setVideoViewerSize = useCallback((width: number, height: number) => {
    if (!webgazerRef.current) return;
    try {
      webgazerRef.current.setVideoViewerSize(width, height);
    } catch (error) {
      console.error('Failed to set video viewer size:', error);
    }
  }, []);

  const applyKalmanFilter = useCallback((apply: boolean) => {
    if (!webgazerRef.current) return;
    try {
      webgazerRef.current.applyKalmanFilter(apply);
    } catch (error) {
      console.error('Failed to apply Kalman filter:', error);
    }
  }, []);

  const recordScreenPosition = useCallback((x: number, y: number, eventType: 'click' | 'move' = 'click') => {
    if (!webgazerRef.current) return;
    try {
      webgazerRef.current.recordScreenPosition(x, y, eventType);
    } catch (error) {
      console.error('Failed to record screen position:', error);
    }
  }, []);

  const addMouseEventListeners = useCallback(() => {
    if (!webgazerRef.current) return;
    try {
      webgazerRef.current.addMouseEventListeners();
    } catch (error) {
      console.error('Failed to add mouse event listeners:', error);
    }
  }, []);

  const removeMouseEventListeners = useCallback(() => {
    if (!webgazerRef.current) return;
    try {
      webgazerRef.current.removeMouseEventListeners();
    } catch (error) {
      console.error('Failed to remove mouse event listeners:', error);
    }
  }, []);

  return {
    // State
    gazeData,
    isRunning,
    calibrationCount,
    
    // Core controls
    start,
    stop,
    pause,
    resume,
    clearData,
    
    // Video controls
    showVideo,
    hideVideo,
    
    // Configuration
    setTracker,
    setRegression,
    showFaceOverlay: showFaceOverlayToggle,
    showFaceFeedbackBox: showFaceFeedbackBoxToggle,
    showPredictionPoints,
    setVideoViewerSize,
    applyKalmanFilter,
    
    // Calibration controls
    recordScreenPosition,
    addMouseEventListeners,
    removeMouseEventListeners,
    
    // Direct instance access for advanced use cases
    webgazer: webgazerRef.current,
  };
}
