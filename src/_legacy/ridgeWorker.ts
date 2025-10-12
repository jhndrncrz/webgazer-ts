/// <reference lib="webworker" />

import util from './util';
import mat from './mat';

const ctx = self as unknown as DedicatedWorkerGlobalScope & { webgazer?: any };

const ridgeParameter = Math.pow(10, -5);
const dataWindow = 50;
const trailDataWindow = 10;
const trainInterval = 500;

const screenXClicksArray = new util.DataWindow(dataWindow) as any;
const screenYClicksArray = new util.DataWindow(dataWindow) as any;
const eyeFeaturesClicks = new util.DataWindow(dataWindow) as any;
const dataClicks = new util.DataWindow(dataWindow) as any;

const screenXTrailArray = new util.DataWindow(trailDataWindow) as any;
const screenYTrailArray = new util.DataWindow(trailDataWindow) as any;
const eyeFeaturesTrail = new util.DataWindow(trailDataWindow) as any;
const dataTrail = new util.DataWindow(trailDataWindow) as any;

function ridge(y: number[][], X: number[][], k: number) {
  const nc = X[0].length;
  const xt = mat.transpose(X);
  let solution: any = [];
  let success = true;
  let localK = k;
  const m_Coefficients = new Array(nc).fill(0);
  do {
    const ss = mat.mult(xt, X);
    for (let i = 0; i < nc; i++) ss[i][i] = ss[i][i] + localK;
    const bb = mat.mult(xt, y);
    try {
      solution = mat.solve(ss, bb);
      for (let i = 0; i < nc; i++) m_Coefficients[i] = (solution[i] as any)[0] ?? solution[i];
      success = true;
    } catch (ex) {
      localK *= 10;
      console.log(ex);
      success = false;
    }
  } while (!success);
  return m_Coefficients;
}

let needsTraining = false;

ctx.onmessage = (event: MessageEvent) => {
  const data = event.data as { screenPos: [number, number]; eyes: any; type: 'click' | 'move' };
  const { screenPos, eyes, type } = data;
  if (type === 'click') {
    screenXClicksArray.push([screenPos[0]]);
    screenYClicksArray.push([screenPos[1]]);
    eyeFeaturesClicks.push(eyes);
  } else if (type === 'move') {
    screenXTrailArray.push([screenPos[0]]);
    screenYTrailArray.push([screenPos[1]]);
    eyeFeaturesTrail.push(eyes);
    dataTrail.push({ eyes, screenPos, type });
  }
  needsTraining = true;
};

function retrain() {
  if (screenXClicksArray.length === 0) return;
  if (!needsTraining) return;
  const screenXArray = screenXClicksArray.data.concat(screenXTrailArray.data);
  const screenYArray = screenYClicksArray.data.concat(screenYTrailArray.data);
  const eyeFeatures = eyeFeaturesClicks.data.concat(eyeFeaturesTrail.data);
  const coefficientsX = ridge(screenXArray, eyeFeatures, ridgeParameter);
  const coefficientsY = ridge(screenYArray, eyeFeatures, ridgeParameter);
  ctx.postMessage({ X: coefficientsX, Y: coefficientsY });
  needsTraining = false;
}

setInterval(retrain, trainInterval);

export {};
