/**
 * HeatmapOverlay Component
 * Visual overlay showing gaze heatmap
 */

import { CSSProperties } from 'react';
import { useGazeHeatmap } from '../hooks/useGazeHeatmap';
import type { UseGazeHeatmapOptions } from '../hooks/useGazeHeatmap';

export interface HeatmapOverlayProps extends UseGazeHeatmapOptions {
  style?: CSSProperties;
  showControls?: boolean;
  onClear?: () => void;
}

export function HeatmapOverlay({
  style = {},
  showControls = false,
  onClear,
  ...heatmapOptions
}: HeatmapOverlayProps) {
  const { canvasRef, points, clear, exportData, exportImage } = useGazeHeatmap(heatmapOptions);

  const handleClear = () => {
    clear();
    if (onClear) {
      onClear();
    }
  };

  const handleExportCSV = () => {
    const csv = exportData();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heatmap-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportImage = () => {
    const dataUrl = exportImage();
    if (dataUrl) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `heatmap-${Date.now()}.png`;
      a.click();
    }
  };

  const defaultStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 9998,
    ...style,
  };

  return (
    <>
      <canvas ref={canvasRef} style={defaultStyle} />
      
      {showControls && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            gap: '10px',
            zIndex: 9999,
            pointerEvents: 'auto',
          }}
        >
          <ControlButton onClick={handleClear}>
            Clear ({points.length})
          </ControlButton>
          <ControlButton onClick={handleExportCSV} disabled={points.length === 0}>
            Export CSV
          </ControlButton>
          <ControlButton onClick={handleExportImage} disabled={points.length === 0}>
            Export PNG
          </ControlButton>
        </div>
      )}
    </>
  );
}

interface ControlButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

function ControlButton({ onClick, disabled, children }: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '8px 16px',
        fontSize: '14px',
        backgroundColor: disabled ? '#ccc' : '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#0056b3';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#007bff';
        }
      }}
    >
      {children}
    </button>
  );
}
