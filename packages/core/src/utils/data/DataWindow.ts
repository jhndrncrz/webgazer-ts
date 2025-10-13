/**
 * Generic sliding window data structure for storing fixed-size sequences
 * Implements a circular buffer pattern for efficient FIFO operations
 */

/**
 * DataWindow - Generic circular buffer for fixed-size data sequences
 * @template T - Type of data stored in the window
 */
export class DataWindow<T> {
  /** Internal storage array */
  public data: T[];
  
  /** Current write position in the circular buffer */
  private currentIndex: number;
  
  /** Maximum capacity of the window */
  private readonly capacity: number;
  
  /** Current number of elements stored */
  private currentSize: number;

  /**
   * Create a new DataWindow
   * @param capacity - Maximum number of elements to store
   */
  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new Error('DataWindow capacity must be greater than 0');
    }
    
    this.capacity = capacity;
    this.data = new Array<T>(capacity);
    this.currentIndex = 0;
    this.currentSize = 0;
  }

  /**
   * Add an element to the window
   * If window is full, overwrites the oldest element
   * @param element - Element to add
   */
  push(element: T): void {
    this.data[this.currentIndex] = element;
    this.currentIndex = (this.currentIndex + 1) % this.capacity;
    
    if (this.currentSize < this.capacity) {
      this.currentSize++;
    }
  }

  /**
   * Get element at logical index (0 = oldest, length-1 = newest)
   * @param index - Logical index (0 to length-1)
   * @returns Element at the specified index
   * @throws Error if index is out of bounds
   */
  get(index: number): T {
    if (index < 0 || index >= this.currentSize) {
      throw new Error(`Index ${index} out of bounds [0, ${this.currentSize})`);
    }
    
    const physicalIndex = this.getTrueIndex(index);
    return this.data[physicalIndex];
  }

  /**
   * Get the physical array index for a logical index
   * Handles the circular buffer wrap-around
   * @param logicalIndex - Logical index (0 = oldest)
   * @returns Physical index in the internal array
   */
  getTrueIndex(logicalIndex: number): number {
    if (logicalIndex < 0 || logicalIndex >= this.currentSize) {
      throw new Error(`Logical index ${logicalIndex} out of bounds [0, ${this.currentSize})`);
    }
    
    // If window is not full, oldest element is at index 0
    if (this.currentSize < this.capacity) {
      return logicalIndex;
    }
    
    // If window is full, oldest element is at currentIndex position
    return (this.currentIndex + logicalIndex) % this.capacity;
  }

  /**
   * Clear all elements from the window
   */
  clear(): void {
    this.data = new Array<T>(this.capacity);
    this.currentIndex = 0;
    this.currentSize = 0;
  }

  /**
   * Get the current number of elements in the window
   */
  get length(): number {
    return this.currentSize;
  }

  /**
   * Check if the window is empty
   */
  get isEmpty(): boolean {
    return this.currentSize === 0;
  }

  /**
   * Check if the window is at full capacity
   */
  get isFull(): boolean {
    return this.currentSize === this.capacity;
  }

  /**
   * Get all elements in logical order (oldest to newest)
   * @returns Array of elements in order
   */
  toArray(): T[] {
    const result: T[] = new Array(this.currentSize);
    
    for (let i = 0; i < this.currentSize; i++) {
      result[i] = this.get(i);
    }
    
    return result;
  }

  /**
   * Iterate over elements in logical order (oldest to newest)
   */
  *[Symbol.iterator](): Iterator<T> {
    for (let i = 0; i < this.currentSize; i++) {
      yield this.get(i);
    }
  }

  /**
   * Apply a function to each element
   * @param callback - Function to apply to each element
   */
  forEach(callback: (element: T, index: number) => void): void {
    for (let i = 0; i < this.currentSize; i++) {
      callback(this.get(i), i);
    }
  }

  /**
   * Map elements to a new array
   * @param callback - Mapping function
   * @returns Array of mapped values
   */
  map<U>(callback: (element: T, index: number) => U): U[] {
    const result: U[] = new Array(this.currentSize);
    
    for (let i = 0; i < this.currentSize; i++) {
      result[i] = callback(this.get(i), i);
    }
    
    return result;
  }

  /**
   * Filter elements
   * @param predicate - Filter predicate
   * @returns Array of elements that match the predicate
   */
  filter(predicate: (element: T, index: number) => boolean): T[] {
    const result: T[] = [];
    
    for (let i = 0; i < this.currentSize; i++) {
      const element = this.get(i);
      if (predicate(element, i)) {
        result.push(element);
      }
    }
    
    return result;
  }

  /**
   * Find the first element matching a predicate
   * @param predicate - Search predicate
   * @returns First matching element or undefined
   */
  find(predicate: (element: T, index: number) => boolean): T | undefined {
    for (let i = 0; i < this.currentSize; i++) {
      const element = this.get(i);
      if (predicate(element, i)) {
        return element;
      }
    }
    
    return undefined;
  }

  /**
   * Check if any element matches a predicate
   * @param predicate - Test predicate
   * @returns True if at least one element matches
   */
  some(predicate: (element: T, index: number) => boolean): boolean {
    for (let i = 0; i < this.currentSize; i++) {
      if (predicate(this.get(i), i)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Check if all elements match a predicate
   * @param predicate - Test predicate
   * @returns True if all elements match
   */
  every(predicate: (element: T, index: number) => boolean): boolean {
    for (let i = 0; i < this.currentSize; i++) {
      if (!predicate(this.get(i), i)) {
        return false;
      }
    }
    
    return true;
  }
}

export default DataWindow;
