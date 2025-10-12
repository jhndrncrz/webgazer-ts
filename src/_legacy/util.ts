import mat from './mat';
import params from './params';

export type EyePatch = {
  patch: ImageData;
  imagex: number;
  imagey: number;
  width: number;
  height: number;
};

const util: any = {};

const resizeWidth = 10;
const resizeHeight = 6;

util.Eye = function(patch: ImageData, imagex: number, imagey: number, width: number, height: number) {
  this.patch = patch;
  this.imagex = imagex;
  this.imagey = imagey;
  this.width = width;
  this.height = height;
};

util.getEyeFeats = function(eyes: { left: EyePatch; right: EyePatch }): number[] {
  const process = (eye: EyePatch) => {
    const resized = util.resizeEye(eye, resizeWidth, resizeHeight);
    const gray = util.grayscale(resized.data, resized.width, resized.height);
    const hist: number[] = [] as any;
    util.equalizeHistogram(gray, 5, hist);
    return hist as number[];
  };
  if (params.trackEye === 'left') return process(eyes.left);
  if (params.trackEye === 'right') return process(eyes.right);
  return ([] as number[]).concat(process(eyes.left), process(eyes.right));
}

util.DataWindow = function<T>(this: any, windowSize: number, data?: T[]) {
  this.data = [] as T[];
  this.windowSize = windowSize;
  this.index = 0;
  this.length = 0;
  if (data) {
    this.data = data.slice(Math.max(0, data.length - windowSize));
    this.length = this.data.length;
  }
};

util.DataWindow.prototype.push = function<T>(this: any, entry: T) {
  if (this.data.length < this.windowSize) {
    this.data.push(entry);
    this.length = this.data.length;
    return this;
  }
  this.data[this.index] = entry;
  this.index = (this.index + 1) % this.windowSize;
  return this;
};

util.DataWindow.prototype.get = function<T>(this: any, ind: number): T {
  return this.data[this.getTrueIndex(ind)];
};

util.DataWindow.prototype.getTrueIndex = function(this: any, ind: number): number {
  if (this.data.length < this.windowSize) return ind;
  return (ind + this.index) % this.windowSize;
};

util.DataWindow.prototype.addAll = function<T>(this: { push: (entry: T) => any }, data: T[]) {
  for (let i = 0; i < data.length; i++) this.push(data[i]);
};

util.grayscale = function(pixels: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray {
  const gray = new Uint8ClampedArray(pixels.length >> 2);
  let p = 0;
  let w = 0;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const value = pixels[w] * 0.299 + pixels[w + 1] * 0.587 + pixels[w + 2] * 0.114;
      gray[p++] = value;
      w += 4;
    }
  }
  return gray;
};

util.equalizeHistogram = function(src: Uint8ClampedArray, step = 5, dst?: Uint8ClampedArray | number[]) {
  const srcLength = src.length;
  if (!dst) dst = src;
  const hist = new Array<number>(256).fill(0);
  for (let i = 0; i < srcLength; i += step) ++hist[src[i]];
  const norm = (255 * step) / srcLength;
  let prev = 0;
  for (let i = 0; i < 256; ++i) {
    const h = hist[i];
    prev = hist[i] = h + prev;
    hist[i] = hist[i] * norm;
  }
  for (let i = 0; i < srcLength; ++i) (dst as any)[i] = hist[src[i]];
  return dst;
};

util.resizeEye = function(eye: EyePatch, w: number, h: number): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = eye.width;
  canvas.height = eye.height;
  canvas.getContext('2d', { willReadFrequently: true })!.putImageData(eye.patch, 0, 0);
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  tempCanvas.getContext('2d')!.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, w, h);
  return tempCanvas.getContext('2d')!.getImageData(0, 0, w, h);
};

util.bound = function(prediction: { x: number; y: number }) {
  if (prediction.x < 0) prediction.x = 0;
  if (prediction.y < 0) prediction.y = 0;
  const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  if (prediction.x > w) prediction.x = w;
  if (prediction.y > h) prediction.y = h;
  return prediction;
};

export default util;
