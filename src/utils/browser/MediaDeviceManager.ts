/**
 * Media device management for camera access and video streaming
 * Handles getUserMedia with browser compatibility
 */

/**
 * Camera constraint options
 */
export interface CameraConstraints {
  video?: boolean | MediaTrackConstraints;
  audio?: boolean;
}

/**
 * MediaDeviceManager - Manages camera access and video streams
 * Provides cross-browser compatible getUserMedia functionality
 */
export class MediaDeviceManager {
  private currentStream: MediaStream | null = null;

  /**
   * Request camera access with specified constraints
   * @param constraints - Camera constraints (resolution, frame rate, etc.)
   * @returns Promise resolving to MediaStream
   * @throws Error if camera access is denied or unavailable
   */
  async requestCameraAccess(
    constraints: CameraConstraints = { video: true }
  ): Promise<MediaStream> {
    // Ensure getUserMedia is available
    this.ensureGetUserMediaAvailable();

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.currentStream = stream;
      return stream;
    } catch (error) {
      throw this.handleGetUserMediaError(error);
    }
  }

  /**
   * Apply new constraints to existing video track
   * @param constraints - New constraints to apply
   * @throws Error if no active stream or constraint application fails
   */
  async applyConstraints(constraints: MediaTrackConstraints): Promise<void> {
    if (!this.currentStream) {
      throw new Error('No active video stream. Call requestCameraAccess() first.');
    }

    const videoTrack = this.currentStream.getVideoTracks()[0];
    if (!videoTrack) {
      throw new Error('No video track found in current stream');
    }

    try {
      await videoTrack.applyConstraints(constraints);
    } catch (error) {
      throw new Error(
        `Failed to apply constraints: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get settings of current video track
   * @returns Video track settings (actual resolution, frame rate, etc.)
   * @throws Error if no active stream
   */
  getVideoSettings(): MediaTrackSettings {
    if (!this.currentStream) {
      throw new Error('No active video stream');
    }

    const videoTrack = this.currentStream.getVideoTracks()[0];
    if (!videoTrack) {
      throw new Error('No video track found in current stream');
    }

    return videoTrack.getSettings();
  }

  /**
   * Get capabilities of video device
   * @returns Video track capabilities (supported resolutions, etc.)
   * @throws Error if no active stream or capabilities not supported
   */
  getVideoCapabilities(): MediaTrackCapabilities {
    if (!this.currentStream) {
      throw new Error('No active video stream');
    }

    const videoTrack = this.currentStream.getVideoTracks()[0];
    if (!videoTrack) {
      throw new Error('No video track found in current stream');
    }

    if (!videoTrack.getCapabilities) {
      throw new Error('getCapabilities() not supported in this browser');
    }

    return videoTrack.getCapabilities();
  }

  /**
   * Stop current video stream and release camera
   */
  stopVideoStream(): void {
    if (!this.currentStream) {
      return;
    }

    // Stop all tracks
    this.currentStream.getTracks().forEach(track => {
      track.stop();
    });

    this.currentStream = null;
  }

  /**
   * Get current active stream
   * @returns Current MediaStream or null if none active
   */
  getCurrentStream(): MediaStream | null {
    return this.currentStream;
  }

  /**
   * Check if camera is currently active
   * @returns True if stream is active
   */
  isStreamActive(): boolean {
    if (!this.currentStream) {
      return false;
    }

    const tracks = this.currentStream.getTracks();
    return tracks.length > 0 && tracks.some(track => track.readyState === 'live');
  }

  /**
   * List available video input devices
   * @returns Array of video input device info
   */
  async listVideoDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch (error) {
      throw new Error(
        `Failed to enumerate devices: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Check if getUserMedia is supported
   * @returns True if supported
   */
  static isGetUserMediaSupported(): boolean {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    );
  }

  /**
   * Ensure getUserMedia is available, setting up polyfill if needed
   * @throws Error if getUserMedia is not available
   */
  private ensureGetUserMediaAvailable(): void {
    // Check if navigator.mediaDevices exists
    if (!navigator.mediaDevices) {
      (navigator as any).mediaDevices = {};
    }

    // Set up getUserMedia polyfill if needed
    if (!navigator.mediaDevices.getUserMedia) {
      // Try webkit prefix
      const getUserMedia =
        (navigator as any).webkitGetUserMedia ||
        (navigator as any).mozGetUserMedia;

      if (!getUserMedia) {
        throw new Error(
          'getUserMedia is not supported in this browser. ' +
          'Please use a modern browser like Chrome, Firefox, Edge, or Safari.'
        );
      }

      // Wrap old-style getUserMedia in Promise
      navigator.mediaDevices.getUserMedia = function (
        constraints: MediaStreamConstraints
      ): Promise<MediaStream> {
        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
  }

  /**
   * Convert getUserMedia error to descriptive Error object
   * @param error - Error from getUserMedia
   * @returns Descriptive Error object
   */
  private handleGetUserMediaError(error: unknown): Error {
    if (error instanceof Error) {
      // DOMException errors from getUserMedia
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        return new Error(
          'Camera access denied. Please allow camera access in your browser settings.'
        );
      }

      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        return new Error(
          'No camera found. Please connect a camera and try again.'
        );
      }

      if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        return new Error(
          'Camera is already in use by another application. Please close other applications using the camera.'
        );
      }

      if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        return new Error(
          'Camera does not support the requested constraints. Try different camera settings.'
        );
      }

      if (error.name === 'TypeError') {
        return new Error(
          'Invalid constraints provided. Please check camera constraint values.'
        );
      }

      if (error.name === 'SecurityError') {
        return new Error(
          'Camera access blocked by security policy. HTTPS is required for camera access.'
        );
      }

      return error;
    }

    return new Error(`Unknown camera access error: ${String(error)}`);
  }
}

export default MediaDeviceManager;
