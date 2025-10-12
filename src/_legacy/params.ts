const params = {
  moveTickSize: 50,
  videoContainerId: 'webgazerVideoContainer',
  videoElementId: 'webgazerVideoFeed',
  videoElementCanvasId: 'webgazerVideoCanvas',
  faceOverlayId: 'webgazerFaceOverlay',
  faceFeedbackBoxId: 'webgazerFaceFeedbackBox',
  gazeDotId: 'webgazerGazeDot',
  videoViewerWidth: 320,
  videoViewerHeight: 240,
  faceFeedbackBoxRatio: 0.66,
  showVideo: true,
  mirrorVideo: true,
  showFaceOverlay: true,
  showFaceFeedbackBox: true,
  showGazeDot: true,
  camConstraints: { video: { width: { min: 320, ideal: 640, max: 1920 }, height: { min: 240, ideal: 480, max: 1080 }, facingMode: 'user' as const } },
  dataTimestep: 50,
  showVideoPreview: true,
  applyKalmanFilter: true,
  saveDataAcrossSessions: true,
  storingPoints: false,
  trackEye: 'both' as 'left' | 'right' | 'both'
};

export type WebGazerParams = typeof params & {
  getEventTypes?: () => string[];
};

export default params as WebGazerParams;
