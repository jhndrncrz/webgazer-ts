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

const webgazer = {
  params,
  util,
  async begin() {
    throw unsupportedBrowserMethod('begin');
  },
  end() {
    return webgazer;
  },
  pause() {
    return webgazer;
  },
  async resume() {
    throw unsupportedBrowserMethod('resume');
  },
  isReady() {
    return false;
  },
  setGazeListener() {
    return webgazer;
  },
  clearGazeListener() {
    return webgazer;
  },
  async getCurrentPrediction() {
    return null;
  },
  setRegression() {
    return webgazer;
  },
  addRegression() {
    return webgazer;
  },
  getRegression() {
    return [];
  },
  addRegressionModule() {
    return webgazer;
  },
  setTracker() {
    return webgazer;
  },
  getTracker() {
    return null;
  },
  addTrackerModule() {
    return webgazer;
  },
  showVideoPreview(show) {
    params.showVideoPreview = Boolean(show);
    return webgazer;
  },
  showVideo(show) {
    params.showVideo = Boolean(show);
    return webgazer;
  },
  hideVideo() {
    params.showVideo = false;
    return webgazer;
  },
  showFaceOverlay(show) {
    params.showFaceOverlay = Boolean(show);
    return webgazer;
  },
  hideFaceOverlay() {
    params.showFaceOverlay = false;
    return webgazer;
  },
  showFaceFeedbackBox(show) {
    params.showFaceFeedbackBox = Boolean(show);
    return webgazer;
  },
  hideFaceFeedbackBox() {
    params.showFaceFeedbackBox = false;
    return webgazer;
  },
  showPredictionPoints(show) {
    params.showGazeDot = Boolean(show);
    return webgazer;
  },
  hidePredictionPoints() {
    params.showGazeDot = false;
    return webgazer;
  },
  setVideoViewerSize() {
    return webgazer;
  },
  stopVideo() {
    return webgazer;
  },
  setStaticVideo() {
    return webgazer;
  },
  async setCameraConstraints() {
    throw unsupportedBrowserMethod('setCameraConstraints');
  },
  getVideoElementCanvas() {
    return null;
  },
  getVideoPreviewToCameraResolutionRatio() {
    return [1, 1];
  },
  saveDataAcrossSessions(save) {
    params.saveDataAcrossSessions = Boolean(save);
    return webgazer;
  },
  async clearData() {},
  getStoredPoints() {
    return [new Array(50).fill(0), new Array(50).fill(0)];
  },
  getCalibrationDataCount() {
    return 0;
  },
  applyKalmanFilter(apply) {
    params.applyKalmanFilter = Boolean(apply);
    return webgazer;
  },
  recordScreenPosition() {
    return webgazer;
  },
  storePoints() {},
  addMouseEventListeners() {
    return webgazer;
  },
  removeMouseEventListeners() {
    return webgazer;
  },
  computeValidationBoxSize() {
    return [0, 0, 0, 0];
  },
  async checkCameraPermission() {
    return 'unsupported';
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
  setLogLevel() {
    return webgazer;
  },
  setDebugMode() {
    return webgazer;
  },
  setMaxFPS() {
    return webgazer;
  },
  setPredictionInterval() {
    return webgazer;
  },
  setFaceDetectionInterval() {
    return webgazer;
  },
  setAutoPauseOnBlur() {
    return webgazer;
  },
  setSmoothingType() {
    return webgazer;
  },
  setEMAAlpha() {
    return webgazer;
  },
  setKalmanFilterStrength() {
    return webgazer;
  },
  getConfig() {
    return { ...params };
  },
  getStoredData() {
    return null;
  },
  on() {
    return webgazer;
  },
  off() {
    return webgazer;
  },
};

module.exports = webgazer;
module.exports.default = webgazer;
module.exports.webgazer = webgazer;
