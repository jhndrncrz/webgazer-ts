import util from './util';
import mat, { Matrix } from './mat';
import params from './params';

const util_regression: any = {};

util_regression.InitRegression = function(this: any) {
  const dataWindow = 50;
  const trailDataWindow = 10;
  this.ridgeParameter = Math.pow(10, -5);
  this.errorXArray = new util.DataWindow(dataWindow);
  this.errorYArray = new util.DataWindow(dataWindow);

  this.screenXClicksArray = new util.DataWindow(dataWindow);
  this.screenYClicksArray = new util.DataWindow(dataWindow);
  this.eyeFeaturesClicks = new util.DataWindow(dataWindow);

  this.trailTime = 1000;
  this.trailDataWindow = this.trailTime / params.moveTickSize;
  this.screenXTrailArray = new util.DataWindow(trailDataWindow);
  this.screenYTrailArray = new util.DataWindow(trailDataWindow);
  this.eyeFeaturesTrail = new util.DataWindow(trailDataWindow);
  this.trailTimes = new util.DataWindow(trailDataWindow);

  this.dataClicks = new util.DataWindow(dataWindow);
  this.dataTrail = new util.DataWindow(trailDataWindow);

  const F: Matrix = [[1, 0, 1, 0],[0, 1, 0, 1],[0, 0, 1, 0],[0, 0, 0, 1]];
  let Q: Matrix = [[1/4, 0, 1/2, 0],[0, 1/4, 0, 1/2],[1/2, 0, 1, 0],[0, 1/2, 0, 1]];
  const delta_t = 1/10;
  Q = mat.multScalar(Q, delta_t);
  const H: Matrix = [[1, 0, 0, 0],[0, 1, 0, 0]];
  const pixel_error = 47;
  const R = mat.multScalar(mat.identity(2), pixel_error);
  const P_initial = mat.multScalar(mat.identity(4), 0.0001);
  const x_initial: Matrix = [[500],[500],[0],[0]];
  this.kalman = new util_regression.KalmanFilter(F, H, Q, R, P_initial, x_initial);
}

util_regression.KalmanFilter = function(this: any, F: Matrix, H: Matrix, Q: Matrix, R: Matrix, P_initial: Matrix, X_initial: Matrix) {
  this.F = F; this.H = H; this.Q = Q; this.R = R; this.P = P_initial; this.X = X_initial;
};

util_regression.KalmanFilter.prototype.update = function(this: any, z: number[]) {
  const { add, sub, mult, inv, identity, transpose } = mat;
  const X_p = mult(this.F, this.X);
  const P_p = add(mult(mult(this.F, this.P), transpose(this.F)), this.Q);
  const zT = transpose([z]);
  const y = sub(zT, mult(this.H, X_p));
  const S = add(mult(mult(this.H, P_p), transpose(this.H)), this.R);
  const K = mult(P_p, mult(transpose(this.H), inv(S)));
  for (let i = 0; i < y.length; i++) y[i] = [y[i] as any];
  this.X = add(X_p, mult(K, y as any));
  this.P = mult(sub(identity(K.length), mult(K, this.H)), P_p);
  return transpose(mult(this.H, this.X))[0];
};

util_regression.ridge = function(y: number[][], X: number[][], k: number) {
  const nc = X[0].length;
  const m_Coefficients = new Array(nc).fill(0);
  const xt = mat.transpose(X);
  let solution: any = [];
  let success = true;
  do {
    const ss = mat.mult(xt, X);
    for (let i = 0; i < nc; i++) ss[i][i] = ss[i][i] + k;
    const bb = mat.mult(xt, y);
    for (let i = 0; i < nc; i++) m_Coefficients[i] = bb[i][0];
    try {
      solution = mat.solve(ss, bb);
      for (let i = 0; i < nc; i++) m_Coefficients[i] = solution[i] as any;
      success = true;
    } catch (ex) {
      k *= 10;
      console.log(ex);
      success = false;
    }
  } while (!success);
  return m_Coefficients;
}

util_regression.setData = function(this: any, data: any[]) {
  for (let i = 0; i < data.length; i++) {
    const leftData = new Uint8ClampedArray(data[i].eyes.left.patch.data);
    const rightData = new Uint8ClampedArray(data[i].eyes.right.patch.data);
    data[i].eyes.left.patch = new ImageData(leftData, data[i].eyes.left.width, data[i].eyes.left.height);
    data[i].eyes.right.patch = new ImageData(rightData, data[i].eyes.right.width, data[i].eyes.right.height);
    this.addData(data[i].eyes, data[i].screenPos, data[i].type);
  }
};

util_regression.addData = function(this: any, eyes: any, screenPos: [number, number], type: 'click' | 'move') {
  if (!eyes) return;
  if (type === 'click') {
    this.screenXClicksArray.push([screenPos[0]]);
    this.screenYClicksArray.push([screenPos[1]]);
    this.eyeFeaturesClicks.push(util.getEyeFeats(eyes));
    this.dataClicks.push({ eyes, screenPos, type });
  } else if (type === 'move') {
    this.screenXTrailArray.push([screenPos[0]]);
    this.screenYTrailArray.push([screenPos[1]]);
    this.eyeFeaturesTrail.push(util.getEyeFeats(eyes));
    this.trailTimes.push(performance.now());
    this.dataTrail.push({ eyes, screenPos, type });
  }
};

export default util_regression;
