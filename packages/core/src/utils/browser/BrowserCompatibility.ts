/**
 * Browser compatibility utilities and polyfills
 * Handles cross-browser differences and feature detection
 */

/**
 * Browser information
 */
export interface BrowserInfo {
  name: string;
  version: string;
  isChrome: boolean;
  isFirefox: boolean;
  isSafari: boolean;
  isEdge: boolean;
  isOpera: boolean;
}

/**
 * Feature support information
 */
export interface FeatureSupport {
  getUserMedia: boolean;
  webgl: boolean;
  indexedDB: boolean;
  webWorkers: boolean;
  requestAnimationFrame: boolean;
}

/**
 * BrowserCompatibility - Handles browser detection and polyfills
 */
export class BrowserCompatibility {
  private static browserInfo: BrowserInfo | null = null;
  private static featureSupport: FeatureSupport | null = null;

  /**
   * Initialize polyfills for requestAnimationFrame and cancelAnimationFrame
   */
  static initializeRequestAnimationFramePolyfill(): void {
    // RequestAnimationFrame polyfill
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame =
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback: FrameRequestCallback): number {
          return window.setTimeout(callback, 1000 / 60) as unknown as number;
        };
    }

    // CancelAnimationFrame polyfill
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame =
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        function (id: number): void {
          window.clearTimeout(id);
        };
    }
  }

  /**
   * Detect browser information
   * @returns Browser information object
   */
  static detectBrowser(): BrowserInfo {
    if (BrowserCompatibility.browserInfo) {
      return BrowserCompatibility.browserInfo;
    }

    const userAgent = navigator.userAgent;
    const vendor = navigator.vendor;

    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    let isChrome = false;
    let isFirefox = false;
    let isSafari = false;
    let isEdge = false;
    let isOpera = false;

    // Detect Edge
    if (userAgent.indexOf('Edg/') > -1 || userAgent.indexOf('Edge/') > -1) {
      browserName = 'Edge';
      isEdge = true;
      const match = userAgent.match(/Edg?\/(\d+)/);
      if (match) {
        browserVersion = match[1];
      }
    }
    // Detect Chrome
    else if (userAgent.indexOf('Chrome') > -1 && vendor.indexOf('Google') > -1) {
      browserName = 'Chrome';
      isChrome = true;
      const match = userAgent.match(/Chrome\/(\d+)/);
      if (match) {
        browserVersion = match[1];
      }
    }
    // Detect Safari
    else if (userAgent.indexOf('Safari') > -1 && vendor.indexOf('Apple') > -1) {
      browserName = 'Safari';
      isSafari = true;
      const match = userAgent.match(/Version\/(\d+)/);
      if (match) {
        browserVersion = match[1];
      }
    }
    // Detect Firefox
    else if (userAgent.indexOf('Firefox') > -1) {
      browserName = 'Firefox';
      isFirefox = true;
      const match = userAgent.match(/Firefox\/(\d+)/);
      if (match) {
        browserVersion = match[1];
      }
    }
    // Detect Opera
    else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR/') > -1) {
      browserName = 'Opera';
      isOpera = true;
      const match = userAgent.match(/(?:Opera|OPR)\/(\d+)/);
      if (match) {
        browserVersion = match[1];
      }
    }

    BrowserCompatibility.browserInfo = {
      name: browserName,
      version: browserVersion,
      isChrome,
      isFirefox,
      isSafari,
      isEdge,
      isOpera
    };

    return BrowserCompatibility.browserInfo;
  }

  /**
   * Check feature support
   * @returns Feature support information
   */
  static checkFeatureSupport(): FeatureSupport {
    if (BrowserCompatibility.featureSupport) {
      return BrowserCompatibility.featureSupport;
    }

    BrowserCompatibility.featureSupport = {
      getUserMedia: !!(
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia
      ),
      webgl: BrowserCompatibility.isWebGLSupported(),
      indexedDB: !!window.indexedDB,
      webWorkers: !!window.Worker,
      requestAnimationFrame: !!window.requestAnimationFrame
    };

    return BrowserCompatibility.featureSupport;
  }

  /**
   * Check if Webgazer is compatible with current browser
   * @returns True if compatible, false otherwise
   */
  static isWebgazerCompatible(): boolean {
    const features = BrowserCompatibility.checkFeatureSupport();
    
    // Minimum requirements
    return (
      features.getUserMedia &&
      features.indexedDB &&
      features.requestAnimationFrame
    );
  }

  /**
   * Get compatibility warnings
   * @returns Array of warning messages
   */
  static getCompatibilityWarnings(): string[] {
    const warnings: string[] = [];
    const features = BrowserCompatibility.checkFeatureSupport();
    const browser = BrowserCompatibility.detectBrowser();

    if (!features.getUserMedia) {
      warnings.push(
        'getUserMedia is not supported. Camera access will not work. ' +
        'Please use a modern browser like Chrome, Firefox, Edge, or Safari.'
      );
    }

    if (!features.indexedDB) {
      warnings.push(
        'IndexedDB is not supported. Calibration data cannot be saved across sessions.'
      );
    }

    if (!features.webWorkers) {
      warnings.push(
        'Web Workers are not supported. Threaded regression will not be available.'
      );
    }

    if (!features.webgl) {
      warnings.push(
        'WebGL is not supported. TensorFlow.js performance may be degraded.'
      );
    }

    // HTTPS warning for non-localhost
    if (
      window.location.protocol !== 'https:' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1' &&
      browser.isChrome
    ) {
      warnings.push(
        'Webgazer requires HTTPS for camera access. ' +
        'For local development, use localhost or run a local HTTPS server.'
      );
    }

    return warnings;
  }

  /**
   * Check if WebGL is supported
   * @returns True if WebGL is supported
   */
  private static isWebGLSupported(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const context =
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      return !!context;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get screen dimensions
   * @returns Screen width and height
   */
  static getScreenDimensions(): { width: number; height: number } {
    return {
      width: Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      ),
      height: Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      )
    };
  }

  /**
   * Check if running in secure context (HTTPS or localhost)
   * @returns True if secure context
   */
  static isSecureContext(): boolean {
    return window.isSecureContext;
  }

  /**
   * Check if page is visible (not in background tab)
   * @returns True if page is visible
   */
  static isPageVisible(): boolean {
    return document.visibilityState === 'visible';
  }

  /**
   * Add visibility change listener
   * @param callback - Function to call when visibility changes
   * @returns Function to remove listener
   */
  static onVisibilityChange(
    callback: (visible: boolean) => void
  ): () => void {
    const handler = () => {
      callback(BrowserCompatibility.isPageVisible());
    };

    document.addEventListener('visibilitychange', handler);

    return () => {
      document.removeEventListener('visibilitychange', handler);
    };
  }

  /**
   * Log browser and feature information to console
   */
  static logCompatibilityInfo(): void {
    const browser = BrowserCompatibility.detectBrowser();
    const features = BrowserCompatibility.checkFeatureSupport();
    const warnings = BrowserCompatibility.getCompatibilityWarnings();

    console.group('Webgazer Compatibility Info');
    console.log('Browser:', `${browser.name} ${browser.version}`);
    console.log('Features:', features);
    console.log('Webgazer Compatible:', BrowserCompatibility.isWebgazerCompatible());
    
    if (warnings.length > 0) {
      console.warn('Compatibility Warnings:');
      warnings.forEach(warning => console.warn(`- ${warning}`));
    } else {
      console.log('No compatibility issues detected ✓');
    }
    
    console.groupEnd();
  }

  /**
   * Check if code is running in development mode
   * @returns True if in development
   */
  static isDevelopmentMode(): boolean {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '' ||
      window.location.protocol === 'file:'
    );
  }
}

// Initialize RAF polyfill immediately
BrowserCompatibility.initializeRequestAnimationFramePolyfill();

export default BrowserCompatibility;
