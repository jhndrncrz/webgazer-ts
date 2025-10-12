import util from './util';
import util_regression from './util_regression';
import params from './params';

const reg: any = {};

let weights = { X: [0], Y: [0] } as { X: number[]; Y: number[] };

reg.RidgeRegThreaded = function (this: any) { this.init(); } as any;

reg.RidgeRegThreaded.prototype.init = function (this: any) {
  const dataWindow = 50;
  const trailDataWindow = 10;
  this.screenXClicksArray = new util.DataWindow(dataWindow);
  this.screenYClicksArray = new util.DataWindow(dataWindow);
  this.eyeFeaturesClicks = new util.DataWindow(dataWindow);
  this.screenXTrailArray = new util.DataWindow(trailDataWindow);
  this.screenYTrailArray = new util.DataWindow(trailDataWindow);
  this.eyeFeaturesTrail = new util.DataWindow(trailDataWindow);
  this.dataClicks = new util.DataWindow(dataWindow);
  this.dataTrail = new util.DataWindow(dataWindow);

  if (!this.worker) {
    const worker = new Worker(new URL('./ridgeWorker.ts', import.meta.url), { type: 'module' });
    this.worker = worker;
    worker.onerror = (err: any) => console.log(err.message);
    worker.onmessage = (evt: MessageEvent) => { weights.X = evt.data.X; weights.Y = evt.data.Y; };
  }

  // Kalman
  util_regression.InitRegression.call(this);
};

reg.RidgeRegThreaded.prototype.addData = function (this: any, eyes: any, screenPos: [number, number], type: 'click' | 'move') {
  if (!eyes) return;
  this.worker.postMessage({ eyes: util.getEyeFeats(eyes), screenPos, type });
};

reg.RidgeRegThreaded.prototype.predict = function (this: any, eyesObj: any) {
  if (!eyesObj) return null;
  const coefficientsX = weights.X;
  const coefficientsY = weights.Y;
  const eyeFeats = util.getEyeFeats(eyesObj);
  let predictedX = 0, predictedY = 0;
  for (let i = 0; i < eyeFeats.length; i++) { predictedX += eyeFeats[i] * coefficientsX[i]; predictedY += eyeFeats[i] * coefficientsY[i]; }
  predictedX = Math.floor(predictedX); predictedY = Math.floor(predictedY);
  if (params.applyKalmanFilter) {
    const g = this.kalman.update([predictedX, predictedY]);
    return { x: g[0], y: g[1] };
  }
  return { x: predictedX, y: predictedY };
};

reg.RidgeRegThreaded.prototype.setData = util_regression.setData;
reg.RidgeRegThreaded.prototype.getData = function (this: any) { return this.dataClicks.data; };
reg.RidgeRegThreaded.prototype.name = 'ridge';

export default reg;
