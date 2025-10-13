/**
 * useGazeElement Hook
 * Track when user is looking at a specific element
 */

import { useRef, useState, useEffect } from 'react';
import { useWebgazerContext } from '../context/WebgazerContext';
import type { UseGazeElementOptions, UseGazeElementReturn } from '../types';

export function useGazeElement<T extends HTMLElement = HTMLElement>(
  options: UseGazeElementOptions = {}
): UseGazeElementReturn<T> {
  const {
    threshold = 50,
    minDwellTime = 0,
    onEnter,
    onLeave,
    onDwell,
  } = options;

  const { gazeData } = useWebgazerContext();
  const ref = useRef<T>(null);
  const [isLooking, setIsLooking] = useState(false);
  const [dwellTime, setDwellTime] = useState(0);
  const dwellStartRef = useRef<number | null>(null);
  const hasDwelledRef = useRef(false);

  useEffect(() => {
    if (!gazeData || !ref.current) {
      if (isLooking) {
        setIsLooking(false);
        setDwellTime(0);
        dwellStartRef.current = null;
        hasDwelledRef.current = false;
        
        if (onLeave) {
          onLeave();
        }
      }
      return;
    }

    const element = ref.current;
    const rect = element.getBoundingClientRect();

    // Check if gaze is within element bounds (with threshold)
    const looking = (
      gazeData.x >= rect.left - threshold &&
      gazeData.x <= rect.right + threshold &&
      gazeData.y >= rect.top - threshold &&
      gazeData.y <= rect.bottom + threshold
    );

    if (looking && !isLooking) {
      // Just entered
      setIsLooking(true);
      dwellStartRef.current = Date.now();
      hasDwelledRef.current = false;
      
      if (onEnter) {
        onEnter();
      }
    } else if (!looking && isLooking) {
      // Just left
      setIsLooking(false);
      setDwellTime(0);
      dwellStartRef.current = null;
      hasDwelledRef.current = false;
      
      if (onLeave) {
        onLeave();
      }
    } else if (looking && isLooking && dwellStartRef.current) {
      // Still looking - update dwell time
      const currentDwell = Date.now() - dwellStartRef.current;
      setDwellTime(currentDwell);

      // Check if dwell threshold reached
      if (!hasDwelledRef.current && currentDwell >= minDwellTime && onDwell) {
        hasDwelledRef.current = true;
        onDwell();
      }
    }
  }, [gazeData, isLooking, threshold, minDwellTime, onEnter, onLeave, onDwell]);

  return {
    ref,
    isLooking,
    dwellTime,
  };
}
