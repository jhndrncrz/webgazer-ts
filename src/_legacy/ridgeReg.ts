import util from './util';
import util_regression from './util_regression';
import params from './params';

const reg: any = {};

reg.RidgeReg = function(this: any) { this.init(); } as any;
reg.RidgeReg.prototype.init = util_regression.InitRegression;
reg.RidgeReg.prototype.addData = util_regression.addData;
reg.RidgeReg.prototype.predict = function(this: any, eyesObj: any) {
  if (!eyesObj || this.eyeFeaturesClicks.length === 0) return null;
  const acceptTime = performance.now() - this.trailTime;
  const trailX: any[] = [], trailY: any[] = [], trailFeat: any[] = [];
  for (let i = 0; i < this.trailDataWindow; i++) {
    if (this.trailTimes.get(i) > acceptTime) {
      trailX.push(this.screenXTrailArray.get(i));
      trailY.push(this.screenYTrailArray.get(i));
      trailFeat.push(this.eyeFeaturesTrail.get(i));
    }
  }
  const screenXArray = this.screenXClicksArray.data.concat(trailX);
  const screenYArray = this.screenYClicksArray.data.concat(trailY);
  const eyeFeatures = this.eyeFeaturesClicks.data.concat(trailFeat);
  const coefficientsX = util_regression.ridge(screenXArray, eyeFeatures, this.ridgeParameter);
  const coefficientsY = util_regression.ridge(screenYArray, eyeFeatures, this.ridgeParameter);
  const eyeFeats = util.getEyeFeats(eyesObj);
  let predictedX = 0, predictedY = 0;
  for (let i = 0; i < eyeFeats.length; i++) { predictedX += eyeFeats[i] * coefficientsX[i]; }
  for (let i = 0; i < eyeFeats.length; i++) { predictedY += eyeFeats[i] * coefficientsY[i]; }
  predictedX = Math.floor(predictedX); predictedY = Math.floor(predictedY);
  if (params.applyKalmanFilter) {
    const newGaze = this.kalman.update([predictedX, predictedY]);
    return { x: newGaze[0], y: newGaze[1] };
  }
  return { x: predictedX, y: predictedY };
};
reg.RidgeReg.prototype.setData = util_regression.setData;
reg.RidgeReg.prototype.getData = function(this: any) { return this.dataClicks.data; };
reg.RidgeReg.prototype.name = 'ridge';
export default reg;
