/**
 * useCalibration Hook
 * Programmatic control over calibration process
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { 
  UseCalibrationOptions, 
  UseCalibrationReturn,
  CalibrationPoint,
  CalibrationResult 
} from '../types';

export function useCalibration(options: UseCalibrationOptions = {}): UseCalibrationReturn {
  const {
    pointCount = 9,
    pointDuration = 1000,
    autoAdvance = true,
    onComplete,
    onPointComplete,
  } = options;

  const [isCalibrating, setIsCalibrating] = useState(false);
  const [currentPointIndex, setCurrentPointIndex] = useState(-1);
  const [points, setPoints] = useState<CalibrationPoint[]>([]);
  // Use ReturnType<typeof setTimeout> for cross-platform compatibility
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate calibration points
  const generatePoints = useCallback(() => {
    const newPoints: CalibrationPoint[] = [];
    const margin = 100;
    const cols = 3;
    const rows = Math.ceil(pointCount / cols);
    
    const width = window.innerWidth - margin * 2;
    const height = window.innerHeight - margin * 2;
    
    for (let i = 0; i < pointCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      const x = margin + (cols > 1 ? (width / (cols - 1)) * col : width / 2);
      const y = margin + (rows > 1 ? (height / (rows - 1)) * row : height / 2);
      
      newPoints.push({ x, y, index: i });
    }
    
    return newPoints;
  }, [pointCount]);

  // Start calibration
  const startCalibration = useCallback(() => {
    setIsCalibrating(true);
    setCurrentPointIndex(0);
    setPoints(generatePoints());
  }, [generatePoints]);

  // Stop calibration
  const stopCalibration = useCallback(() => {
    setIsCalibrating(false);
    setCurrentPointIndex(-1);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const result: CalibrationResult = {
      success: currentPointIndex >= pointCount,
      pointsCalibrated: currentPointIndex + 1,
    };

    if (onComplete) {
      onComplete(result);
    }
  }, [currentPointIndex, pointCount, onComplete]);

  // Advance to next point
  const nextPoint = useCallback(() => {
    if (onPointComplete) {
      onPointComplete(currentPointIndex);
    }

    if (currentPointIndex + 1 >= pointCount) {
      // Calibration complete
      stopCalibration();
    } else {
      setCurrentPointIndex(prev => prev + 1);
    }
  }, [currentPointIndex, pointCount, onPointComplete, stopCalibration]);

  // Auto-advance after duration
  useEffect(() => {
    if (!isCalibrating || !autoAdvance || currentPointIndex < 0) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      nextPoint();
    }, pointDuration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isCalibrating, autoAdvance, currentPointIndex, pointDuration, nextPoint]);

  const currentPoint = currentPointIndex >= 0 && currentPointIndex < points.length
    ? points[currentPointIndex]
    : null;

  const progress = pointCount > 0 
    ? Math.round(((currentPointIndex + 1) / pointCount) * 100)
    : 0;

  return {
    isCalibrating,
    progress,
    currentPoint,
    startCalibration,
    stopCalibration,
    nextPoint,
  };
}
