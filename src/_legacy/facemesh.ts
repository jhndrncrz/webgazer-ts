// Import as any to avoid strict API typing issues across versions
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

export type EyePatches = {
  left: { patch: ImageData; imagex: number; imagey: number; width: number; height: number };
  right: { patch: ImageData; imagex: number; imagey: number; width: number; height: number };
};

export default class TFFaceMesh {
  private modelPromise: Promise<any>;
  predictionReady = false;
  positionsArray: number[][] | null = null;

  constructor() {
    const fld: any = faceLandmarksDetection as any;
    this.modelPromise = (fld.load ? fld.load(fld.SupportedPackages?.mediapipeFacemesh ?? fld.SupportedPackages?.MediaPipeFaceMesh ?? 0, { maxFaces: 1 })
                                  : fld.createDetector ? fld.createDetector(fld.SupportedModels?.MediapipeFacemesh ?? fld.SupportedModels?.MediaPipeFaceMesh, { runtime: 'tfjs' })
                                  : Promise.reject(new Error('face-landmarks-detection API not available')));
  }

  async getEyePatches(video: HTMLVideoElement, imageCanvas: HTMLCanvasElement, width: number, height: number): Promise<EyePatches | null | false> {
    if (imageCanvas.width === 0) return null;
    const model = await this.modelPromise;
  const predictions = await (model.estimateFaces ? model.estimateFaces(video, { flipHorizontal: false, predictIrises: false })
                           : model.estimateFaces ? model.estimateFaces({ input: video, flipHorizontal: false, predictIrises: false })
                           : model.estimateFaces(video));
    if (predictions.length === 0) return false;
    this.positionsArray = (predictions[0] as any).scaledMesh as number[][];
    const prediction: any = predictions[0] as any;
    const [leftBBox, rightBBox] = [
      { eyeTopArc: prediction.annotations.leftEyeUpper0, eyeBottomArc: prediction.annotations.leftEyeLower0 },
      { eyeTopArc: prediction.annotations.rightEyeUpper0, eyeBottomArc: prediction.annotations.rightEyeLower0 },
    ].map(({ eyeTopArc, eyeBottomArc }: any) => {
      const topLeftOrigin = { x: Math.round(Math.min(...eyeTopArc.map((v: number[]) => v[0]))), y: Math.round(Math.min(...eyeTopArc.map((v: number[]) => v[1]))) };
      const bottomRightOrigin = { x: Math.round(Math.max(...eyeBottomArc.map((v: number[]) => v[0]))), y: Math.round(Math.max(...eyeBottomArc.map((v: number[]) => v[1]))) };
      return { origin: topLeftOrigin, width: bottomRightOrigin.x - topLeftOrigin.x, height: bottomRightOrigin.y - topLeftOrigin.y };
    });
    const leftOriginX = leftBBox.origin.x;
    const leftOriginY = leftBBox.origin.y;
    const leftWidth = leftBBox.width;
    const leftHeight = leftBBox.height;
    const rightOriginX = rightBBox.origin.x;
    const rightOriginY = rightBBox.origin.y;
    const rightWidth = rightBBox.width;
    const rightHeight = rightBBox.height;
    if (leftWidth === 0 || rightWidth === 0) return null;
    if (leftHeight === 0 || rightHeight === 0) return null;
    const eyeObjs: any = {};
    const ctx = imageCanvas.getContext('2d', { willReadFrequently: true })!;
    const leftImageData = ctx.getImageData(leftOriginX, leftOriginY, leftWidth, leftHeight);
    eyeObjs.left = { patch: leftImageData, imagex: leftOriginX, imagey: leftOriginY, width: leftWidth, height: leftHeight };
    const rightImageData = ctx.getImageData(rightOriginX, rightOriginY, rightWidth, rightHeight);
    eyeObjs.right = { patch: rightImageData, imagex: rightOriginX, imagey: rightOriginY, width: rightWidth, height: rightHeight };
    this.predictionReady = true;
    return eyeObjs as EyePatches;
  }

  getPositions() { return this.positionsArray; }

  reset() { /* no op for tfjs model */ }

  drawFaceOverlay(ctx: CanvasRenderingContext2D, keypoints: number[][] | null) {
    if (!keypoints) return;
    ctx.fillStyle = '#32EEDB';
    ctx.strokeStyle = '#32EEDB';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < keypoints.length; i++) {
      const x = keypoints[i][0];
      const y = keypoints[i][1];
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  name = 'TFFaceMesh';
}
