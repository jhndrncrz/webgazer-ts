/**
 * CalibrationScreen Component
 * Full-screen calibration UI with animated points
 */

import { useEffect } from 'react';
import { useCalibration } from '../hooks/useCalibration';
import type { CalibrationResult } from '../types';

export interface CalibrationScreenProps {
  pointCount?: number;
  pointDuration?: number;
  autoAdvance?: boolean;
  onComplete?: (result: CalibrationResult) => void;
  onCancel?: () => void;
  theme?: {
    backgroundColor?: string;
    pointColor?: string;
    progressColor?: string;
    textColor?: string;
  };
}

export function CalibrationScreen({
  pointCount = 9,
  pointDuration = 1000,
  autoAdvance = true,
  onComplete,
  onCancel,
  theme = {},
}: CalibrationScreenProps) {
  const {
    backgroundColor = 'rgba(0, 0, 0, 0.95)',
    pointColor = '#ff0000',
    progressColor = '#00ff00',
    textColor = '#ffffff',
  } = theme;

  const {
    isCalibrating,
    progress,
    currentPoint,
    startCalibration,
    stopCalibration,
  } = useCalibration({
    pointCount,
    pointDuration,
    autoAdvance,
    onComplete: (result) => {
      if (onComplete) {
        onComplete(result);
      }
    },
  });

  // Auto-start calibration
  useEffect(() => {
    if (!isCalibrating) {
      startCalibration();
    }
  }, []);

  const handleCancel = () => {
    stopCalibration();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      {/* Instructions */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: textColor,
        }}
      >
        <h2 style={{ margin: 0, fontSize: '32px' }}>Calibration</h2>
        <p style={{ margin: '10px 0', fontSize: '18px' }}>
          {autoAdvance 
            ? 'Look at each point as it appears'
            : 'Click on each red dot'}
        </p>
        <div
          style={{
            width: '300px',
            height: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            overflow: 'hidden',
            margin: '20px auto',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: progressColor,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
          Progress: {progress}%
        </p>
      </div>

      {/* Calibration Point */}
      {currentPoint && (
        <CalibrationPoint
          x={currentPoint.x}
          y={currentPoint.y}
          color={pointColor}
          duration={pointDuration}
        />
      )}

      {/* Cancel Button */}
      <button
        onClick={handleCancel}
        style={{
          position: 'absolute',
          bottom: '40px',
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: textColor,
          border: `2px solid ${textColor}`,
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        Cancel
      </button>
    </div>
  );
}

interface CalibrationPointProps {
  x: number;
  y: number;
  color: string;
  duration: number;
}

function CalibrationPoint({ x, y, color, duration }: CalibrationPointProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    >
      {/* Outer ring animation */}
      <div
        style={{
          position: 'absolute',
          width: '60px',
          height: '60px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          border: `2px solid ${color}`,
          borderRadius: '50%',
          animation: `calibration-pulse ${duration}ms ease-out`,
          opacity: 0,
        }}
      />
      
      {/* Main point */}
      <div
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: color,
          borderRadius: '50%',
          boxShadow: `0 0 20px ${color}`,
          animation: 'calibration-bounce 0.5s ease-out',
        }}
      />
      
      {/* Center dot */}
      <div
        style={{
          position: 'absolute',
          width: '6px',
          height: '6px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: '50%',
        }}
      />

      <style>{`
        @keyframes calibration-pulse {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
        
        @keyframes calibration-bounce {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
