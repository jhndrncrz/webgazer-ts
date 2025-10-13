/**
 * useGazeRecording Hook
 * Record gaze sessions for analysis
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useWebgazerContext } from '../context/WebgazerContext';

export interface GazeRecordingEntry {
  x: number;
  y: number;
  timestamp: number;
  relativeTime: number;
}

export interface UseGazeRecordingReturn {
  isRecording: boolean;
  data: GazeRecordingEntry[];
  startRecording: () => void;
  stopRecording: () => void;
  clearData: () => void;
  exportCSV: () => void;
  exportJSON: () => void;
}

export function useGazeRecording(): UseGazeRecordingReturn {
  const { gazeData } = useWebgazerContext();
  const [isRecording, setIsRecording] = useState(false);
  const [data, setData] = useState<GazeRecordingEntry[]>([]);
  const startTimeRef = useRef<number | null>(null);

  // Record gaze data
  useEffect(() => {
    if (!isRecording || !gazeData) return;

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    const entry: GazeRecordingEntry = {
      x: gazeData.x,
      y: gazeData.y,
      timestamp: Date.now(),
      relativeTime: Date.now() - startTimeRef.current,
    };

    setData(prev => [...prev, entry]);
  }, [gazeData, isRecording]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    startTimeRef.current = Date.now();
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  const clearData = useCallback(() => {
    setData([]);
    startTimeRef.current = null;
  }, []);

  const exportCSV = useCallback(() => {
    const headers = ['x', 'y', 'timestamp', 'relativeTime'];
    const rows = data.map(entry => 
      `${entry.x},${entry.y},${entry.timestamp},${entry.relativeTime}`
    );
    const csv = [headers.join(','), ...rows].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gaze-recording-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const exportJSON = useCallback(() => {
    const json = JSON.stringify(data, null, 2);

    // Download
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gaze-recording-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  return {
    isRecording,
    data,
    startRecording,
    stopRecording,
    clearData,
    exportCSV,
    exportJSON,
  };
}
