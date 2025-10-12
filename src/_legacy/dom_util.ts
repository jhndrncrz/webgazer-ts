declare global {
  interface Window {
    requestAnimFrame: typeof requestAnimationFrame;
    cancelRequestAnimFrame: typeof cancelAnimationFrame;
  }
}

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    (window as any).oRequestAnimationFrame ||
    (window as any).msRequestAnimationFrame ||
    function (callback: FrameRequestCallback) { return window.setTimeout(callback, 1000 / 60) as unknown as number; }
  );
})();

window.cancelRequestAnimFrame = (function () {
  return (
    window.cancelAnimationFrame ||
    (window as any).webkitCancelRequestAnimationFrame ||
    (window as any).mozCancelRequestAnimationFrame ||
    (window as any).oCancelRequestAnimationFrame ||
    (window as any).msCancelRequestAnimationFrame ||
    window.clearTimeout
  ) as any;
})();

export {};
