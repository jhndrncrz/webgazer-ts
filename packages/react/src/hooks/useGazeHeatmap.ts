/**
 * useGazeHeatmap Hook
 * Generate and visualize gaze heatmap data
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { useWebgazerContext } from '../context/WebgazerContext';

export interface HeatmapPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface UseGazeHeatmapOptions {
  width?: number;
  height?: number;
  radius?: number;
  maxOpacity?: number;
  blur?: number;
  gradient?: Record<number, string>;
}

export interface UseGazeHeatmapReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  points: HeatmapPoint[];
  clear: () => void;
  exportData: () => string;
  exportImage: () => string | null;
}

export function useGazeHeatmap(options: UseGazeHeatmapOptions = {}): UseGazeHeatmapReturn {
  const {
    width = window.innerWidth,
    height = window.innerHeight,
    radius = 30,
    maxOpacity = 0.8,
    blur = 15,
    gradient = {
      0.0: 'blue',
      0.25: 'cyan',
      0.5: 'lime',
      0.75: 'yellow',
      1.0: 'red',
    },
  } = options;

  const { gazeData } = useWebgazerContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<HeatmapPoint[]>([]);

  // Collect gaze points
  useEffect(() => {
    if (gazeData) {
      setPoints(prev => {
        const newPoints = [
          ...prev,
          {
            x: gazeData.x,
            y: gazeData.y,
            timestamp: Date.now(),
          },
        ];
        // Cap point array growth to prevent O(N) performance degradation
        return newPoints.slice(-1000);
      });
    }
  }, [gazeData]);

  // Draw heatmap
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Apply blur before drawing
    ctx.filter = `blur(${blur}px)`;

    // Create gradient for coloring
    const colorGradient = ctx.createLinearGradient(0, 0, 0, radius * 2);
    Object.entries(gradient).forEach(([stop, color]) => {
      colorGradient.addColorStop(parseFloat(stop), color);
    });

    // Draw each point
    points.forEach(point => {
      // Create radial gradient for each point
      const pointGradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, radius
      );
      
      pointGradient.addColorStop(0, `rgba(255, 0, 0, ${maxOpacity})`);
      pointGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

      ctx.fillStyle = pointGradient;
      ctx.fillRect(
        point.x - radius,
        point.y - radius,
        radius * 2,
        radius * 2
      );
    });

    // Reset filter
    ctx.filter = 'none';
  }, [points, width, height, radius, maxOpacity, blur, gradient]);

  // Clear heatmap
  const clear = useCallback(() => {
    setPoints([]);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  // Export data as CSV
  const exportData = useCallback(() => {
    const headers = ['x', 'y', 'timestamp'];
    const rows = points.map(p => `${p.x},${p.y},${p.timestamp}`);
    return [headers.join(','), ...rows].join('\n');
  }, [points]);

  // Export as image
  const exportImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    return canvas.toDataURL('image/png');
  }, []);

  return {
    canvasRef,
    points,
    clear,
    exportData,
    exportImage,
  };
}
