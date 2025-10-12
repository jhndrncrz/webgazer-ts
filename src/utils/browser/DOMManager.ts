/**
 * DOM element management utilities
 * Handles creation, styling, and manipulation of DOM elements
 */

/**
 * Style properties for DOM elements
 */
export type StyleProperties = Partial<CSSStyleDeclaration>;

/**
 * DOMManager - Utility class for DOM element operations
 * Provides type-safe DOM manipulation methods
 */
export class DOMManager {
  /**
   * Create a new DOM element with optional styles and attributes
   * @param tagName - HTML tag name
   * @param options - Element configuration
   * @returns Created element
   */
  static createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    options: {
      id?: string;
      className?: string;
      styles?: StyleProperties;
      attributes?: Record<string, string>;
      textContent?: string;
    } = {}
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);

    if (options.id) {
      element.id = options.id;
    }

    if (options.className) {
      element.className = options.className;
    }

    if (options.styles) {
      DOMManager.applyStyles(element, options.styles);
    }

    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    if (options.textContent) {
      element.textContent = options.textContent;
    }

    return element;
  }

  /**
   * Apply styles to an element
   * @param element - Target element
   * @param styles - Style properties to apply
   */
  static applyStyles(
    element: HTMLElement,
    styles: StyleProperties
  ): void {
    Object.entries(styles).forEach(([property, value]) => {
      if (value !== undefined) {
        (element.style as any)[property] = value;
      }
    });
  }

  /**
   * Append element to document body
   * @param element - Element to append
   * @returns The appended element
   */
  static appendToBody<T extends HTMLElement>(element: T): T {
    document.body.appendChild(element);
    return element;
  }

  /**
   * Remove element from DOM
   * @param element - Element to remove
   */
  static removeElement(element: HTMLElement): void {
    element.remove();
  }

  /**
   * Set element visibility
   * @param element - Target element
   * @param visible - Whether element should be visible
   * @param useOpacity - Use opacity instead of display (for Safari/Firefox)
   */
  static setVisible(
    element: HTMLElement,
    visible: boolean,
    useOpacity: boolean = false
  ): void {
    if (useOpacity) {
      element.style.opacity = visible ? '1' : '0';
      element.style.display = 'block';
    } else {
      element.style.display = visible ? 'block' : 'none';
    }
  }

  /**
   * Position element absolutely
   * @param element - Element to position
   * @param position - Position coordinates
   */
  static positionAbsolute(
    element: HTMLElement,
    position: {
      top?: string;
      left?: string;
      right?: string;
      bottom?: string;
    }
  ): void {
    element.style.position = 'absolute';

    if (position.top !== undefined) {
      element.style.top = position.top;
    }
    if (position.left !== undefined) {
      element.style.left = position.left;
    }
    if (position.right !== undefined) {
      element.style.right = position.right;
    }
    if (position.bottom !== undefined) {
      element.style.bottom = position.bottom;
    }
  }

  /**
   * Position element fixed (relative to viewport)
   * @param element - Element to position
   * @param position - Position coordinates
   */
  static positionFixed(
    element: HTMLElement,
    position: {
      top?: string;
      left?: string;
      right?: string;
      bottom?: string;
    }
  ): void {
    element.style.position = 'fixed';

    if (position.top !== undefined) {
      element.style.top = position.top;
    }
    if (position.left !== undefined) {
      element.style.left = position.left;
    }
    if (position.right !== undefined) {
      element.style.right = position.right;
    }
    if (position.bottom !== undefined) {
      element.style.bottom = position.bottom;
    }
  }

  /**
   * Set element dimensions
   * @param element - Element to resize
   * @param dimensions - Width and height
   */
  static setDimensions(
    element: HTMLElement,
    dimensions: {
      width?: string;
      height?: string;
    }
  ): void {
    if (dimensions.width !== undefined) {
      element.style.width = dimensions.width;
    }
    if (dimensions.height !== undefined) {
      element.style.height = dimensions.height;
    }
  }

  /**
   * Create a canvas element with specified dimensions
   * @param width - Canvas width
   * @param height - Canvas height
   * @param options - Additional options
   * @returns Created canvas element
   */
  static createCanvas(
    width: number,
    height: number,
    options: {
      id?: string;
      className?: string;
      styles?: StyleProperties;
    } = {}
  ): HTMLCanvasElement {
    const canvas = DOMManager.createElement('canvas', {
      ...options,
      styles: {
        ...options.styles
      }
    });

    canvas.width = width;
    canvas.height = height;

    return canvas;
  }

  /**
   * Get canvas 2D context with optional configuration
   * @param canvas - Canvas element
   * @param options - Context options
   * @returns Canvas 2D rendering context
   * @throws Error if context creation fails
   */
  static getCanvas2DContext(
    canvas: HTMLCanvasElement,
    options: CanvasRenderingContext2DSettings = {}
  ): CanvasRenderingContext2D {
    const context = canvas.getContext('2d', options);

    if (!context) {
      throw new Error('Failed to get 2D context from canvas');
    }

    return context;
  }

  /**
   * Create a video element for streaming
   * @param options - Video element configuration
   * @returns Created video element
   */
  static createVideoElement(
    options: {
      id?: string;
      className?: string;
      styles?: StyleProperties;
      autoplay?: boolean;
      muted?: boolean;
      playsInline?: boolean;
    } = {}
  ): HTMLVideoElement {
    const video = DOMManager.createElement('video', {
      id: options.id,
      className: options.className,
      styles: options.styles,
      attributes: {
        ...(options.playsInline && { playsinline: '' })
      }
    });

    if (options.autoplay !== false) {
      video.autoplay = true;
    }

    if (options.muted) {
      video.muted = true;
    }

    return video;
  }

  /**
   * Create a container div
   * @param options - Container configuration
   * @returns Created div element
   */
  static createContainer(
    options: {
      id?: string;
      className?: string;
      styles?: StyleProperties;
    } = {}
  ): HTMLDivElement {
    return DOMManager.createElement('div', options);
  }

  /**
   * Query element by ID
   * @param id - Element ID
   * @returns Element or null if not found
   */
  static getElementById<T extends HTMLElement = HTMLElement>(
    id: string
  ): T | null {
    return document.getElementById(id) as T | null;
  }

  /**
   * Query element by selector
   * @param selector - CSS selector
   * @returns First matching element or null
   */
  static querySelector<T extends HTMLElement = HTMLElement>(
    selector: string
  ): T | null {
    return document.querySelector<T>(selector);
  }

  /**
   * Query all elements by selector
   * @param selector - CSS selector
   * @returns Array of matching elements
   */
  static querySelectorAll<T extends HTMLElement = HTMLElement>(
    selector: string
  ): T[] {
    return Array.from(document.querySelectorAll<T>(selector));
  }

  /**
   * Wait for element to be ready (loaded/visible)
   * @param element - Element to wait for
   * @param event - Event to wait for (default: 'load')
   * @returns Promise that resolves when element is ready
   */
  static waitForElementReady(
    element: HTMLElement,
    event: string = 'load'
  ): Promise<void> {
    return new Promise((resolve) => {
      const handler = () => {
        element.removeEventListener(event, handler);
        resolve();
      };
      element.addEventListener(event, handler);
    });
  }

  /**
   * Measure element dimensions
   * @param element - Element to measure
   * @returns Element dimensions
   */
  static measureElement(element: HTMLElement): {
    width: number;
    height: number;
    top: number;
    left: number;
  } {
    const rect = element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left
    };
  }

  /**
   * Check if element is visible in viewport
   * @param element - Element to check
   * @returns True if element is visible
   */
  static isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}

export default DOMManager;
