/**
 * Type definitions for filter implementations
 */

export interface FilterConfig {
  /** Whether the filter is enabled */
  enabled: boolean;
}

export interface FilterState<T> {
  /** Current filtered value */
  value: T;
  
  /** Timestamp of last update */
  timestamp: number;
  
  /** Number of updates processed */
  updateCount: number;
}
