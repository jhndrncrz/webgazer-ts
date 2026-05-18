const unsupportedBrowserMethod = (methodName) =>
  new Error(
    `@webgazer-ts/core method "${methodName}" requires a browser environment. ` +
      'Importing the package during SSR is supported, but tracking can only start in the browser.'
  );

const params = {
  showVideo: true,
  mirrorVideo: true,
  showFaceOverlay: true,
  showFaceFeedbackBox: true,
  showGazeDot: true,
  showVideoPreview: true,
  saveDataAcrossSessions: true,
  applyKalmanFilter: true,
  cameraConstraints: {
    video: {
      width: { min: 320, ideal: 640, max: 1920 },
      height: { min: 240, ideal: 480, max: 1080 },
      facingMode: 'user',
    },
  },
  get camConstraints() {
    return this.cameraConstraints;
  },
  set camConstraints(value) {
    this.cameraConstraints = value;
  },
  getEventTypes() {
    return ['click', 'move'];
  },
};

const util = {
  DataWindow: class DataWindow {
    constructor(windowSize = 0) {
      this.windowSize = windowSize;
      this.data = [];
    }

    push(value) {
      this.data.push(value);
      if (this.windowSize > 0 && this.data.length > this.windowSize) {
        this.data.shift();
      }
    }

    get(index) {
      return this.data[index];
    }

    get length() {
      return this.data.length;
    }
  },
  bound(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },
};

const chainableMethods = [
  'pause',
  'end',
  'setGazeListener',
  'clearGazeListener',
  'setRegression',
  'addRegression',
  'addRegressionModule',
  'setTracker',
  'addTrackerModule',
  'showVideoPreview',
  'showVideo',
  'hideVideo',
  'showFaceOverlay',
  'hideFaceOverlay',
  'showFaceFeedbackBox',
  'hideFaceFeedbackBox',
  'showPredictionPoints',
  'hidePredictionPoints',
  'setVideoViewerSize',
  'stopVideo',
  'setStaticVideo',
  'saveDataAcrossSessions',
  'applyKalmanFilter',
  'recordScreenPosition',
  'addMouseEventListeners',
  'removeMouseEventListeners',
  'storePoints',
  'setLogLevel',
  'setDebugMode',
  'setMaxFPS',
  'setPredictionInterval',
  'setFaceDetectionInterval',
  'setAutoPauseOnBlur',
  'setSmoothingType',
  'setEMAAlpha',
  'setKalmanFilterStrength',
  'on',
  'off',
];

const asyncUnsupportedMethods = {
  async begin() {
    throw unsupportedBrowserMethod('begin');
  },
  async resume() {
    throw unsupportedBrowserMethod('resume');
  },
  async getCurrentPrediction() {
    return null;
  },
  async clearData() {
    return;
  },
  async setCameraConstraints() {
    throw unsupportedBrowserMethod('setCameraConstraints');
  },
  async checkCameraPermission() {
    return 'unsupported';
  },
};

const webgazer = {
  params,
  util,
  isReady() {
    return false;
  },
  getTracker() {
    return null;
  },
  getRegression() {
    return [];
  },
  getStoredPoints() {
    return [new Array(50).fill(0), new Array(50).fill(0)];
  },
  getCalibrationDataCount() {
    return 0;
  },
  getVideoElementCanvas() {
    return null;
  },
  getVideoPreviewToCameraResolutionRatio() {
    return [1, 1];
  },
  computeValidationBoxSize() {
    return [0, 0, 0, 0];
  },
  detectCompatibility() {
    return false;
  },
  getCompatibilityWarnings() {
    return ['@webgazer-ts/core is running outside a browser environment.'];
  },
  logCompatibilityInfo() {},
  getState() {
    return 'not_initialized';
  },
  getEventManager() {
    return null;
  },
  getCalibrationManager() {
    return null;
  },
  getConfig() {
    return { ...params };
  },
  getStoredData() {
    return null;
  },
  ...asyncUnsupportedMethods,
};

for (const methodName of chainableMethods) {
  webgazer[methodName] = (...args) => {
    if (methodName === 'showVideo') params.showVideo = Boolean(args[0]);
    if (methodName === 'showVideoPreview') params.showVideoPreview = Boolean(args[0]);
    if (methodName === 'showFaceOverlay') params.showFaceOverlay = Boolean(args[0]);
    if (methodName === 'showFaceFeedbackBox') params.showFaceFeedbackBox = Boolean(args[0]);
    if (methodName === 'showPredictionPoints') params.showGazeDot = Boolean(args[0]);
    if (methodName === 'saveDataAcrossSessions') params.saveDataAcrossSessions = Boolean(args[0]);
    if (methodName === 'applyKalmanFilter') params.applyKalmanFilter = Boolean(args[0]);
    return webgazer;
  };
}

export default webgazer;
export { webgazer };
