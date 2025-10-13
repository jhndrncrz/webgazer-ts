/**
 * GazeElement Component
 * Wrapper component that responds to gaze
 */

import { ReactNode, CSSProperties } from 'react';
import { useGazeElement } from '../hooks/useGazeElement';
import type { UseGazeElementOptions } from '../types';

export interface GazeElementProps extends UseGazeElementOptions {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  lookingStyle?: CSSProperties;
  onDwellStyle?: CSSProperties;
}

export function GazeElement({
  children,
  className,
  style = {},
  lookingStyle = {},
  onDwellStyle = {},
  ...gazeOptions
}: GazeElementProps) {
  // Use HTMLDivElement as the generic type since we're rendering a div
  const { ref, isLooking, dwellTime } = useGazeElement<HTMLDivElement>(gazeOptions);
  
  const isDwelling = dwellTime >= (gazeOptions.minDwellTime || 0);

  // Merge styles based on state
  const mergedStyle: CSSProperties = {
    ...style,
    ...(isLooking ? lookingStyle : {}),
    ...(isDwelling ? onDwellStyle : {}),
  };

  return (
    <div ref={ref} className={className} style={mergedStyle}>
      {children}
    </div>
  );
}
