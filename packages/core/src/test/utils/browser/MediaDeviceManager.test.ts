import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MediaDeviceManager } from '../../../utils/browser/MediaDeviceManager';

function makeMockStream(readyState: 'live' | 'ended' = 'live'): MediaStream {
  const track = {
    stop: vi.fn(),
    readyState,
    getSettings: vi.fn(() => ({ width: 640, height: 480, frameRate: 30 })),
    getCapabilities: vi.fn(() => ({ width: { min: 320, max: 1920 } })),
    applyConstraints: vi.fn().mockResolvedValue(undefined),
  };
  return {
    getTracks: vi.fn(() => [track]),
    getVideoTracks: vi.fn(() => [track]),
    getAudioTracks: vi.fn(() => []),
  } as unknown as MediaStream;
}

describe('MediaDeviceManager', () => {
  let manager: MediaDeviceManager;
  const originalMediaDevices = navigator.mediaDevices;

  beforeEach(() => {
    manager = new MediaDeviceManager();
    // Reset mediaDevices
    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      value: { getUserMedia: vi.fn(), enumerateDevices: vi.fn() },
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      value: originalMediaDevices,
    });
    vi.restoreAllMocks();
  });

  it('requestCameraAccess() returns a MediaStream on success', async () => {
    const mockStream = makeMockStream();
    (navigator.mediaDevices.getUserMedia as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockStream);

    const stream = await manager.requestCameraAccess();
    expect(stream).toBe(mockStream);
    expect(manager.getCurrentStream()).toBe(mockStream);
    expect(manager.isStreamActive()).toBe(true);
  });

  it('throws a descriptive error for NotAllowedError (permission denied)', async () => {
    const err = Object.assign(new Error('Not allowed'), { name: 'NotAllowedError' });
    (navigator.mediaDevices.getUserMedia as ReturnType<typeof vi.fn>).mockRejectedValueOnce(err);

    await expect(manager.requestCameraAccess()).rejects.toThrow('Camera access denied');
  });

  it('throws a descriptive error for NotFoundError (no camera)', async () => {
    const err = Object.assign(new Error('Not found'), { name: 'NotFoundError' });
    (navigator.mediaDevices.getUserMedia as ReturnType<typeof vi.fn>).mockRejectedValueOnce(err);

    await expect(manager.requestCameraAccess()).rejects.toThrow('No camera found');
  });

  it('throws a descriptive error for NotReadableError (camera in use)', async () => {
    const err = Object.assign(new Error('Not readable'), { name: 'NotReadableError' });
    (navigator.mediaDevices.getUserMedia as ReturnType<typeof vi.fn>).mockRejectedValueOnce(err);

    await expect(manager.requestCameraAccess()).rejects.toThrow('Camera is already in use');
  });

  it('throws a descriptive error for SecurityError (not HTTPS)', async () => {
    const err = Object.assign(new Error('Security'), { name: 'SecurityError' });
    (navigator.mediaDevices.getUserMedia as ReturnType<typeof vi.fn>).mockRejectedValueOnce(err);

    await expect(manager.requestCameraAccess()).rejects.toThrow('HTTPS is required');
  });

  it('throws a descriptive error for OverconstrainedError', async () => {
    const err = Object.assign(new Error('Overconstrained'), { name: 'OverconstrainedError' });
    (navigator.mediaDevices.getUserMedia as ReturnType<typeof vi.fn>).mockRejectedValueOnce(err);

    await expect(manager.requestCameraAccess()).rejects.toThrow('does not support the requested constraints');
  });

  it('stopVideoStream() stops all tracks and clears stream', async () => {
    const mockStream = makeMockStream();
    (navigator.mediaDevices.getUserMedia as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockStream);

    await manager.requestCameraAccess();
    manager.stopVideoStream();

    expect(manager.getCurrentStream()).toBeNull();
    // Verify track.stop() was called
    const track = mockStream.getVideoTracks()[0] as unknown as { stop: ReturnType<typeof vi.fn> };
    expect(track.stop).toHaveBeenCalled();
  });

  it('isStreamActive() returns false when stream has ended tracks', async () => {
    const mockStream = makeMockStream('ended');
    (navigator.mediaDevices.getUserMedia as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockStream);

    await manager.requestCameraAccess();
    expect(manager.isStreamActive()).toBe(false);
  });

  it('isStreamActive() returns false when no stream', () => {
    expect(manager.isStreamActive()).toBe(false);
  });

  it('listVideoDevices() filters to videoinput devices', async () => {
    const devices = [
      { kind: 'videoinput', deviceId: 'cam1', label: 'Camera 1' },
      { kind: 'audioinput', deviceId: 'mic1', label: 'Microphone 1' },
    ];
    (navigator.mediaDevices.enumerateDevices as ReturnType<typeof vi.fn>).mockResolvedValueOnce(devices);

    const videoDevices = await manager.listVideoDevices();
    expect(videoDevices).toHaveLength(1);
    expect(videoDevices[0].kind).toBe('videoinput');
  });

  it('isGetUserMediaSupported() returns true when API is present', () => {
    expect(MediaDeviceManager.isGetUserMediaSupported()).toBe(true);
  });
});
