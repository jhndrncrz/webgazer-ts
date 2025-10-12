import util from './util';
import util_regression from './util_regression';
import params from './params';

const reg: any = {};

reg.RidgeWeightedReg = function(this: any) { this.init(); } as any;
reg.RidgeWeightedReg.prototype.init = util_regression.InitRegression;
reg.RidgeWeightedReg.prototype.addData = util_regression.addData;

reg.RidgeWeightedReg.prototype.predict = function(this: any, eyesObj: any) {
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

  const len = this.eyeFeaturesClicks.data.length;
  const weightedEyeFeats: number[][] = Array(len);
  const weightedXArray: number[][] = Array(len);
  const weightedYArray: number[][] = Array(len);
  for (let i = 0; i < len; i++) {
    const weight = Math.sqrt(1 / (len - i));
    const trueIndex = this.eyeFeaturesClicks.getTrueIndex(i);
    for (let j = 0; j < this.eyeFeaturesClicks.data[trueIndex].length; j++) {
      const val = this.eyeFeaturesClicks.data[trueIndex][j] * weight;
      if (weightedEyeFeats[trueIndex] !== undefined) weightedEyeFeats[trueIndex].push(val);
      else weightedEyeFeats[trueIndex] = [val];
    }
    weightedXArray[i] = this.screenXClicksArray.get(i).slice(0);
    weightedYArray[i] = this.screenYClicksArray.get(i).slice(0);
    weightedXArray[i][0] = weightedXArray[i][0] * weight;
    weightedYArray[i][0] = weightedYArray[i][0] * weight;
  }

  const screenXArray = weightedXArray.concat(trailX);
  const screenYArray = weightedYArray.concat(trailY);
  const eyeFeatures = weightedEyeFeats.concat(trailFeat);
  const coefficientsX = util_regression.ridge(screenXArray, eyeFeatures, this.ridgeParameter);
  const coefficientsY = util_regression.ridge(screenYArray, eyeFeatures, this.ridgeParameter);
  const eyeFeats = util.getEyeFeats(eyesObj);
  let predictedX = 0, predictedY = 0;
  for (let i = 0; i < eyeFeats.length; i++) predictedX += eyeFeats[i] * coefficientsX[i];
  for (let i = 0; i < eyeFeats.length; i++) predictedY += eyeFeats[i] * coefficientsY[i];
  predictedX = Math.floor(predictedX); predictedY = Math.floor(predictedY);
  if (params.applyKalmanFilter) {
    const ng = this.kalman.update([predictedX, predictedY]);
    return { x: ng[0], y: ng[1] };
  }
  return { x: predictedX, y: predictedY };
};

reg.RidgeWeightedReg.prototype.setData = util_regression.setData;
reg.RidgeWeightedReg.prototype.getData = function(this: any) { return this.dataClicks.data; };
reg.RidgeWeightedReg.prototype.name = 'ridgeWeighted';

export default reg;
