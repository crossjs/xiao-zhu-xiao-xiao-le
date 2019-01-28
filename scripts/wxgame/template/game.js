import "./utils/ald-game.js";
import "./weapp-adapter.js";
import "./manifest.js";
import "./egret.wxgame.js";

egret.runEgret({
  entryClassName: "Main",
  orientation: "portrait",
  frameRate: 60,
  scaleMode: "fixedWidth",
  contentWidth: 750,
  contentHeight: 1334,
  showFPS: false,
  fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
  showLog: true,
  maxTouches: 2,
  renderMode: "webgl",
  audioType: 0,
  calculateCanvasScaleFactor: function(context) {
    var backingStore =
      context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      1;
    return (window.devicePixelRatio || 1) / backingStore;
  }
});
