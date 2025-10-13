/**
 * useWebGazer Hook
 * Main hook for initializing and controlling WebGazer eye tracking
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { UseWebGazerOptions, UseWebGazerReturn, GazePrediction } from '../types';

// Dynamic import to avoid bundling issues
let webgazerInstance: any = null;

async function getWebGazer() {
  if (!webgazerInstance) {
    webgazerInstance = await import('@webgazer-ts/core');
  }
  return webgazerInstance.default || webgazerInstance;
}

export function useWebGazer(options: UseWebGazerOptions = {}): UseWebGazerReturn {
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
  const webgazerRef = useRef<any>(null);
  const gazeListenerRef = useRef<((data: GazePrediction | null, timestamp: number) => void) | null>(null);

  // Initialize WebGazer
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const webgazer = await getWebGazer();
        if (!mounted) return;

        webgazerRef.current = webgazer;

        // Configure WebGazer
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
            setCalibrationCount(points ? points.length : 0);
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
        console.error('Failed to initialize WebGazer:', error);
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
      console.error('Failed to start WebGazer:', error);
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
      console.error('Failed to stop WebGazer:', error);
    }
  }, []);

  // Pause tracking
  const pause = useCallback(async () => {
    if (!webgazerRef.current) return;
    
    try {
      await webgazerRef.current.pause();
      setIsRunning(false);
    } catch (error) {
      console.error('Failed to pause WebGazer:', error);
    }
  }, []);

  // Resume tracking
  const resume = useCallback(async () => {
    if (!webgazerRef.current) return;
    
    try {
      await webgazerRef.current.resume();
      setIsRunning(true);
    } catch (error) {
      console.error('Failed to resume WebGazer:', error);
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

  return {
    gazeData,
    isRunning,
    calibrationCount,
    start,
    stop,
    pause,
    resume,
    clearData,
    showVideo,
    hideVideo,
  };
}
