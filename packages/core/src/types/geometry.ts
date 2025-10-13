/**
 * Geometry type definitions for Webgazer
 * Defines basic geometric primitives used throughout the application
 */

/**
 * Represents a 2D point in screen or image space
 */
export interface Point2D {
  x: number;
  y: number;
}

/**
 * Represents a rectangular region
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Represents dimensions
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Represents boundary limits
 */
export interface Bounds {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

/**
 * Represents a bounding box with min/max coordinates
 */
export interface BoundingBox {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}
