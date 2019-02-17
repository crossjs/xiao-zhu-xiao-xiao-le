namespace yyw {
  class PromisedTween {
    private tween: egret.Tween;

    constructor(target: egret.DisplayObject) {
      this.tween = egret.Tween.get(target);
    }

    public to(
      props: any,
      duration: number = 100,
      ease: any = egret.Ease.quadOut,
    ): Promise<any> {
      // @todo 使用计算
      // Object.entries(props).forEach(([key, value]) => {
      //   if (typeof value === "string" && /^[+-]/.test(value)) {
      //   }
      // });
      return new Promise((resolve) => {
        this.tween.setPaused(false).to(props, duration * CONFIG.speedRatio, ease).call(resolve);
      });
    }
  }

  export function removeAllTweens() {
    egret.Tween.removeAllTweens();
  }

  export function pauseTweens(target: egret.DisplayObject) {
    egret.Tween.pauseTweens(target);
  }

  export function resumeTweens(target: egret.DisplayObject) {
    egret.Tween.resumeTweens(target);
  }

  export function removeTweens(target: egret.DisplayObject): void {
    egret.Tween.removeTweens(target);
  }

  export function getTween(target: egret.DisplayObject): PromisedTween {
    return new PromisedTween(target);
  }

  export async function fadeIn(
    target: egret.DisplayObject,
    duration?: number,
    ease?: any,
  ): Promise<void> {
    target.alpha = 0;
    target.visible = true;
    await getTween(target).to({
      alpha: 1,
    }, duration, ease);
  }

  export async function fadeOut(
    target: egret.DisplayObject,
    duration?: number,
    ease?: any,
  ): Promise<void> {
    await getTween(target)
    .to({
      alpha: 0,
    }, duration, ease);
    target.visible = false;
    target.alpha = 1;
  }

  // export async function rightIn(
  //   target: egret.DisplayObject,
  //   duration?: number,
  //   ease?: any,
  // ): Promise<void> {
  //   target.alpha = 0;
  //   target.x = CONFIG.stageWidth;
  //   target.visible = true;
  //   await getTween(target).to({
  //     alpha: 1,
  //     x: 0,
  //   }, duration, ease);
  // }

  // export async function rightOut(
  //   target: egret.DisplayObject,
  //   duration?: number,
  //   ease?: any,
  // ): Promise<void> {
  //   await getTween(target)
  //   .to({
  //     alpha: 0,
  //     x: CONFIG.stageWidth,
  //   }, duration, ease);
  //   target.visible = false;
  //   target.alpha = 1;
  //   target.x = 0;
  // }

  export async function zoomIn(
    target: egret.DisplayObject,
    duration?: number,
    ease?: any,
  ): Promise<void> {
    target.alpha = 0;
    target.scale = 0;
    // target.scaleX = 0;
    // target.scaleY = 0;
    target.visible = true;
    await getTween(target).to({
      alpha: 1,
      scale: 1,
      // scaleX: 1,
      // scaleY: 1,
    }, duration, ease);
  }

  export async function zoomOut(
    target: egret.DisplayObject,
    duration?: number,
    ease?: any,
  ): Promise<void> {
    await getTween(target)
    .to({
      alpha: 0,
      scale: 0,
      // scaleX: 0,
      // scaleY: 0,
    }, duration, ease);
    target.visible = false;
    target.alpha = 1;
    target.scale = 1;
    // target.scaleX = 1;
    // target.scaleY = 1;
  }

  export async function twirlIn(
    target: egret.DisplayObject,
    duration?: number,
    ease?: any,
  ): Promise<void> {
    target.alpha = 0;
    target.scale = 0;
    // target.scaleX = 0;
    // target.scaleY = 0;
    target.rotation = 0;
    target.visible = true;
    await getTween(target).to({
      alpha: 1,
      scale: 1,
      // scaleX: 1,
      // scaleY: 1,
      rotation: 1080,
    }, duration, ease);
  }

  export async function twirlOut(
    target: egret.DisplayObject,
    duration?: number,
    ease?: any,
  ): Promise<void> {
    await getTween(target)
    .to({
      alpha: 0,
      scale: 0,
      // scaleX: 0,
      // scaleY: 0,
      rotation: -1080,
    }, duration, ease);
    target.visible = false;
    target.alpha = 1;
    target.scale = 1;
    // target.scaleX = 1;
    // target.scaleY = 1;
    target.rotation = 0;
  }
}
